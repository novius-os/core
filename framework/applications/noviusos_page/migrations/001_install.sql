/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

CREATE TABLE IF NOT EXISTS `nos_page` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_parent_id` int(11) DEFAULT NULL,
  `page_template` varchar(255) DEFAULT NULL,
  `page_level` tinyint(4) NOT NULL DEFAULT '0',
  `page_title` varchar(255) NOT NULL DEFAULT '',
  `page_lang` varchar(5) NOT NULL,
  `page_lang_common_id` int(11) NOT NULL,
  `page_lang_is_main` tinyint(1) NOT NULL DEFAULT '0',
  `page_menu_title` varchar(255) DEFAULT NULL,
  `page_meta_title` varchar(255) DEFAULT NULL,
  `page_search_words` text,
  `page_raw_html` tinyint(4) DEFAULT '0',
  `page_sort` float DEFAULT NULL,
  `page_menu` tinyint(4) NOT NULL DEFAULT '0',
  `page_type` tinyint(4) NOT NULL DEFAULT '0',
  `page_published` tinyint(4) NOT NULL DEFAULT '0',
  `page_publication_start` datetime DEFAULT NULL,
  `page_meta_noindex` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `page_requested_by_user_id` int(11) DEFAULT NULL,
  `page_lock` tinyint(4) NOT NULL DEFAULT '0',
  `page_entrance` tinyint(4) NOT NULL DEFAULT '0',
  `page_home` tinyint(4) NOT NULL DEFAULT '0',
  `page_cache_duration` int(11) DEFAULT NULL,
  `page_virtual_name` varchar(50) DEFAULT NULL,
  `page_virtual_url` varchar(255) DEFAULT NULL,
  `page_external_link` varchar(255) DEFAULT NULL,
  `page_external_link_type` tinyint(4) DEFAULT NULL,
  `page_created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `page_updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `page_meta_description` text,
  `page_meta_keywords` text,
  `page_head_additional` text,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `page_virtual_url` (`page_virtual_url`, `page_lang`),
  KEY `page_parent_id` (`page_parent_id`),
  KEY `page_lang` (`page_lang`),
  KEY `page_lang_common_id` (`page_lang_common_id`, `page_lang_is_main`),
  KEY `page_lang_is_main` (`page_lang_is_main`),
  KEY `page_requested_by_user_id` (`page_requested_by_user_id`)
)  DEFAULT CHARSET=utf8;