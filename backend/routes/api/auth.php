<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('google-login', [AuthController::class, 'googleLogin']);


// Email Verification Route
Route::get('/email/verify/{id}/{hash}', function (Request $request) {
    $frontend = config('app.frontend_url', 'http://localhost:5173');

    $user = User::find($request->id);
    if (! $user) {
        return redirect("$frontend/login?verified=0&error=invalid_link");
    }

    if (! hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
        return redirect("$frontend/login?verified=0&error=invalid_link");
    }

    if (! $user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
        event(new \Illuminate\Auth\Events\Verified($user));
    }

        return redirect("$frontend/login?verified=1");
})->name('verification.verify');
