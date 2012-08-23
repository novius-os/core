<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (!empty($begin)) {
    echo $begin;
} else {
    echo '<table class="fieldset">';
}
foreach ($fields as $field_name) {
    $field = $fieldset->field($field_name);
    if (!empty($field)) {
        if (isset($callback)) {
            $callback($field);
        } else {
            echo $field->build();
        }
    }
}
if (!empty($end)) {
    echo $end;
} else {
    echo '</table>';
}
