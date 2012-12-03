<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media;

class Renderer_Folder extends \Nos\Renderer_Selector
{
    public function before_construct(&$attributes, &$rules)
    {
        $attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' media';

        if (empty($attributes['id'])) {
            $attributes['id'] = uniqid('media_');
        }
    }

    public function build()
    {
        return $this->template(static::renderer(array(
            'input_name' => $this->name,
            'selected' => array(
                'id' => $this->value,
            ),
            'treeOptions' => array(
                'context' => \Arr::get($this->renderer_options, 'context', null),
            ),
            'height' => \Arr::get($this->renderer_options, 'height', '150px'),
            'width' => \Arr::get($this->renderer_options, 'width', null),
        )));
    }

    /**
     * Construct the radio selector renderer
     * When using a fieldset,
     * build() method should be overwritten to call the template() method on renderer() response
     * @static
     * @abstract
     * @param array $options
     */
    public static function renderer($options = array())
    {
        $options = \Arr::merge(array(
            'urlJson' => 'admin/noviusos_media/inspector/folder/json',
            'reloadEvent' => 'Nos\\Media\\Model_Folder',
            'input_name' => null,
            'selected' => array(
                'id' => null,
                'model' => 'Nos\\Media\\Model_Folder',
            ),
            'columns' => array(
                array(
                    'dataKey' => 'title',
                )
            ),
            'treeOptions' => array(
                'context' => null
            ),
            'height' => '150px',
            'width' => null,
        ), $options);

        return (string) \Request::forge('admin/noviusos_media/inspector/folder/list')->execute(
            array(
                'inspector/modeltree_radio',
                array(
                    'params' => $options,
                )
            )
        )->response();
    }
}
