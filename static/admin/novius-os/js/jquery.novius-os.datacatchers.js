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

                self.uiHeader = self.element.find('> h2')
                    .addClass('nos-datacatchers-header ui-widget-header ui-corner-right');
                self.uiHeaderTitle = self.uiHeader.wrapInner('<div />')
                    .find('> div')
                    .addClass('nos-datacatchers-header-title');
                self.uiHeaderIcon = $('<div></div>').addClass('nos-datacatchers-header-icon')
                    .appendTo(self.uiHeader);

                self.uiAccordion = self.element.find('.accordion')
                    .addClass('nos-datacatchers-accordion');

                self.uiDefaultNuggets = self.element.find('.nos-datacatchers-default-nuggets');

                self.uiForm = self.element.find('form');
                self.uiSave = self.uiForm.find('.nos-datacatchers-buttons button');
                self.uiCancel = self.uiForm.find('.nos-datacatchers-buttons a');
            },

            _init: function() {
                var self = this,
                    o = self.options;

                self.uiHeaderIcon.click(function() {
                    self.element.removeClass('nos-datacatchers-form');
                    self.element.toggleClass('nos-datacatchers-open');
                });

                self.uiAccordion.wijaccordion();

                self.uiAccordion.find('button.catcher').each(function() {
                    var $button = $(this),
                        params = $button.data('params');

                    $button.button({
                            label : params.title,
                            icons : {
                                primary: params.iconClasses || 'nos-icon16 nos-icon16-share'
                            }
                        })
                        .click(function() {
                            var current = $($button).nosTabs('current');
                            $($button).nosTabs('add', {
                                iconClasses: params.iconClasses || null,
                                iconUrl: params.iconUrl || null,
                                url : params.url,
                                label : current.tab.data('ui-ostab').label
                            }, current.index);
                        });
                    if (params.iconUrl) {
                        $button.find('.ui-button-icon-primary')
                            .removeClass( 'nos-icon16-share' )
                            .addClass( 'nos-icon16' )
                            .css( 'background-image', 'url("' + params.iconUrl + '")' );
                    }
                });

                $(self.uiForm).nosFormUI();

                self._defaultNuggets();

                self.uiForm.bind('ajax_success', function(e, json) {
                    self.uiDefaultNuggets.html(json.default_nuggets);
                    self._defaultNuggets();
                    self.uiCancel.triggerHandler('click');
                });

                self.uiCancel.click(function(e) {
                        e.preventDefault();
                        self.element.removeClass('nos-datacatchers-form');
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
                                self.element.replaceWith(data);

                            }
                        })
                    });
            },

            _defaultNuggets : function() {
                var self = this,
                    o = self.options;

                self.uiDefaultNuggets.find('button')
                    .button()
                    .click(function() {
                        self.element.addClass('nos-datacatchers-form');
                        $(self.uiForm).nosOnShow('show');
                    });

                return self;
            }
        });

        return $;
    });
