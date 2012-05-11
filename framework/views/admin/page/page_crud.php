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
<div id="<?= $uniqid = uniqid('id_') ?>"></div>
<script type="text/javascript">
require(['jquery-nos-ostabs'], function ($nos) {
	$nos(function () {
        var tabInfos = {
            label : <?= json_encode(empty($page) ? __('Add a page') : $page->page_title) ?>,
            iconUrl : 'static/novius-os/admin/novius-os/img/16/page.png'
        };
        <?php
        if (!empty($page)) {
            ?>
            tabInfos.actions = [
                {
                    label : <?= json_encode(_('Visualise')) ?>,
                    click : function() {
                        window.open(<?= json_encode($page->get_href()) ?>);
                    },
                    iconClasses : 'nos-icon16 nos-icon16-eye'
                }
            ];
            <?php
        }
        ?>
		$nos('#<?= $uniqid ?>').tab('update', tabInfos).remove();
	});
});
</script>

<?= View::forge('nos::form/layout_languages', array(
    'item' => $page,
    'selected_lang' => $page === null ? null : $page->get_lang(),
    'url_blank_slate' => 'admin/nos/page/page/blank_slate',
    'url_form' => 'admin/nos/page/page/form',
), false);
?>