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

<div id="<?= $uniqid_tabs = uniqid('tabs_') ?>" class="nos-tabs line ui-widget fill-parent" style="clear:both; margin:0;display:none;">
    <ul class="nos-tabs-lang-header">
        <?php
        $locales = Config::get('locales', array());
        $selected_index = 0;
        if ($item === null) {
            foreach ($locales as $locale => $text) {
                echo '<li style="text-align: center;"><a href="'.$url_blank_slate.'?lang='.$locale.'">'.Nos\Helper::flag($locale).'</a></li>';
            }
        } else {
            $main_lang = $item->find_main_lang();
            $possible  = $main_lang->get_possible_lang();
            $i = 0;
            foreach ($possible as $locale) {
                if ($locale == $selected_lang) {
                    $selected_index = $i;
                }
                $item_lang = $item->find_lang($locale);
                echo '<li style="text-align: center;"><a href="'.(empty($item_lang) ? $url_blank_slate.'/'.$main_lang->id : $url_form.'/'.$item_lang->id).'?lang='.$locale.'&common_id='.$main_lang->id.'">'.Nos\Helper::flag($locale).'</a></li>';
                $i++;
            }
        }
        ?>
    </ul>
</div>
<script type="text/javascript">
require([
    'jquery-nos',
    'static/novius-os/admin/config/page/form.js'
], function($nos, callback_fn) {

    $nos(function() {
        var $tabs = $nos('#<?= $uniqid_tabs ?>');
        $tabs.onShow('one', function() {
            $tabs.find('div.page_lang').onShow('one', callback_fn).bind('blank_slate', callback_fn);
            $tabs.wijtabs({
                alignment: 'left',
                ajax: true,
                cache: true,
                panelTemplate: '<div class="fill-parent" style="padding:0;"></div>',
                show: function(e, ui) {
                    $nos(ui.panel).onShow();
                }
            });
            $tabs.wijtabs('select', <?= $selected_index ?>);
	        $tabs.find('> div').addClass('fill-parent').addClass('nos-tabs-lang-content');
        });
        $tabs.onShow();
    });
});
</script>
