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
            ),
        ),
        'visualise' => array(
            'label' => __('Visualise'),
            'primary' => true,
            'iconClasses' => 'nos-icon16 nos-icon16-eye',
            'action' => array(
                'action' => 'window.open',
                'url' => '{{preview_url}}?_preview=1',
            ),
            'disabled' => array(
            function($item, $params)
            {
                if ($item::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    $url = $item->url_canonical(array('preview' => true));
                    if ($item->is_new()) {
                        return true;
                    }
                    if (!!empty($url)) {
                        return $params['config']['i18n']['visualising no url'];
                    }

                    return false;
                }
                return true;
            }),
            'targets' => array(
                'grid' => true,
                'toolbar-edit' => true,
            ),
            'visible' => array(
            function($params) {
                if (isset($params['item']) && $params['item']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    $url = $params['item']->url_canonical(array('preview' => true));
                    return !$params['item']->is_new() && !empty($url);
                }
                if (isset($params['model']) && $params['model']::behaviours('Nos\Orm_Behaviour_Urlenhancer', false)) {
                    return true;
                }
                return false;
            }),
        ),
        'share' => array(
            'label' => __('Share'),
            'iconClasses' => 'nos-icon16 nos-icon16-share',
            'action' => array(
                'action' => 'share',
                'data' => array(
                    'model_id' => '{{_id}}',
                    'model_name' => '{{_model}}',
                ),
            ),
            'targets' => array(
                'toolbar-edit' => true,
            ),
            'visible' => array(
            function($params) {
                $model = get_class($params['item']);
                return !$params['item']->is_new() && $model::behaviours('Nos\Orm_Behaviour_Sharable', false);
            }),
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
            'visible' => array(
            function($params) {
                return !isset($params['item']) || !$params['item']->is_new();
            }),
        ),
    ),
);
