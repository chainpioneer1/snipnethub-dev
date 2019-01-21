<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeedbackTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user');
            $table->enum('layout', ['frown', 'meh', 'smile'])->nullable();
            $table->enum('articles', ['frown', 'meh', 'smile'])->nullable();
            $table->enum('books', ['frown', 'meh', 'smile'])->nullable();
            $table->enum('action', ['frown', 'meh', 'smile'])->nullable();
            $table->enum('socialize', ['frown', 'meh', 'smile'])->nullable();
            $table->string('comment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('feedback');
    }
}
