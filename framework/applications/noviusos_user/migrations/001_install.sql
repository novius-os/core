CREATE TABLE IF NOT EXISTS `nos_role` (
  `role_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`role_id`)
)  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_role_permission` (
  `perm_role_id` int(10) unsigned NOT NULL,
  `perm_application` varchar(30) NOT NULL,
  `perm_identifier` varchar(30) NOT NULL,
  `perm_key` varchar(30) NOT NULL,
  UNIQUE KEY `perm_group_id` (`perm_role_id`,`perm_application`,`perm_key`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_md5` varchar(32) DEFAULT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_firstname` varchar(100) DEFAULT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(64) NOT NULL,
  `user_last_connection` datetime DEFAULT NULL,
  `user_configuration` text,
  `user_created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `user_md5` (`user_md5`)
)  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) DEFAULT CHARSET=utf8;