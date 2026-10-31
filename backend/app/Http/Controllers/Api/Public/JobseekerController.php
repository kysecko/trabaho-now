<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicJobseekerResource;
use App\Models\JobseekerProfile;
use App\Models\User;
use Illuminate\Http\Request;

class JobseekerController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max($request->integer('per_page', 8), 1), 30);

        $jobseekers = User::query()
            ->where('role', 'jobseeker')
            ->where('is_verified', true)
            ->where('verification_status', 'approved')
            ->with([
                'jobseekerProfile',
                'services' => fn ($q) => $q->where('is_active', true),
            ])
            ->withCount([
                'jobRequests as total_requests_count',
                'jobRequests as cancelled_requests_count' => fn ($q) => $q->where('status', 'cancelled'),
            ])
            ->when($request->query('service'), fn ($q, $service) =>
                $q->whereHas('services', fn ($s) => $s->where('name', $service)->where('is_active', true)))
            ->when($request->boolean('available'), fn ($q) =>
                $q->whereHas('jobseekerProfile', fn ($p) => $p->where('availability_status', 'available')))
            ->when($request->query('sort') === 'top_rated', fn ($q) =>
                $q->orderByDesc(
                    JobseekerProfile::select('rating')
                        ->whereColumn('jobseeker_profiles.user_id', 'users.id')
                        ->limit(1)
                ))
            ->latest()
            ->paginate($perPage);

        return PublicJobseekerResource::collection($jobseekers);
    }
}
