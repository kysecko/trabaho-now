<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobseekerProfile extends Model
{
    // Add the columns you actually have, e.g.:
    protected $fillable = [
        'user_id',
        'profession',
        'location',
        'rating',
        'rate',
        'rate_unit',
        'availability_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
