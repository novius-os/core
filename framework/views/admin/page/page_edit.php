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
		$nos('#<?= $uniqid ?>').tab('update', {
				label : <?= json_encode($page->page_title) ?>,
				iconUrl : 'static/novius-os/admin/novius-os/img/16/page.png',
			    actions : [
				    {
					    label : <?= json_encode(_('Visualise')) ?>,
					    click : function() {
						    window.open(<?= json_encode($page->get_href()) ?>);
					    },
					    iconClasses : 'nos-icon16 nos-icon16-eye'
				    }
			    ]
			})
			.remove();
	});
});
</script>

<?php
    echo View::forge('nos::layouts/languages',
        array(
            'item' => $page,
            'views' => array(
                'blank' => array(
                    'location' => 'nos::admin/page/page_form_blank_slate',
                    'params'   => array()
                ),
                'view' => array(
                    'location' => 'nos::admin/page/page_form',
                    'params'   => array('fieldset' => $fieldset)
                ),
            ),
        )
    , false);

