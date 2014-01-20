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
        .app_manager label.tooltip {
            font-weight: bold;
        }
        .app_manager tr {
            height: 32px;
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
<?php
if (!empty($installed)) {
    ?>
            <table>
                <tbody>
    <?php
}
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
    <?php
    if ($app->canUninstall()) {
        ?>
                            <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'remove'))->to_json()) ?>" onclick="return false;"><button data-icon="arrowthick-1-s"><?= __('Uninstall') ?></button></a>
    <?php
    } else {
        $dependents = $app->installedDependentApplications();
        foreach ($dependents as &$dependent) {
            $dependent = \Nos\Application::forge($dependent)->get_name();
        }
        unset($dependent);
        if (count($dependents) == 1) {
            echo strtr(__('Cannot be uninstalled. Uninstall ‘{{application}}’ first.'), array('{{application}}' => $dependents[0]));
        } else {
            echo  preg_replace(
                '`<a>(.*)</a>`',
                render('noviusos_appmanager::admin/applications_tooltip', array('app_folder' => $app->folder, 'applications' => $dependents), true),
                __('Cannot be uninstalled. Uninstall <a>these applications</a> first.')
            );
        }
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
if (!empty($installed)) {
    ?>
                </tbody>
            </table>
    <?php
} else {
    ?>
            <em><?php echo __('No applications found.') ?>.</em>
    <?php
}
?>
        </div>

        <div class="line app_list_available">
            <h1 class="title"><?= __('Available applications'); ?></h1>
<?php
if (!empty($others)) {
    ?>
            <table>
                <tbody>
    <?php
}
foreach ($others as $app) {
    $metadata = $app->getRealMetadata();
    $can_install = $app->canInstall();
    ?>
                    <tr>
                        <td><?= e($app->get_name_translated()) ?> </td>
                        <td>
    <?php
    if (empty($metadata)) {
        ?>
                            <em><?php echo __('No metadata found') ?>.</em>
        <?php
    } else if ($can_install) {
        ?>
                             <a href="#" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app->folder, 'action' => 'add'))->to_json()) ?>" onclick="return false;"><button data-icon="arrowthick-1-n"><?= __('Install') ?></button></a></td>
        <?php
    } else {
        // @note: we can't get application names here since they don't exist therefore there aren't any metadata
        $unavailable_applications = $app->applicationsRequiredAndUnavailable();
        if (count($unavailable_applications) == 1) {
            echo strtr(__('Cannot be installed. Install ‘{{application}}’ first.'), array('{{application}}' => $unavailable_applications[0]));
        } else {
            echo  preg_replace(
                '`<a>(.*)</a>`',
                render('noviusos_appmanager::admin/applications_tooltip', array('app_folder' => $app->folder, 'applications' => $unavailable_applications), true),
                __('Cannot be installed. Install <a>these applications</a> first.')
            );
        }


    }
    ?>
                    </tr>
    <?php
}
if (!empty($others)) {
    ?>
                </tbody>
            </table>
    <?php
} else {
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

                    $container.nosTabs('update', {
                        label: <?= \Format::forge(__('Applications manager'))->to_json() ?>,
                        url:  'admin/noviusos_appmanager/appmanager',
                        iconUrl: 'static/apps/noviusos_appmanager/img/32/app-manager.png',
                        app: true,
                        iconSize: 32,
                        labelDisplay: false
                    });

<?php
if (\Session::user()->user_expert) {
    ?>

                    var $a = $('<a href="#" data-icon="wrench"><?= htmlspecialchars(__('Refresh all metadata')); ?></a>')
                        .on('click', function(e) {
                            e.preventDefault();
                            $container.nosAjax({
                                url: 'admin/noviusos_appmanager/appmanager/refresh_metadata',
                                complete: function() {
                                    $container.load('admin/noviusos_appmanager/appmanager', function() {
                                        $container.find(':first').unwrap();
                                    });
                                }
                            })
                        });
                    $container.nosToolbar($a);

    <?php
}
?>
                    $container.find(".app_list_available table, .app_list_installed table").wijgrid({
                        scrollMode : "auto",
                        rowStyleFormatter: function(args) {
                            if (args.type == wijmo.grid.rowType.header) {
                                args.$rows.hide();
                            }
                        },
                        rendered: function(args) {
                            $(args.target).closest('.wijmo-wijgrid').find('thead').hide();

                            var $tooltip = $(args.target).find('.tooltip');
                            $tooltip.wijtooltip({
                                showCallout: false,
                                calloutFilled : true,
                                closeBehavior: 'sticky',
                                position : {
                                    my : 'center top',
                                    at : 'center bottom',
                                    offset : '0 0'
                                },
                                triggers : 'click',
                                content : $tooltip.find('div.content').html()
                            });
                        },
                        selectionMode: 'none',
                        highlightCurrentCell: false
                    });
                    $container.nosFormUI();

                    $container.find('a').click(function(e) {
                        e.preventDefault();
                        var $a = $(this),
                            data = $a.data('app');

                        $a.find('button').button('option',
                            {
                                'label': '...',
                                'disabled': true
                            }
                        );

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
