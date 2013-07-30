/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE  `nos_page` CHANGE  `page_virtual_name`  `page_virtual_name` VARCHAR( 100 ) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL;
ALTER TABLE  `nos_page` DROP INDEX  `page_virtual_url` ,
ADD INDEX  `page_virtual_url` (  `page_virtual_url` ( 255 ) ,  `page_context` );
ALTER TABLE  `nos_page` CHANGE  `page_virtual_url`  `page_virtual_url` VARCHAR( 2000 ) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL;
