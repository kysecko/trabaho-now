<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\VerificationReviewController;
use Illuminate\Support\Facades\Broadcast;

require __DIR__ . '/api/auth.php';
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// ─────────────────────────────────────────────────────────────
// Public endpoints
// ─────────────────────────────────────────────────────────────
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/reset-password',  [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

Route::post('/email/otp',        [AuthController::class, 'sendOtp'])->middleware('throttle:3,1');
Route::post('/email/otp/verify', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');

Route::prefix('public')->group(function () {
    require __DIR__ . '/api/public.php';
});

// Admin document viewer (Signed URLs)
Route::get(
    '/admin/verifications/{verification}/documents/{key}',
    [VerificationReviewController::class, 'document']
)
    ->name('admin.verifications.document')
    ->middleware('signed');

// ─────────────────────────────────────────────────────────────
// Authenticated endpoints
// ─────────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn(Request $request) => response()->json($request->user()->toAuthArray()));

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('verified')->group(function () {

        // Shared routes (verification submission)
        require __DIR__ . '/api/shared.php';

        // Anything that needs an approved identity goes here
        Route::middleware('verified.identity')->group(function () {

            // NEW: Request Lifecycle & Chat
            require __DIR__ . '/api/requests.php';

            // Uncomment these once you move your client/jobseeker specific routes out
            // require __DIR__ . '/api/client.php';
            // require __DIR__ . '/api/jobseeker.php';
        });

        // Admin routes
        Route::prefix('admin')->middleware('role:admin')->group(function () {
            require __DIR__ . '/api/admin.php';
        });
    });
});
