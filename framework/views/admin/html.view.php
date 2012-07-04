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
            'raphael' => 'static/novius-os/admin/vendor/raphael/raphael-min',

            'jquery' => 'static/novius-os/admin/vendor/jquery/jquery-1.7.2.min',

            'jquery.bgiframe' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.cookie' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.globalize' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery.mousewheel' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-form' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.datetimepicker' => 'static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon',
            'jquery.passwordstrength' => 'static/novius-os/admin/vendor/jquery/jquery-password_strength/jquery.password_strength',

            'jquery-ui.core' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.widget' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.position' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.mouse' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.draggable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.droppable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.resizable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.selectable' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.selectable.min',
            'jquery-ui.sortable' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.accordion' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.accordion.min',
            'jquery-ui.autocomplete' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.autocomplete.min',
            'jquery-ui.button' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.dialog' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.slider' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.slider.min',
            'jquery-ui.tabs' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.tabs.min',
            'jquery-ui.datepicker' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.progressbar' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.progressbar.min',
            'jquery-ui.effects.core' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.blind' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.bounce' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.bounce.min',
            'jquery-ui.effects.clip' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.clip.min',
            'jquery-ui.effects.drop' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.drop.min',
            'jquery-ui.effects.explode' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.explode.min',
            'jquery-ui.effects.fade' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.fold' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.fold.min',
            'jquery-ui.effects.highlight' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.highlight.min',
            'jquery-ui.effects.pulsate' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.pulsate.min',
            'jquery-ui.effects.scale' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.shake' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.effects.shake.min',
            'jquery-ui.effects.slide' => 'static/novius-os/admin/bundle/vendor.min',
            'jquery-ui.effects.transfer' => 'static/novius-os/admin/bundle/vendor.min',

            'wijmo.wijtextselection' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.raphael' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.raphael.min',
            'wijmo.wijaccordion' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijbarchart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijbarchart.min',
            'wijmo.wijbubblechart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijbubblechart.min',
            'wijmo.wijcalendar' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijcarousel' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijcarousel.min',
            'wijmo.wijchartcore' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijchartcore.min',
            'wijmo.wijcheckbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijcombobox' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijcombobox.min',
            'wijmo.wijcompositechart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijcompositechart.min',
            'wijmo.wijdatasource' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijdatepager' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijdatepager.min',
            'wijmo.wijdialog' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijdropdown' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijeditor' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijeditor.min',
            'wijmo.wijevcal' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijevcal.min',
            'wijmo.wijexpander' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijgallery' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijgallery.min',
            'wijmo.wijgauge' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijgauge.min',
            'wijmo.wijgrid' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputcore' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputdate' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputmask' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijinputnumber' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijlightbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijlineargauge' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijneargauge.min',
            'wijmo.wijlinechart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijlinechart.min',
            'wijmo.wijlist' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijmenu' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijpager' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijpiechart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijpiechart.min',
            'wijmo.wijpopup' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijprogressbar' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijprogressbar.min',
            'wijmo.wijradialgauge' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijradialgauge.min',
            'wijmo.wijradio' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijrating' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijrating.min',
            'wijmo.wijribbon' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijribbon.min',
            'wijmo.wijscatterchart' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijscatterchart.min',
            'wijmo.wijslider' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijslider.min',
            'wijmo.wijsplitter' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijsuperpanel' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtabs' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtextbox' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtooltip' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijtree' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijtree.min',
            'wijmo.wijupload' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijupload.min',
            'wijmo.wijutil' => 'static/novius-os/admin/bundle/vendor.min',
            'wijmo.wijvideo' => 'static/novius-os/admin/vendor/wijmo/js/minified/jquery.wijmo.wijvideo.min',
            'wijmo.wijwizard' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijwizard',

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
            'jquery-ui.datetimepicker' => array('jquery', 'jquery-ui.slider', 'link!static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon.css'),
            'jquery.passwordstrength' => array('jquery', 'link!static/novius-os/admin/vendor/jquery/jquery-password_strength/jquery.password_strength.css'),

            'jquery-ui.core' => array('jquery'),
            'jquery-ui.widget' => array('jquery'),
            'jquery-ui.position' => array('jquery'),
            'jquery-ui.mouse' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.draggable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.droppable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse', 'jquery-ui.draggable'),
            'jquery-ui.resizable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.selectable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.sortable' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.accordion' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.autocomplete' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
            'jquery-ui.button' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.dialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse', 'jquery-ui.position'),
            'jquery-ui.slider' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
            'jquery-ui.tabs' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.datepicker' => array('jquery', 'jquery-ui.core'),
            'jquery-ui.progressbar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'jquery-ui.effects.core' => array('jquery'),
            'jquery-ui.effects.blind' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.bounce' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.clip' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.drop' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.explode' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.fade' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.fold' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.highlight' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.pulsate' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.scale' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.shake' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.slide' => array('jquery', 'jquery-ui.effects.core'),
            'jquery-ui.effects.transfer' => array('jquery', 'jquery-ui.effects.core'),

            'wijmo.wijtextselection' => array('jquery'),
            'wijmo.raphael' => array('jquery', 'raphael'),
            'wijmo.wijaccordion' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil'),
            'wijmo.wijbarchart' => array('jquery', 'jquery-ui.widget', 'wijmo.raphael', 'jquery.globalize', 'wijmo.wijchartcore'),
            'wijmo.wijbubblechart' => array('jquery', 'jquery-ui.widget', 'wijmo.raphael', 'jquery.globalize', 'wijmo.wijchartcore'),
            'wijmo.wijcalendar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'wijmo.wijpopup', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale'),
            'wijmo.wijcarousel' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
            'wijmo.wijchartcore' => array('jquery', 'wijmo.raphael'),
            'wijmo.wijcheckbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijcombobox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijlist'),
            'wijmo.wijcompositechart' => array('jquery', 'jquery-ui.widget', 'wijmo.raphael', 'jquery.globalize', 'wijmo.wijchartcore'),
            'wijmo.wijdatasource' => array('jquery'),
            'wijmo.wijdatepager' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.wijutil', 'wijmo.wijpopup'),
            'wijmo.wijdialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.dialog', 'wijmo.wijutil', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale', 'jquery-ui.effects.transfer', 'jquery-ui.effects.fade'),
            'wijmo.wijdropdown' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.draggable', 'jquery-ui.effects.core', 'jquery.mousewheel', 'jquery.bgiframe', 'wijmo.wijsuperpanel'),
            'wijmo.wijeditor' => array('jquery', 'jquery-ui.core', 'jquery-ui.mouse', 'jquery-ui.widget', 'jquery-ui.tabs', 'jquery-ui.position', 'jquery-ui.draggable', 'wijmo.wijutil', 'wijmo.wijspliter', 'wijmo.wijdialog', 'wijmo.wijmenu', 'wijmo.wijtabs'),
            'wijmo.wijevcal' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'jquery.mousewheel', 'wijmo.wijtextselection', 'wijmo.wijutil', 'wijmo.wijinputcore', 'wijmo.wijinputdate', 'wijmo.wijinputnumber', 'wijmo.wijcalendar', 'wijmo.wijdialog', 'wijmo.wijcombobox', 'wijmo.wijdatepager'),
            'wijmo.wijexpander' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil'),
            'wijmo.wijgallery' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijutil'),
            'wijmo.wijgauge' => array('jquery', 'wijmo.raphael'),
            'wijmo.wijgrid' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.draggable', 'jquery-ui.droppable', 'wijmo.wijinputdate', 'wijmo.wijinputmask', 'wijmo.wijinputnumber', 'wijmo.wijutil', 'wijmo.wijdatasource', 'jquery.globalize'),
            'wijmo.wijinputcore' => array('jquery'),
            'wijmo.wijinputdate' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore', 'wijmo.wijcalendar', 'jquery.mousewheel'),
            'wijmo.wijinputmask' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
            'wijmo.wijinputnumber' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
            'wijmo.wijlightbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.wijutil'),
            'wijmo.wijlineargauge' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.raphael', 'wijmo.wijgauge'),
            'wijmo.wijlinechart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.raphael', 'wijmo.wijchartcore'),
            'wijmo.wijlist' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'wijmo.wijsuperpanel'),
            'wijmo.wijmenu' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.mousewheel', 'jquery.bgiframe', 'wijmo.wijsuperpanel'),
            'wijmo.wijpager' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijpiechart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.raphael', 'wijmo.wijchartcore'),
            'wijmo.wijpopup' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.wijutil'),
            'wijmo.wijprogressbar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijradialgauge' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.raphael', 'wijmo.wijgauge'),
            'wijmo.wijradio' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijrating' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijribbon' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijtabs'),
            'wijmo.wijscatterchart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'wijmo.raphael', 'wijmo.wijchartcore'),
            'wijmo.wijslider' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.slider', 'jquery-ui.effects.core', 'wijmo.wijutil'),
            'wijmo.wijsplitter' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.mouse', 'wijmo.wijutil'),
            'wijmo.wijsuperpanel' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.draggable', 'jquery-ui.effects.core', 'jquery.mousewheel'),
            'wijmo.wijtabs' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.wijsuperpanel'),
            'wijmo.wijtextbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijtooltip' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
            'wijmo.wijtree' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.draggable', 'jquery-ui.droppable', 'jquery-ui.effects.core', 'wijmo.wijutil', 'wijmo.wijtextbox'),
            'wijmo.wijupload' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
            'wijmo.wijutil' => array('jquery'),
            'wijmo.wijvideo' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijtooltip'),
            'wijmo.wijwizard' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget','jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.wijutil', 'wijmo.wijsuperpanel'),
        ),
        'deps' => array('jquery', 'jquery-nos', 'log'),
        'config' => array(
            'jquery-nos-wysiwyg' => array(
                'minified' => $assets_minified,
            ),
        ),
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
            'jquery-ui.selectable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.selectable',
            'jquery-ui.sortable' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.sortable',
            'jquery-ui.accordion' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.accordion',
            'jquery-ui.autocomplete' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.autocomplete',
            'jquery-ui.button' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.button',
            'jquery-ui.dialog' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.dialog',
            'jquery-ui.slider' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.slider',
            'jquery-ui.tabs' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.tabs',
            'jquery-ui.datepicker' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.datepicker',
            'jquery-ui.progressbar' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.progressbar',
            'jquery-ui.effects.core' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.core',
            'jquery-ui.effects.blind' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.blind',
            'jquery-ui.effects.bounce' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.bounce',
            'jquery-ui.effects.clip' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.clip',
            'jquery-ui.effects.drop' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.drop',
            'jquery-ui.effects.explode' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.explode',
            'jquery-ui.effects.fade' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.fade',
            'jquery-ui.effects.fold' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.fold',
            'jquery-ui.effects.highlight' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.highlight',
            'jquery-ui.effects.pulsate' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.pulsate',
            'jquery-ui.effects.scale' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.scale',
            'jquery-ui.effects.shake' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.shake',
            'jquery-ui.effects.slide' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.slide',
            'jquery-ui.effects.transfer' => 'static/novius-os/admin/vendor/jquery-ui/jquery.effects.transfer',

            'wijmo.wijtextselection' => 'static/novius-os/admin/vendor/wijmo/js/jquery.plugin.wijtextselection',
            'wijmo.raphael' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.raphael',
            'wijmo.wijaccordion' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijaccordion',
            'wijmo.wijbarchart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijbarchart',
            'wijmo.wijbubblechart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijbubblechart',
            'wijmo.wijcalendar' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcalendar',
            'wijmo.wijcarousel' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcarousel',
            'wijmo.wijchartcore' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijchartcore',
            'wijmo.wijcheckbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcheckbox',
            'wijmo.wijcombobox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcombobox',
            'wijmo.wijcompositechart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijcompositechart',
            'wijmo.wijdatasource' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdatasource',
            'wijmo.wijdatepager' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdatepager',
            'wijmo.wijdialog' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdialog',
            'wijmo.wijdropdown' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijdropdown',
            'wijmo.wijeditor' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijeditor',
            'wijmo.wijevcal' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijevcal',
            'wijmo.wijexpander' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijexpander',
            'wijmo.wijgallery' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijgallery',
            'wijmo.wijgauge' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijgauge',
            'wijmo.wijgrid' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijgrid',
            'wijmo.wijinputcore' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputcore',
            'wijmo.wijinputdate' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputdate',
            'wijmo.wijinputmask' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputmask',
            'wijmo.wijinputnumber' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijinputnumber',
            'wijmo.wijlightbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijlightbox',
            'wijmo.wijlineargauge' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijneargauge',
            'wijmo.wijlinechart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijlinechart',
            'wijmo.wijlist' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijlist',
            'wijmo.wijmenu' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijmenu',
            'wijmo.wijpager' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijpager',
            'wijmo.wijpiechart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijpiechart',
            'wijmo.wijpopup' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijpopup',
            'wijmo.wijprogressbar' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijprogressbar',
            'wijmo.wijradialgauge' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijradialgauge',
            'wijmo.wijradio' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijradio',
            'wijmo.wijrating' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijrating',
            'wijmo.wijribbon' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijribbon',
            'wijmo.wijscatterchart' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijscatterchart',
            'wijmo.wijslider' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijslider',
            'wijmo.wijsplitter' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijsplitter',
            'wijmo.wijsuperpanel' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijsuperpanel',
            'wijmo.wijtabs' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtabs',
            'wijmo.wijtextbox' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtextbox',
            'wijmo.wijtooltip' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtooltip',
            'wijmo.wijtree' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijtree',
            'wijmo.wijupload' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijupload',
            'wijmo.wijutil' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijutil',
            'wijmo.wijvideo' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijvideo',
            'wijmo.wijwizard' => 'static/novius-os/admin/vendor/wijmo/js/jquery.wijmo.wijwizard',

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
            'jquery-nos-timepicker' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.timepicker',
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

<script type="text/javascript">
var hash = document.location.hash.substr(1);
if (hash.substr(0, 4) == 'tab=') {
    document.location.hash = '';
    document.location.href = document.location.pathname + '?tab=' + hash.substr(4);
}
</script>

<link rel="shortcut icon" href="static/novius-os/admin/novius-os/img/noviusos.ico">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/aristo/jquery-wijmo.css">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/jquery.wijmo-complete.all.2.1.4.min.css">
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
    require.config(<?= \Format::forge($config)->to_json() ?>);
</script>
<?= $js ?>
</head>


<body>
	<?= !empty($body) ? $body : '' ?>
</body>
</html>