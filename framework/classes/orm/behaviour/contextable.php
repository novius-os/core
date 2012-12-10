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
     * @param $dataset
     * @param $item
     */
    public static function dataset(&$dataset, $item)
    {
        $dataset['_context'] = function() use ($item) {
            return $item->get_context();
        };
    }

    /**
     * Fill in the context_common_id and context properties when creating the object
     *
     * @param   Model  The object
     * @return void
     */
    public function before_insert(\Nos\Orm\Model $item)
    {
        $context_property      = $this->_properties['context_property'];

        if (empty($item->{$context_property})) {
            // @todo: decide whether we force a context or we use NULL instead
            $item->set($context_property, \Arr::get($this->_properties, 'default_context', Tools_Context::default_context()));
        }
    }

    /**
     * Returns the locale of the current object
     *
     * @return string
     */
    public function get_context($item)
    {
        return $item->get($this->_properties['context_property']);
    }

    public function form_fieldset_fields($item, &$fieldset)
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
            foreach ($where as $k => $w) {
                if ($w[0] == 'context') {
                    if (! is_array($w[1])) {
                        $where[$k] = array($this->_properties['context_property'], '=', $w[1]);
                    } elseif (count($w[1])) {
                        $where[$k] = array($this->_properties['context_property'], 'IN', $w[1]);
                    }
                }
            }
            $options['where'] = $where;
        }
    }
}
