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

class Renderer_Date_Picker extends Renderer_Datetime_Picker
{
    /**
     * @deprecated Use Renderer_Datetime_Picker instead
     */
    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        parent::__construct($name, $label, $renderer, $rules, $fieldset);
    }

    protected static function parseOptions($renderer = array())
    {
        $renderer['renderer_options']['format'] = 'date';
        return parent::parseOptions($renderer);
    }
}
