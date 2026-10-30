<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan; // Added this
use App\Http\Controllers\Api\Auth\AuthController;

require __DIR__ . '/api/auth.php';

Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

// Only ONE public group!
Route::prefix('public')->group(function () {
    require __DIR__ . '/api/public.php';
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());

    Route::post('/email/otp', [AuthController::class, 'sendOtp'])->middleware('throttle:3,1');
    Route::post('/email/otp/verify', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');

    require __DIR__ . '/api/shared.php';

    Route::middleware('verified.identity')->group(function () {
        // require __DIR__ . '/api/client.php';
        // require __DIR__ . '/api/jobseeker.php';
    });

    Route::prefix('admin')->middleware('role:admin')->group(function () {
        require __DIR__ . '/api/admin.php';
    });
});
