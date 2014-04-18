/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

CREATE TABLE IF NOT EXISTS `nos_template_variation` (
  `tpvar_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tpvar_template` varchar(255) NOT NULL,
  `tpvar_title` varchar(255) NOT NULL,
  `tpvar_context` varchar(25) NOT NULL,
  `tpvar_default` tinyint(4) NOT NULL DEFAULT '0',
  `tpvar_data` text,
  `tpvar_created_at` datetime NOT NULL,
  `tpvar_updated_at` datetime NOT NULL,
  `tpvar_created_by_id` INT UNSIGNED NULL,
  `tpvar_updated_by_id` INT UNSIGNED NULL,
  PRIMARY KEY (`tpvar_id`),
  KEY `tpvar_template` (`tpvar_template`),
  KEY `tpvar_context` (`tpvar_context`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `nos_template_variation_menu` (
  `tvme_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tvme_tpvar_id` int(10) unsigned NOT NULL,
  `tvme_key` varchar(30) NOT NULL,
  `tvme_menu_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`tvme_id`),
  KEY `tvme_menu_id` (`tvme_menu_id`),
  KEY `tvme_tpvar_id` (`tvme_tpvar_id`)
) CHARSET=utf8;
