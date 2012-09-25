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

<div class="page line ui-widget" id="<?= $uniqid = uniqid('id_'); ?>">

    <style type="text/css">
        .app_list {
            width : 500px;
            margin: 1em 0 0;
        }
    </style>

    <div class="unit col c1"></div>
    <div class="unit col c10" id="line_first" style="position:relative;;">
        <div class="line" style="overflow:visible;">
            <h1 class="title"><?= __('Novius OS framework configuration'); ?></h1>
            <p>
<?php
if ($nos->is_dirty()) {
    echo __('It looks like you made some changes recently.').' <a href="#" data-app="'.htmlspecialchars(\Format::forge(array('name' => 'nos', 'action' => 'add'))->to_json()).'" onclick="return false;"><button data-icon="wrench">'.__('Update configuration').'</button></a>';
} else {
    echo __('Up to date!');
}
?>
            </p>
        </div>
        <p>&nbsp;</p>
        <div class="line" style="overflow:visible;">
            <h1 class="title"><?= __('Local configuration'); ?></h1>
            <p>
<?php
if ($local->is_dirty()) {
    echo __('It looks like you made some changes recently.').' <a href="#" data-app="'.htmlspecialchars(\Format::forge(array('name' => 'local', 'action' => 'add'))->to_json()).'" onclick="return false;"><button data-icon="wrench">'.__('Update configuration').'</button></a>';
} else {
    echo __('Up to date!');
}
?>
            </p>
        </div>
        <p>&nbsp;</p>
        <div class="line" style="overflow:visible;">
            <h1 class="title"><?= __('Applications'); ?></h1>

            <div class="app_list">
                <table>
                    <thead>
                        <tr>
                            <td><?= __('Installed and ready to use') ?></td>
                            <td><?= __('Actions') ?></td>
                        </tr>
                    </thead>
                    <tbody>
<?php
foreach ($installed as $app) {
    $metadata = $app->metadata;
    ?>
                        <tr>
                            <td>&nbsp;<img src="<?= isset($metadata['icon16']) ? $metadata['icon16'] : 'static/novius-os/admin/novius-os/img/16/application.png' ?>" style="vertical-align:top;" alt="" title="" /> <?= e($app->name) ?></td>
                            <td>
                                <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'remove'))->to_json()) ?>" onclick="return false;"><button data-icon="arrowthick-1-s"><?= __('Uninstall') ?></button></a>
    <?php
    if ($app->is_dirty()) {
        ?>
                                    <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'add'))->to_json()) ?>" onclick="return false;"><button data-icon="wrench"><?= __('Update') ?></button></a>
        <?php
    }
    ?>
                            </td>
                        </tr>
    <?php
}
?>
                    </tbody>
                </table>

<?php
if (empty($installed)) {
    ?>
                <em><?php echo __('No applications found') ?>.</em>
    <?php
}
?>
            </div>

            <p>&nbsp;</p>

            <div class="app_list">
                <table>
                    <thead>
                        <tr>
                            <td><?= __('Available for installation') ?></td>
                            <td><?= __('Actions') ?></td>
                        </tr>
                    </thead>
                    <tbody>
<?php
foreach ($others as $app) {
    $metadata = $app->get_real_metadata();
    ?>
                        <tr>
                            <td><?= e($app->name) ?> </td>
                            <td>
    <?php
    if (empty($metadata)) {
        ?>
                                <em><?php echo __('No metadata found') ?>.</em>
        <?php
    } else {
        ?>
                                 <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'add'))->to_json()) ?>" onclick="return false;"><button data-icon="arrowthick-1-n"><?= __('Install') ?></button></a></td>
        <?php
    }
    ?>
                        </tr>
    <?php
}
?>
                    </tbody>
                </table>

<?php
if (empty($others)) {
    ?>
                <em><?= __('No applications found') ?></em>
    <?php
}
?>

            </div>

<?php
if ($allow_upload) {
    ?>
                <p>&nbsp;</p>
                <h1 class="title"><?= __('Install from a .zip file') ?></h1>

                <form method="post" action="/admin/nos/tray/appmanager/upload" enctype="multipart/form-data">
                    <input type="file" name="zip" />
                    <input type="submit" value="<?= __('Upload the application') ?>" />
                </form>
    <?php
}
?>
        </div>
    </div>
    <div class="unit lastUnit"></div>

    <script type="text/javascript">
        require(
            ['jquery-nos', 'wijmo.wijgrid'],
            function ($) {
                $(function() {
                    var $container = $('#<?= $uniqid ?>');
                    $container.nosFormUI();

                    $container.nosTabs('update', {
                        label: <?= \Format::forge(__('Application manager'))->to_json() ?>,
                        url:  'admin/nos/tray/appmanager',
                        iconUrl: 'static/novius-os/admin/novius-os/img/32/app-manager.png',
                        app: true,
                        iconSize: 32,
                        labelDisplay: false
                    })

                    $(".app_list table").wijgrid({
                        columns: [
                            {  },
                            { width: 200, ensurePxWidth: true }
                        ] });

                    $container.find('a').click(function(e) {
                        e.preventDefault();
                        var data = $(this).data('app');

                        $container.nosAjax({
                            url: 'admin/nos/tray/appmanager/' + data.action + '/' + data.name,
                            complete: function() {
                                $container.load('admin/nos/tray/appmanager', function() {
                                    $container.find(':first').unwrap();
                                });
                                $.nosDispatchEvent({
                                    name : 'Nos\\Application',
                                    action : data.action,
                                    id : data.name
                                });
                            }
                        });
                    })

<?php
$flash = \Session::get_flash('notification.plugins');
if (!empty($flash)) {
    ?>
                    $.nosNotify(<?= \Format::forge()->to_json($flash); ?>);
    <?php
}
?>
                });
            });
    </script>
</div>
