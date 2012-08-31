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

class Widget_Tag extends \Fieldset_Field
{
    protected $options = array();

    public function __construct($name, $label = '', array $attributes = array(), array $rules = array(), \Fuel\Core\Fieldset $fieldset = null)
    {
        $attributes['type']  = 'text';
        $attributes['class'] = (isset($attributes['class']) ? $attributes['class'] : '').' tinymce not_initialized';

        if (empty($attributes['id'])) {
            $attributes['id'] = uniqid('tag_');
        }

        if (!empty($attributes['widget_options'])) {
            $this->options = \Arr::merge($this->options, $attributes['widget_options']);
        }
        unset($attributes['widget_options']);

        parent::__construct($name, $label, $attributes, $rules, $fieldset);
    }

    public function set_value($value, $repopulate = false)
    {
        if (is_array($value)) {
            $labels = static::get_labels_from_tags($value, $this->options['label_column']);
            $value = implode(',', $labels);
        }

        $this->value = $value;
        $this->set_attribute('value', $value);

        return $this;
    }

    public function before_save($item, $data)
    {
        $tags_from = str_replace(' ', ',', $this->value);
        $tags_from = explode(',', $tags_from);
        $tags = array();
        foreach ($tags_from as $tag) {
            if (!empty($tag)) {
                $tags[$tag] = $tag;
            }
        }
        $item->{$this->options['relation_name']} = array();
        if (!count($tags)) {
            return;
        }

        $tag_class = $this->options['model'];

        $item->{$this->options['relation_name']} = $tag_class::find('all', array('where' => array(array($this->options['label_column'], 'IN', array_keys($tags)))));

        foreach ($item->{$this->options['relation_name']} as $obj) {
            unset($tags[$obj->{$this->options['label_column']}]);
        }
        foreach ($tags as $tag) {
            $tag_obj = new $tag_class(array($this->options['label_column'] => $tag));
            $item->{$this->options['relation_name']}[] = $tag_obj;
        }

        return false;
    }

    /**
     * How to display the field
     * @return string
     */
    public function build()
    {
        parent::build();
        $this->fieldset()->append($this->js_init());

        return (string) parent::build();
    }

    public function js_init()
    {
        // we have to find why it's called two times...
        // @todo: This widget is supposing that they are not a lot of tags (< 500) : this is generally the case, but if there is more, think of an Ajax mode       $tags = $this->options['model']::find('all');
        $model = $this->options['model'];
        $tags = $model::find('all');
        $labels = static::get_labels_from_tags($tags, $this->options['label_column']);

        return \View::forge('widget/tag', array(
            'id' => $this->get_attribute('id'),
            'labels' => $labels
        ), false);
    }

    public static function get_labels_from_tags($tags, $label_column)
    {
        $labels = array();
        foreach ($tags as $tag) {
            $labels[] = $tag->{$label_column};
        }

        return $labels;
    }

}
