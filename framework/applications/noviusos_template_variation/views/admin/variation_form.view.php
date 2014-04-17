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
    require(['jquery-nos'], function ($) {
        $(function () {
            var $form = $('#<?= $fieldset->form()->get_attribute('id') ?>'),
                $tpvar_template = $form.find('select[name=tpvar_template]');

            $tpvar_template.change(function() {
                var action = $form.attr('action'),
                    $panel = $form.parent('.nos-ostabs-panel-content');

                $form.ajaxSubmit({
                    url: action.replace('insert_update', 'form_template'),
                    target: $panel
                });

            });
        });
    });
</script>
