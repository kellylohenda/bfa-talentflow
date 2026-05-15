<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_ref', 30)->unique();
            $table->string('idempotency_key', 64)->unique();
            $table->foreignId('talent_id')->constrained('talents')->restrictOnDelete();
            $table->foreignId('workflow_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 30); // bolsa|subsidio_alimentacao|ajuda_custo|outro
            $table->string('period', 7)->nullable(); // YYYY-MM
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('AOA');
            $table->string('status', 20)->default('pendente');
            $table->string('method', 30)->nullable(); // transferencia|cheque|numerario
            $table->timestamp('paid_at')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'talent_id']);
            $table->index(['period', 'talent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
