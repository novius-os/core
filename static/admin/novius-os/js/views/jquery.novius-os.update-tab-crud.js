/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-update-tab-crud',
    ['jquery-nos-ostabs'],
    function($) {
        "use strict";

        $.fn.extend({
            nosUpdateTabCrud : function(params) {
                params = params || {
                    tabParams: {},
                    isNew: false,
                    model: '',
                    itemId: 0,
                    closeEle: '#',
                    texts: {
                        titleClose: 'Bye bye'
                    }
                };
                return this.each(function() {
                    var $container = $(this).nosTabs('update', params.tabParams);
                    if (!params.isNew) {
                        $container.nosListenEvent({
                            name: params.model,
                            action: 'delete',
                            id: params.itemId
                        }, function() {
                            var $close = $(params.closeEle);
                            $close.find('button.ui-priority-primary').click(function() {
                                $(this).nosTabs('close');
                            });
                            $close.show().nosFormUI();
                            $container.nosDialog({
                                title: params.texts.titleClose,
                                content: $close,
                                width: 300,
                                height: 130,
                                close: function() {
                                    $container.nosTabs('close');
                                }
                            });
                        });
                    }
                });
            }
        });

        return $;
    });
