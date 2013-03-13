<?php
namespace Nos\Migrations;

class Install extends \Nos\Migration
{
    public function up()
    {
        // test if there exists old migrations migrations
        $old_migration = \DB::query('SELECT * FROM nos_migration WHERE
        type = "app" AND name="default" AND migration="001_installation_0_1";')->execute();
        if (count($old_migration) > 0) {
            $sql_file_legacy = substr($this->path, 0, strlen($this->path) - 4).'_legacy.sql';
            static::execute_sql_file($sql_file_legacy);
        } else {
            parent::up();
        }
    }
}