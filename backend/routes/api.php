<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'Laravel is connected!']);
});

// Public (register, login, google-login, email verify)
require __DIR__ . '/api/auth.php';

// Logged-in users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    // Not gated: users must reach these before they are verified
    require __DIR__ . '/api/shared.php';

    // Gated: identity verification required
    Route::middleware('verified.identity')->group(function () {
        // require __DIR__ . '/api/client.php';
        // require __DIR__ . '/api/jobseeker.php';
    });

    // Admin only
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        require __DIR__ . '/api/admin.php';
    });
});
