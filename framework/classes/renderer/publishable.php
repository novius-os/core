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
        if (empty($this->renderer_options['item'])) {
            $this->renderer_options['item'] = $this->fieldset()->getInstance();
        }
        return $this->template((string) \View::forge($this->renderer_options['view'], $this->renderer_options, false));
    }
}
