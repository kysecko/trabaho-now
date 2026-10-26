<?php

namespace Database\Seeders;

use App\Models\JobseekerProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class JobseekerSeeder extends Seeder
{
    public function run(): void
    {
        $people = [
            // name, service, barangay, availability, rate (pesos/hr)
            ['Juan Dela Cruz', 'Plumbing',   'Muzon',           'available',   350],
            ['Maria Santos',   'Cleaning',   'Sapang Palay',    'busy',        250],
            ['Pedro Reyes',    'Electrical', 'Tungkong Mangga', 'available',   400],
            ['Ana Lopez',      'Cleaning',   'Gaya-gaya',       'unavailable', 230],
        ];

        foreach ($people as $i => [$name, $service, $barangay, $status, $rate]) {
            $email = 'seed.jobseeker' . ($i + 1) . '@example.com';

            // Skip if already seeded, so re-running doesn't create duplicates
            if (User::where('email', $email)->exists()) {
                continue;
            }

            $user = new User();
            $user->forceFill([
                'name'                => $name,
                'email'               => $email,
                'password'            => Hash::make('password'),
                'role'                => 'jobseeker',
                'is_verified'         => true,
                'verification_status' => 'approved',
            ])->save();

            JobseekerProfile::create([
                'user_id'             => $user->id,
                'barangay'            => $barangay,
                'availability_status' => $status,
            ]);

            Service::create([
                'user_id' => $user->id,
                'name'    => $service,
                'rate'    => $rate,
            ]);
        }
    }
}
