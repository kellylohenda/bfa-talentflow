<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talents', function (Blueprint $table) {
            $table->id();
            $table->string('talent_code', 20)->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('kind', 15); // bolseiro | estagiario
            $table->string('status', 20)->default('activo');
            $table->foreignId('program_id')->constrained()->restrictOnDelete();
            $table->foreignId('university_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('mentor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('application_id')->nullable()->constrained('applications')->nullOnDelete();
            $table->decimal('stipend', 12, 2)->default(0);
            $table->unsignedSmallInteger('perf')->nullable(); // 0-100
            $table->decimal('risk_score', 5, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'program_id', 'kind']);
        });

        // Adiciona FK circular após talents existir
        Schema::table('applications', function (Blueprint $table) {
            $table->foreign('converted_talent_id')->references('id')->on('talents')->nullOnDelete();
        });

        // users.talent_id FK (circular resolvida aqui)
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('talent_id')->references('id')->on('talents')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['talent_id']);
        });
        Schema::table('applications', function (Blueprint $table) {
            $table->dropForeign(['converted_talent_id']);
        });
        Schema::dropIfExists('talents');
    }
};
