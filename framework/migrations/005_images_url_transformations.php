<?php
namespace Nos\Migrations;

class Images_Url_Transformations extends \Nos\Migration
{
    public function up()
    {
        try {
            \File::delete_dir(\Config::get('cache_dir').'media', true, false);
            \File::delete_dir(DOCROOT.'cache'.DS.'media', true, false);
            \File::delete_dir(DOCROOT.'media', true, false);

            \File::delete_dir(\Config::get('cache_dir').'pages', true, false);
        } catch (\InvalidPathException $e) {
            // Dir doesn't exists, no problem
        }
    }
}
