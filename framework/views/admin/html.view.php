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

$requirejs_config = \Config::load('requirejs', true);

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
    'paths' => array_merge(
        \Arr::get($requirejs_config, $assets_minified ? 'paths' : 'paths-min', array()),
        \Arr::get($requirejs_config, $assets_minified ? 'paths-min' : 'paths', array())
    ),
);
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

<link rel="shortcut icon" href="static/novius-os/admin/novius-os/img/favicon/favicon.ico">
<link rel="apple-touch-icon" sizes="57x57" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="static/novius-os/admin/novius-os/img/favicon/apple-touch-icon-152x152.png">
<link rel="icon" type="image/png" href="static/novius-os/admin/novius-os/img/favicon/favicon-196x196.png" sizes="196x196">
<link rel="icon" type="image/png" href="static/novius-os/admin/novius-os/img/favicon/favicon-160x160.png" sizes="160x160">
<link rel="icon" type="image/png" href="static/novius-os/admin/novius-os/img/favicon/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="static/novius-os/admin/novius-os/img/favicon/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="static/novius-os/admin/novius-os/img/favicon/favicon-16x16.png" sizes="16x16">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="msapplication-TileImage" content="static/novius-os/admin/novius-os/img/favicon/mstile-144x144.png">
<meta name="msapplication-square70x70logo" content="static/novius-os/admin/novius-os/img/favicon/mstile-70x70.png">
<meta name="msapplication-square144x144logo" content="static/novius-os/admin/novius-os/img/favicon/mstile-144x144.png">
<meta name="msapplication-square150x150logo" content="static/novius-os/admin/novius-os/img/favicon/mstile-150x150.png">
<meta name="msapplication-square310x310logo" content="static/novius-os/admin/novius-os/img/favicon/mstile-310x310.png">
<meta name="msapplication-wide310x150logo" content="static/novius-os/admin/novius-os/img/favicon/mstile-310x150.png">

<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/aristo/jquery-wijmo.min.css">
<link rel="stylesheet" href="static/novius-os/admin/vendor/wijmo/css/jquery.wijmo-pro.all.3.20141.34.min.css">
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
    require.config(<?= \Format::forge()->to_json($config, \Fuel::$env !== \Fuel::PRODUCTION) ?>);
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
