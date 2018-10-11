<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary(array('noviusos_template_variation::common', 'nos::common'));

return array(
    'data_mapping' => array(
        'tpvar_title' => array(
            'title'    => __('Title'),
            'sortDirection' => 'ascending',
            'cellFormatters' => array(
                'is_default' => array(
                    'type' => 'iconClasses',
                    'column' => 'iconClasses',
                ),
            ),
        ),
        'context' => true,
        'tpvar_template' => array(
            'title'         => __('Template'),
            'value' =>  function ($tpvar) {
                $template = $tpvar->configCompiled();
                return \Arr::get($template, 'title', $tpvar->tpvar_template);
            },
        ),
        'is_default' => array(
            'value' => function ($tpvar) {
                return (bool) (int) $tpvar->tpvar_default;
            }
        ),
        'iconClasses' => array(
            'value' => function ($tpvar) {
                return $tpvar->tpvar_default ? 'ui-icon ui-icon-circle-check' : false;
            }
        ),
        'thumbnail' => array(
            'value' => function ($tpvar) {
                $template = $tpvar->configCompiled();
                return \Arr::get($template, 'screenshot', false);
            },
        ),
        'thumbnailAlternate' => array(
            'value' => function ($tpvar) {
                return 'static/apps/noviusos_template_variation/img/64/template-variation.png';
            }
        ),
    ),
    'actions' => array(
        'add' => array(
            'label' => __('Add a variation'),
        ),
        'list' => array(
            'delete' => array(
                'primary' => false,
                'disabled' => array(
                    'check_default' => function ($tpvar) {
                        return
                            !!$tpvar->tpvar_default ?
                            __(
                                'The default variation cannot be deleted. To delete this '.
                                'variation, set another variation as default first.'
                            ) :
                            false;
                    },
                    'check_used' => function ($tpvar) {
                        if (\Nos\Page\Model_Page::count(array(
                                'where' => array(array('page_template_variation_id' => $tpvar->tpvar_id)),
                            ))) {
                            return __('This variation is used by pages.');
                        }
                    },
                ),
            ),
            'visualise' => array(
                'label' => __('Visualise'),
                'primary' => true,
                'iconClasses' => 'nos-icon16 nos-icon16-eye',
                'action' => array(
                    'action' => 'window.open',
                    'url' => 'admin/noviusos_template_variation/visualise?tpvar_id={{_id}}',
                ),
                'disabled' => false,
                'targets' => array(
                    'grid' => true,
                    'toolbar-edit' => true,
                ),
                'visible' => array(
                    'is_new' => function ($params) {
                        return !isset($params['item']) || !$params['item']->is_new();
                    },
                ),
            ),
            'set_default' => array(
                'label' => __('Set as default variation'),
                'primary' => false,
                'icon' => 'circle-check',
                'action' => array(
                    'action' => 'nosAjax',
                    'params' => array(
                        'url' => '{{controller_base_url}}set_default',
                        'method' => 'POST',
                        'data' => array(
                            'id' => '{{_id}}',
                        ),
                    ),
                ),
                'targets' => array(
                    'grid' => true,
                ),
                'disabled' => array(
                    'check_monocontext' => function ($tpvar) {
                        $controller = \Nos\Nos::main_controller();
                        static $disabled = null;
                        if ($disabled === null) {
                            $disabled = false;
                            if (is_subclass_of($controller, 'Nos\Template\Variation\Controller_Admin_Appdesk')) {
                                $context = Input::get('context', null);
                                if (empty($context) || (is_array($context) && count($context) > 1)) {
                                    $one_site = count(Nos\Tools_Context::sites()) === 1;
                                    if ($one_site) {
                                        $disabled = __(
                                            'We know it’s frustrating, but you can only set a variation as '.
                                            'default when viewing one language. Select a language '.
                                            'from the drop-down list in the top-right corner to do so.'
                                        );
                                    } else {
                                        $disabled = __(
                                            'We know it’s frustrating, but you can only set a variation as '.
                                            'default when viewing one context. Select a context '.
                                            'from the drop-down list in the top-right corner to do so.'
                                        );
                                    }
                                }
                            }
                        }
                        return $disabled;
                    },
                    'check_default' => function ($tpvar) {
                        return !!$tpvar->tpvar_default ? __('This variation is the default already.') : false;
                    },
                ),
            ),
            'duplicate' => array(
                'action' => array(
                    'action' => 'nosTabs',
                    'tab' => array(
                        'url' => 'admin/noviusos_template_variation/variation/insert_update?create_from_id={{_id}}',
                    ),
                ),
                'label' => __('Duplicate'),
                'primary' => false,
                'icon' => 'circle-plus',
                'targets' => array(
                    'toolbar-edit' => true,
                ),
                'visible' => array(
                    'is_new' => function ($params) {
                        return !isset($params['item']) || !$params['item']->is_new();
                    },
                ),
            ),
        ),
    ),
    'i18n' => array(
        // Crud
        'notification item added' => __('Done! The variation has been added.'),
        'notification item deleted' => __('The variation has been deleted.'),

        // General errors
        'notification item does not exist anymore' => __('This variation doesn’t exist any more. It has been deleted.'),
        'notification item not found' => __('We cannot find this variation.'),

        // Deletion popup
        'deleting item title' => __('Deleting the variation ‘{{title}}’'),

        # Delete action's labels
        'deleting button N items' => n__(
            'Yes, delete this variation ',
            'Yes, delete these {{count}} variations'
        ),

        'N items' => n__(
            '1 variation',
            '{{count}} variations'
        ),

        # Keep only if the model has the behaviour Contextable
        'deleting with N contexts' => n__(
            'This variation exists in <strong>one context</strong>.',
            'This variation exists in <strong>{{context_count}} contexts</strong>.'
        ),
        'deleting with N languages' => n__(
            'This variation exists in <strong>one language</strong>.',
            'This variation exists in <strong>{{language_count}} languages</strong>.'
        ),

        # Keep only if the model has the behaviour Twinnable
        'translate error impossible context' => __('This variation cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)'),
    ),
);
