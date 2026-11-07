<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'is_verified')) {
                $table->boolean('is_verified')->default(false);
            }
            // none | pending | approved | rejected
            if (! Schema::hasColumn('users', 'verification_status')) {
                $table->string('verification_status')->default('none')->index();
            }
            if (! Schema::hasColumn('users', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
        });
    }
};
