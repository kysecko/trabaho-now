<?php

use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\EnsureVerified;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Ensure CORS runs before other middleware.
        $middleware->prepend(HandleCors::class);

        $middleware->alias([
            'verified.identity' => EnsureVerified::class,
            'role' => EnsureRole::class,
        ]);

        $middleware->redirectGuestsTo(
            fn(Request $request) => $request->is('api/*')
                ? null
                : config('app.frontend_url', 'http://localhost:5173') . '/login'
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*')
                || $request->expectsJson(),
        );
    })->create();
