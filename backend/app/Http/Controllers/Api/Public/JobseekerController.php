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
        $search  = trim((string) $request->query('q', ''));
        $service = trim((string) $request->query('service', ''));

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

            // Search by worker name or service name
            ->when($search !== '', fn ($q) => $q->where(function ($w) use ($search) {
                $w->where('name', 'ilike', "%{$search}%")
                  ->orWhereHas('services', fn ($s) => $s
                      ->where('is_active', true)
                      ->where('name', 'ilike', "%{$search}%"));
            }))

            // Category tag (partial match, so "Cleaning" matches "Aircon Cleaning")
            ->when($service !== '', fn ($q) => $q->whereHas('services', fn ($s) => $s
                ->where('is_active', true)
                ->where('name', 'ilike', "%{$service}%")))

            ->when($request->query('barangay'), fn ($q, $b) =>
                $q->whereHas('jobseekerProfile', fn ($p) => $p->where('barangay', $b)))

            ->when($request->query('max_rate'), fn ($q, $max) =>
                $q->whereHas('services', fn ($s) => $s
                    ->where('is_active', true)
                    ->where('rate', '<=', (int) $max)))

            ->when($request->boolean('available'), fn ($q) =>
                $q->whereHas('jobseekerProfile', fn ($p) => $p->where('availability_status', 'available')))

            // Date filter: hide workers who already have a booked job that day
            ->when($request->query('date'), fn ($q, $date) =>
                $q->whereHas('jobseekerProfile', fn ($p) => $p->where('availability_status', '!=', 'unavailable'))
                  ->whereDoesntHave('jobRequests', fn ($r) => $r
                      ->whereIn('status', ['accepted', 'in_progress'])
                      ->whereDate('scheduled_at', $date)))

            ->when($request->query('sort', 'top_rated') === 'top_rated', fn ($q) =>
                $q->orderByDesc(
                    JobseekerProfile::select('rating')
                        ->whereColumn('jobseeker_profiles.user_id', 'users.id')
                        ->limit(1)
                ))
            ->latest()
            ->paginate($perPage);

        return PublicJobseekerResource::collection($jobseekers);
    }

    // Fills the barangay dropdown from real data
    public function barangays()
    {
        $list = JobseekerProfile::query()
            ->whereNotNull('barangay')
            ->where('barangay', '!=', '')
            ->distinct()
            ->orderBy('barangay')
            ->pluck('barangay');

        return response()->json(['data' => $list]);
    }
}
