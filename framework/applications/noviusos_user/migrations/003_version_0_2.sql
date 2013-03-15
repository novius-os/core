ALTER TABLE `nos_role_permission` CHANGE  `perm_application`  `perm_key2` VARCHAR( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, CHANGE  `perm_key`  `perm_application` VARCHAR( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE `nos_role_permission` CHANGE  `perm_key2`  `perm_key` VARCHAR( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

UPDATE `nos_role_permission` SET `perm_application` = "noviusos_page" WHERE `perm_application` = "nos_page";
UPDATE `nos_role_permission` SET `perm_application` = "noviusos_media" WHERE `perm_application` = "nos_media";
UPDATE `nos_role_permission` SET `perm_application` = "noviusos_user" WHERE `perm_application` = "nos_user";
UPDATE `nos_role_permission` SET `perm_application` = "noviusos_appmanager" WHERE `perm_application` = "nos_tray";


ALTER TABLE `nos_user_role` ADD PRIMARY KEY ( `user_id` , `role_id` );

ALTER TABLE `nos_user` ADD `user_expert` tinyint(1) NOT NULL DEFAULT '0' AFTER `user_configuration`;


ALTER TABLE `nos_user` ADD `user_lang` VARCHAR( 5 ) NOT NULL DEFAULT 'en_GB' AFTER `user_password`;
