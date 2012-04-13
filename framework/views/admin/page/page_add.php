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
require(['jquery-nos-ostabs'], function ($) {
	$(function () {
		$.nos.tabs.update({
			label : <?= json_encode(__('Add a page')) ?>,
			iconUrl : 'static/novius-os/admin/novius-os/img/16/page.png'
		});
	});
});
</script>

<div class="page line ui-widget" id="<?= $uniqid = uniqid('id_'); ?>">
    <div id="<?= $uniqid_tabs = uniqid('tabs_') ?>" style="width: 92.4%; clear:both; margin:0 auto 1em;">
        <ul style="width: 5%;">
            <?php
            $possible = $parent->get_all_lang();
            $locales = Config::get('locales', array());
            foreach ($possible as $lang) {
                $uniqids[$lang] = uniqid($lang.'_');
                echo '<li style="text-align: center;"><a href="#'.$uniqids[$lang].'">'.Nos\Helper::flag($lang)/*.' '.\Arr::get($locales, $lang, $lang)*/.'</a></li>';
            }
            ?>
        </ul>
        <?php
        foreach ($possible as $lang) {
            ?>
            <div id="<?= $uniqids[$lang] ?>" class="page_lang">
                <?php
                // We can't use $page->page_lang = $lang; $fieldset->populate_with_instance($page);
                // Because the lang property is not populated (defined by the translatable behaviour)

                // Generates a new id
                $fieldset->populate_with_instance(null);
                $fieldset->field('page_parent_id')->set_value($parent->find_lang($lang)->page_id);
                $fieldset->field('page_lang')->set_value($lang);
                $fieldset->field('page_parent_id')->set_widget_options(array(
                    'lang' => $lang,
                ));
                echo View::forge('nos::admin/page/page_form', array(
                    'uniqid' => $uniqids[$lang],
                    'fieldset' => $fieldset,
                    'item' => $page,
                    'lang' => $lang,
                ), false);
                ?>
            </div>
            <?php
        }
        ?>
    </div>
</div>



<script type="text/javascript">
require([
    'jquery-nos',
	'static/novius-os/admin/config/page/form.js'
], function($, callback_fn) {
	$(function() {
        var $tabs = $('#<?= $uniqid_tabs ?>');
        $tabs.wijtabs({
            alignment: 'left',
            show: function(e, ui) {
                $(ui.panel).bind('blank_slate', callback_fn).trigger('blank_slate');
            }
        });
        $tabs.find('> ul').css({
            width : '5%'
        });
        $tabs.find('> div').css({
            width : '94%'
        });
	});
});</script>