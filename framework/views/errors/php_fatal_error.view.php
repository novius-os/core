<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (\Input::is_ajax()) {

    $backtrace = \Debug::filter_backtrace($backtrace);

    \Response::json(array(
        'error' => 'An internal server error has been detected.',
        'internal_server_error' => array(
            'type' => $type,
            'severity' => $severity,
            'message' => $message,
            'filepath' => $filepath,
            'error_line' => $error_line,
            'backtrace' => $backtrace,
        ),
    ));
}
?>

<!--
<?= $type ?> [ <?= $severity ?> ]: <?= $message ?>
<?= $filepath ?> @ line <?= $error_line ?>

<?php
foreach ($backtrace as $trace) {
    $debug_lines = \Debug::file_lines($trace['file'], $trace['line'], false, 0);
    $line = reset($debug_lines);
    $line = trim($line, "\n\r\t ");
    printf("%30s @ line %s\n  %s\n", $trace['file'], $trace['line'], $line);
}
?>
-->
<?php
ob_start();
?>
    <style type="text/css">
        * { margin: 0; padding: 0; }
        body { overflow: auto; background-color: #EEE; font-family: sans-serif; font-size: 16px; line-height: 20px; margin: 40px; }
        #wrapper { padding: 30px; background: #fff; color: #333; margin: 0 auto; width: 800px; }
        a { color: #36428D; }
        h1 { color: #000; font-size: 45px; padding: 0 0 25px; line-height: 1em; }
        .intro { font-size: 22px; line-height: 30px; font-family: georgia, serif; color: #555; padding: 29px 0 20px; border-top: 1px solid #CCC; }
        h2 { margin: 50px 0 15px; padding: 0 0 10px; font-size: 18px; border-bottom: 1px dashed #ccc; }
        h2.first { margin: 10px 0 15px; }
        p { margin: 0 0 15px; line-height: 22px;}
        a { color: #666; }
        pre { border-left: 1px solid #ddd; line-height:20px; margin:20px; padding-left:1em; font-size: 16px; }
        pre, code { color:#137F80; font-family: Courier, monospace; }
        ul, ol { margin: 15px 30px; }
        li { line-height: 24px;}
        .footer { color: #777; font-size: 12px; margin: 40px 0 0 0; }
        pre.fuel_debug_source { border: 1px solid #CCCCCC; background-color: #FFFFFF; color: #333333; font-family: monospace; font-size: 11px; line-height: 1em; margin: 0; padding: 0; width: 100%; overflow: auto; }
        span.fuel_line { display: block; margin: 0px; padding: 0px; }
        span.fuel_line_number { display: inline-block; background-color: #EFEFEF; padding: 4px 8px 4px 8px; }
        span.fuel_line_content { display: inline-block; padding: 4px 0 4px 4px; }
        span.fuel_current_line span.fuel_line_number, span.fuel_current_line { background-color: #f0eb96; font-weight: bold; }
        .backtrace_block { display: none; }
        .wip img { vertical-align: middle; }
    </style>
<?php
$css = ob_get_contents();
ob_end_clean();
ob_start();
?>
    <script type="text/javascript">
    function fuel_toggle(elem){elem = document.getElementById(elem);if (elem.style && elem.style['display']) {var disp = elem.style['display'];} else if (elem.currentStyle) {var disp = elem.currentStyle['display'];}else if (window.getComputedStyle) {var disp = document.defaultView.getComputedStyle(elem, null).getPropertyValue('display');}elem.style.display = disp == 'block' ? 'none' : 'block';return false;};

    require(
        ['jquery-nos-ostabs'],
        function($) {
            $(function() {
                $('#wrapper').nosTabs('update', {
                    label : <?= \Format::forge(__('Something went wrong'))->to_json() ?>
                    //iconUrl : 'static/novius-os/admin/novius-os/img/icons/exclamation--frame.png'
                });
            });
        });
    </script>
<?php
$js = ob_get_contents();
ob_end_clean();
ob_start();
?>
    <div id="wrapper">
        <h1><?= __('You won’t like this: Something went wrong') ?></h1>
        <p><?= strtr(__('What went wrong? <a>If you’re a developer, just click to find out</a>. If you’re not, go ask a developer to help you.'), array('<a>' => '<a href="#" onclick="javascript:fuel_toggle(\'error\');return false;">')) ?></p>

        <div id="error" style="display:none;">

        <p class="intro"><?= $type ?> [ <?= $severity ?> ]: <?= $message ?></p>

        <h2 class="first"><?= $filepath ?> @ line <?= $error_line ?></h2>

<?php
if (is_array($debug_lines)) {
    ?>
    <pre class="fuel_debug_source"><?php
    foreach ($debug_lines as $line_num => $line_content) { ?>
        <span<?= ($line_num == $error_line) ? ' class="fuel_line fuel_current_line"' : ' class="fuel_line"' ?>><span class="fuel_line_number"><?= str_pad($line_num, (mb_strlen(count($debug_lines))), ' ', STR_PAD_LEFT) ?></span><span class="fuel_line_content"><?= $line_content . PHP_EOL ?>
        </span></span><?php
    } ?></pre>
    <?php
}
?>
        <h2>Backtrace</h2>
        <ol>
<?php
$id = 0;
foreach ($backtrace as $trace) {
    $id++;
    $debug_lines = \Debug::file_lines($trace['file'], $trace['line']);
    ?>
            <li>
                <a href="#" onclick="javascript:fuel_toggle('backtrace_<?= $id ?>');return false;"><?= \Fuel::clean_path($trace['file']).' @ line '.$trace['line'] ?></a>
                <div id="backtrace_<?php echo $id; ?>" class="backtrace_block">
                <pre class="fuel_debug_source"><?php
    foreach ($debug_lines as $line_num => $line_content) { ?>
                <span<?= ($line_num == $trace['line']) ? ' class="fuel_line fuel_current_line"' : ' class="fuel_line"' ?>><span class="fuel_line_number"><?= str_pad($line_num, (mb_strlen(count($debug_lines))), ' ', STR_PAD_LEFT) ?></span><span class="fuel_line_content"><?= $line_content . PHP_EOL ?>
                </span></span><?php
    } ?></pre>
                </div>
            </li>
        <?php
} ?>
        </ol>

<?php
if (count($non_fatal) > 0) {
    ?>
        <h2>Prior Non-Fatal Errors</h2>
        <ol>
    <?php
    $id = 0;
    foreach ($non_fatal as $err) {
        $id++;
        extract($err);
        $debug_lines = \Debug::file_lines($orig_filepath, $error_line);
        ?>
            <li>
                <a href="#" onclick="javascript:fuel_toggle('non_fatal_<?= $id ?>');return false;"><?= $severity ?>: <?= $message ?> in <?= $filepath ?> @ line <?= $error_line ?></a>
                <div id="non_fatal_<?php echo $id; ?>" class="backtrace_block">
                <pre class="fuel_debug_source"><?php
        foreach ($debug_lines as $line_num => $line_content) { ?>
                <span<?= ($line_num == $error_line) ? ' class="fuel_line fuel_current_line"' : ' class="fuel_line"' ?>><span class="fuel_line_number"><?= str_pad($line_num, (mb_strlen(count($debug_lines))), ' ', STR_PAD_LEFT) ?></span><span class="fuel_line_content"><?= $line_content . PHP_EOL ?>
                </span></span><?php
        } ?></pre>
                </div>
            </li>
        <?php
    }
    ?>
        </ol>
    <?php
}
?>

<?php
if (!empty($contents)) {
    ?>
        <h2>Prior Contents (<a href="#" onclick="javascript:fuel_toggle('prior_contents');return false;">show</a>)</h2>
        <pre id="prior_contents" class="fuel_debug_source" style="display: none;""><?php echo e($contents); ?></pre>
    <?php
}
?>

        <p class="footer">
            <a href="http://fuelphp.com">Fuel PHP</a> is released under the MIT license.
        </p>
    </div>
    </div>
<?php
$body = ob_get_contents();
ob_end_clean();
ob_start();

if (!$ajax = Input::is_ajax()) {
    $view = \View::forge('nos::admin/html');
    $view->set('title', __('Something went wrong'));
    $view->set('base', Uri::base(false) ?: 'http'.(Input::server('HTTPS') ? 's' : '').'://'.Input::server('HTTP_HOST'), false);
    $view->set('require', 'static/novius-os/admin/vendor/requirejs/require.js', false);
    $view->set('css', $css, false);
    $view->set('js', $js, false);
    $view->set('body', $body, false);
    echo $view;
} else {
    echo $body;
}
