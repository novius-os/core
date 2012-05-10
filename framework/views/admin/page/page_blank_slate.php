<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

echo View::forge('nos::form/layout_blank_slate', array(
    'item' => $page,
    'lang' => $lang,
    'common_id' => $common_id,
    'item_text' => __('page'),
), false);