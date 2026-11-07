<?php

namespace App\Http\Controllers\Api\Shared;

use App\Models\VerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class VerificationController
{
    private const CLIENT_DOCS = ['govId', 'selfie', 'residency'];
    private const JOBSEEKER_DOCS = ['govId', 'selfie', 'residency', 'nbi'];

    private const TEXT_FIELDS = [
        'email', 'firstName', 'middleName', 'lastName', 'gender', 'dob', 'mobile',
        'street', 'barangay', 'zip',
    ];
    private const JOBSEEKER_TEXT_FIELDS = ['skill', 'experience', 'bio'];

    /** The current user's latest verification request (or null). */
    public function show(Request $request): JsonResponse
    {
        $latest = $request->user()->verificationRequests()->latest('id')->first();

        return response()->json([
            'data' => $latest ? [
                'status' => $latest->status,
                'rejection_reason' => $latest->rejection_reason,
                'submitted_at' => $latest->created_at,
                'reviewed_at' => $latest->reviewed_at,
            ] : null,
        ]);
    }

    /** Submit (or resubmit after a rejection) a verification request. */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        // role is cast to the UserRole enum; the server decides the flow, never the client
        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;
        abort_unless(in_array($role, ['client', 'jobseeker'], true), 403);

        if ($user->is_verified || in_array($user->verification_status, ['pending', 'approved'], true)) {
            return response()->json([
                'message' => 'Your verification is already submitted or approved.',
            ], 409);
        }

        $isJobseeker = $role === 'jobseeker';
        $docKeys = $isJobseeker ? self::JOBSEEKER_DOCS : self::CLIENT_DOCS;

        $rules = [
            'email' => ['required', 'email', 'max:255'],
            'firstName' => ['required', 'string', 'max:100'],
            'middleName' => ['required', 'string', 'max:100'],
            'lastName' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:Male,Female,Prefer not to say'],
            // remove the age rule if you don't want to enforce 18+
            'dob' => ['required', 'date', 'before_or_equal:' . now()->subYears(18)->toDateString()],
            'mobile' => ['required', 'string', 'max:20'],
            'street' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:100'],
            'zip' => ['required', 'string', 'max:10'],
        ];

        if ($isJobseeker) {
            $rules += [
                'skill' => ['required', 'string', 'max:100'],
                'experience' => ['required', 'integer', 'min:0', 'max:60'],
                'bio' => ['nullable', 'string', 'max:1000'],
            ];
        }

        foreach ($docKeys as $key) {
            $rules["documents.$key"] = ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120']; // 5 MB
        }

        $validated = $request->validate($rules);

        $fields = array_merge(self::TEXT_FIELDS, $isJobseeker ? self::JOBSEEKER_TEXT_FIELDS : []);
        $data = Arr::only($validated, $fields);

        $stored = [];

        try {
            DB::transaction(function () use ($request, $user, $role, $docKeys, $data, &$stored) {
                foreach ($docKeys as $key) {
                    // private disk: not reachable through a public URL
                    $stored[$key] = $request->file("documents.$key")
                        ->store("verifications/{$user->id}", 'local');
                }

                VerificationRequest::create([
                    'user_id' => $user->id,
                    'role' => $role,
                    'status' => 'pending',
                    'data' => $data,
                    'documents' => $stored,
                ]);

                $user->forceFill([
                    'verification_status' => 'pending',
                    'rejection_reason' => null,
                ])->save();
            });
        } catch (\Throwable $e) {
            foreach ($stored as $path) {
                Storage::disk('local')->delete($path);
            }
            throw $e;
        }

        return response()->json([
            'message' => 'Verification submitted. We will review it within 24–48 hours.',
            'data' => $user->fresh()->toAuthArray(), // same shape as /api/user (see User model)
        ], 201);
    }
}
