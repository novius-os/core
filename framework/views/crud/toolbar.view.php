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
                    $container = $('#<?= $container_id ?>'),
                    $toolbar = $container.nosToolbar('create');

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
                        openShare = false;
                        $button = $('<button></button>').click(function() {
                                var $button = $(this),
                                    $share = $toolbar.nextAll('.nos-datacatchers');
                                if (button.action.action === 'share') {
                                    $button.hover(function() {
                                        if (openShare) {
                                            $button.addClass('ui-state-active');
                                        }
                                    });
                                    var open_close = function(state) {
                                        $share[state ? 'show' : 'hide']();
                                        $toolbar.find('.ui-button').not($button).each(function() {
                                            $(this).button(state ? 'disable' : 'enable');
                                        });

                                        $button.blur()[state ? 'addClass' : 'removeClass']('ui-state-active');
                                        openShare = state;

                                    };

                                    if ($share.size()) {
                                        if ($share !== 'load') {
                                            open_close(!openShare);
                                        }
                                    } else {
                                        $share = 'load';
                                        $.ajax({
                                            url : 'admin/nos/datacatcher/form',
                                            data : button.action.data,
                                            success : function(data) {
                                                $share = $(data).insertAfter($container)
                                                    .addClass('fill-parent nos-fixed-content')
                                                    .css({
                                                        top : $container.css('top'),
                                                        bottom : $container.css('bottom')
                                                    });
                                                open_close(true);
                                            }
                                        });
                                    }
                                } else {
                                    $button.nosAction(button.action);
                                }
                            })
                            .text(button.label)
                            .data(button);

                    $container.nosToolbar('add', $button, true);
                });
            });
        });
</script>
