<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Models\IdVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /** GET /api/verification: latest submission + status for the logged-in user */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $latest = $user->idVerifications()->latest()->first();

        return response()->json([
            'is_verified'         => $user->is_verified,
            'verification_status' => $user->verification_status,
            'reject_reason'       => $latest?->status === 'rejected' ? $latest->reject_reason : null,
            'submitted_at'        => $latest?->created_at,
        ]);
    }

    /** POST /api/verification */
    public function submit(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role->value === 'admin') {
            return response()->json(['message' => 'Admins do not need verification.'], 403);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'Your account is already verified.'], 409);
        }

        if ($user->verification_status === 'pending') {
            return response()->json(['message' => 'Your verification is already under review.'], 409);
        }

        $data = $request->validate([
            'id_type'  => ['required', 'string', 'max:50'],
            'id_front' => ['required', 'image', 'max:5120'],
            'id_back'  => ['nullable', 'image', 'max:5120'],
            'selfie'   => ['required', 'image', 'max:5120'],
        ]);

        // 'local' disk = storage/app/private, never web-accessible
        $dir = "id-verifications/{$user->id}";

        $user->idVerifications()->create([
            'id_type'       => $data['id_type'],
            'id_front_path' => $request->file('id_front')->store($dir, 'local'),
            'id_back_path'  => $request->file('id_back')?->store($dir, 'local'),
            'selfie_path'   => $request->file('selfie')->store($dir, 'local'),
            'status'        => 'pending',
        ]);

        $user->forceFill(['verification_status' => 'pending'])->save();

        return response()->json([
            'message'             => 'Submitted for review.',
            'verification_status' => 'pending',
        ], 201);
    }
}
