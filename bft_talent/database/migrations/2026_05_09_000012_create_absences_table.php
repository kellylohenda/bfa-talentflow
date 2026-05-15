<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->string('absence_code', 20)->unique();
            $table->foreignId('talent_id')->constrained('talents')->cascadeOnDelete();
            $table->foreignId('program_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tipo', 30); // justificada|injustificada|medica|ferias|outro
            $table->date('date_start');
            $table->date('date_end');
            $table->unsignedSmallInteger('dias')->default(1);
            $table->string('status', 20)->default('pendente'); // pendente|aprovada|rejeitada
            $table->text('motivo')->nullable();
            $table->timestamps();

            $table->index(['talent_id', 'date_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
