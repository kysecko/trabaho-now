<?php

use App\Http\Controllers\Api\Shared\ServiceRequestController;
use App\Http\Controllers\Api\Shared\MessageController;
use Illuminate\Support\Facades\Route;

// Request Lifecycle
Route::get('/requests',                             [ServiceRequestController::class, 'index']);
Route::get('/requests/{serviceRequest}',            [ServiceRequestController::class, 'show']);
Route::post('/requests/{serviceRequest}/accept',    [ServiceRequestController::class, 'accept']);
Route::post('/requests/{serviceRequest}/decline',   [ServiceRequestController::class, 'decline']);
Route::post('/requests/{serviceRequest}/complete',  [ServiceRequestController::class, 'complete']);
Route::post('/requests/{serviceRequest}/cancel',    [ServiceRequestController::class, 'cancel']);

// Chat
Route::get('/requests/{serviceRequest}/messages',   [MessageController::class, 'index']);
Route::post('/requests/{serviceRequest}/messages',  [MessageController::class, 'store']);
