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

class Orm_Behaviour_Virtualname extends Orm_Behaviour
{
    protected static $_friendly_slug_always_last = array();

    public static function _init()
    {
        I18n::current_dictionary('nos::orm');

        \Config::load('friendly_slug', true);
        static::$_friendly_slug_always_last = \Config::get('friendly_slug.always_last');
    }

    protected $_properties = array();

    public function __construct($class)
    {
        parent::__construct($class);
        if (!isset($this->_properties['unique'])) {
            $this->_properties['unique'] = 'context';
        }
        if ($this->_properties['unique'] === 'context') {
            $this->_properties['unique'] = $class::behaviours('Nos\Orm_Behaviour_Twinnable', true);
        }
    }

    public function before_save(\Nos\Orm\Model $item)
    {
        $diff = $item->get_diff();

        // If we have a new item or the virtual name has changed
        if ($item->is_new() || !empty($diff[0][$this->_properties['virtual_name_property']])) {

            // Enforce virtual name restrictions
            $item->virtual_name($item->{$this->_properties['virtual_name_property']});

            // If the virtual name is empty, generate a default one from the title
            if (empty($item->{$this->_properties['virtual_name_property']})) {
                $item->virtual_name($item->{$item->title_property()});
            }

            // If it's still empty, we have an error
            if (empty($item->{$this->_properties['virtual_name_property']})) {
                throw new \Exception(__('An URL is needed.'));
            }

            // Check uniqueness if needed
            if ($this->_properties['unique']) {
                $where = array(
                    array($this->_properties['virtual_name_property'], $item->{$this->_properties['virtual_name_property']})
                );
                if (is_array($this->_properties['unique']) && !empty($this->_properties['unique']['context_property'])) {
                    $where[] = array($this->_properties['unique']['context_property'], '=', $item->{$this->_properties['unique']['context_property']});
                }
                if (!$item->is_new()) {
                    $pk = \Arr::get($item::primary_key(), 0);
                    $where[] = array($pk, '!=', $item->{$pk});
                }

                $duplicate = $item::find('all', (array('where' => $where)));
                if (!empty($duplicate)) {
                    throw new BehaviourDuplicateException(__('This URL is already used. Since an URL must be unique, you’ll have to choose another one. Sorry about that.'));
                }
            }
        }
    }

    public function virtual_name(\Nos\Orm\Model $item, $virtual_name = null)
    {
        if (empty($virtual_name)) {
            return $item->{$this->_properties['virtual_name_property']};
        }

        // Build an array of regexps array. First default regexps,
        // then call event friendlySlug
        // and then add always_last regexps
        $default = \Config::get('friendly_slug.active_setup', 'default');
        $options = array(
            \Config::get('friendly_slug.setups.'.$default, array())
        );
        $item->event('friendlySlug', array(&$options));
        $options[] = static::$_friendly_slug_always_last;

        $virtual_name = static::_friendlySlug($virtual_name, $options);
        $item->{$this->_properties['virtual_name_property']} = $virtual_name;

        return $item->{$this->_properties['virtual_name_property']};
    }

    protected static function _friendlySlug($slug, array $options)
    {
        foreach ($options as $regexps) {
            foreach ($regexps as $regexp => $replacement) {
                if (is_int($regexp) && $replacement === 'lowercase') {
                    $slug = \Str::lower($slug);
                } elseif (is_int($regexp) && is_string($replacement)) {
                    $slug = static::_friendlySlug($slug, \Config::get('friendly_slug.setups.'.$replacement, array()));
                } elseif (is_array($replacement)) {
                    $flags = str_replace('u', '', \Arr::get($replacement, 'flags', '')).'u';
                    $replacement = \Arr::get($replacement, 'replacement', '');
                    $slug = preg_replace("`".$regexp."`".$flags, $replacement, $slug);
                } else {
                    $slug = preg_replace("`".$regexp."`u", $replacement, $slug);
                }
            }
        }

        return $slug;
    }

    public static function friendly_slug($slug)
    {
        $default = \Config::get('friendly_slug.active_setup', 'default');
        $options = array(
            \Config::get('friendly_slug.setups.'.$default, array()),
            static::$_friendly_slug_always_last,
        );

        return static::_friendlySlug($slug, $options);
    }
}
