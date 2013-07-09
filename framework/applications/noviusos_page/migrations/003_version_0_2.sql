/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_page` CHANGE `page_lang` `page_context` VARCHAR( 25 ) NOT NULL, CHANGE `page_lang_common_id` `page_context_common_id` INT( 11 ) NOT NULL, CHANGE `page_lang_is_main` `page_context_is_main` TINYINT( 1 ) NOT NULL DEFAULT '0';

UPDATE `nos_page` SET `page_context` = CONCAT('main::', `page_context`);
