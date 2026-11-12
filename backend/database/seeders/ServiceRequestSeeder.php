<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Models\Service;

class ServiceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $clients = User::where('role', 'client')->get();
        $jobseekers = User::where('role', 'jobseeker')->get();
        $services = Service::all();

        if ($clients->isEmpty() || $jobseekers->isEmpty()) {
            $this->command->error('Client or jobseeker accounts not found.');
            return;
        }

        if ($services->isEmpty()) {
            $this->command->error('No services available. Seed services first.');
            return;
        }

        $statuses = [
            'pending',
            'accepted',
            'in_progress',
            'completed',
            'declined',
            'cancelled',
        ];

        $addresses = [
            'Poblacion, Angat, Bulacan',
            'Niugan, Angat, Bulacan',
            'Marungko, Angat, Bulacan',
            'San Roque, Angat, Bulacan',
            'Sta. Cruz, Angat, Bulacan',
        ];

        foreach (range(1, 10) as $i) {

            $status = $statuses[($i - 1) % count($statuses)];

            $client = $clients->random();
            $jobseeker = $jobseekers->random();
            $service = $services->random();

            $data = [
                'client_id' => $client->id,
                'jobseeker_id' => $jobseeker->id,
                'service_id' => $service->id,

                // Required fields
                'title' => $service->title ?? 'Sample Service Request',
                'address' => $addresses[array_rand($addresses)],

                // Optional fields
                'description' => 'This is a sample service request for testing.',
                'barangay' => 'Poblacion',
                'scheduled_at' => now()->addDays(rand(1, 15)),
                'agreed_rate' => rand(300, 1500),

                'status' => $status,
            ];

            if ($status === 'cancelled') {
                $data['cancelled_at'] = now()->subDays(rand(1, 10));
                $data['cancelled_by'] = $client->id;
                $data['cancelled_by_role'] = 'client';
                $data['cancel_reason'] = 'Schedule changed';
                $data['cancel_note'] = 'Sample cancellation record.';
            }

            if ($status === 'completed') {
                $data['completed_at'] = now()->subDays(rand(1, 5));
            }

            ServiceRequest::create($data);
        }

        $this->command->info(
            '10 service requests successfully created!'
        );
    }
}
