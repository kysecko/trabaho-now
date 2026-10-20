<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->is_verified) {
            return response()->json([
                'message' => 'Identity verification required.',
                'code'    => 'verification_required',
            ], 403);
        }

        return $next($request);
    }
}
