<?php

use App\Http\Controllers\Api\Admin\IdQueueController;
use App\Http\Controllers\Api\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/id-queue', [IdQueueController::class, 'index']);
Route::post('/id-queue/{verification}/approve', [IdQueueController::class, 'approve']);
Route::post('/id-queue/{verification}/reject', [IdQueueController::class, 'reject']);
Route::get('/id-queue/{verification}/file/{type}', [IdQueueController::class, 'file']);

Route::get('/users', [UserController::class, 'index']);
