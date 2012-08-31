<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

?>
<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $content = $("#<?= $uniqid = uniqid('id_') ?>");
            $content.nosOnShow('one', function() {
                    $content.nosFormUI();
                })
                .nosOnShow();
        });
    });
</script>

<?php
echo $fieldset->build_hidden_fields();

$fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
$large = !empty($large) && $large == true;
?>

<div id="<?= $uniqid ?>" class="nos-fixed-content fill-parent" style="display:none;">
    <div>
        <?= $large ? '' : '<div class="unit col c1"></div>'; ?>
        <div class="unit col <?= $large ? 'c12' : 'c10' ?>" style="">
            <div class="line ui-widget" style="margin:2em 2em 1em;">
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

    $locales = array_keys(\Config::get('locales'));
    if (!empty($item) && count($locales) > 1) {
        $translatable = $item->behaviours('Nos\Orm_Behaviour_Translatable');
        if ($translatable) {
            echo '<td style="width:16px;">'.\Nos\Helper::flag($item->get_lang()).'</td>';
        }
    }
?>
                        <td class="table-field">
<?php
    if (!empty($title)) {
        $title = (array) $title;
        $size  = min(6, floor(6 / count($title)));
        $first = true;
        foreach ($title as $name) {
            if ($first) {
                $first = false;
            } else {
                echo '</td><td>';
            }
            $field = $fieldset->field($name);
            $placeholder = is_array($field->label) ? $field->label['label'] : $field->label;
            echo ' '.$field
                    ->set_attribute('placeholder',$placeholder)
                    ->set_attribute('title', $placeholder)
                    ->set_attribute('class', 'title')
                    ->set_template($field->type == 'file' ? '<span class="title">{label} {field}</span>': '{field}')
                    ->build();
        }
    }
?>
                        </td>
                    </tr>
                </table>
<?php
    $publishable = (string) \View::forge('form/publishable', array(
        'item' => !empty($item) ? $item : null,
    ), false);

    if (!empty($subtitle) || !empty($publishable)) {
?>
                    <div class="line" style="overflow:visible;">
                        <table style="width:100%;margin-bottom:1em;">
                            <tr>
<?php
        if (!empty($publishable)) {
            echo $publishable;
        }
        if (!empty($subtitle)) {
            $fieldset->form()->set_config('field_template',  "\t\t<td>{label}{required} {field} {error_msg}</td>\n");
            foreach ((array) $subtitle as $name) {
                $field = $fieldset->field($name);
                $placeholder = is_array($field->label) ? $field->label['label'] : $field->label;
                echo $field
                     ->set_attribute('placeholder',$placeholder)
                     ->set_attribute('title', $placeholder)
                     ->build();
            }
            $fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
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
        <div class="unit col c1"></div>
        <div class="unit col c3 <?= $large ? 'lastUnit' : '' ?>"></div>
        <?= $large ? '' : '<div class="unit col c1 lastUnit"></div>' ?>
    </div>

    <div style="clear:both;">
        <div class="line ui-widget" style="margin: 0 2em 2em;">
<?php
            $menus = empty($menu) ? array() : (array) $menu;
            $contents = empty($content) ? array() : (array) $content;
?>
            <?= $large ? '' : '<div class="unit col c1"></div>' ?>
            <div class="unit col c<?= ($large ? 8 : 7) + (empty($menu) ? ($large ? 4 : 3) : 0) ?>" id="line_second" style="position:relative;">
<?php
    foreach ($contents as $content) {
        if (is_array($content) && !empty($content['view'])) {
            echo View::forge($content['view'], array('fieldset' => $fieldset, 'item' => $item) + $content['params'], false);
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
                <div class="unit col <?= $large ? 'c4 lastUnit' : 'c3' ?>" style="position:relative;">
<?php
        $menu = current($menus);
        if (empty($menu['view'])) {
            $accordions = array();
            foreach ($menus as $key => $menu) {
                if (isset($menu['fields'])) {
                    $accordions[$key] = array_merge(array('title' => $key), $menu);
                } else {
                    $accordions[$key] = array('title' => $key, 'fields' => $menu);
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
                echo View::forge($view['view'], array('fieldset' => $fieldset, 'item' => $item) + $view['params'], false);
            }
        }
?>
                 </div>
<?php
    }
?>
            <?= $large ? '' : '<div class="unit lastUnit"></div>' ?>
        </div>
    </div>
</div>
