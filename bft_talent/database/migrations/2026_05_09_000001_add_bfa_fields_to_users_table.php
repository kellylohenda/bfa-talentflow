<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('bfa_role')->nullable()->after('email');
            $table->string('phone', 20)->nullable()->after('bfa_role');
            $table->unsignedBigInteger('talent_id')->nullable()->after('phone');
            $table->unsignedBigInteger('volunteer_id')->nullable()->after('talent_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bfa_role', 'phone', 'talent_id', 'volunteer_id']);
        });
    }
};
