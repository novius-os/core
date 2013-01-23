<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('noviusos_appmanager::common');

?>

<div class="page line ui-widget app_manager" id="<?= $uniqid = uniqid('id_'); ?>">

    <style type="text/css">
        .app_manager p {
            margin: 0.5em 0 0;
        }
        .app_manager .line {
            margin: 1em 0 2em;
        }
        .app_manager h1 {
            margin-bottom: 0.5em;
        }
        .app_manager .app_list_available {
            width : 600px;
        }
    </style>

    <div class="col c1"></div>
    <div class="col c10" style="position:relative;">
        <div class="line native_apps">
            <h1 class="title"><?= __('Native applications'); ?></h1>
            <p>
<?php
if (\Nos\Application::areNativeApplicationsDirty()) {
    echo __('It appears you’ve made some recent changes.').' <a href="#" data-app="'.htmlspecialchars(\Format::forge(array('name' => 'nos', 'action' => 'add'))->to_json()).'" onclick="return false;"><button data-icon="wrench">'.__('Apply changes').'</button></a>';
} else {
    echo __('All applications up-to-date.');
}
?>
            </p>
        </div>

        <div class="line app_list_installed">
            <h1 class="title"><?= __('Installed applications'); ?></h1>
            <table>
                <tbody>
<?php
foreach ($installed as $app) {
    $metadata = $app->metadata;
    ?>
                    <tr>
                        <td>&nbsp;<img src="<?= isset($metadata['icons'][16]) ? $metadata['icons'][16] : 'static/novius-os/admin/novius-os/img/16/application.png' ?>" style="vertical-align:top;" alt="" title="" /> <?= e(Nos\Config_Data::get('app_installed.'.$app->folder.'.name', $app->name)); ?></td>
                        <td>
    <?php
    if ($app->is_dirty()) {
        ?>
        <?= __('Some recent changes') ?>
        <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'add'))->to_json()) ?>" onclick="return false;"><button data-icon="wrench"><?= __('Apply changes') ?></button></a>
        <?php
    } else {
        echo __('Up-to-date');
    }
    ?>
                        </td>
                        <td>
                            <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'remove'))->to_json()) ?>" onclick="return false;"><button data-icon="arrowthick-1-s"><?= __('Uninstall') ?></button></a>
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
            <em><?php echo __('No applications found.') ?>.</em>
    <?php
}
?>
        </div>

        <div class="line app_list_available">
            <h1 class="title"><?= __('Available applications'); ?></h1>
            <table>
                <tbody>
<?php
foreach ($others as $app) {
    $metadata = $app->getRealMetadata();
    ?>
                    <tr>
                        <td><?= e($app->get_name_translated()) ?> </td>
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
            <em><?= __('No applications found.') ?></em>
    <?php
}
?>

        </div>

        <div class="line" style="overflow:visible;">
            <h1 class="title"><?= __('Website configuration'); ?></h1>
            <p>
<?php
if ($local->is_dirty()) {
    echo __('It appears you’ve made some recent changes.').' <a href="#" data-app="'.htmlspecialchars(\Format::forge(array('name' => 'local', 'action' => 'add'))->to_json()).'" onclick="return false;"><button data-icon="wrench">'.__('Apply changes').'</button></a>';
} else {
    echo __('The website’s configuration is up-to-date.');
}
?>
            </p>
        </div>
    </div>
    <div class="col c1"></div>

    <script type="text/javascript">
        require(
            ['jquery-nos', 'wijmo.wijgrid'],
            function ($) {
                $(function() {
                    var $container = $('#<?= $uniqid ?>');
                    $container.nosFormUI();

                    $container.nosTabs('update', {
                        label: <?= \Format::forge(__('Applications manager'))->to_json() ?>,
                        url:  'admin/noviusos_appmanager/appmanager',
                        iconUrl: 'static/apps/noviusos_appmanager/img/32/app-manager.png',
                        app: true,
                        iconSize: 32,
                        labelDisplay: false
                    })

                    $(".app_list_installed table").wijgrid({
                        rendered: function(args) {
                            $(args.target).closest('.wijmo-wijgrid').find('thead').hide();
                        },
                        selectionMode: 'none',
                        highlightCurrentCell: false
                    });

                    $(".app_list_available table").wijgrid({
                        rendered: function(args) {
                            $(args.target).closest('.wijmo-wijgrid').find('thead').hide();
                        },
                        selectionMode: 'none',
                        highlightCurrentCell: false
                    });

                    $container.find('a').click(function(e) {
                        e.preventDefault();
                        var data = $(this).data('app');

                        $container.nosAjax({
                            url: 'admin/noviusos_appmanager/appmanager/' + data.action + '/' + data.name,
                            complete: function() {
                                $container.load('admin/noviusos_appmanager/appmanager', function() {
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
