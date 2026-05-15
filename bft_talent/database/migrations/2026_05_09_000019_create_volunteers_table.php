<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();
            $table->string('volunteer_code', 20)->unique();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('phone', 20)->nullable();
            $table->string('status', 20)->default('activo'); // activo|inactivo|suspenso
            $table->string('area_actuacao', 60)->nullable();
            $table->decimal('total_horas', 8, 2)->default(0);
            $table->foreignId('mentor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('data_inicio')->nullable();
            $table->text('motivacao')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'area_actuacao']);
        });

        // FK de users.volunteer_id — resolvida aqui
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('volunteer_id')->references('id')->on('volunteers')->nullOnDelete();
        });

        // FK de evento_inscricoes.volunteer_id resolvida aqui (volunteers já existe)
        Schema::table('evento_inscricoes', function (Blueprint $table) {
            $table->foreign('volunteer_id')->references('id')->on('volunteers')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('evento_inscricoes', function (Blueprint $table) {
            $table->dropForeign(['volunteer_id']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['volunteer_id']);
        });
        Schema::dropIfExists('volunteers');
    }
};
