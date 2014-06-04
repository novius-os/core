<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');

return array(
    'actions' => array(
        'add' => array(
            // Note to translator: Default copy meant to be overwritten by applications (e.g. Add Page > Add a page)
            'label' => __('Add {{model_label}}'),
            'action' => array(
                'action' => 'nosTabs',
                'method' => 'add',
                'tab' => array(
                    'url' => '{{controller_base_url}}insert_update?context={{context}}',
                ),
            ),
            'targets' => array(
                'toolbar-grid' => true,
            ),
        ),
        'edit' => array(
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => "{{controller_base_url}}insert_update/{{_id}}",
                    'label' => '{{_title}}',
                ),
            ),
            // Standard, most frequent actions (Edit, Visualise, Share, etc.)
            'label' => __('Edit'),
            'primary' => true,
            'icon' => 'pencil',
            'targets' => array(
                'grid' => true,
                'renderer' => true,
            ),
            'disabled' => array(
                'check_context' => function ($item) {
                    try {
                        $context = $item->get_context();
                    } catch (\Exception $e) {
                        // No context on the item => no permission to check
                        return false;
                    }
                    return !in_array($context, array_keys(\Nos\User\Permission::contexts()));
                },
            ),
        ),
        'delete' => array(
            'action' => array(
                'action' => 'confirmationDialog',
                'dialog' => array(
                    'contentUrl' => '{{controller_base_url}}delete/{{_id}}',
                    'title' => __('Deleting the item ‘{{title}}’'),
                ),
            ),
            'label' => __('Delete'),
            'primary' => true,
            'icon' => 'trash',
            'red' => true,
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'align' => 'end',
            'visible' => array(
                'check_is_new' => function ($params) {
                    return !isset($params['item']) || !$params['item']->is_new();
                },
            ),
            'disabled' => array(
                'check_context' => function ($item) {
                    try {
                        $context = $item->get_context();
                    } catch (\Exception $e) {
                        // No context on the item => no permission to check
                        return false;
                    }
                    return !in_array($context, array_keys(\Nos\User\Permission::contexts()));
                },
            ),
        ),
    ),
    'callable_keys' => array(
        'item' => array(
            'menu.menus'
        ),
    ),
);
