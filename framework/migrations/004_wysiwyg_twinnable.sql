ALTER TABLE `nos_wysiwyg` CHANGE `wysiwyg_foreign_id` `wysiwyg_foreign_id` INT( 10 ) UNSIGNED NULL;
ALTER TABLE `nos_wysiwyg` ADD `wysiwyg_foreign_context_common_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER `wysiwyg_foreign_id`;

ALTER TABLE `nos_wysiwyg` ADD INDEX ( `wysiwyg_join_table` , `wysiwyg_foreign_context_common_id` );