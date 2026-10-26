<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicJobseekerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = $this->jobseekerProfile;       // assumed relation
        $service = $this->services->first();      // assumed relation

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'image'      => $profile?->photo_url,                 // assumed column
            'service'    => $service?->name,                      // assumed column
            'barangay'   => $profile?->barangay,                  // assumed column
            'status'     => ucfirst($profile?->availability_status ?? 'unavailable'), // "Available", etc.
            'rating'     => (float) ($profile?->rating ?? 0),     // assumed column
            'jobs'       => (int) ($profile?->jobs_completed ?? 0),   // assumed column
            'cancelRate' => (float) ($profile?->cancel_rate ?? 0),    // assumed column
            'rate'       => $service ? '₱' . number_format($service->rate) . '/hr' : null, // assumed column
        ];
    }
}
