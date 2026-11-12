<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceRequest;
use App\Models\RequestEvent;

class RequestEventSeeder extends Seeder
{
    public function run(): void
    {
        $requests = ServiceRequest::all();

        foreach ($requests as $request) {
            $events = [
                'pending' => ['created'],
                'accepted' => ['created', 'accepted'],
                'in_progress' => ['created', 'accepted'],
                'completed' => ['created', 'accepted', 'completed'],
                'declined' => ['created', 'declined'],
                'cancelled' => ['created', 'cancelled'],
            ];

            $types = $events[$request->status] ?? ['created'];

            foreach ($types as $type) {
                $actorId = $type === 'created'
                    ? $request->client_id
                    : ($request->cancelled_by ?? $request->jobseeker_id);

                $role = $actorId === $request->client_id
                    ? 'client'
                    : 'jobseeker';

                if ($type === 'cancelled') {
                    $role = $request->cancelled_by_role ?? $role;
                }

                RequestEvent::create([
                    'service_request_id' => $request->id,
                    'actor_id' => $actorId,
                    'actor_role' => $role,
                    'type' => $type,
                    'details' => $type === 'cancelled'
                        ? [
                            'reason' => $request->cancel_reason,
                            'note' => $request->cancel_note,
                        ]
                        : null,
                ]);
            }
        }

        $this->command->info('Request events seeded!');
    }
}
