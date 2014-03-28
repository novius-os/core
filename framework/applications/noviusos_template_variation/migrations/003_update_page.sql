/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_page` ADD `page_template_variation_id` INT UNSIGNED  DEFAULT NULL AFTER `page_template`;

UPDATE `nos_page`, `nos_template_variation`
SET `page_template_variation_id` = `tpvar_id`
WHERE `page_context` = `tpvar_context`
AND `page_template` = `tpvar_template`;

ALTER TABLE `nos_page` DROP `page_template`;
