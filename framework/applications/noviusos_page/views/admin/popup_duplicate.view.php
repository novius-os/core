<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('noviusos_page::common', 'nos::common');

$id = $uniqid = uniqid('form_');

$item_contexts = $item->find_context('all');
$context_count = count($item_contexts);

$children = array();
$children_context = array();
// Count the number of children in each context
foreach ($item_contexts as $item_context) {
    $children_context[$item_context->get_context()] = 1;
    foreach ($item_context->find_children_recursive(false) as $child) {
        $children[$child->page_context_common_id] = true;
        $children_context[$item_context->get_context()]++;
    }
}
$children_count = count($children);

$context_or_language = count(Nos\Tools_Context::sites()) == 1 ? 'language' : 'context';

if ($children_count > 0 || $context_count > 1) {
    $deletion_summary = array();
    if ($context_count > 1) {
        $deletion_summary[] = 'N '.$context_or_language.'s';
    }
    if ($children_count > 0) {
        $deletion_summary[] = $children_count == 1 ? '1 child' : 'N children';
    }
    $deletion_summary = $crud['i18n']['deleting with '.implode(' and ', $deletion_summary)];

    $deletion_summary = strtr($deletion_summary, array(
        '{{'.$context_or_language.'_count}}' =>  $context_count,
        '{{children_count}}' =>  $children_count,
        '{{title}}' => $item->title_item(),
    ));
    ?>
    <p style="margin: 1em 0;"><?= $deletion_summary ?></p>
    <?php
}
?>
<form class="fieldset standalone" id="<?= $id ?>">
<?php
if ($context_count > 1 || $children_count > 0) {
    $contexts = \Nos\Tools_Context::contexts();
    $contexts_list = array();
    ?>
    <p><label><input type="checkbox" class="include_children" name="include_children" value="1" checked /> <?= __('Duplicate sub-pages'); ?></label></p>
    <div class="single">
        <table>
    <?php
    foreach ($item_contexts as $item_context) {
        $context = $item_context->get_context();
        $count = $children_context[$context];
        ?>
        <tr>
            <td><?= Nos\Tools_Context::contextLabel($item_context->get_context()) ?></td>
            <td><?= strtr($crud['i18n']['1 item'], array('{{count}}' => $count)) ?></td>
            <td><input type="checkbox" name="contexts_single[]" data-count="<?= 1 ?>" value="<?= $context ?>" checked /></td>
        </tr>
        <?php
    }
    ?>
        </table>
    </div>
    <div class="multi">
    <table>
    <?php
    foreach ($item_contexts as $item_context) {
        $context = $item_context->get_context();
        $count = $children_context[$context];
        ?>
        <tr>
            <td><?= Nos\Tools_Context::contextLabel($item_context->get_context()) ?></td>
            <td><?= strtr($crud['i18n'][$count == 1 ? '1 item' : 'N items'], array('{{count}}' => $count)) ?></td>
            <td><input type="checkbox" name="contexts_multi[]" data-count="<?= $children_context[$context] ?>" value="<?= $context ?>" checked /></td>
        </tr>
        <?php
    }
    ?>
    </table>
    </div>
    <?php
}
?>

    <p style="margin: 1em 0;">
    <button type="submit" class="ui-priority-primary ui-state-default" data-texts="<?= htmlspecialchars(\Format::forge()->to_json(array(
                    '0' => __('Nothing to duplicate'),
                    '1' => __('Duplicate this page'),
                    '+' => __('Duplicate these {{count}} pages'),
                ))) ?>"><?= __('Duplicate') ?></button>
    <span><?= __('or') ?></span>
    <a href="#"><?= __('Cancel') ?></a>
</p>
</form>
<script type="text/javascript">
    require(['jquery-nos'],
            function ($) {
                $(function () {
                    var $form = $('#<?= $id ?>'),
                        $tables = $form.find('table'),
                        $checkboxes,
                        $confirmButton = $form.find(':submit'),
                        $cancelButton = $form.find('a:last');


                    $tables.wijgrid({
                        selectionMode: 'none',
                        highlightCurrentCell: false,
                        columns: [
                            {},
                            {},
                            {
                                cellFormatter: function(args) {
                                    if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                        args.$container.css({
                                            textAlign: 'center'
                                        });
                                    }
                                }
                            }
                        ],
                        rendered: function(args) {
                            $(args.target).closest('.wijmo-wijgrid').find('thead').hide();
                        }
                    });
                    $form.nosFormUI();

                    $checkboxes = $tables.find(':checkbox');
                    $checkboxes.change(function() {
                        var sum = 0;
                        $checkboxes.filter(':checked').filter(':visible').each(function() {
                            sum += +$(this).data('count');
                        });
                        $confirmButton[sum == 0 ? 'addClass' : 'removeClass']('ui-state-disabled');
                        $confirmButton.find('.ui-button-text').text(
                                $.nosDataReplace($confirmButton.data('texts')[(sum > 1 ? '+' : sum).toString()], {
                                    'count': sum.toString()
                                })
                        );
                        $(this).removeClass('ui-state-focus');
                    });

                    $form.find('.include_children').change(function() {
                        var checked = $(this).is(':checked');
                        if (checked) {
                            $form.find('.single').hide();
                            $form.find('.multi').show();
                        } else {
                            $form.find('.multi').hide();
                            $form.find('.single').show();
                        }

                        $checkboxes.first().triggerHandler('change')

                    }).triggerHandler('change');


                    $tables.find('tr').css({cursor: 'pointer'}).click(function(e) {
                        if (!$(e.target).is(':checkbox')) {
                            $(this).find(':checkbox').click();
                        }
                    });


                    $confirmButton.click(function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('ui-state-disabled')) {
                            return;
                        }

                        $form.nosAjax({
                            url : <?= \Format::forge($action)->to_json() ?>,
                            method : 'POST',
                            data : $form.serialize()
                        });
                        $form.nosDialog('close');

                    });

                    $cancelButton.click(function(e) {
                        e.preventDefault();
                        $form.nosDialog('close');
                    });
                });
            });
</script>
