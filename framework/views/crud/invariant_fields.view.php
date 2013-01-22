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
<script type="text/javascript">
require(
    ['jquery-nos-contextable-invariant-fields'],
    function($) {
        $(function() {
            $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>').nosContextableinvariantFields({
                texts : {
                    popin_title: <?= \Format::forge(__('This field is common to all contexts'))->to_json() ?>,
                    popin_content: <?= \Format::forge(__('When you modify the value of this field, the change applies to the following contexts:'))->to_json() ?>,
                    popin_ok: <?= \Format::forge(__('Go ahead, I understand'))->to_json() ?>,
                    popin_cancel: <?= \Format::forge(__('Cancel, I won’t modify it'))->to_json() ?>,
                }
            });
        });
    });
</script>
