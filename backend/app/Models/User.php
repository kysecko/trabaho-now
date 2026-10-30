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

// email_verified_at and is_verified removed: they are only set by verifyOtp() via forceFill().
// role stays: register() validates it to client|jobseeker before create().
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    // We use OTP, not Laravel's verification link.
    public function sendEmailVerificationNotification()
    {
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'role'              => UserRole::class,
            'is_verified'       => 'boolean',
        ];
    }

    public function idVerifications(): HasMany
    {
        return $this->hasMany(IdVerification::class);
    }

    public function jobseekerProfile(): HasOne
    {
        return $this->hasOne(JobseekerProfile::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
