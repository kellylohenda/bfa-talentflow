<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_activities', function (Blueprint $table) {
            $table->id();
            $table->string('activity_code', 20)->unique();
            $table->string('nome');
            $table->string('tipo', 30); // social|ambiental|educacao|saude|cultura|outro
            $table->foreignId('coordenador_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('data');
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fim')->nullable();
            $table->string('local')->nullable();
            $table->unsignedSmallInteger('vagas_total')->nullable();
            $table->unsignedSmallInteger('inscritos_count')->default(0);
            $table->string('status', 20)->default('planeada'); // planeada|activa|concluida|cancelada
            $table->text('descricao')->nullable();
            $table->timestamps();

            $table->index(['data', 'status']);
        });

        Schema::create('volunteer_activity_inscricoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('volunteer_activities')->cascadeOnDelete();
            $table->foreignId('volunteer_id')->constrained('volunteers')->cascadeOnDelete();
            $table->timestamp('inscrito_at')->useCurrent();
            $table->boolean('presente')->default(false);
            $table->decimal('horas_registadas', 6, 2)->nullable();
            $table->timestamps();

            $table->unique(['activity_id', 'volunteer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_activity_inscricoes');
        Schema::dropIfExists('volunteer_activities');
    }
};
