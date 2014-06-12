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

use Nos\I18n;
use Nos\Renderer;
use Nos\Controller;

class Renderer_Item_Picker extends Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'model' => '',
        'appdesk' => '',
        'size' => 64,
        'texts' => array(
            'empty' => 'No item selected',
            'add' => 'Pick an item',
            'edit' => 'Pick another item',
            'delete' => 'Un-select this item',
        ),
        'defaultThumbnail' => '',
    );

    public static function _init()
    {
        I18n::current_dictionary(array('nos::common'));

        // Translate default options of the renderer
        static::$DEFAULT_RENDERER_OPTIONS['texts'] = array(
            'empty' => __('No item selected'),
            'add' => __('Pick an item'),
            'edit' => __('Pick another item'),
            'delete' => __('Un-select this item'),
        );
    }

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        parent::build();
        $this->fieldset()->append(static::js_init($this->get_attribute('id')));

        $model = $this->renderer_options['model'];
        if (!empty($this->value)) {
            $item = $model::find($this->value);
            if (!empty($item)) {
                $this->renderer_options['dataset'] = Controller::dataset_item($item);
            }
        }
        $this->renderer_options['actions'] = \Config::actions(array(
            'models' => array($model),
            'target' => 'renderer',
            'class' => get_called_class()
        ));
        $this->set_attribute(
            'data-picker-options',
            htmlspecialchars(\Format::forge()->to_json($this->renderer_options))
        );

        return (string) parent::build();
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['class'] = (isset($renderer['class']) ? $renderer['class'] : '').' item_picker';

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('item_picker_');
        }

        return parent::parseOptions($renderer);
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param   string  HTML ID attribute of the <input> tag
     * @return string JavaScript to execute to initialise the renderer
     */
    protected static function js_init($id)
    {
        return \View::forge('renderer/item_picker', array(
            'id' => $id,
        ), false);
    }
}
