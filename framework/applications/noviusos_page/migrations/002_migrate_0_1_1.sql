/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

ALTER TABLE `nos_page`
DROP `page_search_words`,
DROP `page_raw_html`,
DROP `page_publication_start`,
DROP `page_requested_by_user_id`,
DROP `page_head_additional`;