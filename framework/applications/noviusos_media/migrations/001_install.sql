/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

CREATE TABLE IF NOT EXISTS `nos_media` (
  `media_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `media_folder_id` int(10) unsigned NOT NULL,
  `media_path` varchar(255) NOT NULL,
  `media_file` varchar(100) NOT NULL,
  `media_ext` varchar(4) NOT NULL,
  `media_title` varchar(50) NOT NULL,
  `media_application` varchar(30) DEFAULT NULL,
  `media_protected` tinyint(1) NOT NULL DEFAULT '0',
  `media_width` smallint(5) unsigned DEFAULT NULL,
  `media_height` smallint(5) unsigned DEFAULT NULL,
  `media_created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `media_updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`),
  KEY `media_folder_id` (`media_folder_id`)
)  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_media_folder` (
  `medif_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `medif_parent_id` int(10) unsigned DEFAULT NULL,
  `medif_title` varchar(50) NOT NULL,
  `medif_path` varchar(255) NOT NULL,
  `medif_dir_name` varchar(50) DEFAULT NULL,
  `medif_created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `medif_updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`medif_id`),
  KEY `medip_parent_id` (`medif_parent_id`)
)  DEFAULT CHARSET=utf8;

INSERT INTO `nos_media_folder` (`medif_id`, `medif_parent_id`, `medif_path`, `medif_dir_name`, `medif_title`, `medif_created_at`, `medif_updated_at`) VALUES
  (1, NULL, '/', NULL, 'Media centre', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

CREATE TABLE IF NOT EXISTS `nos_media_link` (
  `medil_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `medil_from_table` varchar(255) NOT NULL,
  `medil_foreign_id` int(10) unsigned NOT NULL,
  `medil_key` varchar(30) NOT NULL,
  `medil_media_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`medil_id`)
)  DEFAULT CHARSET=utf8;