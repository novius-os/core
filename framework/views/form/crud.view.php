<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
echo $fieldset->open($url_crud);
echo View::forge('nos::form/crud_tab', array(
        'model' => $model,
        'pk' => $pk,
        'item' => $item,
        'config' => $config,
        'fieldset' => $fieldset,
        'tab_params' => $tab_params,
    ), false);
echo View::forge('nos::form/layout_standard', $config['layout'] + array(
        'fieldset' => $fieldset,
        'object' => $item,
    ), false);
echo $fieldset->close();
