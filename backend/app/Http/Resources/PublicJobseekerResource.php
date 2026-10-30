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
            'service'             => $service?->name,
            'barangay'            => $profile?->barangay,
            'availability_status' => $profile?->availability_status ?? 'unavailable',
            'rating'              => (float) ($profile?->rating ?? 0),
            'jobs'                => (int) ($profile?->jobs_completed ?? 0),
            'cancelRate'          => (float) ($profile?->cancel_rate ?? 0),
            'rate'                => $service?->rate ?? null,
        ];
    }
}
