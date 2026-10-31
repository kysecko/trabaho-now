<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicJobseekerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = $this->jobseekerProfile;
        $service = $this->services->first();

        $total = (int) ($this->total_requests_count ?? 0);
        $cancelled = (int) ($this->cancelled_requests_count ?? 0);

        // FIX: Only prepend asset() if the path is a local file
        $photoUrl = null;
        if ($profile?->photo_path) {
            $photoUrl = str_starts_with($profile->photo_path, 'http')
                ? $profile->photo_path
                : asset('storage/' . $profile->photo_path);
        }

        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'is_verified'         => (bool) $this->is_verified,
            'photo_path'          => $profile?->photo_path,
            'photo_url'           => $photoUrl, // Using the fixed logic
            'service'             => $service?->name,
            'barangay'            => $profile?->barangay,
            'availability_status' => $profile?->availability_status ?? 'unavailable',
            'rating'              => round((float) ($profile?->rating ?? 0), 1),
            'jobs'                => (int) ($profile?->jobs_completed ?? 0),
            'cancelRate'          => $total > 0 ? round($cancelled / $total * 100, 1) : 0.0,
            'rate'                => $service?->rate,
            'rate_unit'           => $service?->rate_unit,
            'about'               => $profile?->about,
            'experience'          => $profile?->experience,
            'completed_jobs'      => $this->total_requests_count ?? 0,
            'services'            => $this->services->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'rate' => $s->rate
                ];
            }),
        ];
    }
}
