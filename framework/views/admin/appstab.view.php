<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

    $id = uniqid('temp_');
?>
<div id="<?= $id ?>">
    <div align="center">
    <form data-ui="ajaxForm" id="search">
        <span id="magnifier"></span>
        <input type="search" name="search" placeholder="<?= __('Search') ?>" data-button-go="false" />
    </form>
    </div>
    <div id="apps">
<?php
    foreach ($apps as $app) {
?>
        <a class="app" href="<?= $app['url'] ?>" data-launcher="<?= htmlspecialchars(\Format::forge($app)->to_json()) ?>">
            <span class="icon">
                <img class="gloss" src="static/novius-os/admin/novius-os/img/64/gloss.png" />
                <img width="64" src="<?= $app['icon64'] ?>" />
            </span>
            <span class="text"><?= $app['name'] ?></span>
        </a>
<?php
    }
?>
    </div>
</div>
<script type="text/javascript">
require(
    ['jquery-nos', 'jquery-ui.sortable'],
    function($) {
        $(function() {
            var $panel = $('#<?= $id ?>').nosListenEvent({name : 'Nos\\Application'} ,function(json) {
                        $.ajax({
                            url: 'admin/nos/noviusos/appstab',
                            success: function(data) {
                                $panel.parent().empty().append(data);
                            }
                        });
                    }),
                click = function(e) {
                        e.preventDefault();
                        var $launcher = $(this),
                            tab = $launcher.data('launcher');
                        $launcher.nosTabs($.extend({
                            app: true,
                            iconSize: 32,
                            labelDisplay: false
                        }, tab));
                    },
                apps = $panel.find('#apps').sortable({
                        update: function(e, ui) {
                            ui.item.unbind("click");
                            ui.item.one("click", function (event) {
                                event.preventDefault();
                                event.stopImmediatePropagation();
                                $(this).click(function(e) {
                                    click.call(this, e);
                                });
                            });
                            var orders = {};
                            $('.app').each(function(i) {
                                orders[$(this).data('launcher').key] = {order: i};
                            });
                            $(apps).nosSaveUserConfig('misc.apps', orders);
                        }
                    });
<?php if ($background) { ?>
            $('#noviusospanel').css('background-image', 'url("<?= Uri::create($background->get_public_path()) ?>")');
<?php } ?>
            $panel.find('a.app').click(function(e) {
                click.call(this, e);
            });
        });
    });
</script>
