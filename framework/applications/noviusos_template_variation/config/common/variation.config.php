<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary(array('noviusos_template_variation::common'));

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
        'list' => array(
            'delete' => array(
                'primary' => false,
                'disabled' => array(
                    'check_default' => function ($tpvar) {
                        return
                            !!$tpvar->tpvar_default ?
                            __(
                                'The default template variation cannot be deleted. To delete this '.
                                'template variation, set another template variation as default first.'
                            ) :
                            false;
                    },
                    'check_used' => function ($tpvar) {
                        if (!\Nos\Page\Model_Page::count(array(
                                'where' => array(array('page_template_variation_id' => $tpvar->tpvar_id)),
                            ))) {
                            return __('This template variation is used by pages.');
                        }
                    },
                ),
            ),
            'set_default' => array(
                'label' => __('Set as default template variation'),
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
                                            'We know it’s frustrating, but you can only set a template variation as '.
                                            'default when viewing one language. Select a language '.
                                            'from the drop-down list in the top-right corner to do so.'
                                        );
                                    } else {
                                        $disabled = __(
                                            'We know it’s frustrating, but you can only set a template variation as '.
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
                        return !!$tpvar->tpvar_default ? __('This template variation is the default already.') : false;
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
);
