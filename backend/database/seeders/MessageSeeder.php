<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceRequest;
use App\Models\Message;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $requests = ServiceRequest::all();

        $conversation = [
            'Hello! Is this service still available?',
            'Yes, I am available. Thank you for reaching out!',
            'Great! Can we confirm the schedule?',
            'Sure! What time works best for you?',
            'How about tomorrow morning?',
            'That works perfectly. See you tomorrow!',
        ];

        foreach ($requests as $request) {

            // Only create conversations for active/completed requests
            if (!in_array($request->status, [
                'pending',
                'accepted',
                'in_progress',
                'completed',
            ])) {
                continue;
            }

            foreach ($conversation as $index => $body) {

                $senderId = $index % 2 === 0
                    ? $request->client_id
                    : $request->jobseeker_id;

                Message::create([
                    'service_request_id' => $request->id,
                    'sender_id' => $senderId,
                    'body' => $body,
                    'read_at' => $index < 4 ? now() : null,
                ]);
            }
        }

        $this->command->info('Sample messages seeded!');
    }
}
