<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$id = $uniqid = uniqid('form_');

?>
<form class="fieldset standalone" id="<?= $id ?>">
<p><?= strtr($crud['i18n']['exists in multiple context'], array( #wtf deconstruction
    '<strong>' => '<strong title="'.implode(', ', $contexts_list).'">',
    '{count}' => count($contexts_list),
)) ?></p>
<?= __('Which one would you like to clone?'); ?>
 <select name="context">
    <option value="all"><?= __('All contexts') ?></option>
<?php
foreach ($contexts_list as $item_context) {
    ?>
    <option value="<?= $item_context->get_context() ?>"><?= \Nos\Tools_Context::contextLabel($item_context->get_context(), array('template' => '{site} - {locale}', 'flag' => false)) ?></option>
    <?php
}
?>
</select>

<p>
    <button type="submit" class="primary ui-state-default"><?= __('Duplicate') ?></button>
    <span><?= __('or') ?></span>
    <a href="#"><?= __('Cancel') ?></a>
</p>
</form>
<script type="text/javascript">
    require(['jquery-nos'],
            function ($) {
                $(function () {
                    var $form = $('#<?= $id ?>').nosFormUI(),
                            $confirmButton = $form.find(':submit'),
                            $cancelButton = $form.find('a:last');

                    $confirmButton.click(function(e) {
                        e.preventDefault();

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
