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

class Orm_Behaviour_Url extends Orm_Behaviour
{
	/**
	 * publication_bool_property
	 * publication_start_property
	 * publication_end_property
	 */
	protected $_properties = array();

    public function urls($object, $first = false) {
        $urls = array();
        foreach ($this->_properties['urls'] as $function)
        {
            if (is_callable($function))
            {
                $urls[] = call_user_func($function, $object, $first);
                if ($first && count($urls))
                {
                    return $urls[0];
                }
            }
        }
        return $first ? null : $urls;
    }

    public function url_canonical($object) {
        if ($object::behaviours('Nos\Orm_Behaviour_Sharable')) {
            $default_nuggets = $object->get_catcher_nuggets(Model_Content_Nuggets::DEFAULT_CATCHER);
            $nuggets = $default_nuggets->content_data;
            if (!empty($nuggets[\Nos\DataCatcher::TYPE_URL])) {
                return $nuggets[\Nos\DataCatcher::TYPE_URL];
            }
        }

        return static::urls($object, true);
    }
}