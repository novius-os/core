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

    $model_name = get_class($item);
    $model_id   = $item->id;

    $data_catchers = $item->data_catchers();
    $default_nuggets = $item->get_default_nuggets();
?>
<div id="<?= $id ?>" class="nos-dark-theme line">
    <div class="unit col c4">
    <div class="accordion">
        <h3><?= __('Applications') ?></h3>
        <div>
<?php
    $onDemande = false;
    $auto = false;
    foreach ($data_catchers as $catcher_name => $data_catcher) {
        if (isset($data_catcher['onDemand']) && $data_catcher['onDemand'] && !$onDemande) {
            $onDemande = true;
            echo '<div>', htmlspecialchars(__('This item can be shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customize before share:')) ,'</h4>';
        } elseif ((!isset($data_catcher['onDemand']) || !$data_catcher['onDemand']) && !$auto) {
            echo '<div>', htmlspecialchars(__('This item is automatically shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customize what you share:')) ,'</h4>';
            $auto = true;
        }

        $data_catcher['url'] .= '?'.http_build_query(array(
            'model' => $model_name,
            'id'    => $model_id,
            'catcher' => $catcher_name,
         ), '', '&');

        echo '<button class="catcher" data-params="', htmlspecialchars(\Format::forge($data_catcher)->to_json()) ,'">', htmlspecialchars($data_catcher['title']),'</button>';
    }
?>
        </div>
    </div>
    </div>
    <div class="unit col c8 lastUnit">
    <div class="accordion">
        <h3><?= __('What is shared') ?></h3>
        <div class="nos-datacatchers-default-nuggets">
            <?php
            echo \View::forge('nos::admin/data_catcher/default_nuggets', array(
                'nugget' => $item->get_default_nuggets(),
            ), false);
            ?>
        </div>
    </div>
    </div>

        <?php
        echo \View::forge('nos::admin/data_catcher/form', array(
            'action' => 'admin/nos/datacatcher/save',
            'item' => $item,
            'catcher_name' => \Nos\Model_Content_Nuggets::DEFAULT_CATCHER,
            'nugget' => $item->get_default_nuggets(),
            'nugget_db' => $item->get_catcher_nuggets(\Nos\Model_Content_Nuggets::DEFAULT_CATCHER)->content_data,
        ));
        ?>
</div>
<script type="text/javascript">
require(
    ['jquery-nos-datacatchers'],
    function($) {
        $(function() {
            var $container = $("#<?= $id ?>");
            $container.datacatchers(<?= \Format::forge(array(
                'model_id' => $model_id,
                'model_name' => $model_name,
            ))->to_json() ?>);

            $container.find('.nos-datacatchers-nugget-checkbox').each(function() {
                $(this).change(function() {
                    if ($(this).is(':checked')) {
                        $(this).closest('td').find('.nos-datacatchers-nugget-value').hide();
                    } else {
                        $(this).closest('td').find('.nos-datacatchers-nugget-value').show().nosOnShow();
                    }
                }).triggerHandler('change');
            });

            $container.find('.nos-datacatchers-nugget-image').hover(function() {
                $(this).addClass('ui-state-hover');
            }, function() {
                $(this).removeClass('ui-state-hover');
            }).click(function() {
                $(this).find('input').prop('checked', true).wijradio('refresh');
                $(this).addClass('ui-state-active').siblings().removeClass('ui-state-active');
            });
        });
    });
</script>
