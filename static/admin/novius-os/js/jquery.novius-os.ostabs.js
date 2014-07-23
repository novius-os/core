/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-ostabs',
    ['jquery', 'jquery-nos', 'jquery-ui.widget', 'jquery-nos-loadspinner', 'jquery-ui.sortable', 'wijmo.wijsuperpanel', 'jquery-nos-contextmenu', 'modernizr', 'jquery.simulate'],
    function( $ ) {
        "use strict";
        var undefined = void(0),
            touchDevice = Modernizr.touch;

        $.widget( "nos.ostabs", {
            options: {
                initTabs: [], // e.g. [{"url":"http://www.google.com","iconUrl":"img/google-32.png","label":"Google","iconSize":32,"labelDisplay":false},{"url":"http://www.twitter.com","iconClasses":"ui-icon ui-icon-signal-diag","label":"Twitter"}]
                newTab: 'desktopTab', // e.g. {"url":"applications.htm","label":"Open a new tab","iframe":true} or "desktopTab" or false
                desktopTab: {}, // e.g. {"panelId":"ospanel","url":"applications.htm","iconUrl":"os.png","label":"My OS","iframe":true} or false
                fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
                labelMinWidth: 100,
                labelMaxWidth: 200,
                selected : null,

                texts : {
                    newTab: 'New tab',
                    closeTab: 'Close tab',
                    closeTabs: 'Close all tabs',
                    closeOtherTabs: 'Close all other tabs',
                    confirmCloseOtherTabs: 'Are you sure to want to close all other tabs?',
                    confirmCloseTabs: 'Are you sure to want to close all tabs?',
                    reloadTab: 'Reload tab',
                    moveTab: 'Move tab'
                },

                // callbacks
                add: null,
                remove: null,
                select: null,
                show: null,
                drag: null
            },

            tabId : 0,
            openRank : 0,

            _create: function() {
                var self = this,
                    o = self.options;

                self._tabify( true );

                $(window).resize(function() {
                    if (o.selected !== null) {
                        self._firePanelEvent(self.panels.eq(o.selected), $.Event('resizePanel'));
                    }
                });
            },

            _setOption: function( key, value ) {
                var self = this;

                if ( key == "selected" ) {
                    self.select( value );
                } else {
                    self.options[ key ] = value;
                    self._tabify();
                }
            },

            _getNextTabId: function() {
                var self = this;

                return ++self.tabId;
            },

            _tabId: function( a ) {
                var self = this;

                return $( a ).data( "panelid.tabs" ) || "nos-ostabs-" + self._getNextTabId();
            },

            _sanitizeSelector: function( hash ) {
                // we need this because an id may contain a ":"
                return hash.replace( /:/g, "\\:" );
            },

            _ui: function( li, panel ) {
                var self = this,
                    index = self.lis.index( li );
                if ( panel === undefined ) {
                    panel = self.element.find( self._sanitizeSelector( $(self.anchors[ index ]).data('anchor.tabs') ) )[ 0 ];
                }

                return {
                    tab: li,
                    panel: panel,
                    index: index
                };
            },

            _cleanup: function() {
                var self = this;

                // restore all former loading tabs labels
                self.lis.filter( ".ui-state-processing" )
                    .removeClass( "ui-state-processing" )
                    .find( "span.nos-ostabs-icon" )
                    .removeClass( 'nos-ostabs-loader' )
                    .each(function() {
                        if ($.isFunction($.fn.loadspinner) && $(this).data('nos-loadspinner')) {
                            $(this).loadspinner('destroy');
                        }
                    })
                    .html( ' ' );

                return self;
            },

            _tabify: function( init ) {
                var self = this,
                    o = self.options,
                    fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

                // initialization from scratch
                // create and initialize layout
                if ( init ) {
                    self.element.addClass('nos-ostabs ui-widget ui-widget-content' + (touchDevice ? ' nos-ostabs-touch' : ''));

                    self.uiOstabsHeader = $( '<div></div>' )
                        .addClass( 'nos-ostabs-header' )
                        .appendTo( self.element );

                    self.uiOstabsSuperPanel = $( '<div></div>' )
                        .addClass('nos-ostabs-tabs')
                        .appendTo( self.uiOstabsHeader );

                    self.uiOstabsTray = self.element.find('.nos-ostabs-tray')
                        .addClass('nos-ostabs-nav')
                        .prependTo(self.uiOstabsHeader);

                    if ( $.isPlainObject(o.desktopTab) ) {
                        self.uiOstabsDesktopTab = $( '<ul></ul>' )
                            .addClass( 'nos-ostabs-desktoptab  nos-ostabs-nav' )
                            .prependTo( self.uiOstabsHeader );
                        self._add(o.desktopTab, self.uiOstabsDesktopTab, true)
                            .addClass( 'nos-ostabs-desktoptab' )
                            .removeClass( 'ui-state-default' );
                    } else {
                        self.uiOstabsDesktopTab = $( '<ul></ul>' );
                    }

                    self.uiOstabsSuperPanel.css( 'left', self.uiOstabsDesktopTab.outerWidth( true ) + 25 )
                        .css( 'right', self.uiOstabsTray.outerWidth( true ) + 25 )
                        .wijsuperpanel({
                            allowResize : false,
                            autoRefresh : true,
                            hScroller : {
                                scrollBarVisibility : 'hidden',
                                scrollMode : 'buttons',
                                increaseButtonPosition : {
                                    my: "left bottom",
                                    at: "right bottom"
                                },
                                decreaseButtonPosition : {
                                    my: "right bottom",
                                    at: "left bottom"
                                }
                            },
                            vScroller : {
                                scrollBarVisibility : 'hidden'
                            },
                            showRounder : false
                        })
                        .removeClass('ui-widget ui-widget-content')
                        .css('overflow', 'visible');

                    self.uiOstabsSuperPanelContent = self.uiOstabsSuperPanel.wijsuperpanel( 'getContentElement');
                    self.uiOstabsTabs = $( '<ul></ul>' ).appendTo( self.uiOstabsSuperPanelContent );

                    if ( $.isArray( o.initTabs ) ) {
                        $.each( o.initTabs, function(i, el) {
                            self._add( el );
                        } );
                    }

                    var newTab = o.newTab;
                    if ( $.isPlainObject(newTab) ) {
                        newTab = $.extend({
                            label: o.texts.newTab,
                            iconClasses: 'ui-icon ui-icon-circle-plus'
                        }, newTab);
                    } else if ( newTab && $.isPlainObject(o.desktopTab) ) {
                        newTab = $.extend( {}, o.desktopTab, {
                            label: o.texts.newTab,
                            iconClasses: 'ui-icon ui-icon-circle-plus',
                            iconUrl: '',
                            iconSize: 16
                        });
                    } else {
                        newTab = false;
                    }

                    if ( newTab ) {
                        self.uiOstabsNewTab = self._add(newTab, null, true).addClass( 'nos-ostabs-newtab' );
                    } else {
                        self.uiOstabsNewTab = $ ( '<li>/<li>' );
                    }
                    self.uiOstabsNewTab.hover(function() {
                        $(this).find('.nos-ostabs-label').css('display', 'inline-block');
                        self._tabsWidth();
                    }, function() {
                        $(this).find('.nos-ostabs-label').css('display', 'none');
                        self._tabsWidth();
                    });

                    if (!touchDevice) {
                        self._initSortable();
                    }

                    self.tabsWidth = self.uiOstabsSuperPanelContent.width();
                    self.labelWidth = o.labelMaxWidth;
                    self.uiOstabsTabs.width( self.tabsWidth );
                }

                // Save for internal usage alls <li> and <a> of tabs
                var tabOpenRank = [];
                self.lis = self.uiOstabsDesktopTab.add(self.uiOstabsTabs).find("li")
                    .each(function(i) {
                        var $li = $(this),
                            tab = $li.data( 'ui-ostab') || {};

                        if (!$li.hasClass('nos-ostabs-desktoptab') && tab.openRank !== false) {
                            tabOpenRank[tab.openRank] = $li;
                        }
                    });
                self.openRank = 1;
                $.each(tabOpenRank, function(i, $li) {
                    if ($li) {
                        var tab = $li.data( 'ui-ostab') || {};
                        tab.openRank = self.openRank++;
                    }
                });

                self.anchors = self.lis.map(function() {
                    return $( "a", this )[ 0 ];
                });
                self.panels = $( [] );

                // For all <a> of tabs, search or create the panel
                self.anchors.each(function( i, a ) {
                    var $a = $(a),
                        href = $a.attr( "href"),
                        hash = $a.data('anchor.tabs');
                    if (!href && hash) {
                        a.href = hash;
                        href = hash;
                    }
                    // For dynamically created HTML that contains a hash as href IE < 8 expands
                    // such href to the full page url with hash and then misinterprets tab as ajax.
                    // Same consideration applies for an added tab with a fragment identifier
                    // since a[href=#fragment-identifier] does unexpectedly not match.
                    // Thus normalize href attribute...
                    var hrefBase = href.split( "#" )[ 0 ],
                        baseEl,
                        $panel;
                    if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                            ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                        href = a.hash;
                        a.href = href;
                    }

                    // inline tab
                    if ( fragmentId.test( href ) ) {
                        $panel = self.element.find( self._sanitizeSelector( href ) );
                        self.panels = self.panels.add( $panel );
                    // remote tab
                    // prevent loading the page itself if href is just "#"
                    } else if ( href && href !== "#" ) {
                        // required for restore on destroy
                        $a.data("href.tabs", href );

                        // TODO until #3808 is fixed strip fragment identifier from url
                        // (IE fails to load from such url)
                        $a.data("load.tabs", href.replace( /#.*$/, "" ) );

                        var id = self._tabId( a );
                        a.href = "#" + id;
                        $panel = self.element.find( "#" + id );
                        if ( !$panel.length ) {
                            $panel = $( '<div></div>' )
                                .attr( "id", id )
                                .addClass( "nos-ostabs-panel ui-widget-content ui-corner-bottom nos-ostabs-hide")
                                .appendTo( self.element );

                            self._contextMenu(self.lis.eq(i));
                        }
                        self.panels = self.panels.add( $panel );
                    }
                    $a.data('anchor.tabs', a.hash)
                        .removeAttr('href');
                    $panel.find( '.nos-ostabs-panel-content' )
                        .data( 'nos-ostabs-index', i );
                });

                // initialization from scratch
                // Additionnal initialization now that we have all <li> and panels
                if ( init ) {
                    // attach necessary classes for styling
                    self.uiOstabsTray.add( self.uiOstabsDesktopTab )
                        .addClass( "nos-ostabs-nav ui-helper-reset ui-helper-clearfix" );
                    self.lis.addClass( "ui-corner-top" );
                    self.panels.addClass( "nos-ostabs-panel ui-widget-content" );

                    // Selected tab
                    // use "selected" option or try to retrieve:
                    // 1. from fragment identifier in url
                    // 2. from selected class attribute on <li>
                    if ( o.selected === undefined ) {
                        if ( location.hash ) {
                            self.anchors.each(function( i, a ) {
                                if ( $(a).data('anchor.tabs') == location.hash ) {
                                    o.selected = i;
                                    return false;
                                }
                            });
                        }
                        if ( typeof o.selected !== "number" && self.lis.filter( ".nos-ostabs-selected" ).length ) {
                            o.selected = self.lis.index( self.lis.filter( ".nos-ostabs-selected" ) );
                        }
                        o.selected = o.selected || ( self.lis.length ? 0 : -1 );
                    }

                    // sanity check - default to first tab...
                    o.selected = ( ( o.selected >= 0 && self.anchors[ o.selected ] ) || o.selected < 0 )
                        ? o.selected
                        : 0;

                    // highlight selected tab
                    self.panels.addClass( "nos-ostabs-hide" );
                    self.lis.removeClass( "nos-ostabs-selected ui-state-active" );
                    // check for length avoids error when initializing empty list
                    if ( o.selected >= 0 && self.anchors.length ) {
                        self.element.find( self._sanitizeSelector( $(self.anchors[ o.selected ]).data('anchor.tabs') ) ).removeClass( "nos-ostabs-hide" );
                        self.lis.eq( o.selected ).addClass( "nos-ostabs-selected ui-state-active ui-state-open" );

                        // seems to be expected behaviour that the show callback is fired
                        self.element.queue( "tabs", function() {
                            self._trigger( "show", null, self._ui( self.lis[ o.selected ] ) );
                        });

                        self.title(o.selected, self.title(o.selected));

                        self._load( o.selected );
                    }

                    // clean up to avoid memory leaks in certain versions of IE 6
                    // TODO: namespace this event
                    $( window ).bind( "unload", function() {
                        self.lis.add( self.anchors ).unbind( ".tabs" );
                        self.lis = self.anchors = self.panels = null;
                    });
                // update selected after add/remove
                } else {
                    o.selected = self.lis.index( self.lis.filter( ".nos-ostabs-selected" ) );
                }

                // reset cache if switching from cached to not cached
                self.anchors.removeData( "cache.tabs" );

                // remove all handlers before, tabify may run on existing tabs after add or option change
                self.lis.add( self.anchors ).unbind( ".tabs" );

                var addState = function( state, el ) {
                    el.addClass( "ui-state-" + state );
                };
                var removeState = function( state, el ) {
                    el.removeClass( "ui-state-" + state );
                };
                self.lis.bind( "mouseover.tabs" , function() {
                    addState( "hover", $( this ) );
                });
                self.lis.bind( "mouseout.tabs", function() {
                    removeState( "hover", $( this ) );
                });
                self.anchors.bind( "focus.tabs", function() {
                    addState( "focus", $( this ).closest( "li" ) );
                });
                self.anchors.bind( "blur.tabs", function() {
                    removeState( "focus", $( this ).closest( "li" ) );
                });

                // set up animations
                var hideFx, showFx;
                if ( o.fx ) {
                    if ( $.isArray( o.fx ) ) {
                        hideFx = o.fx[ 0 ];
                        showFx = o.fx[ 1 ];
                    } else {
                        hideFx = showFx = o.fx;
                    }
                }

                // Reset certain styles left over from animation
                // and prevent IE's ClearType bug...
                function resetStyle( $el, fx ) {
                    $el.css( "display", "" );
                    if ( !$.support.opacity && fx.opacity ) {
                        $el[ 0 ].style.removeAttribute( "filter" );
                    }
                }

                function fireCallbacks($panel) {
                    var callbacks = $panel.data('callbacks.ostabs'),
                        dispatcher = $panel.find('.nos-dispatcher');

                    if ($.isPlainObject(callbacks)) {
                        $.each(callbacks, function(i, event) {
                            self._firePanelEvent(dispatcher, event);
                        });
                        callbacks = {};
                    }
                }

                // Show a tab...
                var showTab = showFx
                    ? function( clicked, $show ) {
                        var $li = $( clicked ).closest( "li" ).addClass( "nos-ostabs-selected ui-state-active" );
                        self._tabsWidth();
                        $show.hide().removeClass( "nos-ostabs-hide" ) // avoid flicker that way
                            .animate( showFx, showFx.duration || "normal", function() {
                                if ( $li.hasClass( 'nos-ostabs-newtab' ) ) {
                                    self._tabsWidth();
                                }
                                self.uiOstabsSuperPanel.wijsuperpanel('scrollChildIntoView', $li.find('a'));
                                // TODO ?
                                // Gilles : Bug avec effet la class hide réapparait, sans doute à cause de la double création de panel au add
                                //$( this ).removeClass( "nos-ostabs-hide" );
                                resetStyle( $show, showFx );
                                fireCallbacks($show);
                                self._firePanelEvent($show, $.Event('showPanel'));
                            });
                    }
                    : function( clicked, $show ) {
                        var $li = $( clicked ).closest( "li" );
                        if ( $li.hasClass( 'nos-ostabs-newtab' ) ) {
                            self._tabsWidth();
                        }
                        self.uiOstabsSuperPanel.wijsuperpanel('scrollChildIntoView', $li.find('a'));
                        $li.addClass( "nos-ostabs-selected ui-state-active" );
                        self._tabsWidth();
                        $show.removeClass( "nos-ostabs-hide" );
                        fireCallbacks($show);
                        self._firePanelEvent($show, $.Event('showPanel'));
                    };

                // Hide a tab, $show is optional...
                var hideTab = hideFx
                    ? function( clicked, $hide ) {
                        $hide.animate( hideFx, hideFx.duration || "normal", function() {
                            if ( self.uiOstabsNewTab.hasClass( 'ui-state-active' ) ) {
                                self._tabsWidth();
                            }
                            self.lis.removeClass( "nos-ostabs-selected ui-state-active" );
                            self._tabsWidth();
                            $hide.addClass( "nos-ostabs-hide" );
                            resetStyle( $hide, hideFx );
                            self.element.dequeue( "tabs" );
                            $hide.trigger( "hidePanel.ostabs");
                        });
                    }
                    : function( clicked, $hide ) {
                        if ( self.uiOstabsNewTab.hasClass( 'ui-state-active' ) ) {
                            self._tabsWidth();
                        }
                        self.lis.removeClass( "nos-ostabs-selected ui-state-active" );
                        self._tabsWidth();
                        $hide.addClass( "nos-ostabs-hide" );
                        self.element.dequeue( "tabs" );
                        $hide.trigger( "hidePanel.ostabs");
                    };

                // attach tab event handler, unbind to avoid duplicates from former tabifying...
                self.anchors.bind( "click.tabs", function() {
                        var el = this,
                            $li = $(el).closest( "li" ),
                            $hide = self.panels.filter( ":not(.nos-ostabs-hide)" ),
                            $show = self.element.find( self._sanitizeSelector( $(el).data('anchor.tabs') )),
                            tab = $li.data( 'ui-ostab');

                        $li.addClass( "ui-state-open" );
                        self.uiOstabsNewTab.removeClass('ui-state-open');

                        o.selected = self.anchors.index( this );

                        // If tab selected or
                        // or is already loading or click callback returns false stop here.
                        // Check if click handler returns false last so that it is not executed for loading tab!
                        if ($li.hasClass( "nos-ostabs-selected" ) ||
                            $li.hasClass( "ui-state-processing" ) ||
                            self.panels.filter( ":animated" ).length ||
                            self._trigger( "select", null, self._ui( $li[ 0 ], $show[ 0 ] ) ) === false ) {
                            this.blur();
                            return false;
                        }

                        self._abort();

                        // show new tab
                        if ( $show.length ) {
                            if ( $hide.length ) {
                                self.element.queue( "tabs", function() {
                                    hideTab( el, $hide );
                                });
                            }
                            self.element.queue( "tabs", function() {
                                if (!$li.hasClass('nos-ostabs-desktoptab')) {
                                    tab.openRank = self.openRank++;
                                }
                                showTab( el, $show );
                            });

                            $( 'title' ).html( $li.find( '.nos-ostabs-label' ).html() );
                            var url = encodeURIComponent(tab.url).replace(/%2F/g, '/');
                            if ('replaceState' in window.history) {
                                window.history.replaceState({}, '', document.location.pathname + '?tab=' + url);
                            } else {
                                document.location.hash = 'tab=' + url;
                            }


                            self._load( self.anchors.index( this ) );
                        } else {
                            throw "jQuery UI Tabs: Mismatching fragment identifier.";
                        }

                        this.blur();
                    }).bind( "mousedown.tabs", function(e) {
                        if (e.which === 2) {
                            var el = this,
                                $li = $(el).closest( "li"),
                                closable = $li.not( '.nos-ostabs-desktoptab' ).length;
                            if (closable) {
                                self.remove( self.lis.index($li), !$li.hasClass( "nos-ostabs-selected" ) );
                            }
                        }
                    });

                // disable click in any case
                self.anchors.bind( "click.tabs", function(){
                    return false;
                });

                self._tabsWidth();
            },

            _initSortable: function() {
                var self = this,
                    o = self.options;

                self.uiOstabsTabs.sortable({
                    items: 'li:not(.nos-ostabs-newtab)',
                    appendTo: self.uiOstabsSuperPanelContent,
                    cursor: 'move',
                    delay: 250,
                    scroll: false,
                    helper: 'clone',
                    tolerance: 'pointer',
                    axis: 'x',
                    zIndex : 100000,
                    placeholder: "ui-state-highlight",
                    forcePlaceholderSize: true,
                    start: function() {
                        self.sorting = true;
                    },
                    stop: function() {
                        self.sorting = false;
                    },
                    update: function() {
                        self._trigger( "drag", null );
                        self.lis = self.uiOstabsDesktopTab
                            .add( self.uiOstabsTabs )
                            .find( "li" );
                        self.anchors = self.lis.map(function(i) {
                            var anchor = $( "a", this )[ 0 ];
                            self.element.find( self._sanitizeSelector( $(anchor).data('anchor.tabs') ) )
                                .find( '.nos-ostabs-panel-content' )
                                .data( 'nos-ostabs-index', i );
                            return anchor;
                        });

                        self._tabsWidth();
                    }
                });

                return self;
            },

            _refreshSortable: function() {
                var self = this,
                    o = self.options;

                if (self.uiOstabsTabs.data('ui-sortable')) {
                    self.uiOstabsTabs.sortable('refresh');
                }

                return self;
            },

            _getIndex: function( index ) {
                var self = this;

                // meta-function to give users option to provide a href string instead of a numerical index.
                // also sanitizes numerical indexes to valid values.
                if ( typeof index == "string" ) {
                    self.anchors.each(function(i) {
                        if ($(this).data('anchor.tabs') === index) {
                            index = i;
                            return false;
                        }
                    });
                }

                return index;
            },

            _contextMenu: function(li) {
                var self = this,
                    o = self.options,
                    closable = li.not( '.nos-ostabs-desktoptab' ).length,
                    actions = [], $action_bar, $links,
                    date,
                    id = li.attr('id');

                if (!id) {
                    date = new Date();
                    id = date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + "_" + date.getMilliseconds();
                    li.attr('id', id);
                }

                if (closable) {
                    actions.push(
                        {
                            classes: 'nos-ostabs-close',
                            click: function() {
                                self.remove( self.lis.index(li) ); // Recalculate index if tab have been move
                                return false;
                            },
                            label: o.texts.closeTab,
                            iconClass: 'ui-icon-closethick',
                            iconUrl: 'static/novius-os/admin/novius-os/img/16/close.png'
                        },
                        {
                            classes: 'nos-ostabs-close-allothers',
                            click: function() {
                                if (confirm($.nosCleanupTranslation(o.texts.confirmCloseOtherTabs))) {
                                    self.lis.not( '.nos-ostabs-desktoptab' ).not( '.nos-ostabs-newtab' ).each(function() {
                                        var $liTemp = this;
                                        if ($liTemp !== li[0]) {
                                            self.remove( self.lis.index($liTemp) );
                                        }
                                    });
                                }
                                return false;
                            },
                            label: o.texts.closeOtherTabs,
                            iconClass: 'ui-icon-closethick',
                            iconUrl: 'static/novius-os/admin/novius-os/img/16/close.png'
                        }
                    );
                }

                if (!closable) {
                    actions.push({
                        classes: 'nos-ostabs-close-all',
                        click: function() {
                            if (confirm($.nosCleanupTranslation(o.texts.confirmCloseTabs))) {
                                self.lis.not( '.nos-ostabs-desktoptab' ).not( '.nos-ostabs-newtab' ).each(function() {
                                    self.remove(self.lis.index(this));
                                });
                            }
                            return false;
                        },
                        label: o.texts.closeTabs,
                        iconClass: 'ui-icon-closethick',
                        iconUrl: 'static/novius-os/admin/novius-os/img/16/close.png'
                    });
                }

                if (closable)  {
                    actions.push({
                        classes: 'nos-ostabs-reload',
                        click: function() {
                            var index = self.lis.index(li);
                            self.reload(index);
                            return false;
                        },
                        label: o.texts.reloadTab,
                        iconClass: 'ui-icon-refresh',
                        iconUrl: 'static/novius-os/admin/novius-os/img/16/refresh.png'
                    });

                    if (touchDevice)  {
                        actions.push({
                            classes: 'nos-ostabs-move',
                            click: function() {
                                var offset = li.offset(),
                                    $links = li.data('contextmenu.tabs'),
                                    $layer = $('<div></div>');
                                self._initSortable();

                                setTimeout(function() {
                                    $links.noscontextmenu('destroy').remove();
                                }, 200);

                                li.simulate('mousedown', {
                                    clientX: offset.left,
                                    clientY: offset.top
                                });

                                $layer.css({
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    zIndex: '100000'
                                })
                                    .appendTo('body')
                                    .on('click', function(e) {
                                        var offsettarget = $(e.target).offset();
                                        $layer.remove();
                                        li.simulate('mouseup', {
                                            clientX: offsettarget.left,
                                            clientY: offset.top
                                        });
                                        self.uiOstabsTabs.sortable('destroy');
                                        li.data('createcontextmenu.tabs', false);
                                        self._contextMenu(li);
                                        return false;
                                    });
                                return false;
                            },
                            label: o.texts.moveTab,
                            iconClass: 'ui-icon-arrow-4'
                        });
                    }
                }

                if (('HTMLMenuItemElement' in window)) {
                    self.element.find('#' + li.attr('id') + '-menucontext').remove();

                    $links = $('<menu></menu>')
                        .attr({
                            'type': 'context',
                            id: li.attr('id') + '-menucontext'
                        })
                        .prependTo(self.element);

                    $.each(actions, function() {
                        var action = this;
                        $('<menuitem></menuitem>')
                            .attr({
                                label: 'Novius OS - ' + action.label,
                                icon: action.iconUrl
                            })
                            .click(function() {
                                return action.click();
                            })
                            .appendTo($links);
                    });

                    li.attr('contextmenu', li.attr('id') + '-menucontext');
                } else {
                    if (!li.data('createcontextmenu.tabs')) {
                        li.data('createcontextmenu.tabs', true);
                        li.one('mouseenter', function(e) {
                            $links = $('<ul></ul>')
                                .addClass('nos-ostabs-menuactions')
                                .prependTo(self.element);

                            $.each(actions, function() {
                                var action = this,
                                    menu = $('<li><a href="#"></a></li>')
                                        .appendTo($links)
                                        .find('a')
                                        .click(function(e) {
                                            $links.noscontextmenu('hideAllMenus', e);
                                            action.click();
                                            return false;
                                        });
                                $('<span></span>').addClass('ui-icon wijmo-wijmenu-icon-left ' + action.iconClass)
                                    .appendTo(menu);
                                $('<span></span>').addClass('wijmo-wijmenu-text')
                                    .html(action.label)
                                    .appendTo(menu);
                            });

                            $links.noscontextmenu({
                                trigger: '#' + id
                            });

                            li.data('contextmenu.tabs', $links);
                        });
                    }
                }
            },

            _tabsWidth: function() {
                var self = this,
                    o = self.options,
                    width = 0;
                self.uiOstabsTabs.width( 10000000 );
                self.uiOstabsTabs.find( 'li' )
                    .each(function() {
                        width += $( this ).outerWidth( true );
                    });
                self.uiOstabsTabs.width( width );

                var nbLabel = self.uiOstabsTabs.find( '.nos-ostabs-label:visible' ).length,
                    add;
                if ( self.tabsWidth < self.uiOstabsTabs.width() ) {
                    while ( self.tabsWidth < self.uiOstabsTabs.width() && self.labelWidth > o.labelMinWidth ) {
                        add = self.labelWidth - o.labelMinWidth;
                        add = add > 10 ? 10 : add;
                        width = width - nbLabel * add;
                        self.uiOstabsTabs.width( width );
                        self.labelWidth = self.labelWidth - add;
                        $( 'head .tabswidth' ).remove();
                        $( '<style type="text/css" class="tabswidth">.nos-ostabs .nos-ostabs-header .nos-ostabs-label {width : ' + self.labelWidth + 'px !important;}</style>' ).appendTo( 'head' );
                    }
                } else {
                    do {
                        add = o.labelMaxWidth - self.labelWidth;
                        add = add > 10 ? 10 : add;
                        if ( self.tabsWidth > (width + nbLabel * 10) ) {
                            width = width + nbLabel * add;
                            self.uiOstabsTabs.width( width );
                            self.labelWidth = self.labelWidth + add;
                            $( 'head .tabswidth' ).remove();
                            $( '<style type="text/css" class="tabswidth">.nos-ostabs .nos-ostabs-header .nos-ostabs-label {width : ' + self.labelWidth + 'px !important;}</style>' ).appendTo( 'head' );
                        }
                    } while ( self.tabsWidth > (width + nbLabel * 10) && self.labelWidth < o.labelMaxWidth );
                }

                if ( self.tabsWidth < self.uiOstabsTabs.width() ) {
                    self.uiOstabsSuperPanel.find('.wijmo-wijsuperpanel-buttonleft, .wijmo-wijsuperpanel-buttonright').css('visibility', 'visible');
                } else {
                    self.uiOstabsSuperPanel.find('.wijmo-wijsuperpanel-buttonleft, .wijmo-wijsuperpanel-buttonright').css('visibility', 'hidden');
                }
            },

            add: function( tab, index ) {
                var self = this,
                    o = self.options;

                if ( !$.isPlainObject(tab) || tab.url === undefined ) {
                    return false;
                }

                if ( index === undefined ) {
                    if ($(self.lis.get(o.selected)).hasClass('nos-ostabs-desktoptab')) {
                        index = self.anchors.length - 1;
                    } else {
                        index = o.selected + 1;
                    }
                }

                var $li = self._add(tab);

                if ( index < self.lis.length ) {
                    $li.insertBefore( self.lis[ index ] );
                } else {
                    $li.insertBefore( self.lis[ self.lis.length - 1 ] );
                    index = self.lis.length - 1;
                }

                self._refreshSortable()
                    ._tabify();

                if ( self.anchors.length == 1 ) {
                    self.select(0);
                }

                self._trigger( "add", tab, self._ui( $li[ 0 ] ) );
                return index;
            },

            _add: function(tab, target, notClosable) {
                var self = this,
                    o = self.options,
                    a, icon, label, li;

                if ( !$.isPlainObject(tab) || tab.url === undefined ) {
                    return false;
                }

                target = target || self.uiOstabsTabs;

                tab = $.extend({
                    url: '',
                    iframe: false,
                    label: '',
                    labelDisplay: true,
                    iconClasses: 'ui-icon ui-icon-document',
                    iconUrl: '',
                    openRank: false,
                    iconSize: 16,
                    panelId: false
                }, tab);

                if (tab.openRank !== false && tab.openRank >= self.openRank) {
                    self.openRank = tab.openRank + 1;
                }

                a = $( '<a href="' + tab.url + '" onclick="return false;"></a>' );
                if (tab.iframe) {
                    a.data( "iframe.tabs", true );
                }
                if (tab.panelId) {
                    a.data( "panelid.tabs", tab.panelId );
                }

                icon = self._icon( tab ).appendTo( a );

                label = $( '<span></span>' ).addClass( 'nos-ostabs-label' )
                    .html( tab.label ? (tab.label + '').replace(/</g, '&lt;') : 'New tab' )
                    .appendTo( a );
                if ( !tab.labelDisplay ) {
                    label.hide();
                }
                li = $( '<li></li>' ).append( a )
                    .attr('title', label.text())
                    .addClass( 'ui-corner-top ui-state-default')
                    .data( 'ui-ostab', tab )
                    .appendTo( target );

                if (!notClosable) {
                    $('<span><span></span></span>').addClass('nos-ostabs-closetab')
                        .attr('title', o.texts.closeTab)
                        .click(function(e) {
                            var el = this,
                                $li = $(el).closest( "li");

                            e.preventDefault();
                            self.remove( self.lis.index($li), !$li.hasClass( "nos-ostabs-selected" ) );
                        })
                        .find('span')
                        .addClass('ui-icon ui-icon-closethick')
                        .text(o.texts.closeTab)
                        .end()
                        .appendTo(li);
                }

                if ( !isNaN( tab.iconSize ) && tab.iconSize !== 16 && target !== self.uiOstabsTabs) {
                    li.css({
                        height: ( tab.iconSize + 4 ) + 'px',
                        bottom: ( tab.iconSize - 35 ) + 'px'
                    });
                    icon.css( 'top', '2px' );
                }

                return li;
            },

            remove: function( index, notSelectAfter ) {
                var self = this;
                notSelectAfter = notSelectAfter || false;
                index = self._getIndex( index );
                var $li = self.lis.eq( index ),
                    $contextmenu,
                    $panel = self.element.find( self._sanitizeSelector( $(self.anchors[ index ]).data('anchor.tabs') )),
                    openIndex = 0,
                    openRank = 0;

                if ( index == 0 && !$li.hasClass( "nos-ostabs-selected" ) ) {
                    var linewtab = self.lis.filter( '.nos-ostabs-newtab' );
                    if ( linewtab.hasClass( "nos-ostabs-selected" ) ) {
                        $li = linewtab;
                    }
                }

                if ( $li.not( '.nos-ostabs-desktoptab' ).not( '.nos-ostabs-newtab' ).length ) {
                    $contextmenu = $li.data('contextmenu.tabs');
                    if ($contextmenu) {
                        $contextmenu.noscontextmenu('destroy').remove();
                    }
                    $li.remove();
                    $panel.remove();
                } else {
                    var tab = $li.data( 'ui-ostab');
                    tab.openRank = false;
                    $li.data( 'ui-ostab', tab);
                }

                $li.removeClass( "ui-state-active ui-state-open" );

                if (!notSelectAfter) {
                    openIndex = index > 2 ? index - 1 : (self.lis.length > 3 ? 1 : 0);
                    // Open the last tab in stack opening or the 0 index
                    self.lis.each(function(i) {
                        var $litemp = $(this),
                            tab = $litemp.data( 'ui-ostab') || {};

                        if ($litemp[0] != $li[0] && tab.openRank && tab.openRank > openRank) {
                            openRank = tab.openRank;
                            openIndex = i;
                        }
                    });
                    openIndex = self.anchors.eq(openIndex).data('anchor.tabs');
                }

                if ( $li.not( '.nos-ostabs-desktoptab' ).not( '.nos-ostabs-newtab' ).length ) {
                    $( '> *', $panel ).remove();
                }
                $panel.addClass( "nos-ostabs-hide" )
                    .removeData('callbacks.ostabs');

                $li.removeClass( "nos-ostabs-selected" );

                self._tabify();

                self._trigger( "remove", null, self._ui( $li[ 0 ], $panel[ 0 ] ) );

                if (!notSelectAfter) {
                    self.select( openIndex );
                }
                return self;
            },

            title: function( index, title ) {
                var self = this,
                    o = self.options;
                index = self._getIndex( index );

                var $li = self.lis.eq( index );
                if ( title === undefined ) {
                    return $li.find( '.nos-ostabs-label' ).text();
                } else {
                    $li.find( '.nos-ostabs-label' ).html( title.replace(/</g, '&lt;') );

                    if ( o.selected == index ) {
                        $( 'title' ).html( title.replace(/</g, '&lt;') );
                    }

                    self._trigger( "title", null, self._ui( $li[ 0 ] ) );

                    return self;
                }
            },

            update: function(index, tab) {
                var self = this;

                index = self._getIndex( index );

                if ( !$.isPlainObject(tab) ) {
                    return false;
                }

                var replaceTab = !!tab.url && tab.reload,
                    $li = self.lis.eq( index);

                tab = $.extend({}, $li.data( 'ui-ostab' ), tab );

                if (replaceTab) {
                    delete tab.reload;
                    this.remove(index, true);
                    this.add(tab, index);
                    this.select(index);
                } else {
                    if ( self.options.selected == index ) {
                        $( 'title' ).html( tab.label.replace(/</g, '&lt;') );
                        var url = encodeURIComponent(tab.url).replace(/%2F/g, '/');
                        if ('replaceState' in window.history) {
                            window.history.replaceState({}, '', document.location.pathname + '?tab=' + url);
                        } else {
                            document.location.hash = 'tab=' + url;
                        }
                    }

                    var $newLi = self._add(tab),
                        $newA = $newLi.find('a'),
                        $panel = self.panels.eq( index );

                    $li.data( 'ui-ostab', tab )
                        .attr('title', $newLi.find( '.nos-ostabs-label' ).text())
                        .addClass($newLi.attr('class'))
                        .find('a')
                        .empty()
                        .append($newA.children())
                        .data("href.tabs", tab.url );

                    self._contextMenu($li);

                    $newLi.remove();

                    self._trigger( "update", null, self._ui( $li[ 0 ], $panel[ 0 ] ) );
                }

                return self;
            },

            _icon: function( tab ) {
                var icon = $( '<span></span>' ).addClass( 'nos-ostabs-icon' );
                if ( tab.iconUrl ) {
                    icon.css( 'background-image', 'url("' + tab.iconUrl + '")' );
                } else {
                    icon.addClass( tab.iconClasses );
                }
                if ( !isNaN(tab.iconSize) && tab.iconSize !== 16 ) {
                    icon.css({
                        width: tab.iconSize + 'px',
                        height: tab.iconSize + 'px',
                        lineHeight: tab.iconSize + 'px',
                        top: ( tab.iconSize > 22 ? 22 - tab.iconSize : 10 - tab.iconSize / 2) + 'px'
                    });
                }
                return icon;
            },

            select: function( index ) {
                var self = this;
                index = self._getIndex( index );
                if ( index == -1 ) {
                    return self;
                }
                self.anchors.eq( index ).trigger( "click.tabs" );
                return self;
            },

            _load: function( index ) {
                var self = this;
                index = self._getIndex( index );
                var o = self.options,
                    a = self.anchors.eq( index )[ 0 ],
                    url = $.data( a, "load.tabs" ),
                    iframe = $.data( a, "iframe.tabs" );

                self._abort();

                // not remote or from cache
                if ( (!url && iframe) || self.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
                    self.element.dequeue( "tabs" );
                    return;
                }

                var panel = self.element.find( self._sanitizeSelector( $(a).data('anchor.tabs') )),
                    content = $( '> *', panel ).length;

                if (content !== 0) {
                    self.element.dequeue( "tabs" );
                    return;
                }

                // load remote from here on
                self.lis.eq( index ).addClass( "ui-state-processing" );

                if ( $.isFunction($.fn.loadspinner) ) {
                    $( "span.nos-ostabs-icon", a ).each(function() {
                        var $a = $( this );
                        $a.addClass( 'ui-state-processing' )
                            .loadspinner({
                                diameter : $a.width(),
                                scaling : true
                            });
                    });
                }

                if (!iframe) {
                    self.xhr = $.ajax({
                        url: url,
                        cache: false,
                        success: function( r, s, xhr ) {
                            var json;

                            $( '<div></div>' ).addClass( 'nos-ostabs-panel-content nos-dispatcher' )
                                .data( 'nos-ostabs-index', index )
                                .prependTo( panel.data('callbacks.ostabs', {}) )
                                .html( r );

                            $.data( a, "cache.tabs", true );

                            // case error, response not html but json (tab item was deleted)
                            // If response looks like JSON, execute standard success callback
                            try {
                                json = $.parseJSON(xhr.responseText);
                                self.element.nosAjaxSuccess(json);

                            } catch (e) {}
                        },
                        complete: function(xhr) {
                            // take care of tab labels
                            self._cleanup();

                            self._trigger( "load", null, self._ui( self.lis[index] ) );
                        },
                        error : function (xhr, s) {
                            self.remove(index)

                            // If response looks like JSON, execute standard success callback
                            self.element.nosAjaxError(xhr, s);
                        }
                    });
                } else {
                    $( '<iframe ' + ($.browser.msie ? 'allowTransparency="true" ' : '') + 'src="' + url + '" frameborder="0"></iframe>' )
                        .data( 'nos-ostabs-index', index )
                        .addClass( 'nos-ostabs-panel-content nos-dispatcher' )
                        .bind( 'load', function() {
                            self._cleanup();
                            self._trigger( "load", null, self._ui( self.lis[index] ) );
                        })
                        .prependTo( panel.data('callbacks.ostabs', {}) );

                    $.data( a, "cache.tabs", true );
                }

                // last, so that load event is fired before show...
                self.element.dequeue( "tabs" );

                return self;
            },

            reload: function( index ) {
                var self = this;
                index = self._getIndex( index );
                var o = self.options,
                    a = self.anchors.eq( index )[ 0 ],
                    url = $.data( a, "load.tabs" ),
                    iframe = $.data( a, "iframe.tabs"),
                    $frame, $panel;

                self.select(index);
                self._abort();

                // not remote or from cache
                if ( (!url && iframe) || self.element.queue( "tabs" ).length !== 0 && $.data( a, "cache.tabs" ) ) {
                    self.element.dequeue( "tabs" );
                    return;
                }

                $panel = self.element.find( self._sanitizeSelector( $(a).data('anchor.tabs') ));

                // load remote from here on
                self.lis.eq( index ).addClass( "ui-state-processing" );

                if ( $.isFunction($.fn.loadspinner) ) {
                    $( "span.nos-ostabs-icon", a ).each(function() {
                        var $a = $( this );
                        $a.addClass( 'ui-state-processing' )
                            .loadspinner({
                                diameter : $a.width(),
                                scaling : true
                            });
                    });
                }

                if (!iframe) {
                    self.xhr = $.ajax({
                        url: url,
                        cache: false,
                        success: function( r, s, xhr ) {
                            var json;

                            $panel.find('.nos-ostabs-panel-content')
                                .html( r );

                            // case error, response not html but json (tab item was deleted)
                            // If response looks like JSON, execute standard success callback
                            try {
                                json = $.parseJSON(xhr.responseText);
                                self.element.nosAjaxSuccess(json);

                            } catch (e) {}
                        },
                        complete: function(xhr) {
                            // take care of tab labels
                            self._cleanup();

                            self._trigger( "load", null, self._ui( self.lis[index] ) );
                        },
                        error : function (xhr, s) {
                            self.remove(index)

                            // If response looks like JSON, execute standard success callback
                            self.element.nosAjaxError(xhr, s);
                        }
                    });
                } else {
                    $frame = $panel.find('iframe.nos-ostabs-panel-content');
                    $frame.attr("src", $frame.attr("src"));
                }

                // last, so that load event is fired before show...
                self.element.dequeue( "tabs" );

                return self;
            },

            _abort: function() {
                var self = this;
                // stop possibly running animations
                self.element.queue( [] );
                self.panels.stop( false, true );

                // "tabs" queue must not contain more than two elements,
                // which are the callbacks for the latest clicked tab...
                self.element.queue( "tabs", self.element.queue( "tabs" ).splice( -2, 2 ) );

                // take care of tab labels
                self._cleanup();
                return self;
            },

            tabs: function() {
                var self = this,
                    tabs = [];
                self.uiOstabsTabs.find( 'li:not(.nos-ostabs-newtab)' )
                    .each(function() {
                        var tab = $.extend({}, $(this).data('ui-ostab'));
                        delete tab.openRank;
                        tabs.push(tab);
                    });
                return tabs;
            },

            dispatchEvent : function(event) {
                var self = this,
                    o = self.options;

                $.each(self.panels, function() {
                    var $panel = $(this),
                        i = $panel.find('.nos-ostabs-panel-content' ).data('nos-ostabs-index');

                    if (i === o.selected) {
                        self._firePanelEvent($panel, event);
                    } else {
                        var callbacks = $panel.data('callbacks.ostabs');
                        if ($.isPlainObject(callbacks)) {
                            callbacks[event.type + (event.namespace ? '.' + event.namespace : '')] = event;
                        }
                    }
                });

                return self;
            },

            _firePanelEvent : function($dispatcher, event) {
                $dispatcher = $dispatcher.is('.nos-dispatcher') ? $dispatcher : $dispatcher.find('.nos-dispatcher');

                if ($dispatcher.is('iframe')) {
                    if ($dispatcher[0].contentDocument.$) {
                        $dispatcher[0].contentDocument.$('body').trigger(event);
                    }
                } else {
                    // @todo Figure out why we need this try catch.
                    // Adding a media throws an TypeError exception : unknown method 'trigger' on DOMWindow
                    try {
                        $dispatcher.trigger(event);
                    } catch (e) {
                        log('_firePanelEvent error', e, event);
                    }
                }
            },

            current: function() {
                var self = this,
                    o = self.options;

                return {
                    tab: $(self.lis.get(o.selected)),
                    panel: $(self.panels.get(o.selected)),
                    index: o.selected
                };
            }
        });
        return $;
    });
