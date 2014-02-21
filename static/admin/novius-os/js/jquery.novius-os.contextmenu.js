/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-contextmenu',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'wijmo.wijmenu', 'modernizr'],
    function($) {
        "use strict";
        var touchDevice = Modernizr.touch;


        $.widget("nos.noscontextmenu", $.wijmo.wijmenu, {
            options: {
                triggerEvent: 'rtclick',
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
                }
            },

            _create: function() {
                var self = this,
                    o = self.options;

                self._super();

                if (o.trigger !== '' && o.triggerEvent === 'rtclick' && touchDevice) {
                    require(['jquery.taphold'], function() {
                        var triggerEle = self._getTriggerEle();
                        if(triggerEle.length > 0) {
                            triggerEle.on('taphold', function(e) {
                                $(this).trigger('contextmenu');
                            });
                        }
                    });
                }
            },

            _destroy: function() {
                var self = this,
                    o = self.options;

                if (o.trigger !== '' && o.triggerEvent === 'rtclick' && touchDevice) {
                    self._getTriggerEle().off('taphold');
                }

                self._super();
            }
        });
        return $;
    });
