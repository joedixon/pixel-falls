<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code', 6)->unique(); // Short room code like "ABC123"
            $table->string('name');
            $table->foreignId('host_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['waiting', 'playing', 'finished'])->default('waiting');
            $table->unsignedTinyInteger('max_players')->default(4);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_rooms');
    }
};
