/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('jquery-nos-appdesk',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'jquery-nos-thumbnailsgrid', 'jquery-nos-listgrid', 'jquery-nos-treegrid', 'jquery-nos-preview', 'jquery-ui.button', 'wijmo.wijdropdown', 'wijmo.wijtabs', 'wijmo.wijsuperpanel', 'wijmo.wijsplitter', 'wijmo.wijgrid', 'wijmo.wijmenu'],
    function($) {
        "use strict";
        var undefined = void(0);
        $.widget( "nos.appdesk", {
            options: {
                buttons : [],
                inspectors : [],
                thumbnails : false,
                defaultView : 'grid',
                locales : {},
                sites : {},
                culture: 'en-GB',
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
                    showNbItems : 'Showing {{x}} items out of {{y}}',
                    showOneItem : 'Showing 1 item',
                    showNoItem : 'No items',
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

            _create: function() {
                var self = this,
                    o = self.options;

                self.element.addClass('nos-appdesk');

                self.dispatcher = self.element.closest('.nos-dispatcher');
                if (!self.dispatcher.size()) {
                    self.dispatcher = self.element;
                }

                self.element.nosToolbar('create');

                self.uiSplitterVertical = $('<div></div>').addClass('nos-appdesk-splitter-v')
                    .appendTo(self.element);
                self.uiSplitterVerticalRight = $('<div></div>').appendTo(self.uiSplitterVertical);
                self.uiInspectorsVertical = $('<ul></ul>').addClass('nos-appdesk-inspectors nos-appdesk-inspectors-v')
                    .appendTo(self.uiSplitterVerticalRight);
                self.uiSplitterVerticalLeft = $('<div></div>').appendTo(self.uiSplitterVertical);

                self.uiSplitterHorizontal = $('<div></div>').appendTo(self.uiSplitterVerticalLeft);
                self.uiSplitterHorizontalTop = $('<div></div>').appendTo(self.uiSplitterHorizontal);
                self.uiInspectorsHorizontal = $('<ul></ul>').addClass('nos-appdesk-inspectors nos-appdesk-inspectors-h')
                    .appendTo(self.uiSplitterHorizontalTop);
                self.uiSplitterHorizontalBottom = $('<div></div>').appendTo(self.uiSplitterHorizontal);

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

                self._css()
                    ._uiToolbar()
                    ._uiSplitters()
                    ._uiInspectors()
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
                                if (rules[r].selectorText === '.wijmo-wijgrid tr.wijmo-wijgrid-row.ui-state-hover, .wijmo-wijgrid .wijmo-wijgrid-current-cell, .wijmo-wijgrid td.wijmo-wijgrid-rowheader.ui-state-active') {
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
                            .addClass('primary')
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
                            self.uiToolbarContextsDialog.find(':checkbox').attr('checked', false);
                            $.each(o.selectedContexts, function(i, context) {
                                self.uiToolbarContextsDialog.find(':checkbox[value="' + context + '"]').attr('checked', true);
                            });
                            self.uiToolbarContextsDialog.find(':checkbox').wijcheckbox('refresh');
                            self.uiToolbarContextsDialog.wijdialog('option', 'width', parseInt(self.uiToolbarContextsDialog.css('padding-left').replace('px')) * 2 + $table.outerWidth());
                        }
                    })
                    .nosOnShow('one', function() {
                        $table.wijgrid({
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
                            cellStyleFormatter: function(args) {
                                if (args.state & $.wijmo.wijgrid.renderState.selected) {
                                    args.$cell.removeClass('ui-state-highlight');
                                }
                                if (args._cellIndex > 0) {
                                    args.$cell.css('text-align', 'center');
                                    if (args.row.dataRowIndex === -1) {
                                        var data = $table.wijgrid('data');

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
                                                $checkbox.attr('checked', !checked)
                                                    .wijcheckbox('refresh');
                                            }
                                        });

                                    }
                                } else {
                                    var $tr = args.$cell.parent();
                                    args.$cell.click(function(e) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation();

                                        var $checkbox = $tr.find(':checkbox');
                                        $checkbox.attr('checked', !$checkbox.is(':checked'))
                                            .wijcheckbox('refresh');
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
                    o = self.options;

                self.uiToolbarContextsDialog.wijdialog('close');
                self._uiToolbarContextsButtonLabel();

                self.element.nosSaveUserConfig(o.name + '.selectedContexts', o.selectedContexts);

                self.uiSearchInput.val('');
                self.uiInspectorsTags.wijsuperpanel('destroy');
                self.uiInspectorsTags.empty();
                self._uiList();

                self.dispatcher.data('nosContext', o.selectedContexts)
                    .trigger('contextChange');

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

                    if (count > 10 && Object.key(o.contexts).length > 12) {
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
                        $('<option></option>')
                            .attr({
                                'value': key,
                                'selected': (o.selectedView == key)
                            })
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
                    refreshV = function() {
                        self.uiSplitterHorizontal.wijsplitter("refresh");
                        self._resizeInspectorsV(true)
                            ._resizeInspectorsH(true)
                            ._resizeList(true);
                    },
                    refreshH = function() {
                        self._resizeInspectorsH(true)
                            ._resizeList(true);
                    },
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
                            expanded: function () {
                                refreshV();
                            },
                            collapsed: function () {
                                refreshV();
                            },
                            sized: function () {
                                self.resizing = true;
                                refreshV();
                            }
                        }, self.options.splitters.vertical),
                    horizontalSplitter = $.extend(true, {
                            orientation: "horizontal",
                            fullSplit: true,
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
                            expanded: function () {
                                refreshH();
                            },
                            collapsed: function () {
                                refreshH();
                            },
                            sized: function () {
                                self.resizing = true;
                                refreshH();
                            }
                        }, self.options.splitters.horizontal);

                self.uiSplitterVertical.wijsplitter(verticalSplitter)
                    .find('.ui-resizable-handle')
                    .mousedown(function() {
                        self.resizing = false;
                    });

                self.uiSplitterHorizontal.wijsplitter(horizontalSplitter)
                    .find('.ui-resizable-handle')
                    .mousedown(function() {
                        self.resizing = false;
                    });

                return self;
            },

            _uiInspectors : function() {
                var self = this,
                    o = self.options;

                $.each(o.inspectors, function() {
                    if (!this.hide) {
                        $('<li></li>').addClass('nos-appdesk-inspector ui-widget-content')
                            .data('inspector', this)
                            .appendTo( this.vertical ? self.uiInspectorsVertical : self.uiInspectorsHorizontal );
                    }
                });

                self._resizeInspectorsV(true)
                    ._resizeInspectorsH(true);

                self.uiInspectorsVertical.find('> li')
                    .add(self.uiInspectorsHorizontal.find('> li'))
                    .each(function() {
                        self._loadInspector($(this));
                    });

                return self;
            },

            _loadInspector : function($li) {
                var self = this,
                    inspector = $li.data('inspector'),
                    o = self.options;

                inspector.selectionChanged = function(value, label) {
                        var multiple = false,
                            name = inspector.inputName;

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
                        self.uiInspectorsTags.wijsuperpanel('destroy');

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

                        self.uiInspectorsTags.wijsuperpanel({
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
                } else {
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
                        self.uiInspectorsTags.wijsuperpanel('destroy');
                        self.uiInspectorsTags.empty();
                        self.gridReload();
                    });

                self.uiInspectorsTags.height(self.uiInputContainer.height())
                    .width(parseInt(self.uiSearchBar.width() * 0.3))
                    .wijsuperpanel({
                        showRounder: false,
                        hScroller: {
                            scrollMode: 'buttons'
                        }
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
                        $('<input type="radio" class="view_' + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : '') + '" id="view_' + id + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : '') + '" name="view" ' + (o.defaultView === presentation.id && (!presentation.size || presentation.size === o.thumbnails.thumbnailSize) ? 'checked="checked"' : '') + '" />')
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

                self.uiThumbnail.thumbnailsgrid('destroy')
                    .empty()
                    .hide();
                self.uiGrid.noslistgrid('destroy')
                    .empty()
                    .hide();
                self.uiTreeGrid.nostreegrid('destroy')
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
                    position = self.uiGrid.offset(),
                    positionContainer = self.element.offset(),
                    height = self.element.height() - position.top + positionContainer.top,
                    heights = $.grid.getHeights(),
                    grid = $.extend(true, {}, o.grid);

                self._columnsMultiContext(grid.columns);

                self.uiGrid.css({
                        height : height,
                        width : '100%'
                    })
                    .noslistgrid($.extend({
                        loadingText: o.texts.loading,
                        columnsAutogenerationMode : 'none',
                        selectionMode: 'singleRow',
                        showFilter: self.showFilter,
                        allowSorting: true,
                        scrollMode : 'auto',
                        allowPaging : true,
                        culture: o.culture,
                        pageIndex : self.pageIndex,
                        pageSize: Math.floor((height - heights.footer - heights.header - (self.showFilter ? heights.filter : 0)) / heights.row),
                        allowColSizing : true,
                        allowColMoving : true,
                        data: new wijdatasource({
                            dynamic: true,
                            proxy: new wijhttpproxy({
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
                                } else if (dataSource.data.totalRows === 1) {
                                    self.uiPaginationLabel.html(o.texts.showOneItem);
                                    self.uiNbResult.html('1 ' + o.texts.item);
                                } else {
                                    self.uiPaginationLabel.html(o.texts.showNbItems.replace('{{x}}', dataSource.data.length).replace('{{y}}', dataSource.data.totalRows));
                                    self.uiNbResult.html(dataSource.data.totalRows + ' ' + o.texts.items);
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
                            if (args.state & $.wijmo.wijgrid.renderState.selected && args.$cell.hasClass('ui-state-default')) {
                                args.$cell.removeClass("ui-state-highlight");
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
                    position = self.uiTreeGrid.offset(),
                    positionContainer = self.element.offset(),
                    height = self.element.height() - position.top + positionContainer.top,
                    grid = $.extend(true, {}, o.grid),
                    columns = $.extend({}, o.treeGrid.columns || o.grid.columns);

                delete grid.columns;
                delete grid.urlJson;

                self._columnsMultiContext(columns);

                self.uiTreeGrid.css({
                        height : height,
                        width : '100%'
                    }).nostreegrid($.extend(true, { // True for recursive clone
                        loadingText: o.texts.loading,
                        urlJson : o.treeGrid.urlJson,
                        treeOptions : {
                            context : o.selectedContexts || ''
                        },
                        columnsAutogenerationMode : 'none',
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
                            if (args.state & $.wijmo.wijgrid.renderState.selected && args.$cell.hasClass('ui-state-default')) {
                                args.$cell.removeClass("ui-state-highlight");
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
                    o = self.options,
                    position = self.uiThumbnail.offset(),
                    positionContainer = self.element.offset(),
                    height = self.element.height() - position.top + positionContainer.top;

                self.uiThumbnail.css('height', height)
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
                            } else if (dataSource.data.totalRows === 1) {
                                self.uiPaginationLabel.html(o.texts.showOneItem);
                                self.uiNbResult.html('1 ' + o.texts.item);
                            } else {
                                self.uiPaginationLabel.html(o.texts.showNbItems.replace('{{x}}', dataSource.data.length).replace('{{y}}', dataSource.data.totalRows));
                                self.uiNbResult.html(dataSource.data.totalRows + ' ' + o.texts.items);
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

            _columnsMultiContext : function(columns) {
                var self = this,
                    o = self.options;

                if (!o.hideContexts) {
                    $.each(columns, function(i, column) {
                        if (column.dataKey === 'context') {
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

                if (self.resizing) {
                    var inspectors = self.uiInspectorsVertical.find('.wijmo-wijsplitter-v-bar')
                        .css({
                            width : null,
                            borderRightWidth : null
                        })
                        .end()
                        .find('> li').css({
                            width: '100%',
                            height: 'auto'
                        });

                    if (inspectors.length) {
                        inspectors.css('height', ( self.uiInspectorsVertical.height() / inspectors.length )  + 'px')
                            .trigger(reload ? 'widgetReload' : 'widgetResize');
                    } else {
                        self._hideSplitterV();
                    }
                }

                return self;
            },

            _resizeInspectorsH : function(reload) {
                var self = this;

                if (self.resizing) {
                    var inspectors = self.uiInspectorsHorizontal.find('.wijmo-wijsplitter-h-bar')
                        .css({
                            height : null,
                            borderTopWidth : null
                        })
                        .end()
                        .find('> li').css({
                            width: 'auto',
                            height: '100%'
                        });

                    if (inspectors.length) {
                        inspectors.css('width', ( self.uiInspectorsHorizontal.width() / inspectors.length )  + 'px')
                            .trigger(reload ? 'widgetReload' : 'widgetResize');
                    } else {
                        self._hideSplitterH();
                    }
                }

                self.uiSplitterVertical.wijsplitter('option', 'splitterDistance');

                self._trigger('slidersChange', null, self.slidersSettings());

                return self;
            },

            _resizeList : function(reload) {
                var self = this,
                    o = self.options;

                if (self.init) {
                    var height = self.uiSplitterHorizontalBottom.height() - self.uiSearchBar.outerHeight(true);
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
                        if (reload) {
                            var heights = $.grid.getHeights();
                            self.uiGrid.noslistgrid('option', 'pageSize', Math.floor((height - heights.footer - heights.header - (self.showFilter ? heights.filter : 0)) / heights.row));
                        }
                    }
                }

                return self;
            },

            _hideSplitterV : function() {
                var self = this;

                self.uiSplitterVertical.find('.wijmo-wijsplitter-v-bar')
                    .css({
                        width : '0px',
                        borderRightWidth : '0px'
                    })
                    .end()
                    .wijsplitter('option', 'panel1', {collapsed : true})
                    .wijsplitter('refresh', true, false);

                return self;
            },

            _hideSplitterH : function() {
                var self = this;

                self.uiSplitterHorizontal.find('.wijmo-wijsplitter-h-bar')
                    .css({
                        height : '0px',
                        borderTopWidth : '0px'
                    })
                    .end()
                    .wijsplitter('option', 'panel1', {collapsed : true})
                    .wijsplitter('refresh', true, false);

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
                        self.uiGrid.noslistgrid("ensureControl", true);
                    }
                }

                return self;
            },

            resize : function() {
                var self = this,
                    o = self.options;

                self.uiSplitterVertical.wijsplitter('refresh', true, false);
                self.uiSplitterHorizontal.wijsplitter('refresh', true, false);

                self._resizeInspectorsV()
                    ._resizeInspectorsH()
                    ._resizeList();

                return self;
            },

            slidersSettings : function() {
                return {
                    vertical: {
                        splitterDistance: this.uiSplitterVertical.wijsplitter('option', 'splitterDistance') / $(window).width()
                    },
                    horizontal: {
                        splitterDistance: this.uiSplitterHorizontal.wijsplitter('option', 'splitterDistance') / $(window).height()
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
                                        for (i = 0; i < object[key].length; i++) {
                                            if (object[key][i].context) {
                                                if (configToUse.hideContexts) {
                                                    object[key].splice(i, 1);
                                                    i--;
                                                    continue;
                                                }
                                                nosContext = $.nosContext({
                                                    locales: config.locales,
                                                    sites: config.sites,
                                                    contexts: config.contexts
                                                });
                                                object[key][i] = {
                                                    headerText : nosContext.label({
                                                        oneLocale: i18n.sites,
                                                        oneSite: i18n.languages,
                                                        defaultLabel: i18n.contexts || 'Contexts'
                                                    }),
                                                    dataKey    : 'context',
                                                    setupkey   : 'context',
                                                    allowSort : false,
                                                    showFilter : false,
                                                    cellFormatter : function(args) {
                                                        if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                                            args.$container.css("text-align", "center").html(args.row.data.context);
                                                            return true;
                                                        }
                                                    },
                                                    width : 1
                                                };
                                            } else if (object[key][i].actions) {
                                                actions = object[key][i].actions;
                                                var width;
                                                var showOnlyArrow = object[key][i].showOnlyArrow ? true : false;

                                                if (showOnlyArrow) {
                                                    width = 20;
                                                } else {
                                                    width = $.grid.getActionWidth(actions);

                                                    if (actions.length > 1) {
                                                        // Reserve space for the dropdown actions menu
                                                        //width -= 20;
                                                    }
                                                    // At least 80px wide
                                                    //width = Math.max(width, 80);
                                                }

                                                // Make the drop-down actions columns
                                                object[key][i] = {
                                                    headerText : showOnlyArrow ? '' : '',
                                                    cellFormatter : function(args) {
                                                        var buttons;
                                                        if ($.isPlainObject(args.row.data)) {

                                                            buttons = $.appdeskActions(actions, args.row.data, {
                                                                showOnlyArrow : showOnlyArrow
                                                            });

                                                            buttons.appendTo(args.$container);
                                                            args.$container.parent().addClass('buttontd').css({width: width + 1});

                                                            return true;
                                                        }
                                                    },
                                                    allowSizing : false,
                                                    allowSort : false,
                                                    width : width,
                                                    ensurePxWidth : true,
                                                    showFilter : false,
                                                    setupkey: 'actions'
                                                };
                                            } else if (object[key][i].cellFormatters) {
                                                (function() {
                                                    var cellFormatters = $.isPlainObject(object[key][i].cellFormatters) ? object[key][i].cellFormatters : [object[key][i].cellFormatter];
                                                    var oldCellFormatter = object[key][i].cellFormatter;
                                                    object[key][i] = $.extend(object[key][i], {
                                                        cellFormatter : function(args) {
                                                            if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                                                args.$container.html(args.formattedValue);
                                                                if ($.isFunction(oldCellFormatter)) {
                                                                    oldCellFormatter.call(this, args);
                                                                }
                                                                $.each(cellFormatters, function(i, formatter) {
                                                                    formatter = $.type(formatter) === 'object' ? formatter : {type: formatter};
                                                                    if (formatter.replace) {
                                                                        args.$container.empty();
                                                                    }
                                                                    switch (formatter.type) {
                                                                        case 'bold':
                                                                            args.$container.css('font-weight', 'bold');
                                                                            break;

                                                                        case 'css':
                                                                            if ($.type(formatter.css) === 'object') {
                                                                                args.$container.css(formatter.css);
                                                                            }
                                                                            break;

                                                                        case 'icon':
                                                                            if ($.isPlainObject(args.row.data)) {
                                                                                var src = '';
                                                                                formatter.column && args.row.data[formatter.column] && (src = args.row.data[formatter.column]);
                                                                                formatter.src && (src = formatter.src);
                                                                                $.type(formatter.mapping) === 'object' && formatter.mapping[args.formattedValue] && (src = formatter.mapping[args.formattedValue]);
                                                                                if (!src) {
                                                                                    break;
                                                                                }
                                                                                var size = (formatter.size ? ' width="' + formatter.size + '" height="' + formatter.size + '"' : '');
                                                                                args.$container.prepend(' <img src="' + src + '" ' + size + ' style="vertical-align: middle;" /> ');
                                                                            }
                                                                            break;

                                                                        case 'iconClasses':
                                                                            if ($.isPlainObject(args.row.data)) {
                                                                                if (formatter.column && !args.row.data[formatter.column]) {
                                                                                    break;
                                                                                }
                                                                                args.$container.prepend(' <span class="' + (formatter.column ? args.row.data[formatter.column] : formatter.classes) + '" style="float:left;"></span> ');
                                                                            }
                                                                            break;

                                                                        case 'link':
                                                                            args.$container.wrapInner(
                                                                                $('<a href="#"></a>')
                                                                                    .click(function(e) {
                                                                                        e.preventDefault();
                                                                                        if (formatter.action === 'default' && actions.length && actions[0].action) {
                                                                                            formatter.action = actions[0].action;
                                                                                        }
                                                                                        if (formatter.action && $.type(formatter.action) !== 'object' && appdesk.actions && appdesk.actions[formatter.action]) {
                                                                                            formatter.action = appdesk.actions[formatter.action].action;
                                                                                        }
                                                                                        if ($.type(formatter.action) === 'object') {
                                                                                            $(this).nosAction(formatter.action, args.row.data);
                                                                                        }
                                                                                    })
                                                                            )
                                                                            break;
                                                                    }
                                                                });

                                                                return true;
                                                            }
                                                        }
                                                    });
                                                })();
                                            }
                                        }
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
                                            splitters : {},
                                            slidersChange : function(e, rapport) {
                                                //$.saveUserConfiguration("'.$config['configuration_id'].'.ui.splitters", rapport)
                                            }
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
                        };
                        listenEvent();
                        dispatcher.on('contextChange', function() {
                            dispatcher.nosUnlistenEvent('appdeskContext');
                            listenEvent();
                        });
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
            },

            // Keep track of all created menus so we can hide them when
            appdeskActionsList : [],
            appdeskActions : function(actions, noParseData, options) {
                options = options || {};
                var container = $('<table><tr></tr></table>').addClass('buttontd wijgridtd');

                var actionsPrimary = [];
                var actionsSecondary = [];

                // Possibility to always hide everyting
                if (!options.showOnlyArrow) {
                    $.each(actions, function() {
                        if (this.primary) {
                            actionsPrimary.push(this);
                        } else {
                            actionsSecondary.push(this);
                        }
                    });

                    // If there is only 1 secondary action and it has an icon, don't show the dropdow, but show the action as a button
                    if (actionsSecondary.length == 1 && (actionsSecondary[0].icon || actionsSecondary[0].iconClasses)) {
                        actionsPrimary.push(actionsSecondary[0]);
                    }

                    $.each(actionsPrimary, function(i, action) {
                        var iconClass = false;
                        if (action.iconClasses) {
                            iconClass = action.iconClasses;
                        } else if (action.icon) {
                            iconClass = 'ui-icon ui-icon-' + action.icon;
                        }
                        var uiAction = $('<th></th>')
                            .css('white-space', 'nowrap')
                            .addClass("ui-state-default" + (action.red ? ' ui-state-error' : ''))
                            .attr('title', action.label)
                            .html( (iconClass ? '<span class="' + iconClass +'"></span>' : '') + (action.text || !iconClass ? '&nbsp;' + action.label + '&nbsp;' : ''));

                        // Check whether action name is disabled
                        if (action.name && noParseData && noParseData.actions && noParseData.actions[action.name] == false) {
                            uiAction.addClass('ui-state-disabled')
                                .click(function(e) {
                                    e.stopImmediatePropagation();
                                    e.preventDefault();
                                });
                        } else {
                            uiAction.click(function(e) {
                                    e.stopImmediatePropagation();
                                    e.preventDefault();
                                    uiAction.nosAction(action.action, noParseData);
                                })
                                .hover(
                                    function() {
                                        $(this).addClass("ui-state-hover");
                                    },
                                    function() {
                                        $(this).removeClass("ui-state-hover");
                                    }
                                );
                        }

                        if (iconClass && !action.text) {
                            uiAction.css({
                                width : 20,
                                textAlign : 'center'
                            }).children().css({
                                    margin : 'auto'
                                });
                        } else if (iconClass && action.text) {
                            uiAction.find('span').css('float', 'left');
                        }

                        uiAction.appendTo(container.find('tr'));
                    });
                }

                // Create the dropdown
                if (options.showOnlyArrow || actionsSecondary.length >= 2 || (actionsSecondary.length == 1 && !(actionsSecondary[0].icon || actionsSecondary[0].iconClasses))) {

                    var dropDown = $('<th></th>')
                        .addClass("ui-state-default")
                        .css({
                            width: '20px'
                        })
                        .hover(
                        function() {
                            $(this).addClass("ui-state-hover");
                        },
                        function() {
                            $(this).removeClass("ui-state-hover");
                        }
                    );

                    $("<span></span>")
                        .addClass("ui-icon ui-icon-triangle-1-s")
                        .appendTo(dropDown);

                    // Don't select the line when clicking the "more actions" arrow dropdown
                    dropDown.appendTo(container.find('tr')).click(function(e) {

                        $.each($.appdeskActionsList, function() {
                            $(this).wijmenu('hideAllMenus');
                        });

                        if (!this.created) {
                            var ul = $('<ul></ul>');
                            $.each(actions, function(key, action) {
                                var iconClass;
                                if (action.iconClasses) {
                                    iconClass = action.iconClasses;
                                } else if (action.icon) {
                                    iconClass = 'ui-icon ui-icon-' + action.icon;
                                }
                                var text = '<span class="' + (iconClass ? iconClass : 'nos-icon16 nos-icon16-empty') + ' wijmo-wijmenu-icon-left"></span><span class="wijmo-wijmenu-text">'+action.label+'</span>';
                                var li = $('<li><a href="#"></a></li>')
                                    .appendTo(ul)
                                    .find('a')
                                    .html(text);

                                if (action.red) {
                                    li.addClass('ui-state-error');
                                }

                                // Check whether action name is disabled
                                if (action.name && noParseData.actions && noParseData.actions[action.name] == false) {
                                    li.addClass('ui-state-disabled')
                                        .click(function(e) {
                                            e.stopImmediatePropagation();
                                            e.preventDefault();
                                        });
                                } else {
                                    li.click(function(e) {
                                        e.stopImmediatePropagation();
                                        e.preventDefault();
                                        // Hide me
                                        ul.wijmenu('hideAllMenus');
                                        li.nosAction(action.action, noParseData);
                                    });
                                }
                            });

                            // Search the higher ancestor possible
                            // @todo Review this, because when it's called from inspectors, the result is a <table>
                            //       which is not convenient to add <ul>s or <div>s
                            var containerActions = dropDown.closest('.ui-dialog-content, .nos-dispatcher, body');

                            ul.appendTo(containerActions);

                            ul.wijmenu({
                                trigger : dropDown,
                                triggerEvent : 'click',
                                orientation : 'vertical',
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
                                position : {
                                    my        : 'right top',
                                    at        : 'right bottom',
                                    collision : 'flip',
                                    offset    : '0 0'
                                }
                            });

                            $.appdeskActionsList.push(ul);

                            this.created = true;

                            // Now the menu is created, trigger the event to show it
                            dropDown.triggerHandler('click');
                        }

                    });
                    dropDown.click(false);
                }
                return container;
            },

            grid : {
                getHeights : function() {
                    if (this.heights === undefined) {
                        var $div = $('<div></div>')
                            .appendTo('body');

                        var table = $('<table></table>')
                            .addClass('nos-appdesk')
                            .appendTo($div)
                            .noslistgrid({
                                scrollMode : 'auto',
                                pageSize: 1,
                                showFilter: true,
                                allowPaging : true,
                                data: [ ['test'], ['test2'] ]
                            });
                        this.heights = {
                            row : table.find('tr:first').height(),
                            footer : $div.find('.wijmo-wijgrid-footer').outerHeight(),
                            header : $div.find('.wijmo-wijgrid-headerrow').outerHeight(),
                            filter : $div.find('.wijmo-wijgrid-filterrow').outerHeight()
                        };
                        table.noslistgrid('destroy');
                        $div.remove();
                    }
                    return this.heights;
                },
                getActionWidth : function(actions) {

                    /*
                     this.cache = {};
                     if (null != this.cache[text]) {
                     return this.cache[text];
                     }*/

                    var $div = $('<div></div>')
                        .appendTo('body');

                    var table = $('<table></table>')
                        .addClass('nos-appdesk')
                        .appendTo($div)
                        .noslistgrid({
                            scrollMode : 'none',
                            showFilter: true,
                            allowPaging : true,
                            columns : [
                                {
                                    headerText : '',
                                    cellFormatter : function(args) {
                                        if ($.isPlainObject(args.row.data)) {

                                            var buttons = $.appdeskActions(actions, []);

                                            buttons.appendTo(args.$container);
                                            args.$container.parent().addClass('buttontd');

                                            return true;
                                        }
                                    },
                                    allowSizing : true,
                                    showFilter : false,
                                    ensurePxWidth : true
                                }
                            ],
                            data: [
                                {
                                    'key' : 'value'
                                }
                            ]
                        });
                    $div.find('table.buttontd.wijgridtd').css({
                        'font-size' : '1.05em',
                        'width' : 'auto'
                    });
                    //this.cache[text] = $div.find('.buttontd .buttontd:first').outerWidth();
                    var width = $div.find('.buttontd .buttontd:first').outerWidth();
                    table.noslistgrid('destroy');
                    $div.remove();
                    return width;
                    //return this.cache[text];
                }
            }
        });

        return $;
    });
