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

    $fieldset = \Fieldset::forge();
    //$fieldset->add('model_id', '', array('value' => $model_id, 'type' => 'hidden'));
    //$fieldset->add('model_name', '', array('value' => $model_name, 'type' => 'hidden'));
    $fields = array();
    if (isset($nugget[\Nos\DataCatcher::TYPE_TITLE])) {
        $fields[] = \Nos\DataCatcher::TYPE_TITLE;
        $fieldset->add(\Nos\DataCatcher::TYPE_TITLE, __('Name:'), array('value' => $nugget[\Nos\DataCatcher::TYPE_TITLE]));
    }
    if (isset($nugget[\Nos\DataCatcher::TYPE_URL])) {
        $fields[] = \Nos\DataCatcher::TYPE_URL;
        $options = $item->get_sharable_property(\Nos\DataCatcher::TYPE_URL.'.possibles');
        $fieldset->add(\Nos\DataCatcher::TYPE_URL, __('Url:'), array(
            'type' => 'select',
            'value' => $nugget[\Nos\DataCatcher::TYPE_URL]
        ));
    }
    if (array_key_exists(\Nos\DataCatcher::TYPE_IMAGE, $nugget)) {
        $fields[] = \Nos\DataCatcher::TYPE_IMAGE;
        $possible = array_keys($item->possible_medias(\Nos\DataCatcher::TYPE_IMAGE.'.possible'));
        $value = $nugget[\Nos\DataCatcher::TYPE_IMAGE];
        $fieldset->add(\Nos\DataCatcher::TYPE_IMAGE, __('Image:'), array(
            'type' => 'radio',
            'value' => isset($possible[$value]) ? $value : 0,
        ));
    }
?>
<div id="<?= $id ?>">
<?php
    $fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
    echo $fieldset->build_hidden_fields();
    echo \View::forge('form/fields', array(
        'fieldset' => $fieldset,
        'fields' => $fields,
        'callback' => function($field) use ($item)
        {
            $template = $field->template;
            if (empty($template))
            {
                $template = $field->fieldset->form()->get_config('field_template');
            }
            // Actually, field_name is an number
            $field_name = $field->name;
            $id = uniqid('for_');
            $useTitle = $item->get_sharable_property($field_name.'.useTitle');
            $label = strtr(__('Use default {what}'), array(
                '{what}' => empty($useTitle) ? '' : '('.$useTitle.')',
            ));
            $nugget_silo = $item->get_catcher_nuggets(\Nos\Model_Content_Nuggets::DEFAULT_CATCHER);
            $checked = isset($nugget_silo[$field_name]) ? '' : 'checked';
            $template = str_replace('{field}', '<input type="checkbox" name="default['.$field_name.']" id="'.$id.'" class="nos-datacatchers-nugget-checkbox" '.$checked.' /> <label for="'.$id.'">'.$label.'</label><div class="nos-datacatchers-nugget-value" style="display:none;">{field}</div>', $template);

            // Image field displays a bit differently: radio button with several options
            if ($field->name == \Nos\DataCatcher::TYPE_IMAGE)
            {
                $field->set_template('{field}');
                $possibles = $item->get_sharable_property($field_name.'.possibles');
                foreach ($possibles as $media_id => $idk) {
                    $media = \Nos\Model_Media::find($media_id);
                    $field->set_options(array(
                        $media_id => $media->get_img_tag(array('max_width' => 80, 'max_height' => 80)),
                    ));
                }
                $value = isset($nugget_silo[$field_name]) ? $nugget_silo[$field_name] : 0;
                $field->set_options(array(
                    0 => '<div style="float:left;">'.\Nos\Widget_Media::widget(array(
                        'name' => 'custom_image',
                        'value' => isset($possibles[$value]) ? 0 : $value,
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
        <button type="submit" data-icon="check" class="primary">
            <?= __('Save') ?>
        </button>
        &nbsp; <?= __('or') ?> &nbsp;
        <a href="#" onclick="return false;">
            <?= __('Cancel') ?>
        </a>
    </div>
<?= $fieldset->close() ?>
</div>
<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $container = $("#<?= $id ?>");

            $container.find('.nos-datacatchers-nugget-checkbox').each(function() {
                $(this).change(function() {
                    if ($(this).is(':checked')) {
                        $(this).closest('td').find('.nos-datacatchers-nugget-value').hide();
                    } else {
                        $(this).closest('td').find('.nos-datacatchers-nugget-value').show().nosOnShow();
                    }
                }).triggerHandler('change');
            });

            $container.find('.nos-datacatchers-nugget-image').hover(function() {
                $(this).addClass('ui-state-hover');
            }, function() {
                $(this).removeClass('ui-state-hover');
            }).click(function() {
                $(this).find('input').prop('checked', true).wijradio('refresh');
                $(this).addClass('ui-state-active').siblings().removeClass('ui-state-active');
            });
        });
    });
</script>