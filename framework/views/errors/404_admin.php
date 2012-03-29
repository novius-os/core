<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if ($css) {
?>
<style type="text/css">
	* { margin: 0; padding: 0; }
	body { background-color: #EEE; font-family: sans-serif; font-size: 16px; line-height: 20px; margin: 40px; }
	#wrapper { padding: 30px; background: #fff; color: #333; margin: 0 auto; width: 800px; }
	a { color: #36428D; }
	h1 { color: #000; font-size: 45px; padding: 0 0 25px; line-height: 1em; }
	p { margin: 0 0 15px; line-height: 22px;}
	.wip img { vertical-align: middle; }
</style>
<?
}
if ($js) {
?>
<script type="text/javascript">
require(['jquery-nos-ostabs'], function($) {
	$(function() {
		$.nos.tabs.update({
			label : 'Not implemented yet'
		});
	});
});
</script>
<?
}
if ($body) {
?>
<div id="wrapper">
	<h1>404 Not Found</h1>
	<img src="static/novius-os/admin/novius-os/img/logo.png" style="float:left; margin-right: 30px;"/>
	<br /><br /><br />
	<p class="wip">
		<img src="static/novius-os/admin/novius-os/img/flags/fr.png" />&nbsp; Cette fonction n'est pas encore implémentée. Revenez bientôt !
	</p>
	<br />
	<p class="wip">
		<img src="static/novius-os/admin/novius-os/img/flags/gb.png" />&nbsp; This feature is not implemented yet. Check again soon!
	</p>
	<br style="clear:left;" />

	<p class="intro"></p>
</div>
<?
}
