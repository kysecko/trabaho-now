<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
{
    \App\Models\User::firstOrCreate(
        ['email' => 'admin@trabahonow.test'],
        ['name' => 'Admin', 'password' => 'password123', 'role' => 'admin'],
    );
}
}
