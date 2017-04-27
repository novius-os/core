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

class Renderer_Publishable extends Renderer
{
    protected static $DEFAULT_RENDERER_OPTIONS = array(
        'item' => null,
        'view' => 'nos::renderer/publishable',
        'populate' => null, // Callback allowing the selected value to be changed
        'radio_options' => array(
            'no' => array(
                'value'      => '0',
                'content'    => '<img src="static/novius-os/admin/novius-os/img/icons/status-red.png" />',
                'attributes' => array(
                    'class' => 'notransform',
                ),
            ),
            'planned' => array(
                'value'      => '2',
                'content'    => '<span class="ui-icon ui-icon-clock" />',
                'attributes' => array(
                    'class' => 'notransform',
                ),
            ),
            'yes' => array(
                'value'      => '1',
                'content'    => '<img src="static/novius-os/admin/novius-os/img/icons/status-green.png" />',
                'attributes' => array(
                    'class' => 'notransform',
                ),
            ),
        ),
    );

    /**
     * Build the field
     *
     * @return  string
     */
    public function build()
    {
        $options = &$this->renderer_options;

        if (empty($options['item'])) {
            $options['item'] = $this->fieldset()->getInstance();
        }

        if (empty($options['publishable']) && !empty($options['item'])) {
            $options['publishable'] = $options['item']->behaviours('Nos\Orm_Behaviour_Publishable');
        }

        if (!\Arr::get($options, 'allow_publish', false)) {
            if (\Arr::get($options, 'publishable.options.allow_publish', false)) {
                $options['allow_publish'] = \Config::processCallbackValue(\Arr::get($options, 'publishable.options.allow_publish'), true, $options['item']['item']);
            } else {
                // No configuration = it's allowed
                $options['allow_publish'] = true;
            }
        }
            
        if (isset($options['populate']) && is_callable($options['populate'])) {
            // The selected status may be forced to another via a standard 'populate' callback
            $options['planification_status'] = call_user_func($options['populate'], $options['item']);
        } else {
            $options['planification_status'] = $options['item']->planificationStatus();
        }

        $options['planification_mode'] = !empty($options['publishable']['publication_start_property']) && !empty($options['publishable']['publication_end_property']);
        $options['state_property'] = \Arr::get($options, 'publishable.publication_state_property', \Arr::get($options, 'publishable.publication_bool_property', ''));

        $options['radio_options'] = \Arr::merge(array(
            'no' => array(
                'value'      => '0',
                'content'    => '<img src="static/novius-os/admin/novius-os/img/icons/status-red.png" />',
                'visible'    => !empty($options['state_property']),
                'attributes' => array(
                    'class'    => 'notransform',
                    'id'       => uniqid('no_'),
                    'disabled' => (!$options['allow_publish'] && $options['planification_status'] != 0) ? 'disabled' : false,
                ),
            ),
            'planned' => array(
                'value'      => '2',
                'content'    => '<span class="ui-icon ui-icon-clock" />',
                'visible'    => $options['planification_mode'],
                'attributes' => array(
                    'class'    => 'notransform',
                    'id'       => uniqid('planned_'),
                    'disabled' => !$options['allow_publish'] ? 'disabled' : false,
                ),
            ),
            'yes' => array(
                'value'      => '1',
                'content'    => '<img src="static/novius-os/admin/novius-os/img/icons/status-green.png" />',
                'visible'    => !empty($options['state_property']),
                'attributes' => array(
                    'class'    => 'notransform',
                    'id'       => uniqid('yes_'),
                    'disabled' => !$options['allow_publish'] ? 'disabled' : false,
                ),
            ),
        ), \Arr::get($options, 'radio_options', array()));
        
        return $this->template((string) \View::forge($options['view'], $options, false));
    }
}
