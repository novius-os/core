ALTER TABLE `nos_media` CHANGE `media_path` `media_path` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL ,
CHANGE `media_file` `media_file` VARCHAR( 100 ) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL;
ALTER TABLE `nos_media_folder` CHANGE `medif_path` `medif_path` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL ,
CHANGE `medif_dir_name` `medif_dir_name` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL;