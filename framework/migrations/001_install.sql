/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

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

# User table is necessary to install applications
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
