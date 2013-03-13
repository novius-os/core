# delete old legacy migration
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '001_installation_0_1' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '002_migrate_0_1_1' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '003_version_0_2' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '004_move_migration_table' LIMIT 1;

# insert new migrations
