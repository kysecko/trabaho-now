<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'service_request_id',
        'client_id',
        'jobseeker_id',
        'rating',
        'comment',
    ];

    /**
     * Keep jobseeker_profiles.rating in sync with the average of reviews,
     * so the "top rated" sort always reflects real reviews.
     */
    protected static function booted(): void
    {
        $sync = function (Review $review) {
            $avg = static::where('jobseeker_id', $review->jobseeker_id)->avg('rating');

            JobseekerProfile::where('user_id', $review->jobseeker_id)
                ->update(['rating' => round((float) $avg, 2)]);
        };

        static::saved($sync);
        static::deleted($sync);
    }

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function jobseeker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'jobseeker_id');
    }
}
