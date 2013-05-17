/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('jquery-nos-datacatchers',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'jquery-ui.button', 'wijmo.wijaccordion'],
    function($) {
        "use strict";
        var undefined = void(0);
        $.widget( "nos.datacatchers", {
            options: {
                model_id : '',
                model_name : ''
            },

            _create: function() {
                var self = this,
                    o = self.options;

                self.element.addClass('nos-datacatchers ui-widget-content');

                self.uiApplications = self.element.find('.catchers div');
                self.uiCatcherForm = self.element.find('.nos-datacatchers-catecherform');
                self.uiForm = self.element.find('form');
                self.uiSave = self.uiForm.find('.nos-datacatchers-buttons button');
                self.uiClose = self.element.find('.nos-datacatchers-close');
            },

            _init: function() {
                var self = this,
                    o = self.options;

                self.element.find('.accordion').wijaccordion();

                self._applications();

                self.uiForm.nosFormUI();
                self._form(self.uiForm);

                self.uiForm.bind('ajax_success', function(e, json) {
                    self.uiApplications.html(json.applications);
                    self._applications();
                    self.uiCatcherForm.empty();
                });

                self.uiClose.click(function(e) {
                    e.preventDefault();
                    self.element.trigger('close');
                });

                self.element.nosListenEvent({
                        name : o.model_name,
                        id : o.model_id,
                        action : 'update'
                    }, function() {
                        $.ajax({
                            url : 'admin/nos/datacatcher/form',
                            data : {
                                model_name : o.model_name,
                                model_id : o.model_id
                            },
                            success : function(data) {
                                self.element.nosAjaxSuccess(data);
                                self.element.remove();
                            }
                        })
                    });
            },

            _applications : function() {
                var self = this,
                    o = self.options;

                self.uiApplications.find('button.catcher').each(function() {
                    var $button = $(this),
                        params = $button.data('params'),
                        nuggets = $button.data('nuggets');

                    $button.button({
                            label : params.title,
                            icons : {
                                primary: params.iconClasses || 'nos-icon16 nos-icon16-share'
                            }
                        })
                        .click(function(e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (params.action) {
                                $(this).nosAction(params.action, nuggets);
                            } else {
                                $.ajax({
                                    url : params.url,
                                    success : function(data) {
                                        self.uiCatcherForm.empty();
                                        $('<div><h3></h3><div></div></div>')
                                            .appendTo(self.uiCatcherForm)
                                            .find('h3')
                                            .html(params.title)
                                            .end()
                                            .find('div')
                                            .html(data)
                                            .end()
                                            .wijaccordion()
                                            .nosFormUI();

                                        self._form(self.uiCatcherForm);

                                        self.uiCatcherForm.find('.nos-datacatchers-buttons a')
                                            .click(function(e) {
                                                e.preventDefault();
                                                self.uiCatcherForm.empty();
                                            });
                                    }
                                })
                            }
                        });
                    if (params.iconUrl) {
                        $button.find('.ui-button-icon-primary')
                            .removeClass( 'nos-icon16-share' )
                            .addClass( 'nos-icon16' )
                            .css( 'background-image', 'url("' + params.iconUrl + '")' );
                    }
                });

                return self;
            },

            _form : function($container) {
                var self = this,
                    o = self.options;

                $container.find('.nos-datacatchers-nugget-checkbox').each(function() {
                    $(this).change(function() {
                        if ($(this).is(':checked')) {
                            $(this).closest('tr').find('td:eq(0) .ui-widget').each(function() {
                                var data = $(this).attr('disabled', true).data();
                            });
                        } else {
                            $(this).closest('tr').find('td:eq(0) .ui-widget').each(function() {
                                var data = $(this).removeAttr('disabled').data();
                            });
                        }
                    }).triggerHandler('change');
                });

                $container.find('.nos-datacatchers-nugget-image').hover(function() {
                        $(this).addClass('ui-state-hover');
                    }, function() {
                        $(this).removeClass('ui-state-hover');
                    }).click(function() {
                        $(this).find('input').prop('checked', true);
                        $(this).addClass('ui-state-active').siblings().removeClass('ui-state-active');
                    });

                return self;
            }
        });

        return $;
    });
