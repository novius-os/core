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
    require(['jquery-nos'],
        function ($) {
            $(function () {
                var actions = <?= \Format::forge($actions)->to_json(); ?>,
                    $container = $('#<?= $container_id ?>').nosToolbar('create');

                $container.nosToolbar('add', <?= \Format::forge((string) \View::forge('form/layout_save', array(
                        'save_field' => $fieldset->field('save')
                    ), false))->to_json() ?>)
                    .click(function() {
                        if ($container.is('form')) {
                            $container.submit();
                        } else {
                            $container.find('form:visible').submit();
                        }
                    });

                $.each(actions, function() {
                    var button = this,
                        $button = $('<button></button>').click(function() {
                                $(this).nosAction(button.action);
                            })
                            .text(button.label)
                            .data(button);

                    $container.nosToolbar('add', $button, true);
                });
            });
        });
</script>
