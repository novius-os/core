/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_role_permission` DROP `perm_identifier` ;
ALTER TABLE `nos_role_permission` CHANGE `perm_key` `perm_name` VARCHAR( 100 ) NOT NULL;
ALTER TABLE `nos_role_permission` CHANGE `perm_application` `perm_category_key` VARCHAR( 100 ) NOT NULL;
UPDATE `nos_role_permission` SET `perm_name` = "nos::access" WHERE `perm_name` = "access";
