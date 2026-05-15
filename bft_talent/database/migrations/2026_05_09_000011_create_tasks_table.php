<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_code', 20)->unique();
            $table->foreignId('talent_id')->nullable()->constrained('talents')->nullOnDelete();
            $table->foreignId('assigned_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('descricao')->nullable();
            $table->string('status', 20)->default('pendente'); // pendente|em_progresso|concluida|cancelada
            $table->string('prioridade', 15)->default('normal'); // baixa|normal|alta|urgente
            $table->date('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'talent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
