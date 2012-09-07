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
        <div class="accordion catchers">
            <h3><?= __('Applications') ?></h3>
            <div>
    <?php
                echo \View::forge('nos::admin/data_catcher/applications', array(
                    'data_catchers' => $data_catchers,
                    'item' => $item,
                    'model_id' => $model_id,
                    'model_name' => $model_name,
                    'nuggets' => $default_nuggets,
                ), false);
    ?>
            </div>
        </div>
    </div>
    <div class="unit col c8 lastUnit">
        <div class="nos-datacatchers-default-nuggets accordion">
            <h3><?= __('What is shared - Default settings') ?></h3>
            <div>
                <?php
                echo \View::forge('nos::admin/data_catcher/form', array(
                    'action' => 'admin/nos/datacatcher/save',
                    'item' => $item,
                    'catcher_name' => \Nos\Model_Content_Nuggets::DEFAULT_CATCHER,
                    'nugget' => $default_nuggets,
                    'nugget_db' => $item->get_catcher_nuggets(\Nos\Model_Content_Nuggets::DEFAULT_CATCHER)->content_data,
                ));
                ?>
            </div>
        </div>
        <div class="nos-datacatchers-catecherform">
        </div>
    </div>
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
        });
    });
</script>
