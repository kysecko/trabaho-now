<?php

namespace App\Http\Controllers\Api\Shared;

use App\Http\Controllers\Controller;
use App\Models\RequestEvent;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // FIX: Handle Enum vs String
        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        $column = $role === 'jobseeker' ? 'jobseeker_id' : 'client_id';

        // This is line 25 where it was crashing
        return ServiceRequest::with(['client:id,name', 'jobseeker:id,name', 'service:id,title', 'events', 'messages'])
            ->where($column, $user->id)
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);
    }

    public function show(Request $request, ServiceRequest $serviceRequest)
    {
        $this->authorizeParty($request->user(), $serviceRequest);
        return $serviceRequest->load(['client', 'jobseeker', 'service', 'events', 'messages.sender']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jobseeker_id' => 'required|exists:users,id',
            'service_id'   => 'required|exists:services,id',
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'address'      => 'required|string|max:255',
            'barangay'     => 'nullable|string|max:255',
            'scheduled_at' => 'nullable|date',
            'agreed_rate'  => 'nullable|integer|min:0',
        ]);

        $validated['client_id'] = $request->user()->id;
        $validated['status'] = 'pending';

        $serviceRequest = ServiceRequest::create($validated);

        RequestEvent::create([
            'service_request_id' => $serviceRequest->id,
            'actor_id'           => $request->user()->id,
            'actor_role'         => 'client',
            'type'               => 'created',
        ]);

        return response()->json($serviceRequest->load('jobseeker:id,name'), 201);
    }

    public function accept(Request $request, ServiceRequest $serviceRequest)
    {
        return $this->transition($request, $serviceRequest, 'accepted', ['pending']);
    }

    public function decline(Request $request, ServiceRequest $serviceRequest)
    {
        return $this->transition($request, $serviceRequest, 'declined', ['pending']);
    }

    public function complete(Request $request, ServiceRequest $serviceRequest)
    {
        return $this->transition($request, $serviceRequest, 'completed', ['accepted', 'in_progress'], [
            'completed_at' => now(),
        ]);
    }

    public function cancel(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:80',
            'note'   => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        return DB::transaction(function () use ($serviceRequest, $user, $role, $validated) {
            // Lock the row so concurrent cancels can't both succeed
            $locked = ServiceRequest::whereKey($serviceRequest->id)->lockForUpdate()->firstOrFail();

            if (! $locked->isOpen()) {
                abort(422, 'This request can no longer be cancelled.');
            }

            $this->authorizeParty($user, $locked);

            // Jobseeker can only cancel after acceptance; client can cancel pending too
            if ($user->id === $locked->jobseeker_id && $locked->status === 'pending') {
                abort(422, 'Use decline for pending requests.');
            }

            $actorRole = $user->id === $locked->client_id ? 'client' : 'jobseeker';
            $isLate = $locked->scheduled_at && $locked->scheduled_at->diffInHours(now(), false) > -24;

            $locked->update([
                'status'            => 'cancelled',
                'cancelled_at'      => now(),
                'cancelled_by'      => $user->id,
                'cancelled_by_role' => $actorRole,
                'cancel_reason'     => $validated['reason'],
                'cancel_note'       => $validated['note'] ?? null,
            ]);

            RequestEvent::create([
                'service_request_id' => $locked->id,
                'actor_id'           => $user->id,
                'actor_role'         => $actorRole,
                'type'               => 'cancelled',
                'details'            => [
                    'reason'   => $validated['reason'],
                    'note'     => $validated['note'] ?? null,
                    'late'     => $isLate,
                ],
            ]);

            // TODO: refund credits here once the ledger exists
            return $locked->fresh();
        });
    }

    private function transition(Request $request, ServiceRequest $sr, string $to, array $from, array $extra = [])
    {
        return DB::transaction(function () use ($request, $sr, $to, $from, $extra) {
            $locked = ServiceRequest::whereKey($sr->id)->lockForUpdate()->firstOrFail();
            $this->authorizeParty($request->user(), $locked);

            if (! in_array($locked->status, $from, true)) {
                abort(422, "Cannot move request from {$locked->status} to {$to}.");
            }

            $user = $request->user();
            $actorRole = $user->id === $locked->jobseeker_id ? 'jobseeker' : 'client';

            $locked->update(array_merge(['status' => $to], $extra));

            RequestEvent::create([
                'service_request_id' => $locked->id,
                'actor_id'           => $user->id,
                'actor_role'         => $actorRole,
                'type'               => $to,
            ]);

            return $locked->fresh();
        });
    }

    private function authorizeParty($user, ServiceRequest $sr): void
    {
        $role = $user->role instanceof \BackedEnum ? $user->role->value : $user->role;

        if ($user->id !== $sr->client_id && $user->id !== $sr->jobseeker_id && $role !== 'admin') {
            abort(403, 'You are not authorized to view or modify this request.');
        }
    }
}
