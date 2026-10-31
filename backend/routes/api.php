<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;

require __DIR__ . '/api/auth.php';

Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

Route::prefix('public')->group(function () {
    require __DIR__ . '/api/public.php';
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'email_verified_at' => $user->email_verified_at,
            'is_verified' => (bool) $user->is_verified,
            'verification_status' => $user->verification_status ?? 'none',
        ]);
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/email/otp', [AuthController::class, 'sendOtp'])->middleware('throttle:3,1');
    Route::post('/email/otp/verify', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');

    Route::middleware('verified')->group(function () {
        require __DIR__ . '/api/shared.php';

        Route::middleware('verified.identity')->group(function () {
            // require __DIR__ . '/api/client.php';
            // require __DIR__ . '/api/jobseeker.php';
        });

        Route::prefix('admin')->middleware('role:admin')->group(function () {
            require __DIR__ . '/api/admin.php';
        });
    });
});
