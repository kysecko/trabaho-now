<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobseeker_profiles', function (Blueprint $table) {
            $table->unsignedInteger('jobs_completed')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('jobseeker_profiles', function (Blueprint $table) {
            $table->dropColumn('jobs_completed');
        });
    }
};