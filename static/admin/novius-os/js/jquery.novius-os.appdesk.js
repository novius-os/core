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
                adds : [],
                inspectors : [],
                thumbnails : false,
                defaultView : 'grid',
                locales : {},
                hideLocales : false,
                texts : {
                    allLanguages : 'All',
                    addDropDown : 'Select an action',
                    columns : 'Columns',
                    showFiltersColumns : 'Filters column header',
                    visibility : 'Visibility',
                    settings : 'Settings',
                    vertical : 'Vertical',
                    horizontal : 'Horizontal',
                    hidden : 'Hidden',
                    save : 'Save',
                    cancel: 'Cancel',
                    mainView: 'Main view',
                    item : 'item',
                    items : 'items',
                    showNbItems : 'Showing {{x}} items out of {{y}}',
                    showOneItem : 'Show 1 item',
                    showNoItem : 'No item',
                    showAll : 'Show all items',
                    views : 'Views',
                    viewGrid : 'Grid',
                    viewTreeGrid : 'Tree grid',
                    viewThumbnails : 'Thumbnails',
                    loading : 'Loading...'
                },
                values: {},
                //callbabks
                columnVisibilityChange : null,
                slidersChange : null,
                splitters: {
                    vertical: null,
                    horizontal: null
                },
                views: {},
                selectedView: null,
                selectedLang : null,
                fromView: null,
                name: null,
                grid: {}
            },

            pageIndex : 0,
            showFilter : false,
            gridRendered : false,
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

                self.uiHeaderBar = $('<div></div>').addClass('nos-appdesk-headerbar')
                    .appendTo(self.element);

                self.uiHeaderBarLeft = $('<div></div>').addClass('nos-appdesk-headerbar-left')
                    .appendTo(self.uiHeaderBar);
                self.uiAddsButton = $('<button type="button"></button>').addClass('primary').appendTo(self.uiHeaderBarLeft);

                self.uiHeaderBarRight = $('<div></div>').addClass('nos-appdesk-headerbar-right')
                    .appendTo(self.uiHeaderBar);
                self.uiLangsDropDownContainer = $('<div></div>').addClass('nos-appdesk-dropdownlang')
                    .appendTo(self.uiHeaderBarRight);
                self.uiViewsDropDownContainer = $('<div></div>').addClass('nos-appdesk-dropdownviews')
                    .appendTo(self.uiHeaderBarRight);

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
                self.uiSearchInput = $('<input type="search" name="search" placeholder="Search" value="" />')
                    .addClass('nos-appdesk-search-input ui-helper-reset')
                    .appendTo(self.uiInputContainer);
                self.uiInspectorsTags = $('<div></div>').addClass('nos-appdesk-inspectorstags')
                    .appendTo(self.uiInputContainer);
                self.uiResetSearch = $('<a href="#"></a>').text(o.texts.showAll)
                    .addClass('nos-appdesk-reset-search')
                    .appendTo(self.uiInputContainer);
                self.uiuiResetSearchIcon = $('<span></span>').text(o.texts.showAll)
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

                if (!$.isEmptyObject(o.locales)) {

                    if (o.selectedLang && o.selectedLang.length) {
                        o.selectedLang = null;
                    }

                    if (o.selectedLang == null) {
                        o.selectedLang = Object.keys(o.locales)[0];
                    }
                }

                self._css()
                    ._uiAdds()
                    ._uiSplitters()
                    ._uiInspectors()
                    ._uiSearchBar()
                    ._uiList()
                    ._uiLangsDropDown()
                    ._uiViewsDropDown();

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

            _uiAdds : function() {
                var self = this,
                    o = self.options;

                if (!$.isArray(o.adds) || !o.adds.length) {
                    self.uiHeaderBarLeft.hide();
                    return self;
                }

                var first = o.adds.shift();

                self.uiAddsButton.button({
                        label: first.label,
                        icons : {
                            primary: 'ui-icon ui-icon-plus',
                            secondary: null
                        }
                    })
                    .click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        if ($.isFunction(first.action)) {
                            first.action($(this), {
                                lang: o.selectedLang
                            });
                        } else {
                            $(this).nosTabs('add', {
                                iframe : true,
                                url : first.url,
                                label : first.label
                            });
                        }
                    });

                $.each(o.adds, function(i, add) {
                    $('<a href="#"></a>')
                        .addClass('nos-appdesk-action-secondary')
                        .text(this.label)
                        .appendTo(self.uiHeaderBarLeft)
                        .click(function(e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if ($.isFunction(add.action)) {
                                add.action($(this), {
                                    lang: o.selectedLang
                                });
                            } else {
                                $(this).nosTabs('add', {
                                    iframe : true,
                                    url : add.url,
                                    label : add.label
                                });
                            }
                        });

                });

                return self;
            },

            _uiLangsDropDown : function() {
                var self = this,
                    o = self.options;

                if (o.hideLocales) {
                    self.uiLangsDropDownContainer.hide();
                    return self;
                }

                if (o.selectedLang && o.selectedLang.length) {
                    o.selectedLang = null;
                }

                //self.uiLangsDropDown = $('<select></select>').appendTo(self.uiLangsDropDownContainer);
                if (o.selectedLang == null) {
                    var first = true;
                    $.each(o.locales, function(key, locale) {
                        if (first) {
                            o.selectedLang = key;
                            first = false;
                        }
                    });
                }

                var date = new Date();
                var uniqid = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();

                $.each(o.locales, function(key, locale) {
                    var flag = key.split('_')[1].toLowerCase();
                    self.uiLangsDropDownContainer.append(
                        $('<input type="radio" name="' + uniqid +'" id="' + key + '_' + uniqid + '" value="' + key +'" ' + (o.selectedLang == key ? 'checked' : '') + '/> <label for="' + key + '_' + uniqid + '" title="' + locale + '"><img src="static/novius-os/admin/novius-os/img/flags/' + flag + '.png" /></label>')
                    );
                });

                self.uiLangsDropDownContainer.append(
                    $('<input type="radio" name="' + uniqid +'" id="all_' + uniqid + '" value="" ' + (o.selectedLang == "" ? 'checked' : '') + '/> <label for="all_' + uniqid + '">' + o.texts.allLanguages + '</label>')
                );
                self.uiLangsDropDownContainer.buttonset();

                self.uiLangsDropDownContainer.find('input[name=' + uniqid + ']').change(function() {
                    var select = $(this);

                    o.selectedLang = select.val();

                    select.nosSaveUserConfig(o.name + '.selectedLang', o.selectedLang);

                    self.gridReload();
                    self.dispatcher.data('nosLang', o.selectedLang)
                        .trigger('langChange');
                }).filter(function() {
                    return $(this).val() == o.selectedlang;
                });

                return self;
            },

            _uiViewsDropDown : function() {
                var self = this,
                    o = self.options;

                // If we're in a virtual view, we can't escape
                if (o.views[o.selectedView] && o.views[o.selectedView].virtual) {
                    return self;
                }

                self.uiViewsDropDown = $('<select></select>').appendTo(self.uiViewsDropDownContainer);

                $.each(o.views, function(key, view) {
                    // Virtual views can't be switched to
                    if (view.virtual) {
                        return;
                    }
                    self.uiViewsDropDown.append(
                        $('<option></option>')
                            .attr({
                                'value': key,
                                'selected': (o.selectedView == key)
                            })
                            .append(view.name)
                    );
                });

                self.uiViewsDropDown.append(
                    $('<option></option>')
                        .attr({
                            'value': 'custom',
                            'selected': (o.selectedView == 'custom')
                        })
                        .append('Custom view')
                );

                self.uiViewsDropDown.append(
                    $('<option></option>')
                        .attr('value', 'edit_custom')
                        .append('Edit custom view')
                );

                self.uiViewsDropDown.wijdropdown();

                self.uiViewsDropDown.change(function() {
                    var $dropdown = $(this);

                    if ($dropdown.val() == 'edit_custom') {
                        var $el = self._uiCustomViewDialog();
                        self.uiCustomViewDialog = $(self.uiViewsDropDown).nosDialog({
                            title: o.texts.settings,
                            contentUrl: null,
                            content: $el,
                            onLoad: function() {

                                $el.css({height: '90%'});
                                $el.wijtabs({
                                    alignment: 'left',
                                    scrollable: true,
                                    show: function(e, ui) {
                                        $(ui.panel).find('.superpanel').wijsuperpanel({
                                            autoRefresh: true,
                                            hScroller: {
                                                scrollMode: 'buttons'
                                            }
                                        });
                                        var $layout = $(ui.panel).find('#layout_settings');
                                        self._uiCustomViewDialogRefreshLayout($layout);
                                        $layout.find('.panels').sortable({
                                                connectWith: ".panels",
                                                update: function() {
                                                    self._uiCustomViewDialogRefreshLayout($layout);
                                                },
                                                change: function() {
                                                    self._uiCustomViewDialogRefreshLayout($layout);
                                                },
                                                start: function(event, ui) {
                                                    $(ui.item).addClass('moving');
                                                    self._uiCustomViewDialogRefreshLayout($layout);
                                                },
                                                stop: function(event, ui) {
                                                    $(ui.item).removeClass('moving');
                                                    self._uiCustomViewDialogRefreshLayout($layout);
                                                },
                                                placeholder: "droping"
                                        });
                                        self._uiCustomViewDialogRefreshColumns($(ui.panel).find('.columns-settings'));
                                    }
                                });
                                //$el.css({height: self.uiCustomViewDialog.height() * 0.9});
                                $el.after(
                                    $('<div></div>').css({
                                        textAlign: 'right'
                                    }).append(
                                        $('<button />').button({
                                                label : o.texts.cancel,
                                                icons : {primary : 'ui-icon-gear'}
                                            }).click( function() {
                                                self.uiCustomViewDialog.nosDialog('close');
                                            })
                                    ).append(
                                        $('<button />').button({
                                                label : o.texts.save,
                                                icons : {primary : 'ui-icon-gear'}
                                            }).click( function() {
                                                self._uiCustomViewDialogSave();
                                                self.uiCustomViewDialog.nosDialog('close');
                                            })
                                    )
                                );
                            }
                        });


                        $dropdown.find('option').attr('selected', '');
                        $dropdown.find('option[value=custom]').attr('selected', 'selected');
                        $dropdown.wijdropdown("refresh");
                        $dropdown.nosSaveUserConfig(o.name + '.selectedView', $(this).val());
                    } else {
                        $dropdown.nosSaveUserConfig(o.name + '.selectedView', $(this).val());
                        self.element.trigger('reloadView', {selectedView: $(this).val()});
                    }
                });

                return self;
            },

            _uiCustomViewDialog : function() {
                var self = this,
                    o = self.options,
                    $el = $('<div><ul></ul></div>');

                self._uiCustomViewDialogAddLayoutTab($el);

                self._uiCustomViewDialogAddMainViewTab($el);

                self._uiCustomViewDialogAddInspectorsTab($el);

                return $el;
            },

            _uiCustomViewDialogAddMainViewTab: function($el) {
                var self = this,
                    o = self.options;
                self._uiCustomViewDialogAddItem($el, o.texts.mainView, self._uiCustomViewDialogGetWidgetContentSettings('settings-main-view', o.texts.mainView, self.options));
                $el.find(' > ul > li:last').addClass('separator');
            },

            _uiCustomViewDialogAddInspectorsTab: function($el) {
                var self = this,
                    o = self.options;
                for (var i = 0; i < o.inspectors.length; i++) {
                    self._uiCustomViewDialogAddItem($el, o.inspectors[i].label, self._uiCustomViewDialogGetWidgetContentSettings('settings-inspector-' + i, o.inspectors[i].label, o.inspectors[i]));
                }
            },

            _uiCustomViewDialogGetWidgetContentSettings: function(id, title, settings) {
                var self = this,
                    o = self.options;

                var $contentSettings = $('<div class="content-settings columns-settings"></div>')
                                        .attr({id: id});

                $contentSettings.append(
                    $('<h1></h1>').append(
                        title
                    )
                );

                if (settings.grid) {
                    $contentSettings.append(
                        $('<h2></h2>').append(
                            'Columns' // o.texts.columns ????
                        )
                    );

                    var $columns = $('<ul class="widget-columns"></ul>');
                    var columns = settings.grid.columns;

                    var i;
                    for (i = 0; i < columns.length; i++) {
                        if (columns[i].visible !== false) {
                            $columns.append(
                                $('<li style="float: left;"></li>')
                                    .data('column-id', i)
                                    .append(
                                        $('<div class="title-zone"></div>')
                                            .append (
                                                columns[i].headerText
                                            )
                                    )
                            );
                        }
                    }



                    $contentSettings.append($columns);

                    $contentSettings.append(
                        $('<h2></h2>').append(
                            'Invisible columns' // o.texts.columns ????
                        )
                    );


                    var $notColumns = $('<ul class="not-columns widget-columns"></ul>');

                    for (i = 0; i < columns.length; i++) {
                        if (columns[i].visible === false) {
                            $notColumns.append(
                                $('<li style="float: left;"></li>')
                                    .data('column-id', i)
                                    .append(
                                        $('<div class="title-zone"></div>')
                                            .append (
                                                columns[i].headerText
                                            )
                                    )
                            );
                        }
                    }

                    $contentSettings.append($notColumns);

                    $contentSettings.find('.widget-columns').sortable({
                        placeholder: 'placeholder',
                        connectWith: '.widget-columns',
                        update: function() {
                            self._uiCustomViewDialogRefreshColumns($(this).parent());
                        },
                        change: function() {
                            self._uiCustomViewDialogRefreshColumns($(this).parent());
                        },
                        start: function(event, ui) {
                            $(ui.item).addClass('moving');
                            self._uiCustomViewDialogRefreshColumns($(this).parent());
                        },
                        stop: function(event, ui) {
                            $(ui.item).removeClass('moving');
                            self._uiCustomViewDialogRefreshColumns($(this).parent());
                        }
                    });
                }

                return $contentSettings;
            },

            _uiCustomViewDialogRefreshColumns : function($el) {
                var $uls = $el.find('ul');
                $uls.each(function() {
                    var $lis = $(this).find('li').not('.moving');
                    $lis.removeClass('last');
                    $lis.last().addClass('last');
                    $lis.css({width: ($(this).width() / $lis.length) - 1});
                });
            },

            _uiCustomViewDialogAddLayoutTab : function($el) {
                var self = this,
                    o = self.options;

                var $layout = $('<form id="layout_settings"></form>');

                $layout.append(
                    $('<h1></h1>').append(
                        'Layout'
                    )
                );

                $layout.append(
                    $('<div class="layout"></div>')
                        .append(
                            $('<ul class="left-panel panels"></ul>')
                        )
                        .append(
                            $('<div class="right-side"></div>')
                            .append($('<div class="inside"></div>')
                                .append(
                                    $('<ul class="top-panel panels"></ul>')
                                )
                                .append(
                                    $('<div class="content"></div>')
                                )
                            )
                        )
                );

                var $notLayout = $('<div class="not-layout superpanel"></div>')
                        .append(
                            '<ul class="invisible-panel panels"></ul>'
                        );

                self._uiCustomViewDialogAddItem($el, "Layout", $layout);

                var $leftPanel = $layout.find('.left-panel');
                var $topPanel = $layout.find('.top-panel');
                var $invisiblePanel = $notLayout.find('.invisible-panel');

                $layout.find('.not-layout').wijsuperpanel({
                    hScroller: {
                        scrollMode: 'buttons'
                    }
                });

                for (var i = 0; i < o.inspectors.length; i++) {
                    var visible = !o.inspectors[i].hide;
                    var vertical = o.inspectors[i].vertical;
                    var $inspectorEl = $('<li class="layout-inspector"></li>')
                                    .data('inspector-id', i)
                                    .append(
                                        $('<div></div>')
                                            .append(o.inspectors[i].label)
                                    );
                    if (visible) {
                        if (vertical) {
                            $leftPanel.append(
                                $inspectorEl
                            );
                        } else {
                            $topPanel.append(
                                $inspectorEl
                            );
                        }
                    } else {
                        $invisiblePanel.append(
                            $inspectorEl
                        );
                    }
                }

                $layout.append($notLayout);

                self._uiCustomViewDialogRefreshLayout($layout);
            },

            _uiCustomViewDialogRefreshLayout : function($layout) {
                var $leftPanel = $layout.find('.left-panel'),
                    $topPanel = $layout.find('.top-panel'),
                    $invisiblePanel = $layout.find('.invisible-panel'),
                    $leftLis = $leftPanel.find('li').not('.moving');

                $leftLis.css({
                    height: ($leftPanel.height() - $leftLis.length) / $leftLis.length,
                    width: ''
                });
                $leftLis.removeClass('last');
                $($leftLis[$leftLis.length - 1]).addClass('last');


                var $topLis = $topPanel.find('li').not('.moving');

                $topLis.css({
                    width: ($topPanel.width() - $topLis.length) / $topLis.length,
                    height: ''
                });
                $topLis.removeClass('last');
                $($topLis[$topLis.length - 1]).addClass('last');


                var $invisibleLis = $invisiblePanel.find('li').not('.moving');

                $invisibleLis.css({
                    width: '',
                    height: ''
                });
                $invisibleLis.removeClass('last');
                $($invisibleLis[$invisibleLis.length - 1]).addClass('last');
                $invisiblePanel.css({
                    width: Math.max(($invisibleLis.length + 1) * ($invisibleLis.width() + 1), 100)
                });
            },

            _uiCustomViewDialogSave : function() {
                var self = this,
                    o = self.options;


                for (var j = 0; j < o.inspectors.length; j++) {
                    if (o.inspectors[j].grid) {
                        var gridColumns = o.inspectors[j].grid.columns;
                        var newColumns = [];
                        o.inspectors[j].grid.columnsOrder = [];
                        self.uiCustomViewDialog.find('#settings-inspector-' + j + ' > ul li').each(function(i, el) {
                            var $this = $(this);
                            var newColumn = gridColumns[$this.data('column-id')];


                            newColumn.visible = !$this.closest('ul').hasClass('not-columns');
                            newColumns.push(newColumn);
                            o.inspectors[j].grid.columnsOrder.push(newColumn['setupkey']);
                        });
                        o.inspectors[j].grid.columns = newColumns;
                    }
                }
                o.inspectorsOrder = [];
                var newInspectors = [];
                var layoutSettings = self.uiCustomViewDialog.find('#layout_settings');
                layoutSettings.find('.layout-inspector').each(function() {
                    var newInspector = self.options.inspectors[$(this).data('inspector-id')];
                    var $panel = $(this).closest('.panels');
                    newInspector.hide = $panel.hasClass('invisible-panel');
                    newInspector.vertical = $panel.hasClass('left-panel');
                    newInspectors.push(newInspector);
                    o.inspectorsOrder.push(newInspector['setupkey']);
                });
                self.options.inspectors = newInspectors;

                newColumns = [];


                o.grid.columnsOrder = [];
                self.uiCustomViewDialog.find('#settings-main-view > ul li').each(function(i, el) {
                    var $this = $(this),
                    newColumn = o.grid.columns[$this.data('column-id')];
                    o.grid.columnsOrder.push(newColumn['setupkey']);

                    newColumn.visible = !$this.closest('ul').hasClass('not-columns');
                    newColumns.push(newColumn);
                });

                self.options.grid.columns = newColumns;

                self.element.find('.nos-appdesk-inspector').remove();


                var custom = self._saveUserConfiguration();

                self.element.trigger('reloadView', {selectedView: 'custom', custom: custom});
            },

            _uiCustomViewDialogAddItem : function(element, itemName, content) {
                if ( typeof this.idMenu == 'undefined' ) this.idMenu = 0;
                element.find('> ul').append('<li><a href="#settings_menu_popup_item_' + this.idMenu + '">' + itemName + '</a></li>');
                element.append($('<div id="settings_menu_popup_item_' + this.idMenu + '"></div>').append(content));
                this.idMenu++;
            },

            _saveUserConfiguration: function() {
                var self = this,
                    o = self.options,
                    custom = {
                        from:  o.selectedView != 'custom' ? o.selectedView : o.fromView,
                        appdesk: self._getInspectorsConfiguration(o)
                    };

                custom.appdesk.grid = self._getGridConfiguration(o.grid);

                self.element.nosSaveUserConfig(o.name, {selectedView: 'custom', custom: custom});
                return custom;
            },

            _getGridConfiguration: function(gridFrom) {
                var grid = {columns: {}, columnsOrder: gridFrom.columnsOrder.join(',')};
                var orderedColumns = this._getParameters(gridFrom.columns, this.variantColumnsProperties);

                for (var i = 0; i < gridFrom.columns.length; i++) {
                    grid.columns[gridFrom.columns[i].setupkey] = orderedColumns[i];
                }

                return grid;
            },

            _getInspectorsConfiguration: function(optionsFrom) {
                var newOptions = {inspectors: {}, inspectorsOrder: optionsFrom.inspectorsOrder.join(',')};
                var orderedInspectors = this._getParameters(optionsFrom.inspectors, this.variantInspectorsProperties);
                for (var i = 0; i < this.options.inspectors.length; i++) {
                    if (!orderedInspectors[i]['vertical']) {
                        orderedInspectors[i]['vertical'] = false;
                    }
                    newOptions['inspectors'][optionsFrom.inspectors[i].setupkey] = orderedInspectors[i];
                    if (this.options.inspectors[i]['grid']) {
                        newOptions['inspectors'][optionsFrom.inspectors[i].setupkey]['grid'] = this._getGridConfiguration(this.options.inspectors[i]['grid']);
                    }
                }
                return newOptions;
            },

            _getParameters: function(objects, selected) {
                var newObjects = [];
                for (var i = 0; i < objects.length; i++) {
                    var newObject = {};
                    for (var key in objects[i]) {
                        if (selected[key]) {
                            newObject[key] = objects[i][key];
                        }
                    }
                    newObjects.push(newObject);
                }
                return newObjects;
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
                            .text(label)
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
                            self.uiViewsButtons.find('#view_grid').click().blur();
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

                        if ($.inArray(event.keyCode, [keyCode.ENTER, keyCode.NUMPAD_ENTER]) != -1) {
                            if (o.defaultView === 'treeGrid') {
                                self.uiViewsButtons.find('#view_grid').click().blur();
                            } else {
                                self.gridReload();
                            }
                            return false;
                        }

                        self.timeoutSearchInput = setTimeout(function() {
                            if (o.defaultView === 'treeGrid') {
                                self.uiViewsButtons.find('#view_grid').click().blur();
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
                ];

                $.each(presentations, function() {
                    var presentation = this;
                    if (o[presentation.id]) {
                        $('<label for="view_' + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : '') + '"></label>')
                            .text(presentation.text + (presentation.size ? ' ' + presentation.size + 'px' : ''))
                            .appendTo(self.uiViewsButtons);
                        $('<input type="radio" id="view_' + presentation.id.toLowerCase() + (presentation.size ? '_' + presentation.size : '') + '" name="view" ' + (o.defaultView === presentation.id && (!presentation.size || presentation.size === o.thumbnails.thumbnailSize) ? 'checked="checked"' : '') + '" />')
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
                self.uiGridTitle.text(o.texts.item);

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
                    heights = $.grid.getHeights();

                self.uiGrid.css({
                        height : height,
                        width : '100%'
                    })
                    .noslistgrid($.extend({
                        columnsAutogenerationMode : 'none',
                        selectionMode: 'singleRow',
                        showFilter: self.showFilter,
                        allowSorting: true,
                        scrollMode : 'auto',
                        allowPaging : true,
                        pageIndex : self.pageIndex,
                        pageSize: Math.floor((height - heights.footer - heights.header - (self.showFilter ? heights.filter : 0)) / heights.row),
                        allowColSizing : true,
                        allowColMoving : true,
                        data: new wijdatasource({
                            dynamic: true,
                            proxy: new wijhttpproxy({
                                url: o.grid.proxyUrl,
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
                                dataSource.proxy.options.data.lang = o.selectedLang || '';
                                dataSource.proxy.options.data.inspectors = self._jsonInspectors();
                                dataSource.proxy.options.data.offset = r.pageIndex * r.pageSize;
                                dataSource.proxy.options.data.limit = r.pageSize;
                            },
                            loaded: function(dataSource, data) {
                                if (dataSource.data.totalRows === 0) {
                                    self.uiPaginationLabel.text(o.texts.showNoItem);
                                    self.uiNbResult.text(o.texts.showNoItem);
                                } else if (dataSource.data.totalRows === 1) {
                                    self.uiPaginationLabel.text(o.texts.showOneItem);
                                    self.uiNbResult.text('1 ' + o.texts.item);
                                } else {
                                    self.uiPaginationLabel.text(o.texts.showNbItems.replace('{{x}}', dataSource.data.length).replace('{{y}}', dataSource.data.totalRows));
                                    self.uiNbResult.text(dataSource.data.totalRows + ' ' + o.texts.items);
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
                    }, o.grid));

                return self;
            },

            _uiTreeGrid : function() {
                var self = this,
                    o = self.options,
                    position = self.uiTreeGrid.offset(),
                    positionContainer = self.element.offset(),
                    height = self.element.height() - position.top + positionContainer.top,
                    grid = $.extend(true, {}, o.grid);

                delete grid.columns;

                self.uiTreeGrid.css({
                        height : height,
                        width : '100%'
                    }).nostreegrid($.extend(true, { // True for recursive clone
                        treeUrl : o.treeGrid.proxyUrl,
                        treeOptions : {
                            lang : o.selectedLang || ''
                        },
                        columnsAutogenerationMode : 'none',
                        selectionMode: 'singleRow',
                        allowSorting: true,
                        scrollMode : 'auto',
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
                            self.uiViewsButtons.find('#view_grid').click().blur();
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
                        pageIndex: 0,
                        url: o.grid.proxyUrl,
                        loading: function (dataSource, userData) {
                            var r = userData.data.paging;
                            self.pageIndex = r.pageIndex;
                            dataSource.proxy.options.data.lang = o.selectedLang || '';
                            dataSource.proxy.options.data.inspectors = self._jsonInspectors();
                            dataSource.proxy.options.data.offset = r.pageIndex * r.pageSize;
                            dataSource.proxy.options.data.limit = r.pageSize;
                        },
                        loaded: function(dataSource, data) {
                            if (dataSource.data.totalRows === 0) {
                                self.uiPaginationLabel.text(o.texts.showNoItem);
                                self.uiNbResult.text(o.texts.showNoItem);
                            } else if (dataSource.data.totalRows === 1) {
                                self.uiPaginationLabel.text(o.texts.showOneItem);
                                self.uiNbResult.text('1 ' + o.texts.item);
                            } else {
                                self.uiPaginationLabel.text(o.texts.showNbItems.replace('{{x}}', dataSource.data.length).replace('{{y}}', dataSource.data.totalRows));
                                self.uiNbResult.text(dataSource.data.totalRows + ' ' + o.texts.items);
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
                var self = this;
                var onCustom = false;
                var jsonFile = "";

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

                require(jsonFile, function () {
                    var appdesk = $.appdeskSetup(config);
                    $.extend(true, appdesk.i18nMessages, config.i18n);

                    // Extending appdesk with each of the different json files
                    for (var i = 0; i < arguments.length; i++) {
                        $.extend(true, appdesk, arguments[i](appdesk));
                    }

                    // If the property is set explicitely, use it, else display only if there's more than 1 lang
                    var hideLocales = (typeof config.hideLocales != 'undefined' ? config.hideLocales : Object.keys(config.locales).length <= 1);

                    $.extend(true, appdesk.appdesk, {
                        locales : config.locales,
                        hideLocales : hideLocales,
                        views : config.views,
                        name  : config.configuration_id,
                        selectedView : config.selectedView,
                        selectedLang : config.selectedLang
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
                        var match = [];
                        $.each(params.reloadEvent, function(i, reloadEvent) {
                            if ($.type(reloadEvent) === 'string') {
                                // Reload the grid if a action on a same language's item occurs
                                // Or if a update or a insert on a other language's item occurs
                                if (dispatcher.data('nosLang')) {
                                    match.push({
                                            name : reloadEvent,
                                            lang : dispatcher.data('nosLang')
                                        });
                                    match.push({
                                            name : reloadEvent,
                                            action : ['delete', 'insert']
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
                            });
                    }

                    div.bind('reloadView', function(e, newConfig) {
                        $.extend(config, newConfig);
                        var newDiv = $('<div id="' + id + '"></div>');
                        newDiv.insertAfter(div);
                        div.remove();
                        self.appdeskAdd(id, config);
                    });

                });
            },

            appdeskSetup : function(config) {
                var configToUse = $.extend({}, true, config);

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
                                for (var i = 0; i < object[key].length; i++) {
                                    if (object[key][i].lang) {
                                        if (configToUse.hideLocales) {
                                            object[key].splice(i, 1);
                                            continue;
                                        }
                                        object[key][i] = {
                                            headerText : 'Languages',
                                            dataKey    : 'lang',
                                            setupkey   : 'lang',
                                            showFilter : false,
                                            cellFormatter : function(args) {
                                                if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                                                    args.$container.css("text-align", "center").html(args.row.data.lang);
                                                    return true;
                                                }
                                            },
                                            width : 1
                                        };
                                    }
                                    if (object[key][i].actions) {
                                        var actions = object[key][i].actions;
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
                                                if ($.isPlainObject(args.row.data)) {

                                                    var buttons = $.appdeskActions(actions, args.row.data, {
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
                                    }
                                }
                            }
                        });
                    },

                    self = {
                        tab : null,
                        appdesk : {
                            adds : {},
                            grid : {
                                proxyUrl : '',
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
                            params.appdesk.adds = $.map(params.appdesk.adds, objectToArray);


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
                            .addClass("ui-state-default")
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
                                action.action.apply(this, [noParseData, uiAction]);
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
                                        action.action.apply(this, [noParseData, li]);
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
                                showAnimation : {Animated:"slide", duration: 50, easing: null},
                                hideAnimation : {Animated:"hide", duration: 0, easing: null},
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
                                showFilter: true,
                                allowPaging : true,
                                data: [ ['test'] ]
                            });
                        this.heights = {
                            row : table.height(),
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
                                    headerText : 'Actions',
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
