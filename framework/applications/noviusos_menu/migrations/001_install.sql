/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

CREATE TABLE IF NOT EXISTS `nos_menu` (
  `menu_id`                INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `menu_context`           VARCHAR(25)      NOT NULL,
  `menu_context_common_id` INT(11)          NOT NULL,
  `menu_context_is_main`   TINYINT(1)       NOT NULL DEFAULT '0',
  `menu_title`             VARCHAR(255)     NOT NULL,
  `menu_created_at`        TIMESTAMP        NOT NULL DEFAULT '0000-00-00 00:00:00',
  `menu_updated_at`        TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`menu_id`),
  KEY `menu_created_at` (`menu_created_at`),
  KEY `menu_updated_at` (`menu_updated_at`)
)
  DEFAULT CHARSET =utf8;

CREATE TABLE IF NOT EXISTS `nos_menu_item` (
  `mitem_id`         INT(11) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `mitem_menu_id`    INT(11)             NOT NULL,
  `mitem_parent_id`  INT(11) UNSIGNED DEFAULT NULL,
  `mitem_sort`       TINYINT(3) UNSIGNED NOT NULL DEFAULT '0',
  `mitem_driver`     VARCHAR(512)        NOT NULL,
  `mitem_title`      VARCHAR(255) DEFAULT NULL,
  `mitem_dom_id`     VARCHAR(512) DEFAULT NULL,
  `mitem_css_class`  VARCHAR(512) DEFAULT NULL,
  `mitem_created_at` TIMESTAMP           NOT NULL DEFAULT '0000-00-00 00:00:00',
  `mitem_updated_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`mitem_id`),
  KEY `mitem_created_at` (`mitem_created_at`),
  KEY `mitem_updated_at` (`mitem_updated_at`),
  KEY `mitem_parent_id` (`mitem_parent_id`),
  KEY `mitem_menu_id` (`mitem_menu_id`),
  KEY `mitem_sort` (`mitem_sort`)
)
  DEFAULT CHARSET =utf8;

CREATE TABLE IF NOT EXISTS `nos_menu_item_attribute` (
  `miat_id`       INT(111) UNSIGNED NOT NULL AUTO_INCREMENT,
  `miat_mitem_id` INT(11) UNSIGNED  NOT NULL,
  `miat_key`      VARCHAR(50)       NOT NULL,
  `miat_value`    VARCHAR(512)      NOT NULL,
  PRIMARY KEY (`miat_id`),
  KEY `miat_key` (`miat_key`),
  KEY `miat_mitem_id` (`miat_mitem_id`)
)
  DEFAULT CHARSET =utf8;
