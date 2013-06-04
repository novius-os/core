<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
echo $fieldset->open($crud['url_insert_update']);

echo View::forge('nos::crud/tab', $view_params, false);

echo View::forge('nos::crud/toolbar', $view_params, false);

$layout = $crud['config'][$crud['is_new'] ? 'layout_insert' : 'layout_update'];
foreach ($layout as $view) {
    if (!empty($view['view'])) {
        $view['params'] = empty($view['params']) ? array() : $view['params'];
        echo View::forge($view['view'], $view['params'] + $view_params, false);
    }
}

echo $fieldset->close();
