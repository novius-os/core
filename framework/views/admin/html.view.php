<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');

$assets_minified = \Config::get('novius-os.assets_minified', true);
$config = array(
    'baseUrl' => $base,
    'paths' => array(
        'tinymce' => 'static/novius-os/admin/vendor/tinymce/jquery.tinymce',
        'link' => 'static/novius-os/admin/vendor/requirejs/link',
        'log' => 'static/novius-os/admin/bundle/vendor.min',
        'stacktrace' => 'static/novius-os/admin/vendor/stacktrace',
        'modernizr' => 'static/novius-os/admin/vendor/modernizr',
        'raphael' => 'static/novius-os/admin/vendor/raphael/raphael-min',

        'jquery' => 'static/novius-os/admin/vendor/jquery/jquery-1.9.1.min',
        'jquery-migrate' => 'static/novius-os/admin/vendor/jquery/jquery-migrate-1.2.1',

        'jquery.cookie' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery.globalize' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery.globalize.cultures' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery.mousewheel' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-form' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.datetimepicker' => 'static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon.min',
        'jquery-ui.datetimepicker.i18n' => 'static/novius-os/admin/vendor/jquery/ui-datetimepicker/i18n/jquery-ui-i18n.min',
        'jquery.passwordstrength' => 'static/novius-os/admin/vendor/jquery/jquery-password_strength/jquery.password_strength.min',
        'jquery.validate' => 'static/novius-os/admin/vendor/jquery/jquery-validation/jquery.validate.min',
        'jquery-ui.tag-it' => 'static/novius-os/admin/vendor/jquery/ui-tag-it/js/tag-it.min',

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
        'jquery-ui.datepicker.i18n' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.progressbar' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.progressbar.min',
        'jquery-ui.menu' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.menu.min',
        'jquery-ui.spinner' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.spinner.min',
        'jquery-ui.tooltip' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.tooltip.min',
        'jquery-ui.effects.core' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.effects.blind' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.effects.bounce' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.bounce.min',
        'jquery-ui.effects.clip' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.clip.min',
        'jquery-ui.effects.drop' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.drop.min',
        'jquery-ui.effects.explode' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.explode.min',
        'jquery-ui.effects.fade' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.effects.fold' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.fold.min',
        'jquery-ui.effects.highlight' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.ts.highlight.min',
        'jquery-ui.effects.pulsate' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.pulsate.min',
        'jquery-ui.effects.scale' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.effects.shake' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.effects.shake.min',
        'jquery-ui.effects.slide' => 'static/novius-os/admin/bundle/vendor.min',
        'jquery-ui.effects.transfer' => 'static/novius-os/admin/bundle/vendor.min',

        'wijmo.widget' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.data' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.data.wijdatasource' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijtextselection' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.raphael' => 'static/novius-os/admin/vendor/wijmo/js/wijutil/jquery.wijmo.raphael.min',
        'wijmo.wijaccordion' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijbarchart' => 'static/novius-os/admin/vendor/wijmo/js/wijbarchart/jquery.wijmo.wijbarchart.min',
        'wijmo.wijbubblechart' => 'static/novius-os/admin/vendor/wijmo/js/wijbubblechart/jquery.wijmo.wijbubblechart.min',
        'wijmo.wijcalendar' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijcarousel' => 'static/novius-os/admin/vendor/wijmo/js/wijcarousel/jquery.wijmo.wijcarousel.min',
        'wijmo.wijchartcore' => 'static/novius-os/admin/vendor/wijmo/js/wijchartcore/jquery.wijmo.wijchartcore.min',
        'wijmo.wijcombobox' => 'static/novius-os/admin/vendor/wijmo/js/wijcombobox/jquery.wijmo.wijcombobox.min',
        'wijmo.wijcompositechart' => 'static/novius-os/admin/vendor/wijmo/js/wijcompositechart/jquery.wijmo.wijcompositechart.min',
        'wijmo.wijdatasource' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijdatepager' => 'static/novius-os/admin/vendor/wijmo/js/wijdatepager/jquery.wijmo.wijdatepager.min',
        'wijmo.wijdialog' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijeditor' => 'static/novius-os/admin/vendor/wijmo/js/wijeditor/jquery.wijmo.wijeditor.min',
        'wijmo.wijevcal' => 'static/novius-os/admin/vendor/wijmo/js/wijevcal/jquery.wijmo.wijevcal.min',
        'wijmo.wijexpander' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijgallery' => 'static/novius-os/admin/vendor/wijmo/js/wijgallery/jquery.wijmo.wijgallery.min',
        'wijmo.wijgauge' => 'static/novius-os/admin/vendor/wijmo/js/wijgauge/jquery.wijmo.wijgauge.min',
        'wijmo.wijgrid' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijinputcore' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijinputdate' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijinputmask' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijinputnumber' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijlightbox' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijlineargauge' => 'static/novius-os/admin/vendor/wijmo/js/wijneargauge/jquery.wijmo.wijneargauge.min',
        'wijmo.wijlinechart' => 'static/novius-os/admin/vendor/wijmo/js/wijlinechart/jquery.wijmo.wijlinechart.min',
        'wijmo.wijlist' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijmenu' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijpager' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijpiechart' => 'static/novius-os/admin/vendor/wijmo/js/wijpiechart/jquery.wijmo.wijpiechart.min',
        'wijmo.wijpopup' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijprogressbar' => 'static/novius-os/admin/vendor/wijmo/js/wijprogressbar/jquery.wijmo.wijprogressbar.min',
        'wijmo.wijradialgauge' => 'static/novius-os/admin/vendor/wijmo/js/wijradialgauge/jquery.wijmo.wijradialgauge.min',
        'wijmo.wijrating' => 'static/novius-os/admin/vendor/wijmo/js/wijrating/jquery.wijmo.wijrating.min',
        'wijmo.wijribbon' => 'static/novius-os/admin/vendor/wijmo/js/wijribbon/jquery.wijmo.wijribbon.min',
        'wijmo.wijscatterchart' => 'static/novius-os/admin/vendor/wijmo/js/wijscatterchart/jquery.wijmo.wijscatterchart.min',
        'wijmo.wijslider' => 'static/novius-os/admin/vendor/wijmo/js/wijslider/jquery.wijmo.wijslider.min',
        'wijmo.wijsplitter' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijsuperpanel' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijtabs' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijtooltip' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijtree' => 'static/novius-os/admin/vendor/wijmo/js/wijtree/jquery.wijmo.wijtree.min',
        'wijmo.wijupload' => 'static/novius-os/admin/vendor/wijmo/js/wijupload/jquery.wijmo.wijupload.min',
        'wijmo.wijutil' => 'static/novius-os/admin/bundle/vendor.min',
        'wijmo.wijvideo' => 'static/novius-os/admin/vendor/wijmo/js/wijvideo/jquery.wijmo.wijvideo.min',
        'wijmo.wijwizard' => 'static/novius-os/admin/vendor/wijmo/js/wijwizard/jquery.wijmo.wijwizard',

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
        'jquery-nos-datacatchers' => 'static/novius-os/admin/bundle/nos.min',

        'jquery-nos-context-common-fields' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.context-common-fields',
        'jquery-nos-appstab' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.appstab',
        'jquery-nos-publishable' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.publishable',
        'jquery-nos-layout-standard' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.layout-standard',
        'jquery-nos-toolbar-crud' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.toolbar-crud',
        'jquery-nos-update-tab-crud' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.update-tab-crud',
        'jquery-nos-virtualname' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.virtualname',
        'jquery-nos-permissions' => 'static/novius-os/admin/novius-os/js/views/minified/jquery.novius-os.permissions',
        'jquery-nos-media-folder-form' => 'static/novius-os/admin/novius-os/js/media/minified/jquery.novius-os.media-folder-form',
        'jquery-nos-media-add-form' => 'static/novius-os/admin/novius-os/js/media/minified/jquery.novius-os.media-add-form',
        'jquery-nos-media-edit-form' => 'static/novius-os/admin/novius-os/js/media/minified/jquery.novius-os.media-edit-form',
        'jquery-nos-image-wysiwyg' => 'static/novius-os/admin/novius-os/js/media/minified/jquery.novius-os.image-wysiwyg',
        'jquery-nos-link-wysiwyg' => 'static/novius-os/admin/novius-os/js/page/minified/jquery.novius-os.link-wysiwyg',
        'jquery-nos-inspector-date' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-date',
        'jquery-nos-inspector-model' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-model',
        'jquery-nos-inspector-tree-model' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-tree-model',
        'jquery-nos-inspector-tree-model-checkbox' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-tree-model-checkbox',
        'jquery-nos-inspector-tree-model-radio' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-tree-model-radio',
        'jquery-nos-inspector-plain-data' => 'static/novius-os/admin/novius-os/js/inspector/minified/jquery.novius-os.inspector-plain-data',
        'jquery-nos-renderer-datetimepicker' => 'static/novius-os/admin/novius-os/js/renderer/minified/jquery.novius-os.renderer.datetime-picker',
    ),
    'shim' => array(
        'jquery.cookie' => array('jquery'),
        'jquery.globalize' => array('jquery'),
        'jquery.globalize.cultures' => array('jquery', 'jquery.globalize'),
        'jquery.mousewheel' => array('jquery'),
        'jquery-form' => array('jquery'),
        'jquery-ui.datetimepicker' => array('jquery', 'jquery-ui.datepicker', 'jquery-ui.slider', 'link!static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon.css'),
        'jquery-ui.datetimepicker.i18n' => array('jquery-ui.datetimepicker', 'jquery-ui.datepicker.i18n'),
        'jquery.passwordstrength' => array('jquery', 'link!static/novius-os/admin/vendor/jquery/jquery-password_strength/jquery.password_strength.css'),
        'jquery-ui.tag-it' => array('jquery', 'jquery-ui.autocomplete', 'link!static/novius-os/admin/vendor/jquery/ui-tag-it/css/jquery.tagit.css'),
        'jquery-migrate' => array('jquery'),

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
        'jquery-ui.autocomplete' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.menu'),
        'jquery-ui.button' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
        'jquery-ui.dialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse', 'jquery-ui.position'),
        'jquery-ui.slider' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.mouse'),
        'jquery-ui.tabs' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
        'jquery-ui.datepicker' => array('jquery', 'jquery-ui.core'),
        'jquery-ui.datepicker.i18n' => array('jquery-ui.datepicker'),
        'jquery-ui.progressbar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
        'jquery-ui.menu' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
        'jquery-ui.spinner' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.button'),
        'jquery-ui.tooltip' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position'),
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

        'wijmo.widget' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.wijutil'),
        'wijmo.data' => array('jquery'),
        'wijmo.data.wijdatasource' => array('jquery', 'wijmo.data', 'jquery.globalize', 'jquery.globalize.cultures'),
        'wijmo.wijtextselection' => array('jquery'),
        'wijmo.raphael' => array('jquery', 'raphael'),
        'wijmo.wijaccordion' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijbarchart' => array('jquery', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.raphael', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.wijchartcore'),
        'wijmo.wijbubblechart' => array('jquery', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.raphael', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.wijchartcore'),
        'wijmo.wijcalendar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijpopup', 'jquery.globalize', 'jquery.globalize.cultures', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale'),
        'wijmo.wijcarousel' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget'),
        'wijmo.wijchartcore' => array('jquery', 'wijmo.widget', 'wijmo.raphael'),
        'wijmo.wijcheckbox' => array('jquery-nos'),
        'wijmo.wijcombobox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijlist'),
        'wijmo.wijcompositechart' => array('jquery', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.raphael', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.wijchartcore'),
        'wijmo.wijdatasource' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget'),
        'wijmo.wijdatepager' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijpopup'),
        'wijmo.wijdialog' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.dialog', 'wijmo.widget', 'wijmo.wijutil', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'jquery-ui.effects.slide', 'jquery-ui.effects.scale', 'jquery-ui.effects.transfer', 'jquery-ui.effects.fade'),
        'wijmo.wijdropdown' => array('jquery-nos'),
        'wijmo.wijeditor' => array('jquery', 'jquery-ui.core', 'jquery-ui.mouse', 'jquery-ui.widget', 'jquery-ui.tabs', 'jquery-ui.position', 'jquery-ui.draggable', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijspliter', 'wijmo.wijdialog', 'wijmo.wijmenu', 'wijmo.wijtabs'),
        'wijmo.wijevcal' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'jquery.mousewheel', 'wijmo.widget', 'wijmo.wijtextselection', 'wijmo.wijutil', 'wijmo.wijinputcore', 'wijmo.wijinputdate', 'wijmo.wijinputnumber', 'wijmo.wijcalendar', 'wijmo.wijdialog', 'wijmo.wijcombobox', 'wijmo.wijdatepager'),
        'wijmo.wijexpander' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijgallery' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijgauge' => array('jquery', 'wijmo.raphael', 'wijmo.widget'),
        'wijmo.wijgrid' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.draggable', 'jquery-ui.droppable', 'wijmo.widget', 'wijmo.wijinputdate', 'wijmo.wijinputmask', 'wijmo.wijinputnumber', 'wijmo.wijutil', 'wijmo.data.wijdatasource', 'wijmo.wijdatasource', 'jquery.globalize', 'jquery.globalize.cultures'),
        'wijmo.wijinputcore' => array('jquery', 'wijmo.widget'),
        'wijmo.wijinputdate' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery.globalize.cultures', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore', 'wijmo.wijcalendar', 'jquery.mousewheel'),
        'wijmo.wijinputmask' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery.globalize.cultures', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
        'wijmo.wijinputnumber' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijtextselection', 'jquery.globalize', 'jquery.globalize.cultures', 'jquery-ui.effects.core', 'jquery-ui.effects.blind', 'wijmo.wijpopup', 'wijmo.wijinputcore'),
        'wijmo.wijlightbox' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijlineargauge' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.raphael', 'wijmo.wijgauge'),
        'wijmo.wijlinechart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.raphael', 'wijmo.wijchartcore'),
        'wijmo.wijlist' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijsuperpanel'),
        'wijmo.wijmenu' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijutil', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.mousewheel', 'wijmo.wijsuperpanel'),
        'wijmo.wijpager' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget'),
        'wijmo.wijpiechart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.raphael', 'wijmo.wijchartcore'),
        'wijmo.wijpopup' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijprogressbar' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'jquery-ui.progressbar'),
        'wijmo.wijradialgauge' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.raphael', 'wijmo.wijgauge'),
        'wijmo.wijradio' => array('jquery-nos'),
        'wijmo.wijrating' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget'),
        'wijmo.wijribbon' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijtabs'),
        'wijmo.wijscatterchart' => array('jquery', 'jquery-ui.widget', 'jquery.globalize', 'jquery.globalize.cultures', 'wijmo.widget', 'wijmo.raphael', 'wijmo.wijchartcore'),
        'wijmo.wijslider' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.slider', 'jquery-ui.effects.core', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijsplitter' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.mouse', 'wijmo.widget', 'wijmo.wijutil'),
        'wijmo.wijsuperpanel' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.resizable', 'jquery-ui.draggable', 'jquery-ui.effects.core', 'jquery.mousewheel', 'wijmo.widget'),
        'wijmo.wijtabs' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.widget', 'wijmo.wijsuperpanel'),
        'wijmo.wijtextbox' => array('jquery-nos'),
        'wijmo.wijtooltip' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.position','wijmo.widget'),
        'wijmo.wijtree' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'jquery-ui.draggable', 'jquery-ui.droppable', 'jquery-ui.effects.core', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijtextbox'),
        'wijmo.wijupload' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget'),
        'wijmo.wijutil' => array('jquery'),
        'wijmo.wijvideo' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget', 'wijmo.widget', 'wijmo.wijtooltip'),
        'wijmo.wijwizard' => array('jquery', 'jquery-ui.core', 'jquery-ui.widget','jquery-ui.position', 'jquery-ui.effects.core', 'jquery.cookie', 'wijmo.widget', 'wijmo.wijutil', 'wijmo.wijsuperpanel'),
    ),
    'deps' => array('jquery', 'jquery-nos', 'log'),
    'config' => array(
        'jquery-nos-wysiwyg' => array(
            'minified' => $assets_minified,
        ),
    ),
);

