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

class Renderer_Radioset extends Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'item' => null,
        'view' => 'nos::renderer/radioset',
    );

    public function __construct($name, $label = '', array $renderer = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        $this->renderer_options['name'] = $name;
        parent::__construct($name, $label, $renderer, $rules, $fieldset);
    }

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        if (empty($this->renderer_options['item'])) {
            $this->renderer_options['item'] = $this->fieldset()->getInstance();
            $this->renderer_options['value'] = $this->renderer_options['item']->{$this->renderer_options['name']};
        }
        return $this->template((string) \View::forge($this->renderer_options['view'], $this->renderer_options, false));
    }
}

