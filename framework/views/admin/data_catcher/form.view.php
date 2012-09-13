<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
    $id = uniqid('temp_');

    (!isset($nugget_db) || !is_array($nugget_db)) && $nugget_db = $item->get_default_nuggets();
    $fieldset = \Fieldset::forge(uniqid());
    $fieldset->add('model_id', '', array('value' => $item->id, 'type' => 'hidden'));
    $fieldset->add('model_name', '', array('value' => get_class($item), 'type' => 'hidden'));
    $fieldset->add('catcher_name', '', array('value' => \Nos\Model_Content_Nuggets::DEFAULT_CATCHER, 'type' => 'hidden'));
    $fields = array();

    $fields[] = \Nos\DataCatcher::TYPE_TITLE;
    $fieldset->add(\Nos\DataCatcher::TYPE_TITLE, __('Title:'), array('value' => \Arr::get($nugget, \Nos\DataCatcher::TYPE_TITLE, '')));

    if (array_key_exists(\Nos\DataCatcher::TYPE_URL, $nugget))
    {
        $fields[] = \Nos\DataCatcher::TYPE_URL;
        $fieldset->add(\Nos\DataCatcher::TYPE_URL, __('URL:'), array(
            'type' => 'select',
            'options' => $item->get_sharable_property(\Nos\DataCatcher::TYPE_URL.'.options'),
            'value' => \Arr::get($nugget, \Nos\DataCatcher::TYPE_URL, ''),
        ));
    }

    $fields[] = \Nos\DataCatcher::TYPE_IMAGE;
    $options = array_keys($item->possible_medias(\Nos\DataCatcher::TYPE_IMAGE.'.options'));
    $value = \Arr::get($nugget, \Nos\DataCatcher::TYPE_IMAGE, 0);
    $fieldset->add(\Nos\DataCatcher::TYPE_IMAGE, __('Image:'), array(
        'type' => 'radio',
        'value' => in_array($value, $options) ? $value : 0,
    ));

    $fields[] = \Nos\DataCatcher::TYPE_TEXT;
    $fieldset->add(\Nos\DataCatcher::TYPE_TEXT, __('Description:'), array('value' => \Arr::get($nugget, \Nos\DataCatcher::TYPE_TEXT, ''), 'type' => 'textarea'));
?>
<div id="<?= $id ?>">
<?php
    echo $fieldset->open($action);
    $fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td><td class=\"use_default\">{default}</td></tr>\n");
    echo $fieldset->build_hidden_fields();
    echo \View::forge('form/fields', array(
        'fieldset' => $fieldset,
        'fields' => $fields,
        'callback' => function($field) use ($item, $nugget_db, $nugget) {
            $template = $field->template;
            if (empty($template))
            {
                $template = $field->fieldset->form()->get_config('field_template');
            }
            $field_name = $field->name;
            $id = uniqid('for_');
            $sharable_property = $item->get_sharable_property($field_name);
            // Don't show 'Use default' if the property has no default (= $sharable_property is empty)
            if (in_array($field_name, array(\Nos\DataCatcher::TYPE_TITLE, \Nos\DataCatcher::TYPE_TEXT)) && array_key_exists($field_name, $nugget) && !empty($sharable_property))
            {
                $label = \Arr::get($sharable_property, 'useTitle', __('Use default'));
                $checked = '';
                if (!isset($nugget_db[$field_name]))
                {
                    $checked = 'checked';
                    $field->set_attribute('disabled', true);
                }
                $template = str_replace('{default}', '<input type="checkbox" name="default['.$field_name.']" id="'.$id.'" class="nos-datacatchers-nugget-checkbox" '.$checked.' /> <label for="'.$id.'">'.$label.'</label>', $template);
            }
            else
            {
                $template = str_replace('{default}', '', $template);
            }

            // Image field displays a bit differently: radio button with several options
            if ($field->name == \Nos\DataCatcher::TYPE_IMAGE)
            {
                $field->set_template('{field}');
                $options = $item->get_sharable_property($field_name.'.options', array());
                foreach ($options as $media_id => $idk)
                {
                    $media = \Nos\Model_Media::find($media_id);
                    $field->set_options(array(
                        $media_id => $media->get_img_tag(array('max_width' => 80, 'max_height' => 80)),
                    ));
                }
                $value = isset($nugget_db[$field_name]) ? $nugget_db[$field_name] : 0;
                $field->set_options(array(
                    0 => '<div style="float:left;">'.\Nos\Widget_Media::widget(array(
                        'name' => 'custom_image',
                        'value' => isset($options[$value]) ? 0 : $value,
                        'widget_options' => array(
                            'inputFileThumb' => array(
                                'title' => __('Pick a custom image'),
                            ),
                        ),
                    )).'</div>',
                ));
                $template = strtr($template, array(
                    '{label}' => '{group_label}',
                    '{field}' => '{fields} <div class="nos-datacatchers-nugget-image"> {label} <br /> {field} </div> {fields}',
                ));
            }
            $field->set_template($template);
            echo $field->build();
        },
    ), false);
    ?>
    <div class="nos-datacatchers-buttons">
        <button type="submit" data-icon="check">
            <?= __('Save') ?>
        </button>
    </div>
    <?= $fieldset->close() ?>
</div>
