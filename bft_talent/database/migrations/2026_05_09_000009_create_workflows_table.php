<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->string('workflow_code', 20)->unique();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->string('type', 30); // pagamento|contrato|bolsa|renovacao
            $table->decimal('amount', 12, 2)->nullable();
            $table->string('urgency', 15)->default('normal'); // normal|urgente
            $table->string('status', 20)->default('pendente');
            $table->unsignedSmallInteger('current_step')->default(1);
            $table->unsignedSmallInteger('total_steps')->default(4);
            $table->text('descricao')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'talent_id']);
        });

        Schema::create('workflow_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('step_number');
            $table->string('approver_role', 20);
            $table->foreignId('approver_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('decision', 20)->nullable(); // aprovado|rejeitado
            $table->text('comentario')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['workflow_id', 'step_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_steps');
        Schema::dropIfExists('workflows');
    }
};
