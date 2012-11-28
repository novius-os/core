<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
if ($type === 'checkbox') {
    ?>
    <tr><th></th><td class="{error_class}">{field} {label}{required} {error_msg}</td></tr>
    <?php
} else {
    ?>
    <tr><th class="{error_class}">{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>
    <?php
}
