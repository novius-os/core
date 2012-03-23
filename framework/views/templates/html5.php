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
<!DOCTYPE html>
<html>
<head>
<?php
	if (isset($base)) {
		echo '<base href="'.$base.'" />';
	}
?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title><?= $title ?></title>
<meta name="robots" content="noindex,nofollow">
<link rel="shortcut icon" href="static/cms/img/noviusos.ico">
<?= $css ?>
<script type="text/javascript">
	var require = {
		paths: {
			'jquery-nos': 'static/cms/js/nos',
			'jquery': 'static/cms/js/vendor/jquery/jquery-1.7.1.min',
			'jquery-ui' : 'static/cms/js/vendor/jquery-ui/jquery-ui-1.8.18.custom.min',
			'link': 'static/cms/js/vendor/requirejs/link',
			'order': 'static/cms/js/vendor/requirejs/order.min'
		},
		jQuery: '1.7.1',
		catchError: true,
		priority: ['jquery'],
		deps: [
			'jquery-ui',
			'jquery-nos',
			'static/cms/js/vendor/log'
		]
	};
</script>
<script src="<?= $require ?>" type="text/javascript"></script>
<?= $js ?>
</head>


<body>
	<?= !empty($body) ? $body : '' ?>
</body>
</html>