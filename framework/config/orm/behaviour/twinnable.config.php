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

$config = array(
    'actions' => array(),
);

$contexts = array_keys(\Nos\User\Permission::contexts());

if (count($contexts) > 1) {
    $sites = \Nos\Tools_Context::sites();
    $locales = \Nos\Tools_Context::locales();

    if (count($sites) === 1) {
        // Note to translator: action (button)
        $label = __('Translate');
    } elseif (count($locales) === 1) {
        $label = __('Add to another site');
    } else {
        $label = __('Translate / Add to another site');
    }

    $config['actions'] = array(
        'translate' => array(
            'label' => $label,
            'targets' => array(
                'toolbar-edit' => true,
            ),
            'visible' => array(
                'check_is_new' => function ($params) {
                    return !isset($params['item']) || !$params['item']->is_new();
                },
            ),
            'align' => 'begin',
            'menu' => array(
                'options' => array(
                    'orientation' => 'vertical',
                    'direction' => 'rtl',
                ),
                'menus' => function ($item) use ($contexts, $locales, $sites) {
                    $actions = array();
                    $class = get_class($item);
                    $behaviours = $class::behaviours();
                    $common_config = \Nos\Config_Common::load($class);
                    $controller_base_url = $common_config['placeholders']['controller_base_url'];

                    $main_context = $item->find_main_context();
                    foreach ($contexts as $context) {

                        if ($item->{$behaviours['Nos\Orm_Behaviour_Twinnable']['context_property']} === $context) {
                            continue;
                        }
                        $item_context = $item->find_context($context);
                        $url = $controller_base_url.'insert_update'.(empty($item_context) ? (empty($main_context) ? '' : '/'.$main_context->id).'?context='.$context : '/'.$item_context->id);
                        if (empty($item_context)) {
                            if (count($sites) === 1) {
                                $label = __('Translate into {{context}}');
                            } elseif (count($locales) === 1) {
                                $label = __('Add to {{context}}');
                            } else {
                                if (\Nos\Tools_Context::localeCode($context) === \Nos\Tools_Context::localeCode($item->get_context())) {
                                    $label = __('Add to {{context}}');
                                } else {
                                    $label = __('Translate into {{context}}');
                                }
                            }
                        } else {
                            $label = __('Edit {{context}}');
                        }
                        $label = strtr($label, array('{{context}}' => \Nos\Tools_Context::contextLabel($context)));
                        $actions[] = array(
                            'content' => $label,
                            'action' => array(
                                'action' => 'nosTabs',
                                'method' => empty($main_context) ? 'add' : 'open',
                                'tab' => array(
                                    'url' => $url,
                                ),
                            ),
                        );
                    }
                    return $actions;
                },
            ),
            'icons' => array(
                'secondary' => 'triangle-1-s',
            ),
        ),
    );
}


return $config;
