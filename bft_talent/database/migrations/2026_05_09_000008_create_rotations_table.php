<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rotations', function (Blueprint $table) {
            $table->id();
            $table->string('rotation_code', 20)->unique();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->string('supervisor')->nullable();
            $table->string('status', 20)->default('activa');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('objectivos')->nullable();
            $table->text('avaliacao_final')->nullable();
            $table->timestamps();

            // Apenas 1 rotação activa por talento
            $table->index(['talent_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rotations');
    }
};
