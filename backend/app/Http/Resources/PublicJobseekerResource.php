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

        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'is_verified'         => (bool) $this->is_verified,
            'photo_path'          => $profile?->photo_path,
            'photo_url'           => $profile?->photo_path
                                        ? asset('storage/' . $profile->photo_path)
                                        : null,
            'service'             => $service?->name,
            'barangay'            => $profile?->barangay,
            'availability_status' => $profile?->availability_status ?? 'unavailable',
            'rating'              => (float) ($profile?->rating ?? 0),
            'jobs'                => (int) ($profile?->jobs_completed ?? 0),
            'cancelRate'          => (float) ($profile?->cancel_rate ?? 0),
            'rate'                => $service?->rate,
            'rate_unit'           => $service?->rate_unit, // remove if you have no such column
        ];
    }
}
