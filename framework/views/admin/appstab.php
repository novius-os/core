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
<div id="switcher"></div>
<script type="text/javascript">
require(['jquery-nos'], function($nos) {
	$nos(function() {
		//$('#switcher').themeswitcher();
        var apps = $nos('#apps').sortable({
            update: function() {
                var orders = {};
                $nos('.app').each(function(i) {
                    orders[$nos(this).data('launcher').key] = {order: i};
                });
                $nos(apps).xhr('saveUserConfig', 'misc.apps', orders);
            }
        });
		<?php if ($background) { ?>
		$nos('#noviusospanel').css('background-image', 'url("<?= Uri::create($background->get_public_path()) ?>")');
		<?php } ?>
	});
});
</script>
<div align="center">
<form data-ui="ajaxForm" id="search">
	<span id="magnifier"></span>
	<input type="search" name="search" placeholder="<?= __('Search') ?>" data-button-go="false" />
</form>
</div>
<div id="apps">
	<?php
	foreach ($apps as $app) {
	?>
	<a class="app" href="<?= $app['url'] ?>" data-launcher="<?= htmlspecialchars(\Format::forge($app)->to_json()) ?>">
		<span class="icon">
			<img class="gloss" src="static/novius-os/admin/novius-os/img/64/gloss.png" />
			<img width="64" src="<?= $app['icon64'] ?>" />
		</span>
		<span class="text"><?= $app['name'] ?></span>
	</a>
	<?php
	}
	?>
</div>

<script type="text/javascript">
require(['jquery-nos'], function($nos) {
	$nos('a.app').click(function(e) {
		e.preventDefault();
        var $launcher = $nos(this),
	        tab = $launcher.data('launcher');
		$launcher.tab($nos.extend({
			app: true,
			iconSize: 32,
			labelDisplay: false
		}, tab));
	});
});
</script>