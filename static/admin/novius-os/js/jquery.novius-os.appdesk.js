/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('jquery-nos-appdesk',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'jquery-nos-thumbnailsgrid', 'jquery-nos-listgrid', 'jquery-nos-treegrid', 'jquery-nos-preview', 'jquery-ui.button', 'wijmo.wijtabs', 'wijmo.wijsuperpanel', 'wijmo.wijsplitter', 'wijmo.wijgrid', 'wijmo.wijmenu'],
    function($) {
        "use strict";
        var undefined = void(0),

            wijhttpproxy_extended = function (options) {
                wijhttpproxy.call(this, options);
            };

        wijhttpproxy_extended.prototype = $.extend({}, wijhttpproxy.prototype, {
            request: function (datasource, callBack, userData) {
                if (this._appdeskxhr) {
                    this._appdeskxhr.abort();
                }
                this._appdeskxhr = wijhttpproxy.prototype.request.call(this, datasource, callBack, userData);
                return this._appdeskxhr;
            }
        });

        $.widget( "nos.appdesk", {
            options: {
                buttons : [],
                inspectors : [],
                thumbnails : false,
                defaultView : 'grid',
                locales : {},
                sites : {},
                culture: $.nosLang.substr(0, 2),
                contexts : {},
                hideContexts : false,
                texts : {
                    allSites : 'All sites',
                    allLanguages : 'All languages',
                    allContexts : 'All contexts',
                    settings : 'Settings',
                    item : 'item',
                    items : 'items',
                    //gridTitle: 'Items', // Don't set it here, will use texts.items as default value
                    showNbItems : [
                        'Showing 1 item out of {{y}}',
                        'Showing {{x}} items out of {{y}}'
                    ],
                    showNoItem : 'No items',
                    showNbTotal : '({{nb}} in total)',
                    NItems : [
                        '1 item',
                        '{{count}} items'
                    ],
                    showAll : 'Show all items',
                    viewGrid : 'List',
                    viewTreeGrid : 'Tree',
                    viewThumbnails : 'Thumbnails',
                    selectSites : 'Select the site(s) to show',
                    selectLanguages : 'Select the language(s) to show',
                    selectContexts : 'Select the context(s) to show',
                    workInContext : 'Show {{context}}',
                    otherSites : 'Other sites',
                    otherLanguages : 'Other languages',
                    otherContexts : 'Other contexts',
                    contextsPopinOk : 'OK',
                    loading : 'Loading...',
                    search: 'Search'
                },
                values: {},
                //callbabks
                slidersChange : null,
                splitters: {
                    vertical: null,
                    horizontal: null
                },
                views: {},
                selectedView: null,
                selectedContexts : [],
                fromView: null,
                name: null,
                grid: {}
            },

            pageIndex : 0,
            showFilter : false,
            gridRendered : false,
            nosContext : false,
            resizing : true,
            init : false,
            itemSelected : null,
            variantColumnsProperties: {'visible': true, 'width': true, 'showFilter': true},
            variantInspectorsProperties: {'hide': true, 'vertical': true},
            hasInspectorHideOnMultiContext: false,

            _create: function() {
                var self = this,
                    o = self.options;

                self.element.addClass('nos-appdesk');

                self.dispatcher = self.element.closest('.nos-dispatcher');
                if (!self.dispatcher.size()) {
                    self.dispatcher = self.element;
                }

                self.element.nosToolbar('create');

                self._createLayout();
            },

            _createLayout: function() {
                var self = this,
                    o = self.options;

                self.uiSplitterVertical = $('<div></div>').addClass('nos-appdesk-splitter-v')
                    .appendTo(self.element);
                self.uiSplitterVerticalLeft = $('<div></div>').appendTo(self.uiSplitterVertical);
                self.uiInspectorsVertical = $('<ul></ul>').addClass('nos-appdesk-inspectors nos-appdesk-inspectors-v')
                    .appendTo(self.uiSplitterVerticalLeft);
                self.uiSplitterVerticalRight = $('<div></div>').addClass('nos-appdesk-vpanel-left')
                    .appendTo(self.uiSplitterVertical);

                self.uiSplitterHorizontal = $('<div></div>').appendTo(self.uiSplitterVerticalRight);
                self.uiSplitterHorizontalTop = $('<div></div>').appendTo(self.uiSplitterHorizontal);
                self.uiInspectorsHorizontal = $('<ul></ul>').addClass('nos-appdesk-inspectors nos-appdesk-inspectors-h')
                    .appendTo(self.uiSplitterHorizontalTop);
                self.uiSplitterHorizontalBottom = $('<div></div>').addClass('nos-appdesk-hpanel-bottom')
                    .appendTo(self.uiSplitterHorizontal);

                self.uiSearchBar = $('<div><form><div></div></form></div>')
                    .addClass('nos-appdesk-searchbar-container wijmo-wijgrid ui-widget ui-widget-header ui-state-default')
                    .appendTo(self.uiSplitterHorizontalBottom)
                    .find('form')
                    .addClass('wijmo-wijgrid-headerrow wijmo-wijgrid-innercell')
                    .find('div')
                    .addClass('nos-appdesk-searchbar wijmo-wijgrid-headertext');

                self.uiNbResult = $('<div></div>').addClass('nos-appdesk-nbresult')
                    .appendTo(self.uiSearchBar);
                self.uiInputContainer = $('<div></div>').addClass('nos-appdesk-input-container ui-widget-content ui-corner-all')
                    .appendTo(self.uiSearchBar);
                self.uiViewsButtons = $('<div></div>').addClass('nos-appdesk-views-button')
                    .appendTo(self.uiSearchBar);

                self.uiSearchIcon = $('<div></div>').addClass('nos-appdesk-search-icon ui-icon ui-icon-search')
                    .appendTo(self.uiInputContainer);
                self.uiSearchInput = $('<input type="search" name="search" placeholder="' + o.texts['search'] + '" value="" />')
                    .addClass('nos-appdesk-search-input ui-helper-reset')
                    .appendTo(self.uiInputContainer);
                self.uiInspectorsTags = $('<div></div>').addClass('nos-appdesk-inspectorstags')
                    .appendTo(self.uiInputContainer);
                self.uiResetSearch = $('<a href="#"></a>').html(o.texts.showAll)
                    .attr('title', o.texts.showAll)
                    .addClass('nos-appdesk-reset-search')
                    .appendTo(self.uiInputContainer);
                self.uiuiResetSearchIcon = $('<span></span>').html(o.texts.showAll)
                    .addClass('ui-icon')
                    .appendTo(self.uiResetSearch);

                self.uiGridTitle = $('<div></div>').addClass('nos-appdesk-title')
                    .appendTo(self.uiSearchBar);

                self.uiPaginationLabel = $('<span></span>').addClass('nos-appdesk-pagination');

                self.uiGrid = $('<table></table>').appendTo(self.uiSplitterHorizontalBottom);

                self.uiTreeGrid = $('<table></table>').appendTo(self.uiSplitterHorizontalBottom);

                self.uiThumbnail = $('<div></div>').appendTo(self.uiSplitterHorizontalBottom);

                return self;
            },

            _init: function() {
                var self = this,
                    o = self.options;

                if (!$.isPlainObject(o.thumbnails)) {
                    o.thumbnails = false;
                } else {
                    o.thumbnails = $.extend({
                        thumbnailSize : 128
                    }, o.thumbnails);
                }

                if (!o.texts.gridTitle) {
                    o.texts.gridTitle = o.texts.items;
                }

                self.nosContext = $.nosContext({
                    locales: o.locales,
                    sites: o.sites,
                    contexts: o.contexts
                });

                if (!$.isEmptyObject(o.contexts)) {

                    if (!$.isArray(o.selectedContexts)) {
                        o.selectedContexts = $.type(o.selectedContexts) === 'string' ? [o.selectedContexts] : [];
                    }
                    $.each(o.selectedContexts, function(i, context) {
                        if (!o.contexts[context]) {
                            delete o.selectedContexts[context];
                        }
                    })
                    if (o.selectedContexts.length === 0) {
                        o.selectedContexts.push(Object.keys(o.contexts)[0]);
                    }
                }

                self.isMultiContextSelected = o.selectedContexts.length > 1;

                self._css()
                    ._uiToolbar()
                    ._uiInspectorsPopulate()
                    ._uiSplitters()
                    ._uiInspectorsInit()
                    ._uiSearchBar()
                    ._uiList();

                self.init = true;
            },

            _css : function() {
                var self = this,
                    o = self.options;

                if (!$('style#inspectorsGrid').length) {
                    var css = '';
                    for (var u=0, numSheets = document.styleSheets.length; u<numSheets; u++) {
                        var sheet = document.styleSheets[u];
                        if (sheet.href && /wijmo/.test(sheet.href)) {
                            var rules = sheet.rules ? sheet.rules : sheet.cssRules;
                            for (var r=0, numRules = rules.length; r<numRules; r++) {
                                if (rules[r].selectorText === '.ui-widget-content') {
                                    css += '.nos-appdesk .nos-appdesk-splitter-v .wijmo-wijsplitter-v-panel2 .wijmo-wijsplitter-h-panel1 .wijmo-wijgrid-alternatingrow {background:' + rules[r].style['background'] + ';}';
                                    css += '.nos-appdesk .nos-appdesk-splitter-v .wijmo-wijsplitter-v-panel1 .wijmo-wijgrid-alternatingrow {background:' + rules[r].style['background'] + ';}';
                                }
                                if (rules[r].selectorText === '.wijmo-wijgrid tr.wijmo-wijgrid-row.ui-state-hover, .wijmo-wijgrid .wijmo-wijgrid-current-cell, .wijmo-wijgrid td.wijmo-wijgrid-rowheader.ui-state-active'
                                    || rules[r].selectorText === '.wijmo-wijgrid tr.ui-state-hover.wijmo-wijgrid-row, .wijmo-wijgrid .wijmo-wijgrid-current-cell, .wijmo-wijgrid td.ui-state-active.wijmo-wijgrid-rowheader') {
                                    css += '.nos-appdesk .nos-appdesk-splitter-v .wijmo-wijsplitter-v-panel2 .wijmo-wijsplitter-h-panel1 .wijmo-wijgrid-alternatingrow.ui-state-hover {background:' + rules[r].style['background'] + ';}';
                                    css += '.nos-appdesk .nos-appdesk-splitter-v .wijmo-wijsplitter-v-panel1 .wijmo-wijgrid-alternatingrow.ui-state-hover {background:' + rules[r].style['background'] + ';}';
                                }
                            }
                        }
                    }
                    $('<style type="text/css" id="inspectorsGrid">' + css + '</style>').appendTo('head');
                }

                return self;
            },

            _uiToolbar : function() {
                var self = this;

                return self._uiToolbarActions()
                    ._uiToolbarContexts()
                    ._uiToolbarViews();
            },

            _uiToolbarActions : function() {
                var self = this,
                    o = self.options;

                if (!$.isArray(o.buttons) || !o.buttons.length) {
                    return self;
                }

                $.each(o.buttons, function(i, button) {
                    var $el;
                    if (button.primary) {
                        $el = $('<button></button>').html(button.label)
                            .data('icon', button.icon || 'plus')
                            .addClass('ui-priority-primary')
                            .click(function(e) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                $(this).nosAction(button.action, {
                                    context: o.selectedContexts.length ? o.selectedContexts[0] : ''
                                });
                            });
                    } else {
                        $el = $('<a href="#"></a>')
                            .addClass('nos-appdesk-action-secondary')
                            .html(button.label)
                            .click(function(e) {
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                $(this).nosAction(button.action, {
                                    context: o.selectedContexts.length ? o.selectedContexts[0] : ''
                                });
                            });
                    }
                    self.element.nosToolbar('add', $el);
                });

                return self;
            },

            _uiToolbarContexts : function() {
                var self = this,
                    o = self.options;

                if (o.hideContexts || !!$.isEmptyObject(o.contexts)) {
                    return self;
                }
                self.dispatcher.data('nosContext', o.selectedContexts);

                self._uiToolbarContextsButton();
                self.uiToolbarContextsDialog = $('<div><form><table><thead><tr><th></th></tr></thead><tbody></tbody></table></form></div>');
                var $table = self.uiToolbarContextsDialog.find('table'),
                    $tbody = $table.find('tbody'),
                    $trHeader = $table.find('tr');

                $.each(o.locales, function(locale, locale_params) {
                    $('<th></th>').html(locale_params.title)
                        .append('<br /><img src="static/novius-os/admin/novius-os/img/flags/' + locale_params.flag + '.png" />')
                        .appendTo($trHeader)
                });

                $.each(o.sites, function(site, site_params) {
                    var $tr = $('<tr></tr>').appendTo($tbody);

                    $('<th></th>').html(site_params.title)
                        .appendTo($tr);

                    $.each(o.locales, function(locale, locale_params) {
                        if (o.contexts[site + '::' + locale]) {
                            $('<td></td>').append('<input type="checkbox" name="contexts" value="' + site + '::' + locale +'" />')
                                .appendTo($tr);
                        } else {
                            $('<td></td>')
                                .appendTo($tr);
                        }
                    });
                });
                self.uiToolbarContextsDialog.wijdialog({
                        title: self.nosContext.label({
                                oneSite: o.texts.selectLanguages,
                                oneLocale: o.texts.selectSites,
                                defaultLabel: o.texts.selectContexts
                            }),
                        autoOpen: false,
                        buttons: [
                            {
                                text:o.texts.contextsPopinOk,
                                click: function(){
                                    o.selectedContexts = [];
                                    self.uiToolbarContextsDialog.find(':checked').each(function() {
                                        o.selectedContexts.push($(this).val());
                                    });
                                    if (o.selectedContexts.length === 0) {
                                        self.uiToolbarContextsDialog.find(':checkbox').each(function() {
                                            o.selectedContexts.push($(this).val());
                                        });
                                    }

                                    self._selectContexts();
                                }
                            }
                        ],
                        captionButtons: {
                            pin: {visible: false},
                            refresh: {visible: false},
                            toggle: {visible: false},
                            minimize: {visible: false},
                            maximize: {visible: false}
                        },
                        modal: true,
                        open: function() {
                            self.uiToolbarContextsDialog.nosOnShow('show');
                            self.uiToolbarContextsDialog.find(':checkbox').prop('checked', false);
                            $.each(o.selectedContexts, function(i, context) {
                                self.uiToolbarContextsDialog.find(':checkbox[value="' + context + '"]').prop('checked', true);
                            });
                            self.uiToolbarContextsDialog.wijdialog('option', 'width',
                                Math.min(
                                    parseInt(self.uiToolbarContextsDialog.css('padding-left').replace('px')) * 2 + $table.outerWidth(),
                                    window.innerWidth - 200
                                )
                            );
                        }
                    })
                    .nosOnShow('one', function() {
                        $table.noslistgrid({
                            scrollMode : "auto",
                            columns: [
                                {
                                    cellFormatter: function(args) {
                                        args.$container.text(args.formattedValue)
                                            .parent().addClass('wijmo-wijgrid-rowheader ui-widget-content ui-state-default')
                                            .removeClass('wijdata-type-string');
                                        return true;
                                    }
                                }
                            ],
                            noCellsSelected: true,
                            cellStyleFormatter: function(args) {
                                if (args._cellIndex > 0) {
                                    args.$cell.css('text-align', 'center');
                                    if (args.row.dataRowIndex === -1) {
                                        var data = $table.noslistgrid('data');

                                        args.$cell.click(function(e) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();

                                            var checked = null;

                                            for (var i = 1; i <= data.length; i++) {
                                                var $checkbox = $table.find('tr:eq(' + i + ')')
                                                        .find('td:eq(' + args._cellIndex + ')')
                                                        .find(':checkbox');

                                                if (checked === null) {
                                                    checked = $checkbox.is(':checked');
                                                }
                                                $checkbox.prop('checked', !checked);
                                            }
                                        });

                                    }
                                } else {
                                    var $tr = args.$cell.parent();
                                    args.$cell.click(function(e) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation();

                                        var $checkbox = $tr.find(':checkbox');
                                        $checkbox.prop('checked', !$checkbox.is(':checked'));
                                    });
                                }
                            }
                        });
                        self.uiToolbarContextsDialog.nosFormUI();
                    });

                return self;
            },

            _selectContexts : function() {
                var self = this,
                    o = self.options,
                    isMultiContextSelected = o.selectedContexts.length > 1,
                    appdeskChangeReloadEvent;

                self.uiToolbarContextsDialog.wijdialog('close');
                self._uiToolbarContextsButtonLabel();

                self.element.nosSaveUserConfig(o.name + '.selectedContexts', o.selectedContexts);

                self.uiSearchInput.val('');
                if (self.uiInspectorsTags.data('wijmo-wijsuperpanel')) {
                    self.uiInspectorsTags.wijsuperpanel('destroy');
                }
                self.uiInspectorsTags.empty().css('width', 'auto');

                self.dispatcher.data('nosContext', o.selectedContexts);

                if (self.hasInspectorHideOnMultiContext && self.isMultiContextSelected != isMultiContextSelected) {
                    self.dispatcher.off('contextChange');

                    self.uiSplitterVertical.remove();
                    self._createLayout()
                        ._uiInspectorsPopulate()
                        ._uiSplitters()
                        ._uiInspectorsInit()
                        ._uiSearchBar()
                        ._uiList();

                    appdeskChangeReloadEvent = self.dispatcher.data('appdeskChangeReloadEvent');
                    if ($.isFunction(appdeskChangeReloadEvent)) {
                        self.dispatcher.on('contextChange', appdeskChangeReloadEvent);
                    }
                } else {
                    self._uiList();

                    self.dispatcher.trigger('contextChange')
                }

                self.isMultiContextSelected = isMultiContextSelected;

                return self;
            },

            _uiToolbarContextsButton : function() {
                var self = this,
                    o = self.options;

                var $splitButton = $('<div><button></button><button></button></div>').addClass('nos-appdesk-buttoncontext'),
                    date = new Date(),
                    id = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds(),
                    $ul = $('<ul></ul>'),
                    count = 0;

                $splitButton.find('button:first')
                    .click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        self.uiToolbarContextsDialog.wijdialog('open');
                    })
                    .end()
                    .find('button:last')
                    .attr('id', id)
                    .html(self.nosContext.label({
                            oneSite: o.texts.selectLanguages,
                            oneLocale: o.texts.selectSites,
                            defaultLabel: o.texts.selectContexts
                        }))
                    .data({
                        text: false,
                        icons: {
                            primary: 'triangle-1-s'
                        }
                    });

                self.uiToolbarContextsButton = self.element.nosToolbar('add', $splitButton, true);
                self.uiToolbarContextsButton.buttonset();
                self._uiToolbarContextsButtonLabel();

                $('<li><a></a></li>')
                    .appendTo($ul)
                    .find('a')
                    .html(self.nosContext.label({
                            oneSite: o.texts.selectLanguages,
                            oneLocale: o.texts.selectSites,
                            defaultLabel: o.texts.selectContexts
                        }));

                $('<li></li>')
                    .appendTo($ul);

                $.each(o.contexts, function(context) {
                    count++;
                    $('<li><a></a></li>')
                        .data('context', context)
                        .appendTo($ul)
                        .find('a')
                        .append(o.texts.workInContext.replace('{{context}}', self.nosContext.contextLabel(context)));

                    if (count > 10 && Object.keys(o.contexts).length > 12) {
                        $('<li><a></a></li>')
                            .appendTo($ul)
                            .find('a')
                            .html(self.nosContext.label({
                                    oneSite: o.texts.otherLanguages,
                                    oneLocale: o.texts.otherSites,
                                    defaultLabel: o.texts.otherContexts
                                }));

                        return false
                    }
                });

                $ul.insertAfter(self.uiToolbarContextsButton)
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
                            trigger: '#' + id,
                            select: function(e, data) {
                                var $li = $(data.item.element),
                                    context = $li.data('context');

                                if (context) {
                                    o.selectedContexts = [context];

                                    self._selectContexts();
                                } else {
                                    self.uiToolbarContextsDialog.wijdialog('open');
                                }
                            }
                        });

                return self;
            },

            _uiToolbarContextsButtonLabel : function() {
                var label = '',
                    nbSites = 0,
                    nbLocales = 0,
                    sites = {},
                    locales = {},
                    self = this,
                    o = self.options,
                    $button = self.uiToolbarContextsButton.find('button:first');

                if (o.selectedContexts.length === 1) {
                    $button.button('option', 'label', self.nosContext.contextLabel(o.selectedContexts[0]));
                } else {
                    $.each(o.selectedContexts, function(i, context) {
                        var site = self.nosContext.siteCode(context),
                            locale = self.nosContext.localeCode(context);

                        if (!sites[site]) {
                            nbSites++;
                            sites[site] = [];
                        }
                        sites[site].push(locale);

                        if (!locales[locale]) {
                            nbLocales++;
                            locales[locale] = [];
                        }
                        locales[locale].push(site);
                    });

                    if (Object.keys(o.contexts).length === o.selectedContexts.length) {
                        $button.button('option', 'label', self.nosContext.label({
                            oneSite: o.texts.allLanguages,
                            oneLocale: o.texts.allSites,
                            defaultLabel: o.texts.allContexts
                        }));
                    } else if (nbSites === 1 && o.sites[Object.keys(sites)[0]].locales.length === nbLocales) {
                        $button.button('option', 'label', self.nosContext.siteLabel(Object.keys(sites)[0]) + ', ' + o.texts.allLanguages);
                    } else if (nbLocales === 1 && o.locales[Object.keys(locales)[0]].sites.length === nbSites) {
                        $button.button('option', 'label', o.texts.allSites + ', ' + self.nosContext.localeLabel(Object.keys(locales)[0]));
                    } else {
                        $.each(sites, function(site, locales) {
                            if (label !== '') {
                                label += '&nbsp;&nbsp;';
                            }
                            if (Object.keys(o.sites).length > 1) {
                                label += self.nosContext.siteLabel(site, {'short': true}) + ' ';
                            }
                            if (Object.keys(o.locales).length > 1) {
                                $.each(locales, function(i, locale) {
                                    label += self.nosContext.localeLabel(locale, {'short': true}) + ' ';
                                });
                            }
                        });
                        $button.button('option', 'label', label);
                    }
                }

                return self;
            },

            _uiToolbarViews : function() {
                var self = this,
                    o = self.options;

                // If we're in a virtual view, we can't escape
                if (o.views[o.selectedView] && o.views[o.selectedView].virtual) {
                    return self;
                }

                var $viewsDropDown = $('<select></select>'),
                    views_count = 0;

                $.each(o.views, function(key, view) {
                    // Virtual views can't be switched to
                    if (view.virtual) {
                        return;
                    }

                    views_count++;
                    $viewsDropDown.append(
                        $('<option></option>').attr('value', key)
                            .prop('selected', o.selectedView == key)
                            .append(view.name)
                    );
                });
                if (views_count <= 1) {
                    return self;
                }

                $viewsDropDown.change(function() {
                    var $dropdown = $(this);

                    $dropdown.nosSaveUserConfig(o.name + '.selectedView', $(this).val());
                    self.element.trigger('reloadView', {selectedView: $(this).val()});
                });

                self.element.nosToolbar('add', $viewsDropDown, true);

                return self;
            },

            _uiSplitters : function() {
                var self = this,
                    hasVerticalInspector = !self.uiInspectorsVertical.is(':empty'),
                    verticalSplitter = $.extend(true, {
                            orientation: "vertical",
                            splitterDistance: 200,
                            showExpander: false,
                            fullSplit: false,
                            panel1 : {
                                minSize : 150,
                                scrollBars : 'none'
                            },
                            panel2 : {
                                minSize : 200,
                                scrollBars : 'none'
                            },
                            sized: function () {
                                self._trigger('slidersChange', null, self.slidersSettings());
                                self._resizeInspectorsV()
                                    ._resizeInspectorsH(true)
                                    ._resizeList(true);
                            }
                        }, self.options.splitters.vertical),
                    horizontalSplitter = $.extend(true, {
                            orientation: "horizontal",
                            fullSplit: hasVerticalInspector,
                            splitterDistance: 200,
                            showExpander: false,
                            panel1 : {
                                minSize : 200,
                                scrollBars : 'none'
                            },
                            panel2 : {
                                minSize : 200,
                                scrollBars : 'none'
                            },
                            sized: function () {
                                self._trigger('slidersChange', null, self.slidersSettings());
                                self._resizeInspectorsH()
                                    ._resizeList(true);
                            }
                        }, self.options.splitters.horizontal);

                if (hasVerticalInspector) {
                    self.uiSplitterVertical.wijsplitter(verticalSplitter);
                } else {
                    self.uiSplitterVerticalLeft.remove();
                    self.uiSplitterVerticalLeft.css({
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: '100%'
                        });
                }

                if (!self.uiInspectorsHorizontal.is(':empty')) {
                    self.uiSplitterHorizontal.wijsplitter(horizontalSplitter);
                } else {
                    self.uiSplitterHorizontal.add(self.uiSplitterHorizontalBottom)
                        .css({
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: '100%'
                        });
                    self.uiSplitterHorizontalTop.remove();
                }

                return self;
            },

            _uiInspectorsPopulate : function() {
                var self = this,
                    o = self.options;

                $.each(o.inspectors, function() {
                    if (this.multiContextHide) {
                        self.hasInspectorHideOnMultiContext = true;
                    }
                    if (!this.hide && (!this.multiContextHide || o.selectedContexts.length === 1)) {
                        $('<li></li>').addClass('nos-appdesk-inspector ui-widget-content')
                            .data('inspector', $.extend({
                                loadingText: o.texts.loading
                            }, this))
                            .appendTo( this.vertical ? self.uiInspectorsVertical : self.uiInspectorsHorizontal );
                    }
                });

                return self;
            },

            _uiInspectorsInit : function() {
                var self = this,
                    o = self.options;


                if (self.uiSplitterVertical.data('wijmo-wijsplitter')) {
                    self.uiInspectorsVerticalLi = self.uiInspectorsVertical.find('> li');
                    self._resizeInspectorsV(true);
                    self.uiInspectorsVerticalLi.each(function() {
                        self._loadInspector($(this));
                    });
                }
                if (self.uiInspectorsHorizontal.data('wijmo-wijsplitter')) {
                    self.uiInspectorsHorizontalLi = self.uiInspectorsHorizontal.find('> li');
                    self._resizeInspectorsH(true);
                    self.uiInspectorsHorizontalLi.each(function() {
                        self._loadInspector($(this));
                    });
                }

                return self;
            },

            _loadInspector : function($li) {
                var self = this,
                    inspector = $li.data('inspector'),
                    o = self.options;

                inspector.selectionChanged = function(value, label) {
                        var multiple = false,
                            name = inspector.inputName,
                            max, width;

                        if (inspector.inputName.substr(-2, 2) === '[]') {
                            name = inspector.inputName.substr(0, inspector.inputName.length - 2);
                            multiple = true;
                        }

                        if (!multiple) {
                            self.uiInspectorsTags.find('span.' + name).remove();
                        } else {
                            var already = false;
                            self.uiInspectorsTags.find('span.' + name).each(function() {
                                if ($(this).find('input').val() === value) {
                                    already = true;
                                    return false;
                                }
                            });
                            if (already) {
                                return true;
                            }
                        }

                        self.pageIndex = 0;
                        if (self.uiInspectorsTags.data('wijmo-wijsuperpanel')) {
                            self.uiInspectorsTags.wijsuperpanel('destroy');
                        }

                        var span = $('<span></span>').addClass('nos-appdesk-inspectorstag ui-state-default ui-corner-all ' + name)
                            .html(label)
                            .appendTo(self.uiInspectorsTags);

                        $('<input type="hidden" name="' + inspector.inputName + '" />').val(value)
                            .appendTo(span);

                        $('<a href="#"></a>').addClass('ui-icon ui-icon-close')
                            .click(function(e) {
                                e.preventDefault();
                                $(this).parent().remove();
                                self.gridReload();
                            })
                            .appendTo(span);

                        max = parseInt(self.uiInputContainer.width() * 0.7);
                        width = self.uiInspectorsTags.css('width', '1%').outerWidth();
                        self.uiInspectorsTags.width(width > max ? max : width)
                            .wijsuperpanel({
                                showRounder: false,
                                hScroller: {
                                    scrollMode: 'buttons'
                                }
                            });

                        if (o.defaultView === 'treeGrid') {
                            self.uiViewsButtons.find('.view_grid').click().blur();
                        } else {
                            self.gridReload();
                        }
                    };

                $li.data('inspector', inspector);

                if ($.isFunction(inspector.url)) {
                    inspector.url.call(self, $li);
                } else if (inspector.url) {
                    $.ajax({
                        url: inspector.url,
                        dataType: 'html'
                    })
                    .done(function(data) {
                        $(data).appendTo($li); // appendTo for embed javascript work
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        log('error');
                        log(textStatus);
                        log(errorThrown);
                    });
                } else {
                    $li.html(inspector.view);
                }

                return self;
            },

            _uiSearchBar : function() {
                var self = this,
                    o = self.options;

                self.uiResetSearch.hide();

                self.uiSearchInput.on('keypress', function( event ) {
                        var keyCode = $.ui.keyCode;

                        self.pageIndex = 0;

                        if ( self.timeoutSearchInput ) {
                            clearTimeout(self.timeoutSearchInput);
                        }

                        // Don't ever use keyCode.NUMPAD_ENTER here, it conflicts with "L" minuscule
                        if (event.keyCode === keyCode.ENTER) {
                            if (o.defaultView === 'treeGrid') {
                                self.uiViewsButtons.find('.view_grid').click().blur();
                            } else {
                                self.gridReload();
                            }
                            return false;
                        }

                        self.timeoutSearchInput = setTimeout(function() {
                            if (o.defaultView === 'treeGrid') {
                                self.uiViewsButtons.find('.view_grid').click().blur();
                            } else {
                                self.gridReload();
                            }
                        }, 500);
                    });

                self.uiResetSearch.click(function(e) {
                        e.preventDefault();
                        self.uiSearchInput.val('');
                        if (self.uiInspectorsTags.data('wijmo-wijsuperpanel')) {
                            self.uiInspectorsTags.wijsuperpanel('destroy');
                        }
                        self.uiInspectorsTags.empty().css('width', 'auto');
                        self.gridReload();
                    });

                self.uiInspectorsTags.height(self.uiInputContainer.height())
                    .css('width', 'auto')
                    .wijsuperpanel({
                        showRounder: false,
                        hScroller: {
                            scrollMode: 'buttons'
                        }
                    });

                self.uiInputContainer.click(function() {
                    self.uiSearchInput.focus();
                });

                var presentations = [
                        {
                            id : 'treeGrid',
                            text : o.texts.viewTreeGrid,
                            icon : 'view-tree'
                        },
                        {
                            id : 'grid',
                            text : o.texts.viewGrid,
                            icon : 'view-list'
                        },
                        {
                            id : 'thumbnails',
                            size : 64,
                            text : o.texts.viewThumbnails,
                            icon : 'view-thumbs-small'
                        },
                        {
                            id : 'thumbnails',
                            size : 128,
                            text : o.texts.viewThumbnails,
                            icon : 'view-thumbs-big'
                        }
                    ],
                    date = new Date(),
                    id = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();

                $.each(presentations, function() {
                    var presentation = this;
                    if (o[presentation.id]) {
                        $('<label for="view_' + id + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : '') + '"></label>')
                            .html(presentation.text + (presentation.size ? ' ' + presentation.size + 'px' : ''))
                            .appendTo(self.uiViewsButtons);

                        $('<input type="radio" name="view" />')
                            .attr('id', 'view_' + id + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : ''))
                            .prop('checked', (o.defaultView === presentation.id && (!presentation.size || presentation.size === o.thumbnails.thumbnailSize)))
                            .addClass('view_' + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : ''))
                            .appendTo(self.uiViewsButtons)
                            .button({
                                text : false,
                                label: presentation.text + (presentation.size ? ' ' + presentation.size + 'px' : ''),
                                icons : {
                                    primary: 'ui-icon ' + presentation.icon,
                                    secondary: null
                                }
                            })
                            .click(function() {
                                if (o.defaultView !== presentation.id || (presentation.id === 'thumbnails' && o.thumbnails.thumbnailSize !== presentation.size)) {
                                    self.uiViewsButtons
                                        .find('button')
                                        .removeClass('ui-state-active');
                                    $(this).addClass('ui-state-active');
                                    o.defaultView = presentation.id;
                                    if (presentation.size) {
                                        o.thumbnails.thumbnailSize = presentation.size;
                                    }
                                    if (presentation.id === 'treeGrid') {
                                        self.uiSearchInput.val('');
                                        self.uiResetSearch.hide();
                                        self.uiNbResult.hide();

                                    }
                                    self._uiList();
                                }
                            });
                    }
                });
                if (self.uiViewsButtons.find('input').length > 1) {
                    self.uiViewsButtons.buttonset();
                } else {
                    self.uiViewsButtons.hide();
                }

                return self;
            },

            _uiList : function() {
                var self = this,
                    o = self.options;

                self.gridRendered = false;
                self.uiGridTitle.html(o.texts.gridTitle);

                if (self.uiThumbnail.data('nos-thumbnailsgrid')) {
                    self.uiThumbnail.thumbnailsgrid('destroy');
                }
                if (self.uiGrid.data('nos-noslistgrid')) {
                    self.uiGrid.noslistgrid('destroy');
                }
                if (self.uiTreeGrid.data('nos-nostreegrid')) {
                    self.uiTreeGrid.nostreegrid('destroy');
                }

                self.uiThumbnail.add(self.uiGrid).add(self.uiTreeGrid)
                    .empty()
                    .hide();
                if (o.defaultView === 'thumbnails') {
                    self.uiThumbnail.show();
                    self._uiThumbnail();
                } else if (o.defaultView === 'treeGrid') {
                    self.uiTreeGrid.show();
                    self._uiTreeGrid();
                } else {
                    self.uiGrid.show();
                    self._uiGrid();
                }

                return self;
            },

            _uiGrid : function() {
                var self = this,
                    o = self.options,
                    height =  self._listHeight(self.uiGrid),
                    grid = $.extend(true, {}, o.grid);

                self._columnsMultiContext(grid.columns);

                self.uiGrid.css({
                        height : height,
                        width : '100%'
                    })
                    .noslistgrid($.extend({
                        loadingText: o.texts.loading,
                        columnsAutogenerationMode : 'none',
                        columnsOptions: o,
                        selectionMode: 'singleRow',
                        showFilter: self.showFilter,
                        allowSorting: true,
                        scrollMode : 'auto',
                        allowPaging : true,
                        culture: o.culture,
                        pageIndex : self.pageIndex,
                        pageSizeAuto: true,
                        allowColSizing : true,
                        allowColMoving : true,
                        data: new wijdatasource({
                            dynamic: true,
                            proxy: new wijhttpproxy_extended({
                                url: o.grid.urlJson,
                                dataType: "json",
                                error: function(jqXHR, textStatus, errorThrown) {
                                    log(jqXHR, textStatus, errorThrown);
                                },
                                data: {}
                            }),
                            loading: function (dataSource, userData) {
                                var r = userData.data.paging;
                                self.pageIndex = r.pageIndex;
                                if (self.gridRendered) {
                                    self.uiGrid.noslistgrid("currentCell", -1, -1);
                                }
                                dataSource.proxy.options.data.context = o.selectedContexts || '';
                                dataSource.proxy.options.data.inspectors = self._jsonInspectors();
                                dataSource.proxy.options.data.offset = r.pageIndex * r.pageSize;
                                dataSource.proxy.options.data.limit = r.pageSize;
                            },
                            loaded: function(dataSource, data) {
                                if (dataSource.data.totalRows === 0) {
                                    self.uiPaginationLabel.html(o.texts.showNoItem);
                                    self.uiNbResult.html(o.texts.showNoItem);
                                } else {
                                    self.uiPaginationLabel.html(
                                        $.nosI18nPlural(o.texts.showNbItems, dataSource.data.length)
                                            .replace('{{x}}', dataSource.data.length)
                                            .replace('{{y}}', dataSource.data.totalRows)
                                    );
                                    self.uiNbResult.html(
                                        $.nosI18nPlural(o.texts.NItems, dataSource.data.totalRows)
                                            .replace('{{count}}', dataSource.data.totalRows)
                                    );
                                }
                                self.uiNbResult.show();

                                self.uiResetSearch[self.uiInspectorsTags.find('.nos-appdesk-inspectorstag').length || self.uiSearchInput.val() ? 'show' : 'hide']();
                            },
                            reader: {
                                read: function (dataSource) {
                                    var count = parseInt(dataSource.data.total, 10);
                                    dataSource.data = dataSource.data.items;
                                    dataSource.data.totalRows = count;
                                }
                            }
                        }),
                        pageIndexChanging: function() {
                            self.element.trigger('selectionChanged.appdesk', false);
                        },
                        cellStyleFormatter: function(args) {
                            if (args.$cell.is('th')) {
                                args.$cell.removeClass("ui-state-active");
                            }
                            if (args.state & $.wijmo.wijgrid.renderState.selected) {
                                args.$cell.removeClass("wijmo-wijgrid-current-cell");
                            }
                        },
                        currentCellChanging : function () {
                            return self.gridRendered;
                        },
                        currentCellChanged: function (e) {
                            if (e) {
                                var row = $(e.target).noslistgrid("currentCell").row(),
                                    data = row ? row.data : false;

                                if (data) {

                                    self.itemSelected = $.extend({}, data);
                                    self.element.trigger('selectionChanged.appdesk', data);
                                }
                            }
                            return true;
                        },
                        rendering : function() {
                            self.gridRendered = false;
                        },
                        rendered : function() {
                            self.gridRendered = true;
                            self.uiGrid.css('height', 'auto');
                            var sel = self.uiGrid.noslistgrid("selection");
                            sel && sel.clear();
                            if (self.itemSelected !== null) {
                                // Search the selection in the data
                                $.each(self.uiGrid.noslistgrid('data') || [], function(dataRowIndex, data) {
                                    if (data._model == self.itemSelected._model && data._id == self.itemSelected._id) {
                                        sel.addRows(dataRowIndex);
                                        self.element.trigger('selectionChanged.appdesk', data);
                                    }
                                });
                            }
                        },
                        dataLoading: function(e) {
                            self.uiPaginationLabel.detach();
                        },
                        loaded: function() {
                            self.uiSplitterHorizontalBottom.find('.wijmo-wijgrid-footer').prepend(self.uiPaginationLabel);
                        }
                    }, grid));

                return self;
            },

            _uiTreeGrid : function() {
                var self = this,
                    o = self.options,
                    grid = $.extend(true, {}, o.grid),
                    columns = $.extend({}, o.treeGrid.columns || o.grid.columns);

                delete grid.columns;
                delete grid.urlJson;

                self._columnsMultiContext(columns);

                self.uiTreeGrid.css({
                        height : self._listHeight(self.uiTreeGrid),
                        width : '100%'
                    }).nostreegrid($.extend(true, { // True for recursive clone
                        loadingText: o.texts.loading,
                        urlJson : o.treeGrid.urlJson,
                        treeOptions : {
                            context : o.selectedContexts || ''
                        },
                        initialDepth : o.treeGrid.initialDepth || 2,
                        columnsAutogenerationMode : 'none',
                        columnsOptions: o,
                        selectionMode: 'singleRow',
                        allowSorting: true,
                        scrollMode : 'auto',
                        culture: o.culture,
                        allowColSizing : true,
                        allowColMoving : true,
                        columns : o.treeGrid.columns || o.grid.columns,
                        sorting: function(e, args) {
                            $.each(o.grid.columns, function() {
                                var column = this;
                                if (column.headerText === args.column.headerText) {
                                    column.sortDirection = args.sortDirection;
                                } else {
                                    column.sortDirection = 'none';
                                }
                            });
                            self.uiViewsButtons.find('.view_grid').click().blur();
                            return false;
                        },
                        cellStyleFormatter: function(args) {
                            if (args.$cell.is('th')) {
                                args.$cell.removeClass("ui-state-active");
                            }
                            if (args.state & $.wijmo.wijgrid.renderState.selected) {
                                args.$cell.removeClass("wijmo-wijgrid-current-cell");
                            }
                        },
                        currentCellChanging : function () {
                            return self.gridRendered;
                        },
                        currentCellChanged: function (e) {
                            if (e) {
                                var row = $(e.target).nostreegrid("currentCell").row(),
                                    data = row ? row.data : false;

                                if (data) {
                                    self.itemSelected = $.extend({}, data);
                                    self.element.trigger('selectionChanged.appdesk', data);
                                }
                            }
                            return true;
                        },
                        rendering : function() {
                            self.gridRendered = false;
                        },
                        rendered : function() {
                            self.gridRendered = true;
                            self.uiTreeGrid.css('height', 'auto');
                            var sel = self.uiTreeGrid.nostreegrid("selection");
                            sel && sel.clear();
                            if (self.itemSelected !== null) {
                                $.each(self.uiTreeGrid.nostreegrid('data') || [], function(dataRowIndex, data) {
                                    if (data._model == self.itemSelected._model && data._id == self.itemSelected._id) {
                                        sel.addRows(dataRowIndex);
                                        self.element.trigger('selectionChanged.appdesk', data);
                                    }
                                });
                            }
                        },
                        dataLoading: function(e) {
                            self.uiPaginationLabel.detach();
                        },
                        loaded: function() {
                            self.uiSplitterHorizontalBottom.find('.wijmo-wijgrid-footer').prepend(self.uiPaginationLabel);
                        }
                    }, grid));

                return self;
            },

            _uiThumbnail : function() {
                var self = this,
                    o = self.options;

                self.uiThumbnail.css('height', self._listHeight(self.uiThumbnail))
                    .thumbnailsgrid($.extend({
                        texts: {
                            loading: o.texts.loading
                        },
                        pageIndex: 0,
                        url: o.grid.urlJson,
                        loading: function (dataSource, userData) {
                            var r = userData.data.paging;
                            self.pageIndex = r.pageIndex;
                            dataSource.proxy.options.data.context = o.selectedContexts || '';
                            dataSource.proxy.options.data.inspectors = self._jsonInspectors();
                            dataSource.proxy.options.data.offset = r.pageIndex * r.pageSize;
                            dataSource.proxy.options.data.limit = r.pageSize;
                        },
                        loaded: function(dataSource, data) {
                            if (dataSource.data.totalRows === 0) {
                                self.uiPaginationLabel.html(o.texts.showNoItem);
                                self.uiNbResult.html(o.texts.showNoItem);
                            } else {
                                self.uiPaginationLabel.html(
                                    $.nosI18nPlural(o.texts.showNbItems, dataSource.data.length)
                                        .replace('{{x}}', dataSource.data.length)
                                        .replace('{{y}}', dataSource.data.totalRows)
                                );
                                self.uiNbResult.html(
                                    $.nosI18nPlural(o.texts.NItems, dataSource.data.totalRows)
                                        .replace('{{count}}', dataSource.data.totalRows)
                                );
                            }
                            self.uiNbResult.show();

                            self.uiResetSearch[self.uiInspectorsTags.find('.nos-appdesk-inspectorstag').length || self.uiSearchInput.val() ? 'show' : 'hide']();
                        },
                        rendered : function() {
                            self.uiSplitterHorizontalBottom.find('.wijmo-wijpager').prepend(self.uiPaginationLabel);

                            if (self.itemSelected !== null) {
                                // Search the selection in the data
                                var found = false;
                                $.each(self.uiThumbnail.thumbnailsgrid('data') || [], function(dataRowIndex, data) {
                                    if (data._model == self.itemSelected._model && data._id == self.itemSelected._id) {
                                        found = true;
                                        if (!self.uiThumbnail.thumbnailsgrid('select', dataRowIndex)) {
                                            self.itemSelected = null;
                                        }
                                    }
                                });
                                if (!found) {
                                    self.uiThumbnail.thumbnailsgrid('unselect');
                                }
                            }
                        },
                        reader: {
                            read: function (dataSource) {
                                var count = parseInt(dataSource.data.total, 10);
                                dataSource.data = dataSource.data.items;
                                dataSource.data.totalRows = count;
                            }
                        },
                        pageIndexChanging: function() {
                            self.itemSelected = null;
                            self.element.trigger('selectionChanged.appdesk', false);
                        },
                        selectionChanged : function(e, data) {
                            if (!data || $.isEmptyObject(data)) {
                                self.itemSelected = null;
                                self.element.trigger('selectionChanged.appdesk', false);
                            } else {
                                self.itemSelected = $.extend({}, data.item.data.noParseData);
                                self.element.trigger('selectionChanged.appdesk', data.item.data.noParseData);
                            }
                        }
                    }, o.thumbnails));

                return self;
            },

            _listHeight : function($grid) {
                var self = this,
                    position = $grid.offset(),
                    positionContainer = self.element.offset(),
                    borderTop = parseInt($grid.css('borderTopWidth').replace('px', '')),
                    borderBottom = parseInt($grid.css('borderBottomWidth').replace('px', ''));

                return self.element.height() - position.top + positionContainer.top - borderTop - borderBottom;
            },

            _columnsMultiContext : function(columns) {
                var self = this,
                    o = self.options;

                if (!o.hideContexts) {
                    $.each(columns, function(i, column) {
                        if (column.context) {
                            column.visible = o.selectedContexts.length > 1;
                        } else if (column.multiContextHide) {
                            column.visible = o.selectedContexts.length === 1;
                        }
                    });
                }

                return self;
            },

            _jsonInspectors : function() {
                var self = this,
                    inspectors = $.extend({}, this.options.values || {});

                self.uiInspectorsTags.find('input')
                    .add(self.uiSearchInput)
                    .each(function() {
                        var input = $(this),
                            name = input.attr('name'),
                            multiple = false;

                        if (name.substr(-2, 2) === '[]') {
                            name = name.substr(0, name.length - 2);
                            multiple = true;
                        }

                        if (!multiple) {
                            inspectors[name] = input.val();
                        } else {
                            if (!$.isArray(inspectors[name])) {
                                inspectors[name] = [];
                                inspectors[name].push( input.val() );
                            } else if (-1 == $.inArray( input.val(), inspectors[name])) {
                                inspectors[name].push( input.val() );
                            }
                        }
                    });

                return inspectors;
            },

            _resizeInspectorsV : function(reload) {
                var self = this;

                if (self.uiSplitterVertical.data('wijmo-wijsplitter')) {
                    self.uiInspectorsVerticalLi.css({
                            width: '100%',
                            height: (self.uiInspectorsVertical.height() / self.uiInspectorsVerticalLi.length) + 'px'
                        })
                        .trigger(reload ? 'widgetReload' : 'widgetResize');
                }

                return self;
            },

            _resizeInspectorsH : function(reload) {
                var self = this;

                if (self.uiSplitterHorizontal.data('wijmo-wijsplitter')) {
                    self.uiInspectorsHorizontalLi.css({
                            width: (self.uiInspectorsHorizontal.width() / self.uiInspectorsHorizontalLi.length) + 'px',
                            height: '100%'
                        })
                        .trigger(reload ? 'widgetReload' : 'widgetResize');
                }

                return self;
            },

            _resizeList : function(reload) {
                var self = this,
                    o = self.options,
                    height, heights;

                if (self.init) {
                    height = self._listHeight(self.uiSplitterHorizontalBottom.find('> .ui-widget:eq(1)'));
                    if (o.defaultView === 'thumbnails') {
                        if (reload) {
                            self._uiList();
                        } else {
                            self.uiThumbnail.thumbnailsgrid('setSize', self.uiSplitterHorizontalBottom.width(), height);
                        }
                    } else if (o.defaultView === 'treeGrid') {
                        if (reload) {
                            self._uiList();
                        } else {
                            self.uiTreeGrid.nostreegrid('setSize', null, height);
                        }
                    } else {
                        self.uiGrid.noslistgrid('setSize', null, height);
                    }
                }

                return self;
            },

            gridReload : function() {
                var self = this,
                    o = self.options;

                if (self.init) {
                    if (o.defaultView === 'thumbnails') {
                        self._uiList();
                    } else if (o.defaultView === 'treeGrid') {
                        self._uiList();
                    } else {
                        self.uiGrid.noslistgrid('option', 'pageIndex', self.pageIndex)
                            .noslistgrid('ensureControl', true);
                    }
                }

                return self;
            },

            resize : function() {
                var self = this,
                    o = self.options;

                if (self.uiSplitterVertical.data('wijmo-wijsplitter')) {
                    self.uiSplitterVertical.wijsplitter('refresh', false, false);
                }
                if (self.uiSplitterHorizontal.data('wijmo-wijsplitter')) {
                    self.uiSplitterHorizontal.wijsplitter('refresh', false, false);
                }

                self._resizeInspectorsV()
                    ._resizeInspectorsH()
                    ._resizeList();

                return self;
            },

            slidersSettings : function() {
                var self = this;

                return {
                    vertical: {
                        splitterDistance:
                            self.uiSplitterVertical.data('wijmo-wijsplitter') ?
                            this.uiSplitterVertical.wijsplitter('option', 'splitterDistance') / $(window).width() :
                            0
                    },
                    horizontal: {
                        splitterDistance:
                            self.uiSplitterHorizontal.data('wijmo-wijsplitter') ?
                            this.uiSplitterHorizontal.wijsplitter('option', 'splitterDistance') / $(window).height() :
                            0
                    }
                }
            }
        });

        $.extend({
            appdeskAdd: function(id, config) {
                var self = this,
                    onCustom = false,
                    jsonFile = "",
                    appdesk,
                    appdeskSetup = function(config) {
                        var configToUse = $.extend({}, true, config);
                        var i18n = config.i18n || {};

                        var self = {},
                            objectToArray = function(val, i) {
                                val['setupkey'] = i;
                                return val;
                            },

                            keyToOrderedArray = function(object, key) {
                                if (object[key + 'Order']) {
                                    var keys = object[key + 'Order'].split(',');
                                    var ordered = [];
                                    for (var i = 0; i < keys.length; i++) {
                                        // Remove null values
                                        if (object[key][keys[i]] != null) {
                                            object[key][keys[i]]['setupkey'] = keys[i];
                                            ordered.push(object[key][keys[i]]);
                                        }
                                    }
                                    return ordered;
                                } else {
                                    return $.map(object[key], objectToArray);
                                }
                            },

                            recursive = function(object) {
                                $.each(object, function(key, val) {
                                    // `i18n` key must not be processed. For instance, it can contain the `columns` key
                                    // but we would not want it to be processed.
                                    if (key === 'i18nMessages' || key === 'texts') {
                                        return;
                                    }

                                    var i, nosContext,
                                        actions = [];
                                    if ($.isPlainObject(val)) {
                                        if ($.isFunction(val._)) {
                                            // Translate value
                                            object[key] = val._();
                                        } else {
                                            recursive(val);
                                        }
                                    } else if ($.isArray(val)) {
                                        recursive(val);
                                    }

                                    // Build actions columns if any, and translate columns properties
                                    if (key === 'columns') {
                                        object[key] = keyToOrderedArray(object, key);
                                    }
                                });
                            },

                            self = {
                                tab : null,
                                appdesk : {
                                    buttons : {},
                                    grid : {
                                        urlJson : '',
                                        columns : {}
                                    },
                                    thumbnails : null,
                                    defaultView : 'grid',
                                    inspectors : {},
                                    splittersVertical : null,
                                    splittersHorizontal : null
                                },

                                i18nMessages : {},

                                i18n : function(label) {
                                    var o = {};
                                    var self = this;

                                    $.extend(o, {
                                        label : label,
                                        _ : function() {
                                            return self.i18nMessages[o.label] || o.label;
                                        }
                                    });

                                    return o;
                                },

                                build : function() {
                                    // Clone object
                                    var params = $.extend(true, {
                                        appdesk : {
                                            texts : this.i18nMessages,
                                            splitters : {}
                                        }
                                    }, this);

                                    if (params.appdesk.splittersVertical) {
                                        params.appdesk.splitters.vertical = {splitterDistance : params.appdesk.splittersVertical};
                                    }
                                    if (params.appdesk.splittersHorizontal) {
                                        params.appdesk.splitters.horizontal = {splitterDistance : params.appdesk.splittersHorizontal};
                                    }
                                    params.appdesk.buttons = $.map(params.appdesk.buttons, objectToArray);


                                    params.appdesk.inspectors = keyToOrderedArray(params.appdesk, 'inspectors');

                                    // 'actions' is an object containing all the possible actions
                                    // 'appdesk.grid.columns.actions.actions' references the actions we actually use (and are copied from 'actions')
                                    if (params.actions) {
                                        params.appdesk.actions = params.actions;
                                        var gridActions = params.actions;
                                        if (params.appdesk.grid.columns.actions && params.appdesk.grid.columns.actions.actions) {
                                            $.each(params.appdesk.grid.columns.actions.actions, function(i, val) {
                                                if ($.type(val) == 'string') {
                                                    params.appdesk.grid.columns.actions.actions[i] = gridActions[val];
                                                }
                                            });
                                        }
                                        if (params.appdesk.treeGrid && params.appdesk.treeGrid.columns && params.appdesk.treeGrid.columns.actions && params.appdesk.treeGrid.columns.actions.actions) {
                                            $.each(params.appdesk.treeGrid.columns.actions.actions, function(i, val) {
                                                if ($.type(val) == 'string') {
                                                    params.appdesk.treeGrid.columns.actions.actions[i] = gridActions[val];
                                                }
                                            });
                                        }
                                        if (params.appdesk.thumbnails && params.appdesk.thumbnails.actions) {
                                            $.each(params.appdesk.thumbnails.actions, function(i, val) {
                                                if ($.type(val) == 'string') {
                                                    params.appdesk.thumbnails.actions[i] = gridActions[val];
                                                }
                                            });
                                        }
                                        $.each(params.appdesk.inspectors, function(i, inspector) {
                                            if (inspector.preview && inspector.options.actions) {
                                                $.each(inspector.options.actions, function(i, val) {
                                                    if ($.type(val) == 'string') {
                                                        inspector.options.actions[i] = gridActions[val];
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    //
                                    configToUse = params.appdesk;

                                    // Translate clone object
                                    recursive(params);

                                    // Build properties for preview inspector
                                    for (var i = 0; i < params.appdesk.inspectors.length; i++) {
                                        if (params.appdesk.inspectors[i].preview) {
                                            params.appdesk.inspectors[i].url = function($li) {
                                                var inspectorData = $li.data('inspector'),
                                                    widget = $('<div></div>')
                                                        .appendTo($li)
                                                        .preview(inspectorData.options)
                                                        .parent()
                                                        .on({
                                                            widgetResize: function() {
                                                                widget.preview('resize');
                                                            }
                                                        })
                                                        .end();
                                            };
                                        }
                                    }

                                    return params;
                                }
                            };
                        return self;
                    };


                if (config.selectedView == 'custom') {
                    if (config.custom) {
                        jsonFile = config.views[config.custom.from].json;
                        onCustom = true;
                    } else {
                        config.selectedView = 'default';
                    }
                }

                if (config.selectedView != 'custom') {
                    jsonFile = config.views[config.selectedView].json;
                }

                appdesk = appdeskSetup(config);
                $.extend(true, appdesk.i18nMessages, config.i18n);

                if ($.isPlainObject(config.appdesk)) {
                    $.extend(true, appdesk, config.appdesk);
                }

                var init = function() {
                    // If the property is set explicitely, use it, else display only if there's more than 1 context
                    var hideContexts = (typeof config.hideContexts != 'undefined' ? config.hideContexts : Object.keys(config.contexts).length <= 1);

                    $.extend(true, appdesk.appdesk, {
                        contexts : config.contexts,
                        sites : config.sites,
                        locales : config.locales,
                        hideContexts : hideContexts,
                        views : config.views,
                        name  : config.configuration_id,
                        selectedView : config.selectedView,
                        selectedContexts : config.selectedContexts
                    });
                    if (onCustom) {
                        $.extend(true, appdesk.appdesk, {
                            fromView : config.custom.from
                        }, config.custom.appdesk);
                    }

                    var timeout,
                        div = $('div#' + id),
                        dispatcher = div.closest('.nos-dispatcher'),
                        params = appdesk.build();

                    if ($.isPlainObject(params.tab) && !$.isEmptyObject(params.tab)) {
                        try {
                            $(div).nosTabs('update', params.tab);
                        } catch (e) {
                            log('Could not update current tab. Maybe your config file should not try to update it.');
                        }
                    }

                    div.removeAttr('id')
                        .appdesk(params.appdesk);

                    dispatcher.on({
                        resizePanel : function() {
                            if (timeout) {
                                window.clearTimeout(timeout);
                            }
                            timeout = window.setTimeout(function() {
                                div.appdesk('resize');
                            }, 200);
                        },
                        showPanel :  function() {
                            div.appdesk('resize');
                        }
                    });

                    if (params.reloadEvent) {
                        if (!$.isArray(params.reloadEvent)) {
                            params.reloadEvent = [params.reloadEvent];
                        }
                        var listenEvent = function() {
                                var match = [];
                                $.each(params.reloadEvent, function(i, reloadEvent) {
                                    if ($.type(reloadEvent) === 'string') {
                                        // Reload the grid if a action on a same language's item occurs
                                        // Or if a update or a insert on a other language's item occurs
                                        if (dispatcher.data('nosContext')) {
                                            match.push({
                                                name : reloadEvent,
                                                context : dispatcher.data('nosContext')
                                            });
                                        } else {
                                            match.push({
                                                name : reloadEvent
                                            });
                                        }
                                    } else {
                                        match.push(reloadEvent);
                                    }
                                });
                                dispatcher.nosListenEvent(match, function() {
                                        div.appdesk('gridReload');
                                    }, 'appdeskContext');
                            },
                            appdeskChangeReloadEvent = function() {
                                dispatcher.nosUnlistenEvent('appdeskContext');
                                listenEvent();
                            };
                        listenEvent();
                        dispatcher.data('appdeskChangeReloadEvent', appdeskChangeReloadEvent);
                        dispatcher.on('contextChange', appdeskChangeReloadEvent);
                    }

                    div.bind('reloadView', function(e, newConfig) {
                        $.extend(config, newConfig);
                        var newDiv = $('<div id="' + id + '"></div>');
                        newDiv.insertAfter(div);
                        div.remove();
                        self.appdeskAdd(id, config);
                    });
                };

                if (jsonFile && (!$.isArray(jsonFile) || jsonFile.length)) {
                    require(jsonFile, function () {
                        // Extending appdesk with each of the different json files
                        for (var i = 0; i < arguments.length; i++) {
                            $.extend(true, appdesk, arguments[i](appdesk));
                        }

                        init();
                    });
                } else {
                    init();
                }
            }
        });

        return $;
    });
