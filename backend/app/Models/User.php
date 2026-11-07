<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * OTP is used instead of Laravel's default verification link.
     */
    public function sendEmailVerificationNotification(): void
    {
        // OTP notification is handled separately.
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Consistent user response for authentication APIs.
     */
    public function toAuthArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role?->value,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'is_verified' => (bool) $this->is_verified,
            'verification_status' => $this->verification_status ?? 'unverified',
            'rejection_reason' => $this->rejection_reason,
        ];
    }

    public function idVerifications(): HasMany
    {
        return $this->hasMany(IdVerification::class);
    }

    public function verificationRequests(): HasMany
    {
        return $this->hasMany(VerificationRequest::class);
    }

    public function jobseekerProfile(): HasOne
    {
        return $this->hasOne(JobseekerProfile::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    // Requests created by a client.
    public function clientRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'client_id');
    }

    // Requests sent to a jobseeker.
    public function jobRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class, 'jobseeker_id');
    }

    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'jobseeker_id');
    }
}
