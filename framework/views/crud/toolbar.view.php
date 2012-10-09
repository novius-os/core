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
                var actions = <?= \Format::forge($crud['actions'])->to_json(); ?>,
                    $container = $('#<?= isset($container_id) ? $container_id : $fieldset->form()->get_attribute('id') ?>'),
                    $toolbar = $container.nosToolbar('create'),
                    $buttons = [],
                    is_new = <?= \Format::forge($crud['is_new'])->to_json(); ?>,
                    addButtons = function(actions) {
                        $.each(actions, function() {
                            var element = this,
                                openShare = false,
                                $element;

                            if (element.action && element.action.action === 'share') {
                                var action = $.extend(true, {}, element.action);
                                delete element.action;
                                element.bind = element.bind || {};
                                element.bind.click = function() {
                                    var $share = $toolbar.nextAll('.nos-datacatchers');

                                    $element.hover(function() {
                                        if (openShare) {
                                            $element.addClass('ui-state-active');
                                        }
                                    });
                                    var open_close = function(state) {
                                        $share[state ? 'show' : 'hide']();
                                        $toolbar.find('.ui-button').not($element).each(function() {
                                            $(this).button(state ? 'disable' : 'enable');
                                        });

                                        $element.blur()[state ? 'addClass' : 'removeClass']('ui-state-active');
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
                                            data : action.data,
                                            success : function(data) {
                                                $share = $(data).insertAfter($container)
                                                        .bind('close', function() {
                                                            open_close(false);
                                                        })
                                                        .addClass('fill-parent nos-fixed-content')
                                                        .css({
                                                            top : $container.css('top'),
                                                            bottom : $container.css('bottom')
                                                        });
                                                open_close(true);
                                            }
                                        });
                                    }
                                }
                            }

                            $element = $container.nosToolbar('add', $.nosUIElement(element), true)
                                    .nosOnShow('show');

                            $buttons.push($element);
                        });
                    };

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

                if (!is_new) {
                    $container.nosListenEvent({
                            name: <?= \Format::forge($crud['model'])->to_json(); ?>
                        }, function(event) {
                            if ($.inArray(<?= \Format::forge($item->{$crud['pk']})->to_json(); ?>, event.id) !== -1 && event.action === 'delete') {
                                return false;
                            }
                            $container.nosAjax({
                                url: <?= \Format::forge($crud['url_actions'])->to_json(); ?>,
                                type: 'GET',
                                data: <?= \Format::forge($crud['behaviours']['contextable'] ? array(
                                    'common_id' => $item->{$crud['behaviours']['contextable']['common_id_property']},
                                    'context' => $crud['context'],
                                ) : '')->to_json(); ?>,
                                success: function(json) {
                                    $.each($buttons, function() {
                                        $(this).remove();
                                    });
                                    $buttons = [];
                                    addButtons(json);
                                }
                            });
                        });
                }

                addButtons(actions);
            });
        });
</script>
