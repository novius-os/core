<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
echo $view_params['fieldset']->open($view_params['url_insert_update']);
echo View::forge('nos::form/insert_update_tab', array(
        'model' => $view_params['model'],
        'pk' => $view_params['pk'],
        'item' => $view_params['item'],
        'config' => $view_params['config'],
        'fieldset' => $view_params['fieldset'],
        'tab_params' => $view_params['tab_params'],
    ), false);
echo View::forge('nos::form/layout_standard', $view_params['config']['layout'] + array(
        'fieldset' => $view_params['fieldset'],
        'object' => $view_params['item'],
    ), false);
echo $view_params['fieldset']->close();
