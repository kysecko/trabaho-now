<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestEvent extends Model
{
    protected $fillable = [
        'service_request_id',
        'actor_id',
        'actor_role',
        'type',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function request(): BelongsTo
    {
        return $this->belongsTo(
            ServiceRequest::class,
            'service_request_id'
        );
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
