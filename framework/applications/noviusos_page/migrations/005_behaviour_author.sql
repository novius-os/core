ALTER TABLE `nos_page` ADD `page_created_by_id` INT UNSIGNED NULL AFTER `page_updated_at` ,
ADD `page_updated_by_id` INT UNSIGNED NULL AFTER `page_created_by_id`;
