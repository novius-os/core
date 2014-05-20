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
        'empty_option' => true,
        'choose_label' => '',
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
        $options = static::getOptions($this->renderer_options, $item);
        $this->set_options(\Arr::pluck($options, 'text', 'value'));

        parent::build();

        if (!empty($this->renderer_options['context'])) {
            $this->fieldset()->append(static::js_init($this->get_attribute('id'), $this->renderer_options));
        }
        return (string) parent::build();
    }

    /**
     * @param  array $renderer_options
     * @param  \Nos\Orm\Model $item
     * @return array
     */
    public static function getOptions(&$renderer_options, $item = null)
    {
        $model = $renderer_options['model'];
        $twinnable = $model::behaviours('Nos\Orm_Behaviour_Twinnable', array());
        $contextable = $model::behaviours('Nos\Orm_Behaviour_Contextable', $twinnable);

        $shared_context = false;
        if (!empty($contextable)) {
            $context = \Arr::get($renderer_options, 'context', !empty($item) ? $item->get_context() : null);
            if (!empty($context)) {
                $shared_context = \Arr::get($renderer_options, 'shared_context', false);
                if (!empty($twinnable) && $shared_context) {
                    $items = $model::findMainOrContext($context);
                } else {
                    $renderer_options['context'] = $context;
                    $items = $model::find('all', array('where' => array(
                        array($contextable['context_property'] => $context),
                    )));
                }
            }
        }
        if (empty($context)) {
            \Arr::delete($renderer_options, 'context');
        }

        $pk = $model::primary_key();
        if (!isset($items)) {
            $items = $model::find('all');
        }
        $options = array();
        if (\Arr::get($renderer_options, 'empty_option', true)) {
            $options[] = array(
                'text' => \Arr::get($renderer_options, 'choose_label'),
                'value' => '',
            );
        }
        foreach ($items as $item) {
            $options[] = array(
                'text' => $item->title_item(),
                'value' => $shared_context ? $item->{$twinnable['common_id_property']} : $item->{$pk[0]},
            );
        }
        return $options;
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
