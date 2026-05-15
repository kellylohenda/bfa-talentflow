<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_ref', 30)->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->foreignId('program_id')->constrained()->restrictOnDelete();
            $table->foreignId('university_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tipo', 20)->default('nacional');
            $table->string('stage', 30)->default('analise');
            $table->unsignedSmallInteger('score')->default(0);
            $table->text('observacoes')->nullable();
            $table->unsignedBigInteger('converted_talent_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['stage', 'program_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
