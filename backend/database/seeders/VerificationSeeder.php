<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VerificationSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            // Use the existing admin account as reviewer.
            $reviewer = User::where('email', 'admin@trabahonow')->firstOrFail();

            // Sample users.
            $users = [
                [
                    'email' => 'unverified@trabahonow.test',
                    'name' => 'Unverified User',
                    'role' => 'jobseeker',
                    'status' => 'unverified',
                    'is_verified' => false,
                ],
                [
                    'email' => 'pending@trabahonow.test',
                    'name' => 'Pending User',
                    'role' => 'jobseeker',
                    'status' => 'pending',
                    'is_verified' => false,
                ],
                [
                    'email' => 'approved@trabahonow.test',
                    'name' => 'Approved User',
                    'role' => 'client',
                    'status' => 'approved',
                    'is_verified' => true,
                ],
                [
                    'email' => 'rejected@trabahonow.test',
                    'name' => 'Rejected User',
                    'role' => 'jobseeker',
                    'status' => 'rejected',
                    'is_verified' => false,
                ],
            ];

            foreach ($users as $sample) {
                $user = User::updateOrCreate(
                    ['email' => $sample['email']],
                    [
                        'name' => $sample['name'],
                        'password' => Hash::make('Password123!'),
                        'role' => $sample['role'],
                        'is_verified' => $sample['is_verified'],
                        'verification_status' => $sample['status'],
                        'rejection_reason' => $sample['status'] === 'rejected'
                            ? 'The submitted identification document is unclear.'
                            : null,
                    ]
                );

                // No verification request for unverified users.
                if ($sample['status'] === 'unverified') {
                    continue;
                }

                $rejectionReason = $sample['status'] === 'rejected'
                    ? 'The submitted identification document is unclear.'
                    : null;

                DB::table('verification_requests')->updateOrInsert(
                    ['user_id' => $user->id],
                    [
                        'role' => $sample['role'],
                        'status' => $sample['status'],
                        'data' => json_encode([
                            'first_name' => $sample['name'],
                            'last_name' => 'Sample',
                            'birth_date' => '2000-05-15',
                            'address' => 'Cebu City',
                            'contact_number' => '09123456789',
                        ]),
                        'documents' => json_encode([
                            'valid_id' => 'verification_documents/sample_valid_id.jpg',
                            'selfie' => 'verification_documents/sample_selfie.jpg',
                        ]),
                        'reviewed_by' => $sample['status'] === 'pending'
                            ? null
                            : $reviewer->id,
                        'reviewed_at' => $sample['status'] === 'pending'
                            ? null
                            : now(),
                        'rejection_reason' => $rejectionReason,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
        });
    }
}
