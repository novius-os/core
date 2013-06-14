<table id="<?= $uniqid_context = uniqid('context_') ?>">
    <thead>
        <tr>
            <th></th>
<?php
foreach (\Nos\Tools_Context::locales() as $locale => $locale_params) {
    ?>
        <th>
            <?= $locale_params['title'] ?>
            <br />
            <img src="static/novius-os/admin/novius-os/img/flags/<?= $locale_params['flag'] ?>.png" />
        </th>
    <?php
}
?>
        </tr>
    </thead>
    <tbody>
<?php
foreach (\Nos\Tools_Context::sites() as $site => $site_params) {
    $contexts = \Nos\Tools_Context::contexts();
    ?>
    <tr>
        <th><?= $site_params['title'] ?></th>
    <?php
    foreach (\Nos\Tools_Context::locales() as $locale => $locale_params) {
        ?>
        <td>
        <?php
        $category_key = $site.'::'.$locale;
        if (isset($contexts[$category_key])) {
            ?>
            <input type="checkbox" name="<?= $checkbox_name ?>" value="<?= $category_key ?>" <?= $role->checkPermissionOrEmpty($permission_name, $category_key) ? 'checked' : '' ?> />
            <?php
        }
        ?>
        </td>
        <?php
    }
    ?>
    </tr>
    <?php
}
?>
    </tbody>
</table>
<script type="text/javascript">
require(['jquery-nos', 'wijmo.wijgrid'], function($) {
    var $table = $('#<?= $uniqid_context ?>');
    $table.wijgrid({
        columns: [
            {
                cellFormatter: function(args) {
                    args.$container.text(args.formattedValue)
                        .parent().addClass('wijmo-wijgrid-rowheader ui-widget-content ui-state-default')
                        .removeClass('wijdata-type-string');
                    return true;
                }
            }
        ],
        cellStyleFormatter: function(args) {
            if (args.state & $.wijmo.wijgrid.renderState.selected) {
                args.$cell.removeClass('ui-state-highlight');
            }
            if (args._cellIndex > 0) {
                args.$cell.css('text-align', 'center');
                if (args.row.dataRowIndex === -1) {
                    var data = $table.wijgrid('data');

                    args.$cell.click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        var checked = null;

                        for (var i = 1; i <= data.length; i++) {
                            var $checkbox = $table.find('tr:eq(' + i + ')')
                                .find('td:eq(' + args._cellIndex + ')')
                                .find(':checkbox');

                            if (checked === null) {
                                checked = $checkbox.is(':checked');
                            }
                            $checkbox.prop('checked', !checked);
                        }
                    });

                }
            } else {
                var $tr = args.$cell.parent();
                args.$cell.click(function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    var $checkbox = $tr.find(':checkbox');
                    $checkbox.prop('checked', !$checkbox.is(':checked'));
                });
            }
        }
    });
});
</script>
