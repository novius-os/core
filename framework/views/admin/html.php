<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

	$assets_minified = \Config::get('assets_minified', true);
    $config = array(
        'baseUrl' => $base,
        'paths' => array(
            'tinymce' => 'static/novius-os/admin/vendor/tinymce/jquery.tinymce',
            'link' => 'static/novius-os/admin/vendor/requirejs/link',
            'log' => 'static/novius-os/admin/bundle/vendor.min',

            'jquery' => 'static/novius-os/admin/vendor/jquery/jquery-1.7.2.min',

            'jquery.bgiframe' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.cookie' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.globalize' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.mousewheel' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-form' => 'static/novius-os/admin/bundle/vendor.min',

            'jquery-ui.core' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.widget' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.position' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.mouse' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.draggable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.droppable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.resizable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.sortable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.dialog' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.button' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.datepicker' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.core' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.blind' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.slide' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.scale' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.transfer' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.fade' => 'static/novius-os/admin/bundle/vendor.min',

            'wijmo.wijtextselection' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijutil' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputcore' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputdate' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputmask' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputnumber' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijlist' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijpopup' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijcalendar' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtabs' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijdatasource' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijsplitter' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijsuperpanel' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijdropdown' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijmenu' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijcheckbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijexpander' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijaccordion' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijdialog' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijpager' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtextbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijgrid' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijlightbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtooltip' => 'static/novius-os/admin/bundle/vendor.min',

            'jquery-nos-validate' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-wysiwyg' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-loadspinner' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-ostabs' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-preview' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-listgrid' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-treegrid' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-thumbnailsgrid' => 'static/novius-os/admin/bundle/nos.min',
            'jquery-nos-appdesk' => 'static/novius-os/admin/bundle/nos.min',
        ),
        'shim' => array(
            'jquery.bgiframe' => array('jquery'),
            'jquery.cookie' => array('jquery'),
            'jquery.globalize' => array('jquery'),
            'jquery.mousewheel' => array('jquery'),
            'jquery-form' => array('jquery'),

            'jquery-ui.core' => array('jquery'),
            'jquery-ui.widget' => array('jquery'),
            'jquery-ui.position' => array('jquery'),
            'jquery-ui.mouse' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.draggable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.droppable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse', 'jquery-ui.draggable'),
            'jquery-ui.resizable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.sortable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.dialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse', 'jquery-ui.position'),
            'jquery-ui.button' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.datepicker' => array('jquery', 'jquery-ui.core'),
            'jquery-ui.effects.core' => array('jquery'),
            'jquery-ui.effects.blind' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.slide' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.scale' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.transfer' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.fade' => array('jquery', 'jquery-ui.effects.core'),

            'wijmo.wijtextselection' => array('jquery'),
            'wijmo.wijutil' => array('jquery'),
            'wijmo.wijinputcore' => array('jquery'),
            'wijmo.wijdatasource' => array('jquery'),
            'wijmo.wijpopup' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijutil'),
            'wijmo.wijcalendar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'wijmo.wijpopup', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale'),
            'wijmo.wijinputdate' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore', 'wijmo.wijcalendar', 'jquery.mousewheel'),
            'wijmo.wijinputmask' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
            'wijmo.wijinputnumber' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
            'wijmo.wijsuperpanel' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.draggable', 'jquery-ui.effects.core', 'jquery.mousewheel'),
            'wijmo.wijlist' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'wijmo.wijsuperpanel'),
            'wijmo.wijtabs' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.wijsuperpanel'),
            'wijmo.wijsplitter' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.mouse', 'wijmo.wijutil'),
            'wijmo.wijdropdown' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.draggable', 'jquery-ui.effects.core', 'jquery.mousewheel', 'jquery.bgiframe', 'wijmo.wijsuperpanel'),
            'wijmo.wijmenu' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.mousewheel', 'jquery.bgiframe', 'wijmo.wijsuperpanel'),
            'wijmo.wijcheckbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijexpander' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil'),
            'wijmo.wijaccordion' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil'),
            'wijmo.wijdialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.dialog', 'wijmo.wijutil', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale', 'jquery-ui.effects.transfer', 'jquery-ui.effects.fade'),
            'wijmo.wijpager' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijtextbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijgrid' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.draggable', 'jquery-ui.droppable', 'wijmo.wijinputdate', 'wijmo.wijinputmask', 'wijmo.wijinputnumber', 'wijmo.wijutil', 'wijmo.wijdatasource', 'jquery.globalize'),
            'wijmo.wijlightbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.wijutil'),
            'wijmo.wijtooltip' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
        ),
        'deps' => array('jquery', 'jquery-nos'),
    );

	if (!$assets_minified) {
		$config['paths'] = array_merge($config['paths'], array(
            'tinymce' => 'static/novius-os/admin/vendor/tinymce/jquery.tinymce_src',
            'log' => 'static/novius-os/admin/vendor/log',

            'jquery' => 'static/novius-os/admin/vendor/jquery/jquery-1.7.2',

            'jquery.bgiframe' => 'static/novius-os/admin/vendor/jquery/bgiframe/jquery.bgiframe-2.1.3-pre',
            'jquery.cookie' => 'static/novius-os/admin/vendor/jquery/cookie/jquery.cookie',
            'jquery.globalize' => 'static/novius-os/admin/vendor/jquery/globalize/globalize.min',
            'jquery.mousewheel' => 'static/novius-os/admin/vendor/jquery/mousewheel/jquery.mousewheel.min',
            'jquery-form' => 'static/novius-os/admin/vendor/jquery/jquery-form/jquery.form',

            'jquery-ui.core' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.core',
            'jquery-ui.widget' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.widget',
            'jquery-ui.position' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.position',
            'jquery-ui.mouse' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.mouse',
            'jquery-ui.draggable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.draggable',
            'jquery-ui.droppable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.droppable',
            'jquery-ui.resizable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.resizable',
            'jquery-ui.sortable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.sortable',
            'jquery-ui.dialog' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.dialog',
            'jquery-ui.button' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.button',
            'jquery-ui.datepicker' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.datepicker',
            'jquery-ui.effects.core' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.core',
            'jquery-ui.effects.blind' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.blind',
            'jquery-ui.effects.slide' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.slide',
            'jquery-ui.effects.scale' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.scale',
            'jquery-ui.effects.transfer' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.transfer',
            'jquery-ui.effects.fade' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.fade',

            'wijmo.wijtextselection' => 'static/novius-os/admin/vendor/wijmo/js/jquery.plugin.wijtextselection',
            'wijmo.wijutil' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijutil',
            'wijmo.wijinputcore' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputcore',
            'wijmo.wijinputdate' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputdate',
            'wijmo.wijinputmask' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputmask',
            'wijmo.wijinputnumber' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputnumber',
            'wijmo.wijlist' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijlist',
            'wijmo.wijpopup' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijpopup',
            'wijmo.wijcalendar' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcalendar',
            'wijmo.wijtabs' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtabs',
            'wijmo.wijdatasource' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdatasource',
            'wijmo.wijsplitter' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijsplitter',
            'wijmo.wijsuperpanel' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijsuperpanel',
            'wijmo.wijdropdown' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdropdown',
            'wijmo.wijmenu' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijmenu',
            'wijmo.wijcheckbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcheckbox',
            'wijmo.wijexpander' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijexpander',
            'wijmo.wijaccordion' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijaccordion',
            'wijmo.wijdialog' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdialog',
            'wijmo.wijpager' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijpager',
            'wijmo.wijtextbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtextbox',
            'wijmo.wijgrid' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijgrid',
            'wijmo.wijlightbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijlightbox',
            'wijmo.wijtooltip' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtooltip',

            'jquery-nos-validate' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.validate',
            'jquery-nos-wysiwyg' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.wysiwyg',
            'jquery-nos' => 'static/novius-os/admin/novius-os/js/jquery.novius-os',
            'jquery-nos-loadspinner' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.loadspinner',
            'jquery-nos-ostabs' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.ostabs',
            'jquery-nos-preview' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.preview',
            'jquery-nos-listgrid' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.listgrid',
            'jquery-nos-treegrid' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.treegrid',
            'jquery-nos-thumbnailsgrid' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.thumbnailsgrid',
            'jquery-nos-appdesk' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.appdesk',
        ));
	}
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
<link rel="shortcut icon" href="static/novius-os/admin/novius-os/img/noviusos.ico">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/aristo/jquery-wijmo.css">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/jquery.wijmo-complete.all.2.1.0.min.css">
<?php
	if ($assets_minified) {
?>
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/nos.min.css">
<?php
	} else {
?>
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/laGrid.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/novius-os.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.ostabs.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.appdesk.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.listgrid.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.treegrid.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.thumbnailsgrid.css">
<link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.preview.css">
<?php
	}
?>
<?= $css ?>
<script src="<?= $require ?>" type="text/javascript"></script>
<script type="text/javascript">
	var assets_minified = <?= \Format::forge($assets_minified)->to_json() ?>;
    require.onError = function (err) {
        console.log(err);
        if (err.requireType === 'timeout') {
            console.log('modules: ' + err.requireModules);
        }

        throw err;
    };
    require.config(<?= \Format::forge($config)->to_json() ?>);
</script>
<?= $js ?>
</head>


<body>
	<?= !empty($body) ? $body : '' ?>
</body>
</html>