<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('noviusos_user::common');

return array(
    'controller_url' => 'admin/noviusos_user/role',
    'model' => 'Nos\\User\\Model_Role',
    'tab' => array(
        'iconUrl' => 'static/apps/noviusos_user/img/16/user.png',
        'labels' => array(
            'insert' => __('Add a role'),
        ),
    ),
    'layout' => array(
        'form' => array(
            'view' => 'nos::form/layout_standard',
            'params' => array(
                'title' => 'role_name',
                'medias' => array(),
                'large' => true,
                'save' => 'save',
                'subtitle' => array(),
                'content' => array(
                    'permissions' => array(
                        'view' => 'noviusos_user::admin/permission',
                    ),
                ),
            ),
        ),
    ),
    'fields' => array(
        'role_name' => array(
            'label' => __('Title'),
            'validation' => array(
                'required',
            ),
        ),
        'role_user_id' => array(
            'form' => array(
                'type' => 'hidden',
            ),
        ),
        'save' => array(
            'label' => '',
            'form' => array(
                'type' => 'submit',
                'tag' => 'button',
                'data-icon' => 'check',
                'class' => 'primary',
                // Note to translator: This is a submit button
                'value' => __('Save'),
            ),
        ),
    ),
);
