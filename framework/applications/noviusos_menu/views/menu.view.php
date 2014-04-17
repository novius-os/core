<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$display_branch = function () {

};
$display_branch = function ($items) use ($menu, $display_branch) {
    if (count($items)) {
        echo '<ul>';
        foreach ($items as $item) {
            echo '<li>', $item->html();
            echo $display_branch($menu->branch($item));
            echo '</li>';
        }
        echo '</ul>';
    }
};
echo $display_branch($menu->branch());
