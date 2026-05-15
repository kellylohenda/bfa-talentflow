<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hours_entries', function (Blueprint $table) {
            $table->id();
            $table->string('hour_code', 20)->unique();
            $table->foreignId('volunteer_id')->constrained('volunteers')->cascadeOnDelete();
            $table->foreignId('activity_id')->nullable()->constrained('volunteer_activities')->nullOnDelete();
            $table->date('data');
            $table->decimal('horas', 6, 2);
            $table->string('descricao')->nullable();
            $table->boolean('validado')->default(false);
            $table->foreignId('validado_por_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validado_at')->nullable();
            $table->timestamps();

            $table->index(['volunteer_id', 'data']);
            $table->index(['validado', 'volunteer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hours_entries');
    }
};
