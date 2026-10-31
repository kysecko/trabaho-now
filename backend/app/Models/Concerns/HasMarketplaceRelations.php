<?php

namespace App\Models\Concerns;

use App\Models\JobseekerProfile;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceRequest;

/**
 * Add `use HasMarketplaceRelations;` inside your User model, and delete any
 * existing jobseekerProfile() / services() methods there to avoid duplicates.
 */
trait HasMarketplaceRelations
{
    public function jobseekerProfile()
    {
        return $this->hasOne(JobseekerProfile::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function clientRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'client_id');
    }

    public function jobRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'jobseeker_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'jobseeker_id');
    }
}
