<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
echo $crud['fieldset']->open($crud['url_crud']);
echo View::forge('nos::form/crud_tab', array(
        'model' => $crud['model'],
        'pk' => $crud['pk'],
        'item' => $crud['item'],
        'config' => $crud['config'],
        'fieldset' => $crud['fieldset'],
        'tab_params' => $crud['tab_params'],
    ), false);
echo View::forge('nos::form/layout_standard', $crud['config']['layout'] + array(
        'fieldset' => $crud['fieldset'],
        'object' => $crud['item'],
    ), false);
echo $crud['fieldset']->close();