if (!$assets_minified) {
    // To use when software is in a dev branch
    /*if (Fuel::$env === Fuel::DEVELOPMENT) {
        $config['deps'][] = 'jquery-migrate';
    }*/

    $config['paths'] = array_merge($config['paths'], array(
        'tinymce' => 'static/novius-os/admin/vendor/tinymce/jquery.tinymce_src',
        'log' => 'static/novius-os/admin/vendor/log',

        'jquery' => 'static/novius-os/admin/vendor/jquery/jquery-1.9.1',

        'jquery.cookie' => 'static/novius-os/admin/vendor/jquery/cookie/jquery.cookie',
        'jquery.globalize' => 'static/novius-os/admin/vendor/jquery/globalize/globalize',
        'jquery.globalize.cultures' => 'static/novius-os/admin/vendor/jquery/globalize/cultures/globalize.cultures',
        'jquery.mousewheel' => 'static/novius-os/admin/vendor/jquery/mousewheel/jquery.mousewheel.min',
        'jquery-form' => 'static/novius-os/admin/vendor/jquery/jquery-form/jquery.form',
        'jquery-ui.datetimepicker' => 'static/novius-os/admin/vendor/jquery/ui-datetimepicker/jquery-ui-timepicker-addon',
        'jquery-ui.datetimepicker.i18n' => 'static/novius-os/admin/vendor/jquery/ui-datetimepicker/i18n/jquery-ui-i18n',
        'jquery.passwordstrength' => 'static/novius-os/admin/vendor/jquery/jquery-password_strength/jquery.password_strength',
        'jquery.validate' => 'static/novius-os/admin/vendor/jquery/jquery-validation/jquery.validate',
        'jquery-ui.tag-it' => 'static/novius-os/admin/vendor/jquery/ui-tag-it/js/tag-it',

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
        'jquery-ui.datepicker.i18n' => 'static/novius-os/admin/vendor/jquery-ui/i18n/jquery-ui-i18n',
        'jquery-ui.progressbar' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.progressbar',
        'jquery-ui.menu' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.menu',
        'jquery-ui.spinner' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.spinner',
        'jquery-ui.tooltip' => 'static/novius-os/admin/vendor/jquery-ui/minified/jquery.ui.tooltip',
        'jquery-ui.effects.core' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect',
        'jquery-ui.effects.blind' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-blind',
        'jquery-ui.effects.bounce' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-bounce',
        'jquery-ui.effects.clip' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-clip',
        'jquery-ui.effects.drop' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-drop',
        'jquery-ui.effects.explode' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-explode',
        'jquery-ui.effects.fade' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-fade',
        'jquery-ui.effects.fold' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-fold',
        'jquery-ui.effects.highlight' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-highlight',
        'jquery-ui.effects.pulsate' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-pulsate',
        'jquery-ui.effects.scale' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-scale',
        'jquery-ui.effects.shake' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-shake',
        'jquery-ui.effects.slide' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-slide',
        'jquery-ui.effects.transfer' => 'static/novius-os/admin/vendor/jquery-ui/jquery.ui.effect-transfer',

        'wijmo.widget' => 'static/novius-os/admin/vendor/wijmo/js/Base/jquery.wijmo.widget',
        'wijmo.data' => 'static/novius-os/admin/vendor/wijmo/js/data/wijmo.data',
        'wijmo.data.wijdatasource' => 'static/novius-os/admin/vendor/wijmo/js/data/wijmo.data.wijdatasource',
        'wijmo.wijtextselection' => 'static/novius-os/admin/vendor/wijmo/js/wijutil/jquery.plugin.wijtextselection',
        'wijmo.raphael' => 'static/novius-os/admin/vendor/wijmo/js/wijutil/jquery.wijmo.raphael',
        'wijmo.wijaccordion' => 'static/novius-os/admin/vendor/wijmo/js/wijaccordion/jquery.wijmo.wijaccordion',
        'wijmo.wijbarchart' => 'static/novius-os/admin/vendor/wijmo/js/wijbarchart/jquery.wijmo.wijbarchart',
        'wijmo.wijbubblechart' => 'static/novius-os/admin/vendor/wijmo/js/wijbubblechart/jquery.wijmo.wijbubblechart',
        'wijmo.wijcalendar' => 'static/novius-os/admin/vendor/wijmo/js/wijcalendar/jquery.wijmo.wijcalendar',
        'wijmo.wijcarousel' => 'static/novius-os/admin/vendor/wijmo/js/wijcarousel/jquery.wijmo.wijcarousel',
        'wijmo.wijchartcore' => 'static/novius-os/admin/vendor/wijmo/js/wijchartcore/jquery.wijmo.wijchartcore',
        'wijmo.wijcombobox' => 'static/novius-os/admin/vendor/wijmo/js/wijcombobox/jquery.wijmo.wijcombobox',
        'wijmo.wijcompositechart' => 'static/novius-os/admin/vendor/wijmo/js/wijcompositechart/jquery.wijmo.wijcompositechart',
        'wijmo.wijdatasource' => 'static/novius-os/admin/vendor/wijmo/js/wijdatasource/jquery.wijmo.wijdatasource',
        'wijmo.wijdatepager' => 'static/novius-os/admin/vendor/wijmo/js/wijdatepager/jquery.wijmo.wijdatepager',
        'wijmo.wijdialog' => 'static/novius-os/admin/vendor/wijmo/js/wijdialog/jquery.wijmo.wijdialog',
        'wijmo.wijeditor' => 'static/novius-os/admin/vendor/wijmo/js/wijeditor/jquery.wijmo.wijeditor',
        'wijmo.wijevcal' => 'static/novius-os/admin/vendor/wijmo/js/wijevcal/jquery.wijmo.wijevcal',
        'wijmo.wijexpander' => 'static/novius-os/admin/vendor/wijmo/js/wijexpander/jquery.wijmo.wijexpander',
        'wijmo.wijgallery' => 'static/novius-os/admin/vendor/wijmo/js/wijgallery/jquery.wijmo.wijgallery',
        'wijmo.wijgauge' => 'static/novius-os/admin/vendor/wijmo/js/wijgauge/jquery.wijmo.wijgauge',
        'wijmo.wijgrid' => 'static/novius-os/admin/vendor/wijmo/js/wijgrid/jquery.wijmo.wijgrid',
        'wijmo.wijinputcore' => 'static/novius-os/admin/vendor/wijmo/js/wijinput/jquery.wijmo.wijinputcore',
        'wijmo.wijinputdate' => 'static/novius-os/admin/vendor/wijmo/js/wijinput/jquery.wijmo.wijinputdate',
        'wijmo.wijinputmask' => 'static/novius-os/admin/vendor/wijmo/js/wijinput/jquery.wijmo.wijinputmask',
        'wijmo.wijinputnumber' => 'static/novius-os/admin/vendor/wijmo/js/wijinput/jquery.wijmo.wijinputnumber',
        'wijmo.wijlightbox' => 'static/novius-os/admin/vendor/wijmo/js/wijlightbox/jquery.wijmo.wijlightbox',
        'wijmo.wijlineargauge' => 'static/novius-os/admin/vendor/wijmo/js/wijneargauge/jquery.wijmo.wijneargauge',
        'wijmo.wijlinechart' => 'static/novius-os/admin/vendor/wijmo/js/wijlinechart/jquery.wijmo.wijlinechart',
        'wijmo.wijlist' => 'static/novius-os/admin/vendor/wijmo/js/wijlist/jquery.wijmo.wijlist',
        'wijmo.wijmenu' => 'static/novius-os/admin/vendor/wijmo/js/wijmenu/jquery.wijmo.wijmenu',
        'wijmo.wijpager' => 'static/novius-os/admin/vendor/wijmo/js/wijpager/jquery.wijmo.wijpager',
        'wijmo.wijpiechart' => 'static/novius-os/admin/vendor/wijmo/js/wijpiechart/jquery.wijmo.wijpiechart',
        'wijmo.wijpopup' => 'static/novius-os/admin/vendor/wijmo/js/wijpopup/jquery.wijmo.wijpopup',
        'wijmo.wijprogressbar' => 'static/novius-os/admin/vendor/wijmo/js/wijprogressbar/jquery.wijmo.wijprogressbar',
        'wijmo.wijradialgauge' => 'static/novius-os/admin/vendor/wijmo/js/wijradialgauge/jquery.wijmo.wijradialgauge',
        'wijmo.wijrating' => 'static/novius-os/admin/vendor/wijmo/js/wijrating/jquery.wijmo.wijrating',
        'wijmo.wijribbon' => 'static/novius-os/admin/vendor/wijmo/js/wijribbon/jquery.wijmo.wijribbon',
        'wijmo.wijscatterchart' => 'static/novius-os/admin/vendor/wijmo/js/wijscatterchart/jquery.wijmo.wijscatterchart',
        'wijmo.wijslider' => 'static/novius-os/admin/vendor/wijmo/js/wijslider/jquery.wijmo.wijslider',
        'wijmo.wijsplitter' => 'static/novius-os/admin/vendor/wijmo/js/wijsplitter/jquery.wijmo.wijsplitter',
        'wijmo.wijsuperpanel' => 'static/novius-os/admin/vendor/wijmo/js/wijsuperpanel/jquery.wijmo.wijsuperpanel',
        'wijmo.wijtabs' => 'static/novius-os/admin/vendor/wijmo/js/wijtabs/jquery.wijmo.wijtabs',
        'wijmo.wijtooltip' => 'static/novius-os/admin/vendor/wijmo/js/wijtooltip/jquery.wijmo.wijtooltip',
        'wijmo.wijtree' => 'static/novius-os/admin/vendor/wijmo/js/wijtree/jquery.wijmo.wijtree',
        'wijmo.wijupload' => 'static/novius-os/admin/vendor/wijmo/js/wijupload/jquery.wijmo.wijupload',
        'wijmo.wijutil' => 'static/novius-os/admin/vendor/wijmo/js/wijutil/jquery.wijmo.wijutil',
        'wijmo.wijvideo' => 'static/novius-os/admin/vendor/wijmo/js/wijvideo/jquery.wijmo.wijvideo',
        'wijmo.wijwizard' => 'static/novius-os/admin/vendor/wijmo/js/wijwizard/jquery.wijmo.wijwizard',

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
        'jquery-nos-datacatchers' => 'static/novius-os/admin/novius-os/js/jquery.novius-os.datacatchers',

        'jquery-nos-context-common-fields' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.context-common-fields',
        'jquery-nos-appstab' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.appstab',
        'jquery-nos-publishable' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.publishable',
        'jquery-nos-layout-standard' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.layout-standard',
        'jquery-nos-toolbar-crud' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.toolbar-crud',
        'jquery-nos-update-tab-crud' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.update-tab-crud',
        'jquery-nos-virtualname' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.virtualname',
        'jquery-nos-permissions' => 'static/novius-os/admin/novius-os/js/views/jquery.novius-os.permissions',
        'jquery-nos-media-folder-form' => 'static/novius-os/admin/novius-os/js/media/jquery.novius-os.media-folder-form',
        'jquery-nos-media-add-form' => 'static/novius-os/admin/novius-os/js/media/jquery.novius-os.media-add-form',
        'jquery-nos-media-edit-form' => 'static/novius-os/admin/novius-os/js/media/jquery.novius-os.media-edit-form',
        'jquery-nos-image-wysiwyg' => 'static/novius-os/admin/novius-os/js/media/jquery.novius-os.image-wysiwyg',
        'jquery-nos-link-wysiwyg' => 'static/novius-os/admin/novius-os/js/page/jquery.novius-os.link-wysiwyg',
        'jquery-nos-inspector-date' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-date',
        'jquery-nos-inspector-model' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-model',
        'jquery-nos-inspector-tree-model' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-tree-model',
        'jquery-nos-inspector-tree-model-checkbox' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-tree-model-checkbox',
        'jquery-nos-inspector-tree-model-radio' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-tree-model-radio',
        'jquery-nos-inspector-plain-data' => 'static/novius-os/admin/novius-os/js/inspector/jquery.novius-os.inspector-plain-data',
        'jquery-nos-renderer-datetimepicker' => 'static/novius-os/admin/novius-os/js/renderer/jquery.novius-os.renderer.datetime-picker',
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
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/aristo/jquery-wijmo.min.css">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/jquery.wijmo-pro.all.3.20131.4.min.css">
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
    <link rel="stylesheet" href="static/novius-os/admin/novius-os/css/jquery.novius-os.datacatchers.css">
    <?php
}
?>
<?= $css ?>
<script src="<?= $require ?>" type="text/javascript"></script>
<script type="text/javascript">
    require.config(<?= \Format::forge($config)->to_json() ?>);
</script>
<script type="text/javascript">
    require(['jquery-nos'], function($) {
        $.nosLang = '<?php
            $user = \Session::user();
            echo !empty($user) ? $user->user_lang : \Input::get('lang', \Config::get('novius-os.default_locale', 'en_GB'));
            ?>';
        $.nosTexts = $.extend($.nosTexts, {
            chooseMediaFile : <?= \Format::forge(__('Select a media file'))->to_json() ?>,
            chooseMediaImage : <?= \Format::forge(__('Pick an image'))->to_json() ?>,
            errorImageNotfind : <?= \Format::forge(__('We’re afraid we cannot find this image.'))->to_json() ?>
        });
    });
</script>
<?= $js ?>
</head>

<body>
    <?= !empty($body) ? $body : '' ?>
</body>
</html>
