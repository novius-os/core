ALTER TABLE `nos_role_permission` DROP `perm_identifier ;
ALTER TABLE `nos_role_permission` CHANGE `perm_key` `perm_name` VARCHAR( 30 ) NOT NULL;
ALTER TABLE `nos_role_permission` CHANGE `perm_application` `perm_category_key` VARCHAR( 30 ) NOT NULL;
UPDATE `nos_role_permission` SET `perm_name` = "nos::access" WHERE `perm_name` = "access";
