<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Page;

class Renderer_Selector extends \Nos\Renderer_Selector
{
    public function before_construct(&$attributes, &$rules)
    {
        $attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' nos-page';

        if (empty($attributes['id'])) {
            $attributes['id'] = uniqid('page_');
        }
    }

    public function build()
    {
        $multiple = \Arr::get($this->renderer_options, 'multiple', false);
        if ($multiple) {

            $ids = (array) $this->value;
            $selected = array();
            foreach ($ids as $id) {
                $selected['Nos\\Page\\Model_Page|'.$id] = array(
                    'id' => $id,
                    'model' => 'Nos\\Page\\Model_Page',
                );
            }
        } else {
            // Converts null to 0
            $id = (string) (int) $this->value;
            $selected = array('id'=> $id);
        }
        return $this->template(static::renderer(array(
            'input_name' => $this->name,
            'selected' => $selected,
            'multiple' => $multiple,
            'treeOptions' => array(
                'context' => \Arr::get($this->renderer_options, 'context', null),
            ),
            'height' => \Arr::get($this->renderer_options, 'height', '150px'),
            'width' => \Arr::get($this->renderer_options, 'width', null),
        )));
    }

    /**
     * Returns a page selector renderer
     * @static
     * @param array $options
     */
    public static function renderer($options = array())
    {
        $view = 'inspector/modeltree_radio';
        $defaultSelected = array(
            'id' => null,
            'model' => 'Nos\\Page\\Model_Page',
        );
        if (isset($options['multiple']) && $options['multiple']) {
            $view = 'inspector/modeltree_checkbox';
            $defaultSelected = array();
        }
        $options = \Arr::merge(array(
            'urlJson' => 'admin/noviusos_page/inspector/page/json',
            'reloadEvent' => 'Nos\\Page\\Model_Page',
            'input_name' => null,
            'selected' => $defaultSelected,
            'columns' => array(
                array(
                    'dataKey' => 'title',
                ),
            ),
            'treeOptions' => array(
                'context' => null
            ),
            'height' => '150px',
            'width' => null,
            'contextChange' => true,
        ), $options);

        return (string) \Request::forge('admin/noviusos_page/inspector/page/list')->execute(
            array(
                $view,
                array(
                    'params' => $options,
                )
            )
        )->response();
    }
}
