<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::application');

$one_site = count(Nos\Tools_Context::sites()) === 1;
?>
<script type="text/javascript">
require(
    ['jquery-nos-contextable-invariant-fields'],
    function($) {
        $(function() {
            $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>').nosContextableinvariantFields({
                texts : {
                    popin_title: <?= \Format::forge($one_site ? __('This field is common to all languages') : __('This field is common to all contexts'))->to_json() ?>,
                    popin_content: <?= \Format::forge($one_site ? __('When you modify the value of this field, the change applies to the following languages:') : __('When you modify the value of this field, the change applies to the following contexts:'))->to_json() ?>,
                    popin_ok: <?= \Format::forge(__('Go ahead, I understand'))->to_json() ?>,
                    popin_cancel: <?= \Format::forge(__('Cancel, I won’t modify it'))->to_json() ?>,
                }
            });
        });
    });
</script>
