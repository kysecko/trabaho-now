<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable();

            $table->foreignId('cancelled_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('cancelled_by_role')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->text('cancel_note')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cancelled_by');

            $table->dropColumn([
                'cancelled_at',
                'cancelled_by_role',
                'cancel_reason',
                'cancel_note',
            ]);
        });
    }
};
