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

$id = uniqid('temp_');
?>
<div id="<?= $id ?>" class="nos-desktop-apps">
<?php
foreach ($apps as $app) {
    ?>
        <a class="app" href="#" data-launcher="<?= htmlspecialchars(\Format::forge($app)->to_json()) ?>">
            <span class="icon">
                <img class="gloss" src="static/novius-os/admin/novius-os/img/64/gloss.png" />
                <img width="64" src="<?= $app['icon'] ?>" />
            </span>
            <span class="text"><?= $app['name'] ?></span>
        </a>

    <?php
}
?>
</div>
<script type="text/javascript">
require(
    ['jquery-nos-nosdesktop'],
    function($) {
        $(function() {
            $('#<?= $id ?>').nosdesktop({
                reloadUrl: 'admin/nos/noviusos/desktop'
            });
        });
    });
</script>
