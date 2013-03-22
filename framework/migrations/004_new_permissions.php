<?php

namespace Nos\Migrations;

class New_permissions extends \Nos\Migration
{
    public function up()
    {
        \DB::query('ALTER TABLE `nos_role_permission` DROP `perm_identifier ;')->execute();
        \DB::query('ALTER TABLE `nos_role_permission` CHANGE `perm_key` `perm_name` VARCHAR( 30 ) NOT NULL;')->execute();
        \DB::query('ALTER TABLE `nos_role_permission` CHANGE `perm_application` `perm_category_key` VARCHAR( 30 ) NOT NULL;')->execute();
        \DB::query('UPDATE `nos_role_permission` SET `perm_name` = "nos::access" WHERE `perm_name` = "access";')->execute();
    }

    public function down()
    {

    }
}
