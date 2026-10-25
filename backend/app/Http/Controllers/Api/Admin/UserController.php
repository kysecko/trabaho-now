<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role   = $request->query('role');
        $status = $request->query('status');

        $users = User::query()
            ->where('role', '!=', 'admin')
            ->when($role, fn ($q) => $q->where('role', $role))
            ->when($status, function ($q) use ($status) {
                $q->where(function ($q) use ($status) {
                    $q->where('verification_status', $status);
                    // Users who never submitted an ID may have NULL; the UI shows those as "pending"
                    if ($status === 'pending') {
                        $q->orWhereNull('verification_status');
                    }
                });
            })
            ->latest()
            ->paginate(50);

        return response()->json($users);
    }
}
