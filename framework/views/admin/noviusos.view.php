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

<div id="noviusos">
    <div class="nos-ostabs-tray"><?= \View::forge('nos::admin/tray') ?></div>
</div>
<script type="text/javascript">
require(
    ['jquery-nos-ostabs'],
    function( $ ) {
        $(function() {
            var backgroundUrl= <?= $background ? \Format::forge(Uri::create($background->url()))->to_json() : 'null' ?>,
                $body = $('body').addClass('nos-background');
            $('#noviusos').nosTabs('init', <?= $ostabs ?>);
            if (backgroundUrl) {
                $body.css('background-image', 'url("' + backgroundUrl + '")');
            }
        });
    });
</script>
