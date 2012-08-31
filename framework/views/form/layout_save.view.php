<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if ($save_field) {
    echo $save_field->set_template('{field}')->build();
} else {
    throw new \Exception('The save field is not present or incorrectly configured.');
}
?>
&nbsp; <?= __('or') ?> &nbsp; <a href="#" onclick="javascript:$nos(this).nosTabs('close');return false;"><?= __('Cancel') ?></a>
