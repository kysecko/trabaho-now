<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@trabahonow'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'is_verified' => true,
                'verification_status' => 'approved'
            ],
        );
    }
}
