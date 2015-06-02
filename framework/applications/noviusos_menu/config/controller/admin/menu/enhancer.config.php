<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

// Get the available views
$app_config = \Config::load('noviusos_menu::config', true);
$views_config = \Arr::get($app_config, 'views', array());
$views = array();
foreach($views_config as $key => $value){
    $views[$key] = $value['title'];
}

return array(
    'fields' => array(
        'menu_id' => array(
            'label' => __('Menu:'),
            'form' => array(
                'type' => 'hidden',
                'class' => 'menu_id',
            ),
            'renderer' => 'Nos\Renderer_Item_Picker',
            'renderer_options' => array(
                'model' => 'Nos\\Menu\\Model_Menu',
                'appdesk' => 'admin/noviusos_menu/menu/appdesk',
                'defaultThumbnail' => 'static/apps/noviusos_menu/img/64/menu.png',
                'texts' => array(
                    'empty' => __('No menu selected'),
                    'add' => __('Pick a menu'),
                    'edit' => __('Pick another menu'),
                    'delete' => __('Un-select this menu'),
                ),
            ),
        ),
        'menu_view' => array(
            'label' => __('View:'),
            'template' => '<p style="margin:10px 0 .5em 10px;">{label}{required}<br />{field} {error_msg}</p>',
            'form' => array(
                'type' => count($views) > 1 ? 'select' : 'hidden',
                'class' => 'menu_view',
                'options' => $views,
                'value' => key($views),
            ),
        ),
    ),
    'preview' => array(
        'params' => array(
            'title' => function($args) {
                $menu_id = \Arr::get($args, 'menu_id');
                if (!empty($menu_id)) {
                    $menu = \Nos\Menu\Model_Menu::find($menu_id);
                    if (!empty($menu)) {
                        return strtr(__('Menu &laquo; {{title}} &raquo;'), array(
                            '{{title}}' => $menu->title_item(),
                        ));
                    }
                }
                return __('Menu');
            }
        ),
    ),
);
