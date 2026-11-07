<?php

namespace App\Http\Controllers\Api\Admin;

use App\Events\UserVerified;
use App\Events\UserRejected;
use App\Models\VerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class VerificationReviewController
{
    /** GET /admin/verifications?status=pending&role=client */
    public function index(Request $request): JsonResponse
    {
        $query = VerificationRequest::with('user:id,name,email,role')
            ->latest('id');

        $query->where('status', $request->query('status', 'pending'));

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $page = $query->paginate((int) $request->query('per_page', 15));

        $page->getCollection()->transform(fn (VerificationRequest $v) => [
            'id' => $v->id,
            'status' => $v->status,
            'role' => $v->role,
            'submitted_at' => $v->created_at,
            'user' => $v->user,
            'name' => trim(($v->data['firstName'] ?? '') . ' ' . ($v->data['lastName'] ?? '')),
        ]);

        return response()->json($page);
    }

    /** GET /admin/verifications/{id} - full details + short-lived document links */
    public function show(VerificationRequest $verification): JsonResponse
    {
        $verification->load('user:id,name,email,role', 'reviewer:id,name');

        $documents = collect($verification->documents)->map(fn ($path, $key) => [
            'key' => $key,
            'mime' => Storage::disk('local')->mimeType($path),
            'url' => URL::temporarySignedRoute(
                'admin.verifications.document',
                now()->addMinutes(10),
                ['verification' => $verification->id, 'key' => $key]
            ),
        ])->values();

        return response()->json([
            'data' => [
                'id' => $verification->id,
                'status' => $verification->status,
                'role' => $verification->role,
                'submitted_at' => $verification->created_at,
                'reviewed_at' => $verification->reviewed_at,
                'reviewer' => $verification->reviewer,
                'rejection_reason' => $verification->rejection_reason,
                'user' => $verification->user,
                'data' => $verification->data,
                'documents' => $documents,
            ],
        ]);
    }

    /** POST /admin/verifications/{id}/approve */
    public function approve(Request $request, VerificationRequest $verification): JsonResponse
    {
        if ($verification->status !== 'pending') {
            return response()->json(['message' => 'This request was already reviewed.'], 409);
        }

        DB::transaction(function () use ($request, $verification) {
            $verification->update([
                'status' => 'approved',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'rejection_reason' => null,
            ]);

            $verification->user->forceFill([
                'is_verified' => true,
                'verification_status' => 'approved',
                'rejection_reason' => null,
            ])->save();
        });

        // 🔥 REAL-TIME BROADCAST: Fire the event AFTER the DB commit succeeds
        broadcast(new UserVerified($verification->user->id));

        // TODO: notify the user (your Notifications / Mail folders)
        // $verification->user->notify(new VerificationReviewed($verification));

        return response()->json(['message' => 'Verification approved.']);
    }

    /** POST /admin/verifications/{id}/reject  { reason } */
    public function reject(Request $request, VerificationRequest $verification): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        if ($verification->status !== 'pending') {
            return response()->json(['message' => 'This request was already reviewed.'], 409);
        }

        DB::transaction(function () use ($request, $verification, $validated) {
            $verification->update([
                'status' => 'rejected',
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'rejection_reason' => $validated['reason'],
            ]);

            $verification->user->forceFill([
                'is_verified' => false,
                'verification_status' => 'rejected',
                'rejection_reason' => $validated['reason'],
            ])->save();
        });

        // 🔥 REAL-TIME BROADCAST: Notify the user they were rejected (optional)
        broadcast(new UserRejected($verification->user->id, $validated['reason']));

        return response()->json(['message' => 'Verification rejected.']);
    }

    /**
     * GET signed URL: streams one private document.
     * Protected by the `signed` middleware (links expire after 10 minutes),
     * so it works inside <img src="..."> without an auth header.
     */
    public function document(VerificationRequest $verification, string $key)
    {
        $path = $verification->documents[$key] ?? null;
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path);
    }
}
