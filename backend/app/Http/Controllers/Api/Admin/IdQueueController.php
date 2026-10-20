<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\IdVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class IdQueueController extends Controller
{
    /** GET /api/admin/id-queue?status=pending */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');

        $items = IdVerification::with('user:id,name,email,role')
            ->where('status', $status)
            ->oldest()
            ->paginate(20);

        return response()->json($items);
    }

    /** POST /api/admin/id-queue/{verification}/approve */
    public function approve(Request $request, IdVerification $verification): JsonResponse
    {
        if ($verification->status !== 'pending') {
            return response()->json(['message' => 'This request was already reviewed.'], 409);
        }

        $verification->update([
            'status'      => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $verification->user->forceFill([
            'is_verified'         => true,
            'verification_status' => 'approved',
        ])->save();

        return response()->json(['message' => 'Approved.']);
    }

    /** POST /api/admin/id-queue/{verification}/reject */
    public function reject(Request $request, IdVerification $verification): JsonResponse
    {
        if ($verification->status !== 'pending') {
            return response()->json(['message' => 'This request was already reviewed.'], 409);
        }

        $data = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $verification->update([
            'status'        => 'rejected',
            'reject_reason' => $data['reason'],
            'reviewed_by'   => $request->user()->id,
            'reviewed_at'   => now(),
        ]);

        $verification->user->forceFill([
            'is_verified'         => false,
            'verification_status' => 'rejected',
        ])->save();

        return response()->json(['message' => 'Rejected.']);
    }

    /** GET /api/admin/id-queue/{verification}/file/{type}  (front | back | selfie) */
    public function file(IdVerification $verification, string $type): StreamedResponse
    {
        $path = match ($type) {
            'front'  => $verification->id_front_path,
            'back'   => $verification->id_back_path,
            'selfie' => $verification->selfie_path,
            default  => null,
        };

        abort_if(! $path || ! Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path);
    }
}
