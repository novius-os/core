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

class Widget_Media_Folder extends \Nos\Widget_Selector
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
        return $this->template(static::widget(array(
            'input_name' => $this->name,
            'selected' => array(
                'id' => $this->value,
            ),
            'treeOptions' => array(
                'lang' => \Arr::get($this->widget_options, 'lang', null),
            ),
            'height' => \Arr::get($this->widget_options, 'height', '150px'),
            'width' => \Arr::get($this->widget_options, 'width', null),
        )));
    }

    /**
     * Construct the radio selector widget
     * When using a fieldset,
     * build() method should be overwritten to call the template() method on widget() response
     * @static
     * @abstract
     * @param array $options
     */
    public static function widget($options = array())
    {
        $options = \Arr::merge(array(
            'urlJson' => 'admin/nos/media/inspector/folder/json',
            'reloadEvent' => 'Nos\\Model_Media_Folder',
            'input_name' => null,
            'selected' => array(
                'id' => null,
                'model' => 'Nos\\Model_Media_Folder',
            ),
            'columns' => array(
                array(
                    'dataKey' => 'title',
                )
            ),
            'treeOptions' => array(
                'lang' => null
            ),
            'height' => '150px',
            'width' => null,
        ), $options);

        return (string) \Request::forge('nos/admin/media/inspector/folder/list')->execute(
            array(
                'inspector/modeltree_radio',
                array(
                    'params' => $options,
                )
            )
        )->response();
    }
}
