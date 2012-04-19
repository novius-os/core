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
require(['jquery-nos'], function($) {
	$.nos.ui.form("#<?= $uniqid1 = uniqid('id_') ?>,#<?= $uniqid2 = uniqid('id_') ?>");
});
</script>

<?php
foreach ($fieldset->field() as $field) {
    if (false != strpos(get_class($field), 'Widget_')) {
        continue;
    }
	if ($field->type == 'hidden') {
		echo $field->build();
	}
}
$fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
$large = !empty($large) && $large == true;
?>

<div class="line ui-widget" id="<?= $uniqid1 ?>">
	<?= $large ? '' : '<div class="unit col c1"></div>'; ?>
	<div class="unit col <?= $large ? 'c8' : 'c7' ?>" id="line_first" style="z-index:99;">
		<div class="line" style="margin-bottom:1em;">
			<?php
            if (!empty($medias)) {
                foreach ((array) $medias as $name) {
                    echo $fieldset->field($name)->build();
                }
            }
			?>
			<?php
            if (!empty($title)) {
                $title = (array) $title;
                $size  = min(6, floor(6 / count($title)));
                foreach ($title as $name) {
                    $field = $fieldset->field($name);
                    $placeholder = is_array($field->label) ? $field->label['label'] : $field->label;
                    echo ' '.$field
                            ->set_attribute('placeholder',$placeholder)
                            ->set_attribute('title', $placeholder)
                            ->set_attribute('class', 'title '.($field->type == 'file' ? '' : 'c'.$size))
                            ->set_template($field->type == 'file' ? '<span class="title">{label} {field}</span>': '{field}')
                            ->build();
                }
            }
            ?>
			<?php
            if (!empty($id)) {
                $id = $fieldset->field($id);
                $value = !empty($id) ? $id->get_value() : null;
                if (!empty($value)) {
                    echo '<span style="opacity: 0.5">'.$id->label.$value.'</span>';
                }
            }
			?>
		</div>
        <?php
        if (!empty($subtitle)) {
            ?>
            <div class="line" style="margin-bottom:1em;overflow:visible;">
			<?php
            $fieldset->form()->set_config('field_template',  "\t\t{label}{required} {field} {error_msg}</td>\n");
            foreach ((array) $subtitle as $field) {
                echo '<div class="unit col">'.$fieldset->field($field)->build().'</div>';
            }
            $fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");
			?>
            </div>
        <?php
        }
        ?>
	</div>
	<div class="unit col <?= $large ? 'c4 lastUnit' : 'c3' ?>" style="position:relative;z-index:98;text-align:center;">
		<p><?= $fieldset->field($save)->set_template('{field}')->build() ?> &nbsp; <?= __('or') ?> &nbsp; <a href="#" onclick="javascript:$.nos.tabOrDialog.close(this);return false;"><?= __('Cancel') ?></a></p>
        <?php
            echo \View::forge('form/publishable', array(
                'object' => !empty($object) ? $object : null,
            ), false);
        ?>
	</div>
	<?= $large ? '' : '<div class="unit col c1 lastUnit"></div>' ?>
</div>

<div class="line ui-widget" id="<?= $uniqid2 ?>">
    <?php
    $menu = empty($menu) ? array() : (array) $menu;
    ?>
	<?= $large ? '' : '<div class="unit col c1"></div>' ?>
	<div class="unit col c<?= ($large ? 8 : 7) + (empty($menu) ? ($large ? 4 : 3) : 0) ?>" id="line_second" style="position:relative;margin-bottom:1em;">
		<?= is_array($content) ? implode($content) : $content ?>
	</div>

	<?php
    if (!empty($menu)) {
        $fieldset->form()->set_config('field_template',  "\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} {error_msg}</span>\n");
        ?>
        <div class="unit col <?= $large ? 'c4 lastUnit' : 'c3' ?>" style="position:relative;z-index:98;margin-bottom:1em;">
             <div class="accordion">
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
                                //echo $field;
                                if ($field instanceof \View) {
                                    echo $field;
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