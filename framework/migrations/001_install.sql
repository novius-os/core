CREATE TABLE IF NOT EXISTS `nos_content_nuggets` (
  `content_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content_catcher` varchar(25) DEFAULT NULL,
  `content_model_name` varchar(100) DEFAULT NULL,
  `content_model_id` int(10) unsigned DEFAULT NULL,
  `content_data` text,
  PRIMARY KEY (`content_id`),
  UNIQUE KEY `content_catcher` (`content_catcher`,`content_model_name`,`content_model_id`)
)  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_wysiwyg` (
  `wysiwyg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `wysiwyg_text` text NOT NULL,
  `wysiwyg_join_table` varchar(255) NOT NULL,
  `wysiwyg_key` varchar(30) NOT NULL,
  `wysiwyg_foreign_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`wysiwyg_id`)
)  DEFAULT CHARSET=utf8;