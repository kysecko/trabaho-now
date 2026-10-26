<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Notifications\VerifyEmailNotification;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne; // <-- ADDED
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'is_verified', 'email_verified_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

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

    // ADDED THESE TWO METHODS
    public function jobseekerProfile(): HasOne
    {
        return $this->hasOne(JobseekerProfile::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
