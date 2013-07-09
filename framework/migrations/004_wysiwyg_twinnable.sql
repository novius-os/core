/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_wysiwyg` CHANGE `wysiwyg_foreign_id` `wysiwyg_foreign_id` INT( 10 ) UNSIGNED NULL;
ALTER TABLE `nos_wysiwyg` ADD `wysiwyg_foreign_context_common_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL AFTER `wysiwyg_foreign_id`;

ALTER TABLE `nos_wysiwyg` ADD INDEX ( `wysiwyg_join_table` , `wysiwyg_foreign_context_common_id` );