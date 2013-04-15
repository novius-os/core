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

class Orm_Behaviour_Contextable extends Orm_Behaviour
{
    /**
     * context_property
     * default_context
     */
    protected $_properties = array();

    /**
     *  Populates the dataset with a _context key containing the context of the current item
     * @param \Nos\Orm\Model $item
     * @param $dataset
     */
    public function dataset(Orm\Model $item, &$dataset)
    {
        $dataset['_context'] = array($item, 'get_context');
    }

    /**
     * Fill in the context_common_id and context properties when creating the object
     *
     * @param  \Nos\Orm\Model $item The object
     */
    public function before_insert(Orm\Model $item)
    {
        $context_property      = $this->_properties['context_property'];

        if (empty($item->{$context_property})) {
            $item->set($context_property, \Arr::get($this->_properties, 'default_context', Tools_Context::defaultContext()));
        }
    }

    /**
     * Returns the locale of the current object
     *
     * @param \Nos\Orm\Model $item
     * @return string
     */
    public function get_context(Orm\Model $item)
    {
        return $item->get($this->_properties['context_property']);
    }

    public function form_fieldset_fields(Orm\Model $item, &$fieldset)
    {
        $context_property = $this->_properties['context_property'];
        // Empty array just so the data are retrieved from the input
        if (isset($fieldset[$context_property])) {
            $fieldset[$context_property]['dont_populate'] = true;
        }
    }

    public function before_query(&$options)
    {
        if (array_key_exists('where', $options)) {
            $where = $options['where'];
            if (isset($where['context'])) {
                $where[$this->_properties['context_property']] = $where['context'];
                unset($where['context']);
            }

            foreach ($where as $k => $w) {
                if (is_int($k)) {
                    $keys = array_keys($w);
                    if (count($w) == 1 && $keys[0] == 'context') {
                        $where[$k] = array($this->_properties['context_property'] => $w[$keys[0]]);
                    }

                    if (count($w) > 1 && $w[0] == 'context') {
                        $w[0] = $this->_properties['context_property'];
                        if (count($w) == 2 && is_array($w[1])) {
                            $w[2] = $w[1];
                            $w[1] = 'IN';
                        }
                        $where[$k] = $w;
                    }
                }
            }
            $options['where'] = $where;
        }
    }
}
