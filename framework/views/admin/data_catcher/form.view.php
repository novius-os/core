<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');

$uniqid = uniqid('container_');

(!isset($nugget_db) || !is_array($nugget_db)) && $nugget_db = $item->get_default_nuggets();

$fields = array(
    'model_id' => array(
        'form' => array(
            'type' => 'hidden',
            'value' => $item->id,
        ),
    ),
    'model_name' => array(
        'form' => array(
            'type' => 'hidden',
            'value' => get_class($item),
        ),
    ),
    'catcher_name' => array(
        'form' => array(
            'type' => 'hidden',
            'value' => \Nos\Model_Content_Nuggets::DEFAULT_CATCHER,
        ),
    ),
);

$fields[\Nos\DataCatcher::TYPE_TITLE] = array(
    'label' => __('Title:'),
);

if (array_key_exists(\Nos\DataCatcher::TYPE_URL, $nugget)) {
    $fields[\Nos\DataCatcher::TYPE_URL] = array(
        'label' => __('URL:'),
        'form' => array(
            'type' => 'select',
            'options' => $item->get_sharable_property(\Nos\DataCatcher::TYPE_URL.'.options'),
        ),
    );
}

$image_id = \Arr::get($nugget, \Nos\DataCatcher::TYPE_IMAGE, 0);
$options = array_keys($item->get_sharable_property(\Nos\DataCatcher::TYPE_IMAGE.'.options', array()));

$fields[\Nos\DataCatcher::TYPE_IMAGE] = array(
    'label' => __('Image:'),
    'form' => array(
        'type' => 'radio',
        'value' => in_array($image_id, $options) ? $image_id : 0,
    ),
);

$fields[\Nos\DataCatcher::TYPE_TEXT] = array(
    'label' => __('Description:'),
    'form' => array(
        'type' => 'textarea',
        'rows' => 5,
     ),
);

$values = $nugget;
unset($values[\Nos\DataCatcher::TYPE_IMAGE]);

$fieldset = \Fieldset::build_from_config($fields);
$fieldset->populate($values);

?>
<div id="<?= $uniqid ?>">
<?php
echo $fieldset->open($action);

$fieldset->form()->set_config('field_template',
    "\t\t".'<tr>
        <th>{label}</th>
        <td>{field}</td>
        <td class="use_default">{default}</td>
    </tr>'."\n");
echo $fieldset->build_hidden_fields();
echo \View::forge(
    'form/fields',
    array(
        'fieldset' => $fieldset,
        'fields' => array(
            \Nos\DataCatcher::TYPE_TITLE,
            \Nos\DataCatcher::TYPE_URL,
            \Nos\DataCatcher::TYPE_IMAGE,
            \Nos\DataCatcher::TYPE_TEXT,
        ),
        'callback' =>
            function($field) use ($item, $nugget_db, $nugget) {
                $template = $field->template;
                if (empty($template)) {
                    $template = $field->fieldset->form()->get_config('field_template');
                }
                $field_name = $field->name;
                $id = uniqid('for_');
                $sharable_property = $item->get_sharable_property($field_name);
                // Don't show 'Use default' if the property has no default (= $sharable_property is empty)
                if (in_array($field_name, array(\Nos\DataCatcher::TYPE_TITLE, \Nos\DataCatcher::TYPE_TEXT)) && array_key_exists($field_name, $nugget) && !empty($sharable_property)) {
                    $label = \Arr::get($sharable_property, 'useTitle', __('Use default'));
                    $checked = '';
                    if (!isset($nugget_db[$field_name])) {
                        $checked = 'checked';
                        $field->set_attribute('disabled', true);
                    }
                    $template = str_replace('{default}', '<input type="checkbox" name="default['.$field_name.']" id="'.$id.'" class="nos-datacatchers-nugget-checkbox" '.$checked.' /> <label for="'.$id.'">'.$label.'</label>', $template);
                } else {
                    $template = str_replace('{default}', '', $template);
                }

                // Image field displays a bit differently: radio button with several options
                if ($field->name == \Nos\DataCatcher::TYPE_IMAGE) {
                    $field->set_template('{field}');
                    $options = $item->get_sharable_property($field_name.'.options', array());
                    foreach ($options as $media_id => $idk) {
                        $media = \Nos\Media\Model_Media::find($media_id);
                        $field->set_options(
                            array(
                                $media_id => $media->getImgTagResized(80, 80),
                            )
                        );
                    }
                    $value = isset($nugget_db[$field_name]) ? $nugget_db[$field_name] : 0;
                    $field->set_options(
                        array(
                            0 => '<div style="float:left;">'.\Nos\Media\Renderer_Media::renderer(
                                array(
                                    'name' => 'custom_image',
                                    'value' => isset($options[$value]) ? 0 : $value,
                                    'renderer_options' => array(
                                        'inputFileThumb' => array(
                                            'title' => __('Pick a custom image'),
                                        ),
                                    ),
                                )
                            ).'</div>',
                        )
                    );
                    $template = strtr(
                        $template,
                        array(
                            '{label}' => '{group_label}',
                            '{field}' => '{fields} <div class="nos-datacatchers-nugget-image"> {label} <br /> {field} </div> {fields}',
                        )
                    );
                }
                $field->set_template($template);
                echo $field->build();
            },
    ),
    false
);
?>
    <div class="nos-datacatchers-buttons">
        <button type="submit" data-icon="check">
            <?= __('Save') ?>
        </button>
    </div>
    <?= $fieldset->close() ?>
</div>
