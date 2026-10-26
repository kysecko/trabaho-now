<?php

use App\Http\Controllers\Api\Public\JobseekerController;
use Illuminate\Support\Facades\Route;

Route::get('/jobseekers', [JobseekerController::class, 'index']);
