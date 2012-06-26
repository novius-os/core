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

    $fieldset = \Fieldset::forge();
    $fieldset->add('model_id', '', array('value' => $model_id, 'type' => 'hidden'));
    $fieldset->add('model_name', '', array('value' => $model_name, 'type' => 'hidden'));
    $fields = array();
    if (isset($default_nuggets[\Nos\Orm_Behaviour_Sharable::TYPE_TITLE])) {
        $fields[] = \Nos\Orm_Behaviour_Sharable::TYPE_TITLE;
        $fieldset->add(\Nos\Orm_Behaviour_Sharable::TYPE_TITLE, __('Name:'), array('value' => $default_nuggets[\Nos\Orm_Behaviour_Sharable::TYPE_TITLE]));
    }
?>
<div id="<?= $id ?>" class="nos-dark-theme">
    <h2><?= __('Share') ?></h2>
    <div class="accordion">
        <h3><?= __('Catchers') ?></h3>
        <div>
<?
    $onDemande = false;
    $auto = false;
    foreach ($data_catchers as $data_catcher) {
        if (isset($data_catcher['onDemand']) && $data_catcher['onDemand'] && !$onDemande) {
            $onDemande = true;
            echo '<div>', htmlspecialchars(__('This item can be shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customize before share:')) ,'</h4>';
        } elseif ((!isset($data_catcher['onDemand']) || !$data_catcher['onDemand']) && !$auto) {
            echo '<div>', htmlspecialchars(__('This item is automatically shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customize what you share:')) ,'</h4>';
            $auto = true;
        }

        echo '<button class="catcher" data-params="', htmlspecialchars(\Format::forge($data_catcher)->to_json()) ,'">', htmlspecialchars($data_catcher['title']),'</button>';
    }
?>
        </div>
        <h3><?= __('What will be shared') ?></h3>
        <div class="nos-datacatchers-default-nuggets"><?= $default_nuggets_view ?></div>
    </div>
<?
    echo $fieldset->open('admin/nos/catcher/save');
    echo $fieldset->build_hidden_fields();
    echo \View::forge('form/fields', array(
        'fieldset' => $fieldset,
        'fields' => $fields,
    ), false);
?>
    <div class="nos-datacatchers-buttons">
        <button type="submit" data-icon="check" class="primary">
            <?= __('Save') ?>
        </button>
        &nbsp; <?= __('or') ?> &nbsp;
        <a href="#" onclick="return false;">
            <?= __('Cancel') ?>
        </a>
    </div>
<?= $fieldset->close() ?>
</div>
<script type="text/javascript">
require(['jquery-nos-datacatchers'], function($nos) {
    $nos(function() {
        $nos("#<?= $id ?>").datacatchers();
    });
});
</script>