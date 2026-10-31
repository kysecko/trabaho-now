<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('jobseeker_profiles', 'rating')) {
            Schema::table('jobseeker_profiles', function (Blueprint $table) {
                $table->decimal('rating', 3, 2)->default(0);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('jobseeker_profiles', 'rating')) {
            Schema::table('jobseeker_profiles', function (Blueprint $table) {
                $table->dropColumn('rating');
            });
        }
    }
};