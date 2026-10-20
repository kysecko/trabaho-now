<?php

use App\Http\Controllers\Api\Shared\VerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/verification', [VerificationController::class, 'show']);
Route::post('/verification', [VerificationController::class, 'submit']);
