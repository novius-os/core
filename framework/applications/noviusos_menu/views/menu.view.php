<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

!isset($depth) && $depth = 3;
$display_branch = function ($items, $depth) use ($menu, &$display_branch) {
    if (count($items) && $depth > 0) {
        echo '<ul>';
        foreach ($items as $item) {
            echo '<li>', $item->html();
            echo $display_branch($menu->branch($item), $depth - 1);
            echo '</li>';
        }
        echo '</ul>';
    }
};
echo $display_branch($menu->branch(), $depth);
