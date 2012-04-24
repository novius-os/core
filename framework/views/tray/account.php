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
<div class="page line ui-widget" id="<?= $uniqid = uniqid('id_'); ?>">
	<div style="position:relative;">
		<div class="line" style="overflow:visible;">

            <div style="margin-left: 4%; margin-right: 4%; height: 28px;">
                <h1 class="title" style="float:left;"><?= $logged_user->fullname(); ?></h1>

                <a style="float:right;overflow:auto;" href="admin/nos/tray/account/disconnect">
                    <button data-icon="power"><?= __('Disconnect') ?></button>
                </a>
            </div>

			<div class="tabs" style="width: 92.4%; clear:both; margin:0 auto 1em;">
				<ul style="width: 15%;">
					<li><a href="#infos"><?= __('Your account') ?></a></li>
					<li><a href="#display"><?= __('Theme') ?></a></li>
				</ul>
				<div id="infos">
                    <?= render('admin/user/user_details_edit', array('fieldset' => $fieldset_infos, 'user' => $logged_user), false) ?>
				</div>
				<div id="display">
					<?= $fieldset_display ?>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
    require(['jquery-nos'], function($nos) {
		$nos(function() {
			$nos('#<?= $uniqid ?>').form();
			$nos('#<?= $fieldset_display->form()->get_attribute('id') ?>').bind('ajax_success', function(e, json) {
				if (json.wallpaper_url) {
					$nos('#noviusospanel').css('background-image', 'url("' + json.wallpaper_url + '")');
				} else {
					$nos('#noviusospanel').css('background-image', '');
				}
			});
			$nos('#<?= $uniqid ?> .tabs').wijtabs({
				alignment: 'left'
			});
		});
    });
</script>