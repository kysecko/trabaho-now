<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicJobseekerResource;
use App\Models\User;
use Illuminate\Http\Request;

class JobseekerController extends Controller
{
    public function index(Request $request)
    {
        $jobseekers = User::query()
            ->where('role', 'jobseeker')
            ->where('is_verified', true)
            ->where('verification_status', 'approved')
            ->with(['jobseekerProfile', 'services'])
            ->when($request->query('service'), fn ($q, $service) =>
                $q->whereHas('services', fn ($s) => $s->where('name', $service)))
            ->when($request->boolean('available'), fn ($q) =>
                $q->whereHas('jobseekerProfile', fn ($p) => $p->where('availability_status', 'available')))
            ->latest()
            ->paginate(30);

        return PublicJobseekerResource::collection($jobseekers);
    }
}
