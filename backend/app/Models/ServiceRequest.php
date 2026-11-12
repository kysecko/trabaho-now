<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceRequest extends Model
{
    public const STATUSES = [
        'pending',
        'accepted',
        'in_progress',
        'completed',
        'declined',
        'cancelled',
    ];

    protected $fillable = [
        'client_id',
        'jobseeker_id',
        'service_id',
        'title',
        'description',
        'address',
        'barangay',
        'scheduled_at',
        'agreed_rate',
        'status',
        'completed_at',

        // Cancellation fields
        'cancelled_at',
        'cancelled_by',
        'cancelled_by_role',
        'cancel_reason',
        'cancel_note',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // --- Original Relationships (Restored) ---

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function jobseeker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'jobseeker_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    // --- New Relationships & Methods ---

    public function events(): HasMany
    {
        return $this->hasMany(RequestEvent::class)->latest();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->oldest();
    }

    public function isOpen(): bool
    {
        return in_array($this->status, ['pending', 'accepted', 'in_progress']);
    }
}
