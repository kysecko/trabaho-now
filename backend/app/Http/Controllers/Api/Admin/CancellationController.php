<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\RequestEvent;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CancellationController extends Controller
{
    public function index(Request $request)
    {
        return ServiceRequest::with(['client:id,name', 'jobseeker:id,name'])
            ->where('status', 'cancelled')
            ->when($request->cancelled_by_role, fn ($q) => $q->where('cancelled_by_role', $request->cancelled_by_role))
            ->latest('cancelled_at')
            ->paginate(30);
    }

    public function adminCancel(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate(['reason' => 'required|string|max:80', 'note' => 'nullable|string']);

        return DB::transaction(function () use ($serviceRequest, $request, $validated) {
            $locked = ServiceRequest::whereKey($serviceRequest->id)->lockForUpdate()->firstOrFail();
            if (! $locked->isOpen()) abort(422, 'Already closed.');

            $locked->update([
                'status'            => 'cancelled',
                'cancelled_at'      => now(),
                'cancelled_by'      => $request->user()->id,
                'cancelled_by_role' => 'admin',
                'cancel_reason'     => $validated['reason'],
                'cancel_note'       => $validated['note'] ?? null,
            ]);

            RequestEvent::create([
                'service_request_id' => $locked->id,
                'actor_id'           => $request->user()->id,
                'actor_role'         => 'admin',
                'type'               => 'cancelled',
                'details'            => ['reason' => $validated['reason']],
            ]);

            return $locked->fresh();
        });
    }
}
