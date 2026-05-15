<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evento_inscricoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos')->cascadeOnDelete();
            // XOR: talent OU volunteer, nunca ambos
            $table->foreignId('talent_id')->nullable()->constrained('talents')->nullOnDelete();
            $table->unsignedBigInteger('volunteer_id')->nullable();
            $table->string('status', 20)->default('inscrito'); // inscrito|presente|ausente|cancelado
            $table->timestamp('inscrito_at')->useCurrent();
            $table->timestamps();

            $table->unique(['evento_id', 'talent_id'], 'ei_evento_talent_unique');
            $table->unique(['evento_id', 'volunteer_id'], 'ei_evento_volunteer_unique');
        });

        // Adicionar FK de sessoes_bolseiro.evento_id agora que eventos existe
        Schema::table('sessoes_bolseiro', function (Blueprint $table) {
            $table->foreign('evento_id')->references('id')->on('eventos')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sessoes_bolseiro', function (Blueprint $table) {
            $table->dropForeign(['evento_id']);
        });
        Schema::dropIfExists('evento_inscricoes');
    }
};
