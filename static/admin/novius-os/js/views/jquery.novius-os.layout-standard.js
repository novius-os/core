/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-layout-standard',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosLayoutStandard : function(params) {
                params = params || {
                    tabParams: {}
                };
                return this.each(function() {
                    var $container = $(this),
                        $dispatcher = $container.closest('.nos-dispatcher').on('showPanel', function() {
                            $container.nosOnShow();
                            $dispatcher.wijTriggerVisibility();
                        }),
                        id = $container.attr('id'),
                        $contextButton = $container.find('.change-context')
                            .attr('id', id + 'context')
                            .data({
                                icons: {
                                    secondary: 'triangle-1-s'
                                }
                            });

                    if (params.tabParams) {
                        $contextButton.next()
                            .wijmenu({
                                orientation: 'vertical',
                                animation: {
                                    animated:"slide",
                                    option: {
                                        direction: "up"
                                    },
                                    duration: 50,
                                    easing: null
                                },
                                hideAnimation: {
                                    animated:"slide",
                                    option: {
                                        direction: "up"
                                    },
                                    duration: 0,
                                    easing: null
                                },
                                direction: 'rtl',
                                triggerEvent: "click",
                                trigger: '#' + id + 'context',
                                shown: function (event, item) {
                                    var $contextMenu = $(item.element);
                                    $contextMenu.parent()
                                        .css({
                                            maxHeight: '200px',
                                            width: $contextMenu.outerWidth(true) + 20,
                                            overflowY: 'auto',
                                            overflowX: 'hidden'
                                        })
                                },
                                select: function(e, data) {
                                    var $li = $(data.item.element),
                                        context = $li.data('context'),
                                        tabParams = params.tabParams;

                                    if (context) {
                                        tabParams.url = tabParams.url.replace(/context=([^&]+)/g, 'context=' + encodeURIComponent(context.code));

                                        $container.closest('form').find('.input-context').val(context.code);
                                        $contextButton.button('option', 'label', context.label);
                                        $li.nosTabs('update', tabParams);

                                        $container.closest('.nos-dispatcher, body').data('nosContext', context.code).trigger('contextChange');
                                    }
                                }
                            });
                    }

                    log('init');
                    $container.nosOnShow('one', function() {
                        log('$container.nosFormUI()');
                            $container.nosFormUI();
                        })
                        .nosOnShow();

                });
            }
        });

        return $;
    });
