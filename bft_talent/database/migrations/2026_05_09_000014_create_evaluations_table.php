<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->foreignId('program_id')->constrained()->restrictOnDelete();
            $table->foreignId('evaluator_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('period', 7); // YYYY-MM ou YYYY-TN
            $table->string('tipo', 20)->default('trimestral'); // mensal|trimestral|semestral|anual
            $table->unsignedSmallInteger('score'); // 0-100
            $table->string('classificacao', 20)->nullable(); // insatisfatorio|satisfatorio|bom|muito_bom|excelente
            $table->text('pontos_fortes')->nullable();
            $table->text('areas_melhoria')->nullable();
            $table->text('comentarios')->nullable();
            $table->timestamps();

            $table->unique(['talent_id', 'period', 'tipo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
