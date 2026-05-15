<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presencas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->date('data');
            $table->string('status', 20)->default('presente'); // presente|ausente|justificado|ferias
            $table->time('hora_entrada')->nullable();
            $table->time('hora_saida')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();

            $table->unique(['talent_id', 'data']);
            $table->index(['talent_id', 'data']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presencas');
    }
};
