<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    public $table = 'articles';

    public $fillable = ['author', 'type', 'filter', 'content'];

    public function filter(){
        return $this->hasOne('App\FilterType', 'id', 'filter');
    }

    public function auth(){
        return $this->hasOne('App\User', 'id', 'author');
    }
}
