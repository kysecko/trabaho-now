
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('request_events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('service_request_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('actor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('actor_role')->nullable();
            $table->string('type')->index();
            $table->json('details')->nullable();

            $table->timestamps();

            $table->index([
                'service_request_id',
                'created_at'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('request_events');
    }
};
