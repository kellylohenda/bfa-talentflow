<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_code', 20)->unique();
            // Polimórfico: owner pode ser Talent, Application, Volunteer, Payment, Workflow
            $table->string('owner_type', 60);
            $table->unsignedBigInteger('owner_id');
            $table->foreignId('uploaded_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('category', 40); // bi|passaporte|cv|diploma|comprovativo|outro
            $table->unsignedSmallInteger('version')->default(1);
            $table->string('mime_type', 60)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('storage_path');
            $table->string('status', 20)->default('pendente'); // pendente|aprovado|rejeitado
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['owner_type', 'owner_id']);
            $table->index(['status', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
