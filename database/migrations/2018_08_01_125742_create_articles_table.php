<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('type', ['article', 'book', 'action', 'socialize']);
            $table->string('author');
            $table->integer('filter');
            $table->string('nVisits')->nullable();
            $table->string('tag')->nullable();
            $table->string('image_url')->nullable();
            $table->string('external_link')->nullable();
            $table->string('video_link')->nullable();
            $table->string('content');
            $table->string('title');
            $table->string('nLikes')->nullable();
            $table->string('nBads')->nullable();
            $table->string('reviewers')->nullable();
            $table->string('comments')->nullable();
            $table->softDeletes();
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
        Schema::dropIfExists('articles');
    }
}
