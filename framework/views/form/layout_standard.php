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
require(['jquery-nos'], function($nos) {
	$nos(function() {
        var $header  = $nos("#<?= $uniqid1 = uniqid('id_') ?>").form();
        var $content = $nos("#<?= $uniqid2 = uniqid('id_') ?>");

        $content.initOnShow('init', function() {

                var height = $header
                .addClass('ui-widget-content')
                .css({
                        'zIndex':100
                })
               .outerHeight();
            $content.form()
                .addClass('fill-parent')
                .addClass('ui-widget-content').css({
                    top: height
                });
                $header.css('position', 'absolute');
                $header.css($header.offsetParent());
        });
        $content.initOnShow();
        log($content);
	});

	$nos(function() {
        return true;
        var $header  = $nos("#<?= $uniqid1 ?>")
        var $content = $nos("#<?= $uniqid2 ?>");

        $header.initOnShow('init', function() {
            $header
                .addClass('ui-widget-content')
                .css($header.offsetParent())
                .css({
                    position: 'absolute',
                    zIndex:100
                })
            return;

            $header.form();
        });
        $content.initOnShow('init', function() {
            var height = $header.outerHeight();
            $content
                .addClass('fill-parent')
                .addClass('ui-widget-content').css({
                    position: 'absolute',
                    top: height
                });
            $content.form();
        });
        $header.initOnShow();
        $content.initOnShow();
	});
});
</script>

<?php
echo $fieldset->build_hidden_fields();

$fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
$large = !empty($large) && $large == true;
?>

<div id="<?= $uniqid1 ?>" class="line ui-widget nos-fixed-header" style="margin-bottom:1em;">
	<?= $large ? '' : '<div class="unit col c1"></div>'; ?>
	<div class="unit col <?= $large ? 'c8' : 'c6' ?>" style="">
        <table class="title-fields" style="margin-bottom:1em;">
            <tr>
			<?php
            if (!empty($medias)) {
                echo '<td>';
                foreach ((array) $medias as $name) {
                    echo $fieldset->field($name)->build();
                }
                echo '</td>';
            }
			?>
                <td>
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
        if (!empty($subtitle)) {
            ?>
            <div class="line" style="overflow:visible;">
                <table style="width:100%;margin-bottom:1em;">
                    <tr>
                        <?php
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
                        ?>
                    </tr>
                </table>
            </div>
        <?php
        }
        ?>
	</div>
    <div class="unit col c1"></div>
	<div class="unit col c3 <?= $large ? 'lastUnit' : '' ?>" style="position:relative;">
		<p><?= $fieldset->field($save)->set_template('{field}')->build() ?> &nbsp; <?= __('or') ?> &nbsp; <a href="#" onclick="javascript:$(this).nos().tab('close');return false;"><?= __('Cancel') ?></a></p>
        <?php
            echo \View::forge('form/publishable', array(
                'object' => !empty($object) ? $object : null,
            ), false);
        ?>
	</div>
	<?= $large ? '' : '<div class="unit col c1 lastUnit"></div>' ?>
</div>

<div id="<?= $uniqid2 ?>" class="nos-fixed-content" style="display:none;">
    <div class="line ui-widget" style="margin: 2em;">
        <?php
        $menu = empty($menu) ? array() : (array) $menu;
        ?>
        <?= $large ? '' : '<div class="unit col c1"></div>' ?>
        <div class="unit col c<?= ($large ? 8 : 7) + (empty($menu) ? ($large ? 4 : 3) : 0) ?>" id="line_second" style="position:relative;margin-bottom:1em;">
            <?= is_array($content) ? implode($content) : $content ?>
        </div>

        <?php
        if (!empty($id)) {
            $_id = $fieldset->field($id);
            $_id = !empty($_id) ? $_id->get_value() : null;
            $admin = __('Admin');
            if (empty($_id)) {
                // Nothing
            } else {
                if (empty($menu)) {
                    // Display below current content, in a new line
                } else if (isset($menu[$admin]['fields'])) {
                    array_unshift($menu[$admin]['fields'], '_id');
                } else if (!isset($menu[$admin])) {
                    $menu[$admin] = array(
                        'header_class'  => 'faded',
                        'content_class' => 'faded',
                        'fields' => array('_id'),
                    );
                } else {
                    array_unshift($menu[$admin], '_id');
                }
            }
        }

        if (!empty($menu)) {
            $fieldset->form()->set_config('field_template',  "\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} {error_msg}</span>\n");
            ?>
            <div class="unit col <?= $large ? 'c4 lastUnit' : 'c3' ?>" style="position:relative;margin-bottom:1em;">
                 <div class="accordion fieldset">
                    <?php
                    foreach ((array) $menu as $title => $options) {
                        if (!isset($options['fields'])) {
                            $options = array('fields' => $options);
                        }
                        ?>
                        <h3 class="<?= isset($options['header_class']) ? $options['header_class'] : '' ?>"><a href="#"><?= $title ?></a></h3>
                        <div class="<?= isset($options['content_class']) ? $options['content_class'] : '' ?>" style="overflow:visible;">
                            <?php
                            foreach ((array) $options['fields'] as $field) {
                                try {
                                    if ($field instanceof \View) {
                                        echo $field;
                                    } else if ($field == '_id') {
                                        echo '<p>ID : '.$_id.'</p>';
                                    } else {
                                        echo '<p>'.$fieldset->field($field)->build().'</p>';
                                    }
                                } catch (\Exception $e) {
                                    throw new \Exception("Field $field : " . $e->getMessage(), $e->getCode(), $e);
                                }
                            }
                            ?>
                        </div>
                        <?php
                    }
                    ?>
                 </div>
             </div>
            <?php
            }
            ?>
        <?= $large ? '' : '<div class="unit lastUnit"></div>' ?>
    </div>

    <?php
    if (!empty($id) && empty($menu) && !empty($_id)) {
        echo '<div class="line" style="margin: -2em 2em 2em;">'.($large ? '' : '<div class="unit col c1"></div>').'<div class="unit">ID : '.$_id.'</div></div>';
    }
    ?>
</div>