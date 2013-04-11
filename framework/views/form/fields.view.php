<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


$content = array();

foreach ($fields as $field_name) {
    $field = $fieldset->field($field_name);
    // Note: the isRestricted() check should not be strictly necessary, as restricted fields sould return empty content
    if (!empty($field) && !$field->isRestricted()) {
        if (isset($callback)) {
            // The callback function can either echo things or returning the content.
            ob_start();
            echo $callback($field);
            $content[] = ob_get_clean();
        } else {
            $content[] = $field->build();
        }
    }
}
$content = implode('', $content);

if (!empty($content) || !empty($show_when_empty)) {
    if (!empty($begin)) {
        echo $begin;
    } else {
        echo '<table class="fieldset">';
    }

    echo $content;

    if (!empty($end)) {
        echo $end;
    } else {
        echo '</table>';
    }
}
