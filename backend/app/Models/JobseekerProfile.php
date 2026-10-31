<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobseekerProfile extends Model
{
    public function toArray(Request $request): array
    {
        $profile = $this->jobseekerProfile;

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'avatar'     => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'profession' => $this->services->first()?->name ?? $profile?->profession,
            'location'   => $profile?->location,
            'rating'     => (float) ($profile?->rating ?? 0),
            'rate'       => $profile?->rate,
            'rateUnit'   => $profile?->rate_unit,
            'verified'   => true, // the query only returns verified, approved users
        ];
    }
}
