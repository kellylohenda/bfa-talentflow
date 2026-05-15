<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sessoes_bolseiro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->unsignedBigInteger('evento_id')->nullable();
            $table->string('titulo');
            $table->timestamp('data_hora');
            $table->string('formato', 20)->default('presencial'); // presencial|online|hibrido
            $table->string('status', 20)->default('agendada'); // agendada|realizada|cancelada
            $table->string('local')->nullable();
            $table->text('descricao')->nullable();
            $table->text('resultado')->nullable();
            $table->timestamps();

            $table->index(['talent_id', 'data_hora']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessoes_bolseiro');
    }
};
