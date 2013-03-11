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

CREATE TABLE IF NOT EXISTS `nos_user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) DEFAULT CHARSET=utf8;