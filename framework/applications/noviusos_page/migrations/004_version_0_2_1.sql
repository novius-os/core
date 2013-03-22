ALTER TABLE `nos_page`
  ADD `page_publication_start` DATETIME NULL DEFAULT NULL AFTER `page_published` ,
  ADD `page_publication_end` DATETIME NULL DEFAULT NULL AFTER `page_publication_start`;
