<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');

?>
<script type="text/javascript">
require(
    ['jquery-nos-layout-standard'],
    function($) {
        $(function() {
            var $content = $("#<?= $uniqid = uniqid('id_') ?>").nosLayoutStandard({
                    tabParams:  <?= isset($crud['tab_params']) ? \Format::forge()->to_json($crud['tab_params']) : 'null' ?>
                });
        });
    });
</script>

<?php

$has_restricted_fields = false;
foreach ($fieldset->field() as $field) {
    if ($field->isRestricted()) {
        // Only use one <div> to wrap all restricted fields (instead of one per field)
        if (!$has_restricted_fields) {
            echo '<div style="display:none;">';
            $has_restricted_fields = true;
        }
        echo $field->set_template('{field}')->build();
        // We don't use the {description} placeholder, so build() should return an empty string
        $field->set_template('{description}');
    }
}
if ($has_restricted_fields) {
    echo '</div>';
}

echo $fieldset->build_hidden_fields();

$fieldset->form()->set_config('field_template', "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
$large = !empty($large) && $large == true;
?>

<div id="<?= $uniqid ?>" class="nos-fixed-content fill-parent" style="display:none;">
    <div>
        <?= $large ? '' : '<div class="col c1"></div>'; ?>
        <div class="col <?= $large ? 'c12' : 'c10' ?>">
            <div class="line ui-widget" style="margin:2em 0 1em;">
                <table class="title-fields" style="margin-bottom:1em;">
                    <tr>
<?php
if (!empty($medias)) {
    $medias = (array) $medias;
    echo '<td style="width:'.(75 * count($medias)).'px;">';
    foreach ($medias as $name) {
        echo $fieldset->field($name)->set_template('{field}')->build();
    }
    echo '</td>';
}

$contexts = array_keys(\Nos\Tools_Context::contexts());
if (!empty($item) && count($contexts) > 1) {
    $contextable = $item->behaviours('Nos\Orm_Behaviour_Twinnable') !== null || $item->behaviours('Nos\Orm_Behaviour_Contextable') !== null;
    if ($contextable) {
        $allowed_contexts = \Nos\User\Permission::contexts();
        if ($item->is_new() && count($allowed_contexts) > 1) {
            $flag = \Nos\Tools_Context::flagUrl($item->get_context());
            $site = \Nos\Tools_Context::site($item->get_context());
            ?>
            <td style="width:16px;text-align:center;">
                <button class="change-context" type="button"><?= \Nos\Tools_Context::contextLabel($item->get_context(), array('template' => '{site}<br />{locale}', 'short' => true)) ?></button>
                <ul style="display: none;">
            <?php
            foreach ($allowed_contexts as $context => $domains) {
                echo '<li data-context="'.e(\Format::forge(array('code' => $context, 'label' => \Nos\Tools_Context::contextLabel($context, array('template' => '{site}<br />{locale}', 'short' => true))))->to_json()).'"><a>'.strtr(__('Add to {{context}}'), array('{{context}}' => \Nos\Tools_Context::contextLabel($context))).'</a></li>';
            }
            ?>
                </ul>
            </td>
            <?php
        } else {
            echo '<td style="width:16px;text-align:center;">'.\Nos\Tools_Context::contextLabel($item->get_context(), array('template' => '{site}<br />{locale}', 'short' => true)).'</td>';
        }
    }
}
?>
                        <td style="<?= !empty($medias) ? 'line-height:60px;' : '' ?>"><div class="table-field">
<?php
if (!empty($title)) {
    $title = (array) $title;
    $size  = min(6, floor(6 / count($title)));
    $first = true;
    foreach ($title as $name) {
        if ($first) {
            $first = false;
        } else {
            echo '</div></td><td><div class="table-field">';
        }
        $field = $fieldset->field($name);
        $placeholder = is_array($field->label) ? $field->label['label'] : $field->label;
        echo ' '.$field
                ->set_attribute('placeholder', $placeholder)
                ->set_attribute('title', $placeholder)
                ->set_attribute('class', $field->get_attribute('class').' ui-priority-primary')
                ->set_template($field->type == 'file' ? '<span class="ui-priority-primary">{label} {field}</span>': '{field}')
                ->build();
    }
}
?>
                        </div></td>
                    </tr>
                </table>
<?php

if (!empty($subtitle)) {
    ?>
                    <div class="line crud_subtitle">
                        <table style="width:100%;">
                            <tr>
    <?php
    if (!empty($subtitle)) {
        $fieldset->form()->set_config('field_template', '{label}{required} {field} {error_msg}');
        foreach ((array) $subtitle as $name) {
            $field = $fieldset->field($name);
            if ($field->type == 'hidden' || $field->isRestricted()) {
                continue;
            }
            $field_template = $field->template;
            if (!empty($field_template)) {
                $field_template = str_replace(array('<tr>', '</tr>', '<td>', '</td>'), '', $field_template);
                $field->set_template($field_template);
            }
            $placeholder = is_array($field->label) ? $field->label['label'] : $field->label;
            echo "\t\t<td>",
                $field
                     ->set_attribute('placeholder', $placeholder)
                     ->set_attribute('title', $placeholder)
                     ->build(),
                "</td>\n";
        }
        $fieldset->form()->set_config('field_template', "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
    }
    ?>
                            </tr>
                        </table>
                    </div>
    <?php
}
?>
            </div>
        </div>
        <?= $large ? '' : '<div class="col c1"></div>' ?>
    </div>

    <div style="clear:both;">
        <div class="line ui-widget" style="margin: 0 0 2em;">
<?php
            $menus = empty($menu) ? array() : (array) $menu;
            $contents = empty($content) ? array() : (array) $content;
?>
            <?= $large ? '' : '<div class="col c1"></div>' ?>
            <div class="col c<?= ($large ? 8 : 7) + (empty($menu) ? ($large ? 4 : 3) : 0) ?>" id="line_second" style="position:relative;">
<?php
foreach ($contents as $content) {
    if (is_array($content) && !empty($content['view'])) {
        echo View::forge($content['view'], $view_params + (isset($content['params']) ? $content['params'] : array()) + array('view_params' => $view_params), false);
    } elseif (is_callable($content)) {
        echo $content();
    } else {
        echo $content;
    }
}
?>
            </div>
<?php
if (!empty($menus)) {
    ?>
                <div class="col <?= $large ? 'c4' : 'c3' ?>" style="position:relative;">
    <?php
    $menu = current($menus);
    if (empty($menu['view'])) {
        $accordions = array();
        foreach ($menus as $key => $menu) {
            if (isset($menu['fields'])) {
                $accordions[$key] = array_merge(array('title' => $key), $menu);
            } else if (!\Arr::is_assoc($menu)) {
                $accordions[$key] = array('title' => $key, 'fields' => $menu);
            } else {
                $accordions[$key] = $menu;
            }
        }
        $menus = array(
            array(
                'view' => 'nos::form/accordion',
                'params' => array('accordions' => $accordions),
            ),
        );
    }
    foreach ($menus as $view) {
        if (!empty($view['view'])) {
            echo View::forge($view['view'], $view_params + (isset($view['params']) ? $view['params'] : array()) + array('view_params' => $view_params), false);
        }
    }
    ?>
                 </div>
    <?php
}
?>
            <?= $large ? '' : '<div class="col c1"></div>' ?>
        </div>
    </div>
</div>
