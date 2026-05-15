<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentor_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_code', 20)->unique();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->foreignId('mentor_user_id')->constrained('users')->restrictOnDelete();
            $table->timestamp('scheduled_at');
            $table->unsignedSmallInteger('duracao_min')->default(60);
            $table->string('status', 20)->default('agendada'); // agendada|realizada|cancelada
            $table->string('formato', 20)->default('presencial'); // presencial|video|telefone
            $table->text('notas')->nullable();
            $table->text('accoes')->nullable();
            $table->timestamps();

            $table->index(['talent_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentor_sessions');
    }
};
