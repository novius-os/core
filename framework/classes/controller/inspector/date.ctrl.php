<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

use Date, View;

class Controller_Inspector_Date extends Controller_Inspector
{
    public function prepare_i18n()
    {
        parent::prepare_i18n();
        I18n::current_dictionary('nos::common');
    }

    public function action_list()
    {
        $view = View::forge('inspector/date');

        $content = array();
        $since = array();
        $month = array();
        $year = array();
        if (is_array($this->config['options'])) {
            foreach ($this->config['options'] as $type) {
                switch ($type) {
                    case 'since' :
                        if (is_array($this->config['since']) && is_array($this->config['since']['options'])) {
                            foreach ($this->config['since']['options'] as $key => $label) {
                                if ($key == 'current month') {
                                    $dateBegin = new Date();
                                    $dateBegin->modify('first day of this month');
                                } else {
                                    $dateBegin = new Date();
                                    if (!($key == 'previous monday' && date('N') == 1)) {
                                        $dateBegin->modify($key);
                                    }
                                }
                                $since[] = array(
                                    'value' => $dateBegin->format('%Y-%m-%d').'|',
                                    'title' => $label,
                                    'group' => $this->config['since']['optgroup'],
                                );
                            }
                        }
                        break;

                    case 'month' :
                        $date = new Date();
                        $date->modify($this->config['month']['first_month']);
                        $date->modify('first day of this month');
                        $date_limit = clone $date;
                        if ($this->config['month']['limit_type'] == 'year') {
                            $date_limit->modify('-'.intval($this->config['month']['limit_value']).' year');
                        } elseif ($this->config['month']['limit_type'] == 'month') {
                            $date_limit->modify('-'.intval($this->config['month']['limit_value']).' month');
                        }
                        while (1 == 1) {
                            $dateEnd = clone $date;
                            $dateEnd->modify('last day of this month');
                            $month[] = array(
                                'value' => $date->format('%Y-%m-%d').'|'.$dateEnd->format('%Y-%m-%d'),
                                'title' => $date->format('%B %Y'),
                                'group' => $this->config['month']['optgroup'],
                            );
                            if (Date::compare($date, $date_limit) <= 0) {
                                break;
                            }
                            $date->modify('-1 month');
                        }
                        break;

                    case 'year' :
                        $date = new Date();
                        $date->modify($this->config['year']['first_year']);
                        $date->modify('first day of January');
                        $date_limit = clone $date;
                        $date_limit->modify('-'.intval($this->config['year']['limit']).' year');
                        while (1 == 1) {
                            $dateEnd = clone $date;
                            $dateEnd->modify('last day of December');
                            $year[] = array(
                                'value' => $date->format('%Y-%m-%d').'|'.$dateEnd->format('%Y-%m-%d'),
                                'title' => $date->format('%Y'),
                                'group' => $this->config['year']['optgroup'],
                            );
                            if (Date::compare($date, $date_limit) <= 0) {
                                break;
                            }
                            $date->modify('-1 year');
                        }
                        break;
                }
            }
            foreach ($this->config['options'] as $type) {
                switch ($type) {
                    case 'custom' :
                        $content = array_merge($content, array(array(
                            'value' => 'custom',
                            'title' => $this->config['labels']['Custom dates'],
                            'group' => '',
                        )));
                        break;

                    case 'since' :
                        $content = array_merge($content, $since);
                        break;

                    case 'month' :
                        $content = array_merge($content, $month);
                        break;

                    case 'year' :
                        $content = array_merge($content, $year);
                        break;
                }
            }
        }

        $view->set('content', $content, false);
        $view->set('labels', $this->config['labels']);

        $view->set('date_begin', \Nos\Renderer_Date_Picker::renderer(array(
            'name' => $this->config['input_begin'],
        )), false);
        $view->set('date_end', \Nos\Renderer_Date_Picker::renderer(array(
            'name' => $this->config['input_end'],
        )), false);

        return $view;
    }

    public static function process_config($application, $config, $item_actions = array(), $gridKey = null)
    {
        $inspector_path = static::get_path();

        $default_config = array(
            'input_begin'           => 'date_begin',
            'input_end'             => 'date_end',
            'labels'                => array(
                'Custom dates' => __('Custom dates'),
                'from begin to end' => __('from {{begin}} to {{end}}'),
                'until end' => __('until {{end}}'),
                'since begin' => __('since {{begin}}'),
            ),
            'options'               => array('custom', 'since', 'month', 'year'),
            'since'                 => array(
                'optgroup'  => __('Since'),
                'options'   => array(
                    '-3 day'            => __('3 last days'),
                    'previous monday'   => __('Week beginning'),
                    '-1 week'           => __('Less than a week'),
                    'current month'     => __('Month beginning'),
                    '-1 month'          => __('Less than one month'),
                    '-2 month'          => __('Less than two months'),
                    '-3 month'          => __('Less than three months'),
                    '-6 month'          => __('Less than six months'),
                    '-1 year'           => __('Less than one year'),
                ),
            ),
            'month'                 => array(
                'optgroup'      => __('Previous months'),
                'first_month'   => 'now',
                'limit_type'    => 'year',
                'limit_value'   => 1,
            ),
            'year'                  => array(
                'optgroup'      => __('Years'),
                'first_year'    => 'now',
                'limit'         => 4,
            ),
            'appdesk' => array(
                'vertical'  => true,
                'url'       => $inspector_path.'/list',
                'inputName' => $config['input']['key']
            ),
        );

        $config = array_merge($default_config, $config);
        $config['appdesk'] = array_merge($default_config['appdesk'], $config['appdesk']);
        $config['since'] = array_merge($default_config['since'], $config['since']);
        $config['month'] = array_merge($default_config['month'], $config['month']);
        $config['year'] = array_merge($default_config['year'], $config['year']);

        if (!isset($config['input']['query'])) {
            $column = $config['input']['key'];
            $config['input']['query'] = function($value, $query) use ($column) {
                list($begin, $end) = explode('|', $value.'|');
                if ($begin) {
                    if ($begin = Date::create_from_string($begin, '%Y-%m-%d')) {
                        $query->where(array($column, '>=', $begin->format('mysql')));
                    }
                }
                if ($end) {
                    if ($end = Date::create_from_string($end, '%Y-%m-%d')) {
                        $query->where(array($column, '<=', $end->format('mysql')));
                    }
                }

                return $query;
            };
        }

        return $config;
    }
}
