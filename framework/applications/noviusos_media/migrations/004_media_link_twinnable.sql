ALTER TABLE `nos_media_link` ADD INDEX ( `medil_media_id` );
ALTER TABLE `nos_media_link` ADD INDEX ( `medil_from_table` , `medil_foreign_id` );

ALTER TABLE `nos_media_link` CHANGE `medil_foreign_id` `medil_foreign_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `nos_media_link` ADD `medil_foreign_context_common_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER `medil_foreign_id`;

ALTER TABLE `nos_media_link` ADD INDEX ( `medil_from_table` , `medil_foreign_context_common_id` );