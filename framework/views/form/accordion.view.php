<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (!empty($fieldset)) {
    $fieldset->form()->set_config('field_template', "\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} {error_msg}</span>\n");

    foreach ($fieldset->field() as $field) {
        if ($field->type == 'checkbox') {
            $template = $field->template;
            if (empty($template)) {
                $field->set_template("\t\t<span class=\"{error_class}\">{field} {label}{required} {error_msg}</span>\n");
            }
        }
    }
}
?>
<div class="accordion <?= !empty($fieldset) ? 'fieldset' : '' ?> <?= !empty($classes) ? $classes : '' ?>">
<?php
foreach ((array) $accordions as $options) {
    if (!is_array($options)) {
        $options = array($options);
    }
    if (!isset($options['fields'])) {
        $options['fields'] = !isset($options['view']) ? $options : array();
    }
    if (!isset($options['field_template'])) {
        $options['field_template'] = '<p>{field}</p>';
    }
    if (!isset($options['title'])) {
        $options['title'] = '';
    }
    if (empty($options['view'])) {
        $ignore = true;
        foreach ((array) $options['fields'] as $field) {
            if ($field instanceof \View || !$fieldset->field($field)->is_restricted()) {
                $ignore = false;
                continue;
            }
        }
        if ($ignore) {
            continue;
        }
    }
    ?>
        <h3 class="<?= isset($options['header_class']) ? $options['header_class'] : '' ?>"><a href="#"><?= $options['title'] ?></a></h3>
        <div class="<?= isset($options['content_class']) ? $options['content_class'] : '' ?>" style="overflow:visible;">
    <?php
    if (!empty($options['view'])) {
        echo View::forge(
            $options['view'],
            (isset($view_params) ? $view_params : array()) + (isset($options['params']) ? $options['params'] : array()),
            false
        );
    }
    foreach ((array) $options['fields'] as $field) {
        try {
            if ($field instanceof \View) {
                echo $field;
                continue;
            }
            $field = $fieldset->field($field);
            if (!$field->is_restricted()) {
                echo strtr($options['field_template'], array('{field}' => $field->build()));
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
