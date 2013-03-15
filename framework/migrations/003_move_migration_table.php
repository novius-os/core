<?php
namespace Nos\Migrations;

class Move_migration_table
{
    public function up()
    {
        // stop migration if install_legacy has been executed
        $existing_migration = \DB::query('SELECT * FROM nos_migration WHERE
        type = "package" AND name="nos" AND migration="003_move_migration_table";')->execute();
        if (count($existing_migration) > 0) {
            return false;
        }

        \Config::load('migrations', true);
        $table = \Config::get('migrations.table');
        if ($table == 'migration') {
            \DB::query('RENAME TABLE `migration` TO  `nos_migration`;')->execute();
            \Migrate::set_table('nos_migration');
            \Config::set('migrations.table', 'nos_migration');
        }
    }

    public function down()
    {

    }
}