# delete old legacy migrations
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '001_installation_0_1' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '002_migrate_0_1_1' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '003_version_0_2' LIMIT 1;
DELETE FROM `nos_migration` WHERE `nos_migration`.`type` = 'app' AND `nos_migration`.`name` = 'default' AND `nos_migration`.`migration` = '004_move_migration_table' LIMIT 1;

# insert new equivalent migrations
INSERT INTO `nos_migration` (`type`, `name`, `migration`) VALUES
('module', 'noviusos_media', '001_install'),
('module', 'noviusos_media', '002_migrate_0_1_1'),
('module', 'noviusos_page', '001_install'),
('module', 'noviusos_page', '002_migrate_0_1_1'),
('module', 'noviusos_page', '003_version_0_2'),
('module', 'noviusos_user', '001_install'),
('module', 'noviusos_user', '002_migrate_0_1_1'),
('module', 'noviusos_user', '003_version_0_2'),
('package', 'nos', '002_version_0_2'),
('package', 'nos', '003_move_migration_table'),
('module', 'noviusos_templates_basic', '001_version_0_2'),
('module', 'noviusos_blog', '001_install'),
('module', 'noviusos_blog', '002_migrate_0_1_1'),
('module', 'noviusos_blog', '003_version_0_2'),
('module', 'noviusos_comments', '001_install'),
('module', 'noviusos_form', '001_install'),
('module', 'noviusos_news', '001_install'),
('module', 'noviusos_news', '002_migrate_0_1_1'),
('module', 'noviusos_news', '003_version_0_2'),
('module', 'noviusos_slideshow', '001_install');