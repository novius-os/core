/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_media` ADD `media_created_by_id` INT UNSIGNED NULL AFTER `media_updated_at` ,
ADD `media_updated_by_id` INT UNSIGNED NULL AFTER `media_created_by_id`;

ALTER TABLE `nos_media_folder` ADD `medif_created_by_id` INT UNSIGNED NULL AFTER `medif_updated_at` ,
ADD `medif_updated_by_id` INT UNSIGNED NULL AFTER `medif_created_by_id`;
