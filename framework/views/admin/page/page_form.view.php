<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$fieldset->populate_with_instance($page);
$fieldset->field('page_parent_id')->set_widget_options(array(
    'lang' => $lang,
));

$fieldset->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");

foreach ($fieldset->field() as $field) {
	if ($field->type == 'checkbox') {
		$field->set_template('{field} {label}');
	}
}

$checkbox_url  = '<label><input type="checkbox" data-id="same_url_title">'.strtr(__('Use {field}'), array('{field}' => __('title'))).'</label>';
$checkbox_menu = '<label><input type="checkbox" data-id="same_menu_title">'.strtr(__('Use {field}'), array('{field}' => __('title'))).'</label>';

$fieldset->field('page_cache_duration')->set_template('{label} {field} {required} seconds');
$fieldset->field('page_lock')->set_template('{label} {field} {required}');
$fieldset->field('page_virtual_name')->set_template('{label}{required} <br /> <div class="table-field">{field} <span>&nbsp;.html</span></div>'.$checkbox_url);

$fieldset->field('page_menu_title')->set_template("\t\t<span class=\"{error_class}\">{label}{required}</span>\n\t\t<br />\n\t\t<span class=\"{error_class}\">{field} <br />$checkbox_menu {error_msg}</span>\n");

$form_attributes = $fieldset->get_config('form_attributes');

if (!isset($form_attributes['class'])) {
    $form_attributes['class'] = '';
}
$form_attributes['class'] .= ' fill-parent';
$fieldset->set_config('form_attributes', $form_attributes);

?>

<?= $fieldset->open('admin/nos/page/page/form/'.($page->is_new() ? '' : '/'.$page->page_id)) ?>

<?php
Event::register_function('config|nos::views/admin/page/page_form', 1, function(&$config) use ($fieldset, $page) {
    $config['fieldset'] = $fieldset;
    $config['object']   = $page;
    $config['content'][] = \View::forge('form/expander', array(
        'title'    => __('Content'),
        // Wysiwyg are edge-to-edge with the border
        'nomargin' => true,
        'options' => array(
            'allowExpand' => false,
        ),
        'content'  => '
            <div data-id="external">
                <table>
                    '.$fieldset->field('page_external_link')->build().'
                    '.$fieldset->field('page_external_link_type')->build().'
                </table>
            </div>
            <div data-id="internal" style="display:none;">
                <p style="padding:1em;">We\'re sorry, internal links are not supported yet. We need a nice page selector before that.</p>
            </div>
            <div data-id="wysiwyg" style="display:none;"></div>',
    ), false);
});

$config = Config::load('nos::views/admin/page/page_form', true);

?>
<?= View::forge('form/layout_standard', $config, false); ?>
<?= $fieldset->close() ?>
<script type="text/javascript">
require(
    ['jquery-nos-ostabs', 'static/novius-os/admin/config/page/form.js'],
    function ($, callback_fn) {
		$(function () {
			var tabInfos = {
				label : <?= json_encode(empty($page) || $page->is_new() ? __('Add a page') : $page->page_title) ?>,
				iconUrl : 'static/novius-os/admin/novius-os/img/16/page.png',
				url : 'admin/nos/page/page/crud<?= empty($page) ? '' : '/'.$page->page_id ?>?lang=<?= $lang ?>'
			};
<?php
	if (!empty($page) && !$page->is_new()) {
?>
			tabInfos.actions = [
				{
					label : <?= json_encode(__('Visualise')) ?>,
					click : function() {
						window.open(<?= json_encode($page->get_href()) ?> + '?_preview=1');
					},
					iconClasses : 'nos-icon16 nos-icon16-eye'
				}
			];
<?php
	}
?>
			var $el = $('#<?= $fieldset->form()->get_attribute('id') ?>');
            $el.addClass('fill-parent');
            $el.css('overflow', 'auto');
			$el.nosOnShow('bind', function() {
				$el.nosTabs('update', tabInfos);
			});

            callback_fn.call($('#<?= $fieldset->form()->get_attribute('id') ?>'));
        });
	});
</script>