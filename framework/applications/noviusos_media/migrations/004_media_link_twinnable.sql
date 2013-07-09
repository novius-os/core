/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_media_link` ADD INDEX ( `medil_media_id` );
ALTER TABLE `nos_media_link` ADD INDEX ( `medil_from_table` , `medil_foreign_id` );

ALTER TABLE `nos_media_link` CHANGE `medil_foreign_id` `medil_foreign_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `nos_media_link` ADD `medil_foreign_context_common_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER `medil_foreign_id`;

ALTER TABLE `nos_media_link` ADD INDEX ( `medil_from_table` , `medil_foreign_context_common_id` );