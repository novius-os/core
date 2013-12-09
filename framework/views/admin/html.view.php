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

$requirejs_config = \Config::load('requirejs');

$assets_minified = \Config::get('novius-os.assets_minified', true);

$config = array(
    'baseUrl' => $base,
    'deps' => array('jquery', 'jquery-nos', 'log'),
    'config' => array(
        'jquery-nos-wysiwyg' => array(
            'minified' => $assets_minified,
        ),
    ),
    'shim' => \Arr::get($requirejs_config, 'shim', array()),
    'paths' => \Arr::get($requirejs_config, 'paths-min', array()),
);

if (!$assets_minified) {
    $config['paths'] = array_merge($config['paths'], \Arr::get($requirejs_config, 'paths', array()));
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
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/jquery.wijmo-pro.all.3.20133.20.min.css">
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
            $locale = !empty($user) ?
                $user->user_lang :
                \Input::get('lang', \Config::get('novius-os.default_locale', 'en_GB'));
            echo $locale;
            ?>';
        $.nosLangPluralRule = <?= \Format::forge(\Nos\I18n::pluralRule($locale))->to_json() ?>;
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
