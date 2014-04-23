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

class Renderer_Select_Model extends Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'multiple' => false,
        'model' => '',
        'chooseLabel' => '',
        //'context' => null,
        //'item' => null,
    );

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        $item = \Arr::get($this->renderer_options, 'item', $this->fieldset()->getInstance());

        $model = $this->renderer_options['model'];
        $contextable = $model::behaviours(
            'Nos\Orm_Behaviour_Contextable',
            $model::behaviours('Nos\Orm_Behaviour_Twinnable', array())
        );

        $conditions = array('where' => array());
        if (!empty($contextable)) {
            $context = \Arr::get($this->renderer_options, 'context', !empty($item) ? $item->get_context() : null);
            if (!empty($context)) {
                $this->renderer_options['context'] = $context;
                $conditions['where'][] = array($contextable['context_property'] => $context);
            }
        }

        $pk = $model::primary_key();
        $items = $model::find('all', $conditions);
        $options = array();
        $chooseLabel = \Arr::get($this->renderer_options, 'chooseLabel');
        if ($chooseLabel !== false) {
            $options[''] = $chooseLabel;
        }
        foreach ($items as $item) {
            $options[$item->{$pk[0]}] = $item->title_item();
        }
        $this->set_options($options);

        parent::build();

        if (!empty($contextable) && !empty($context)) {
            $this->fieldset()->append(static::js_init($this->get_attribute('id'), $this->renderer_options));
        }
        return (string) parent::build();
    }

    /**
     * Parse the renderer array to get attributes and the renderer options
     * @param  array $renderer
     * @return array 0: attributes, 1: renderer options
     */
    protected static function parseOptions($renderer = array())
    {
        $renderer['type'] = 'select';

        if (!isset($renderer['renderer_options'])) {
            $renderer['renderer_options'] = array();
        }

        if (empty($renderer['id'])) {
            $renderer['id'] = uniqid('selectmodel_');
        }

        $renderer_options = static::$DEFAULT_RENDERER_OPTIONS;
        if (!empty($renderer['renderer_options'])) {
            $renderer_options = \Arr::merge($renderer_options, $renderer['renderer_options']);
        }
        unset($renderer['renderer_options']);

        return array($renderer, $renderer_options);
    }

    /**
     * Generates the JavaScript to initialise the renderer
     *
     * @param string $id ID attribute of the <input> tag
     * @param array $renderer_options The renderer options
     * @return string JavaScript to execute to initialise the renderer
     */
    public static function js_init($id, array $renderer_options)
    {
        // we have to find why it's called two times...
        return \View::forge('nos::renderer/select/model', array(
            'id' => $id,
            'renderer_options' => $renderer_options,
        ), false);
    }
}
