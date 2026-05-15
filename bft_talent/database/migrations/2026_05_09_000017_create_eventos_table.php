<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('event_code', 20)->unique();
            $table->string('titulo');
            $table->string('tipo', 30); // formacao|networking|avaliacao|celebracao|reuniao|outro
            $table->timestamp('data_inicio');
            $table->timestamp('data_fim')->nullable();
            $table->string('local')->nullable();
            $table->string('formato', 20)->default('presencial'); // presencial|online|hibrido
            $table->unsignedSmallInteger('vagas')->nullable();
            $table->string('status', 20)->default('planeado'); // planeado|confirmado|cancelado|concluido
            $table->text('descricao')->nullable();
            $table->timestamps();

            $table->index(['data_inicio', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
