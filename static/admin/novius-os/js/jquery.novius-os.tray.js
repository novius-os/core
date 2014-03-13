/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-tray',
    ['jquery-nos'],
    function($) {
        "use strict";

        $.fn.extend({
            nosTray : function(params) {
                var buttons,
                    document = window.document,
                    fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
                params = params || {
                    buttons : {}
                };
                buttons = params.buttons;
                if (buttons.fullscreen) {
                    if (fullscreenEnabled) {
                        buttons.fullscreen.bind = {
                            click: function() {
                                var element = document.documentElement;

                                if (document.fullscreen || document.mozFullScreen || document.webkitFullscreen) {
                                    if(document.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if(document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if(document.webkitExitFullscreen) {
                                        document.webkitExitFullscreen();
                                    }
                                } else {
                                    if(element.requestFullscreen) {
                                        element.requestFullscreen();
                                    } else if(element.mozRequestFullScreen) {
                                        element.mozRequestFullScreen();
                                    } else if(element.webkitRequestFullscreen) {
                                        element.webkitRequestFullscreen();
                                    } else if(element.msRequestFullscreen) {
                                        element.msRequestFullscreen();
                                    }
                                }
                            }
                        };
                    } else {
                        delete buttons.fullscreen;
                    }
                }
                return this.each(function() {
                    var $div = $('<div></div>').appendTo(this);

                    $.each(buttons, function() {
                        $.nosUIElement(this).appendTo($div);
                    });

                    $div.nosFormUI().buttonset().nosOnShow();
                    $div.find('.wijmo-wijmenu').appendTo('body');
                });
            }
        });

        return $;
    });
