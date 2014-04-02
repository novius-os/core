<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_menu::common', 'nos::common'));

?>
<div id="<?= $uniqid = uniqid('id_') ?>">
    <?=
    $item->driver()->form(array(
        'context' => $context
    )); ?>
</div>
<script type="text/javascript">
    require(
        ['jquery-nos'],
        function ($) {
            $(function () {
                var $container = $('#<?= $uniqid ?>');
                var $form = $container.find('form:first');

                $container.nosFormUI();

                // Store original data
                var original_data = $form.serializeArray();

                // Form cancel
                $form.find('[data-id="close"]').on('click', function (e) {
                    e.preventDefault();
                    $form.nosDialog('close');
                });

                // Form submit
                $form.on('submit', function (e) {
                    e.preventDefault();

                    // Get form data (only modified values)
                    var data = {
                        mitem_id: <?= \Format::forge($item_id)->to_json() ?>,
                        mitem_driver: <?= \Format::forge($item->mitem_driver)->to_json() ?>
                    };
                    $.each($form.serializeArray(), function (key, element) {
                        var modified = true;
                        $.each(original_data, function (key, original_element) {
                            if (element.name == original_element.name
                                && element.value == original_element.value) {
                                // Same value, not modified
                                modified = false;
                                return false;
                            }
                        });
                        if (modified) {
                            data[element.name] = element.value;
                        }
                    });

                    // Update item
                    $('#<?= $menu_form_id ?>').each(function () {
                        $(this).trigger('update_item', data);
                    });

                    $form.nosDialog('close');
                    return false;
                });
            });
        }
    );

</script>
