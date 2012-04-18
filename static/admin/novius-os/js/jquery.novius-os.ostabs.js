/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('jquery-nos-ostabs',
[
    'jquery',
    'log',
    'order!jquery-ui',
    'order!wijmo-open',
    'order!wijmo-complete',
    'order!jquery-nos',
    'order!jquery-nos-loadspinner'
], function( $ ) {
    "use strict";
    var undefined = void(0);

    $.widget( "nos.ostabs", {
        options: {
            initTabs: [], // e.g. [{"url":"http://www.google.com","iconUrl":"img/google-32.png","label":"Google","iconSize":32,"labelDisplay":false},{"url":"http://www.twitter.com","iconClasses":"ui-icon ui-icon-signal-diag","label":"Twitter"}]
            newTab: 'appsTab', // e.g. {"url":"applications.htm","label":"Open a new tab","iframe":true} or "appsTab" or false
            trayTabs: [], // e.g. [{"url":"account.php","iconClasses":"ui-icon ui-icon-contact","label":"Account"},{"url":"customize.htm","iconClasses":"ui-icon ui-icon-gear","label":"Customization"}]
            appsTab: {}, // e.g. {"panelId":"ospanel","url":"applications.htm","iconUrl":"os.png","label":"My OS","iframe":true} or false
            fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
            labelMinWidth: 100,
            labelMaxWidth: 200,
            selected : null,

            texts : {
                scrollLeft : 'Scroll left',
                scrollRight : 'Scroll right',
                newTab: 'New tab',
                removeTab: 'Remove tab',
                closeTab: 'Close tab',
                reloadTab: 'Reload tab',
                spinner: 'Loading...'
            },

            // callbacks
            add: null,
            remove: null,
            select: null,
            show: null,
            drag: null
        },

        tabId : 0,
        stackOpening: [],

        _create: function() {
            var self = this,
                o = self.options;

            self._tabify( true );

            $(window).resize(function() {
                if (o.selected) {
                    self._firePanelEvent(self.panels.eq(o.selected), {event : 'resizePanel'});
                }
            });
        },

        // TODO : revoir ?
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
                panel = self.element.find( self._sanitizeSelector( self.anchors[ index ].hash ) )[ 0 ];
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
                    if ( $.isFunction($.fn.loadspinner) ) {
                        $(this).loadspinner( 'destroy' );
                    }
                })
                .html( ' ' )
                .parent()
                .find( "span.nos-ostabs-label" )
                .each(function() {
                    var el = $( this ),
                        html = el.data( "label.tabs" );

                    if ( html ) {
                        el.html( html ).removeData( "label.tabs" );
                    }
                });

            return self;
        },

        _tabify: function( init ) {
            var self = this,
                o = self.options,
                fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

            // initialization from scratch
            if ( init ) {
                self.element.addClass( "nos-ostabs ui-widget ui-widget-content" );

                self.uiOstabsHeader = $( '<div></div>' )
                    .addClass( 'ui-widget-header' )
                    .appendTo( self.element );

                self.uiOstabsSuperPanel = $( '<div></div>' )
                    .addClass('nos-ostabs-tabs')
                    .appendTo( self.uiOstabsHeader );

                self.uiOstabsTray = $( '<ul></ul>' )
                    .addClass( 'nos-ostabs-tray nos-ostabs-nav' );
                if ( $.isArray( o.trayTabs ) ) {
                    $.each( o.trayTabs, function(i, el) {
                        if ( $.isPlainObject(el) ) {
                            self._add( el, self.uiOstabsTray )
                                .addClass( 'nos-ostabs-tray' );
                        }
                    } );
                }
                self.uiOstabsTray.prependTo(self.uiOstabsHeader);

                if ( $.isPlainObject(o.appsTab) ) {
                    self.uiOstabsAppsTab = $( '<ul></ul>' )
                        .addClass( 'nos-ostabs-appstab  nos-ostabs-nav' )
                        .prependTo( self.uiOstabsHeader );
                    self._add( o.appsTab, self.uiOstabsAppsTab )
                    .addClass( 'nos-ostabs-appstab' )
                    .removeClass( 'ui-state-default' );
                } else {
                    self.uiOstabsAppsTab = $( '<ul></ul>' );
                }

                self.uiOstabsSuperPanel.css( 'left', self.uiOstabsAppsTab.outerWidth( true ) + 25 )
                    .css( 'right', self.uiOstabsTray.outerWidth( true ) + 35 )
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
                } else if ( newTab && $.isPlainObject(o.appsTab) ) {
                    newTab = $.extend( {}, o.appsTab, {
                        label: o.texts.newTab,
                        iconClasses: 'ui-icon ui-icon-circle-plus',
                        iconUrl: '',
                        iconSize: 16
                    });
                } else {
                    newTab = false;
                }

                if ( newTab ) {
                    self.uiOstabsNewTab = self._add( newTab ).addClass( 'nos-ostabs-newtab' );
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
                        self.lis = self.uiOstabsAppsTab
                            .add( self.uiOstabsTray )
                            .add( self.uiOstabsTabs )
                            .find( "li:has(a[href])" );
                        self.anchors = self.lis.map(function(i) {
                            var anchor = $( "a", this )[ 0 ];
                            self.element.find( self._sanitizeSelector( anchor.hash ) )
                                .find( '.nos-ostabs-panel-content' )
                                .data( 'nos-ostabs-index', i );
                            return anchor;
                        });

                        self._tabsWidth();
                    }
                });


                self.tabsWidth = self.uiOstabsSuperPanelContent.width();
                self.labelWidth = o.labelMaxWidth;
                self.uiOstabsTabs.width( self.tabsWidth );
            }

            self.lis = self.uiOstabsAppsTab.add(self.uiOstabsTray).add(self.uiOstabsTabs).find("li:has(a[href])");
            self.anchors = self.lis.map(function() {
                return $( "a", this )[ 0 ];
            });
            self.panels = $( [] );

            self.anchors.each(function( i, a ) {
                var href = $( a ).attr( "href" );
                // For dynamically created HTML that contains a hash as href IE < 8 expands
                // such href to the full page url with hash and then misinterprets tab as ajax.
                // Same consideration applies for an added tab with a fragment identifier
                // since a[href=#fragment-identifier] does unexpectedly not match.
                // Thus normalize href attribute...
                var hrefBase = href.split( "#" )[ 0 ],
                    baseEl;
                if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                        ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                    href = a.hash;
                    a.href = href;
                }

                // inline tab
                if ( fragmentId.test( href ) ) {
                    self.panels = self.panels.add( self.element.find( self._sanitizeSelector( href ) ) );
                // remote tab
                // prevent loading the page itself if href is just "#"
                } else if ( href && href !== "#" ) {
                    // required for restore on destroy
                    $.data( a, "href.tabs", href );

                    // TODO until #3808 is fixed strip fragment identifier from url
                    // (IE fails to load from such url)
                    $.data( a, "load.tabs", href.replace( /#.*$/, "" ) );

                    var id = self._tabId( a );
                    a.href = "#" + id;
                    var $panel = self.element.find( "#" + id );
                    if ( !$panel.length ) {
                        self.lis.eq(i);
                        $panel = $( '<div></div>' )
                            .attr( "id", id )
                            .addClass( "nos-ostabs-panel ui-widget-content ui-corner-bottom nos-ostabs-hide")
                            .appendTo( self.element );

                        self._actions($panel, i);
                    }
                    self.panels = self.panels.add( $panel );
                }
            });

            // initialization from scratch
            if ( init ) {
                // attach necessary classes for styling
                self.uiOstabsTray.add( self.uiOstabsAppsTab )
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
                            if ( a.hash == location.hash ) {
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
                    self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) ).removeClass( "nos-ostabs-hide" );
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
                            self._firePanelEvent($show, {event : 'showPanel'});
                        });
                }
                : function( clicked, $show ) {
                    var $li = $( clicked ).closest( "li" );
                    if ( $li.hasClass( 'nos-ostabs-newtab' ) ) {
                        self._tabsWidth();
                    }
                    self.uiOstabsSuperPanel.wijsuperpanel('scrollChildIntoView', $li.find('a'));
                    $li.addClass( "nos-ostabs-selected ui-state-active" );
                    $show.removeClass( "nos-ostabs-hide" );
                    fireCallbacks($show);
                    self._firePanelEvent($show, {event : 'showPanel'});
                };

            // Hide a tab, $show is optional...
            var hideTab = hideFx
                ? function( clicked, $hide ) {
                    $hide.animate( hideFx, hideFx.duration || "normal", function() {
                        if ( self.uiOstabsNewTab.hasClass( 'ui-state-active' ) ) {
                            self._tabsWidth();
                        }
                        self.lis.removeClass( "nos-ostabs-selected ui-state-active" );
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
                    $hide.addClass( "nos-ostabs-hide" );
                    self.element.dequeue( "tabs" );
                    $hide.trigger( "hidePanel.ostabs");
                };

            // attach tab event handler, unbind to avoid duplicates from former tabifying...
            self.anchors.bind( "click.tabs", function() {
                var el = this,
                    $li = $(el).closest( "li" ),
                    $hide = self.panels.filter( ":not(.nos-ostabs-hide)" ),
                    $show = self.element.find( self._sanitizeSelector( el.hash ) );

                $li.addClass( "ui-state-open" );
                self.uiOstabsNewTab.removeClass('ui-state-open ui-state-default');

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
                        self.stackOpening.push(el);
                        showTab( el, $show );
                    });

                    $( 'title' ).text( $li.find( '.nos-ostabs-label' ).text() );

                    self._load( self.anchors.index( this ) );
                } else {
                    throw "jQuery UI Tabs: Mismatching fragment identifier.";
                }

                this.blur();
            });

            // disable click in any case
            self.anchors.bind( "click.tabs", function(){
                return false;
            });

            self._tabsWidth();
        },

        _getIndex: function( index ) {
            var self = this;

            // meta-function to give users option to provide a href string instead of a numerical index.
            // also sanitizes numerical indexes to valid values.
            if ( typeof index == "string" ) {
                index = self.anchors.index( self.anchors.filter( "[href$=" + index + "]" ) );
            }

            return index;
        },

        _actions: function( $panel, index ) {
            var self = this,
                o = self.options;

            var li = self.lis.eq(index),
                a =  self.anchors.eq(index);

            var actions = $( '<div></div>' )
                .addClass( 'nos-ostabs-actions ui-state-active' )
                .prependTo( $panel );

            var links = $( '<div></div>' )
                .addClass( 'nos-ostabs-actions-links' )
                .prependTo( actions );

            var removable = li.not( '.nos-ostabs-tray' ).not( '.nos-ostabs-appstab' ).not( '.nos-ostabs-newtab' ).length;
            var closable = li.not( '.nos-ostabs-appstab' ).length;
            var reloadable = a.data( "iframe.tabs" );

            if ( closable ) {
                var close = $( '<a href="#"></a>' )
                    .addClass( 'nos-ostabs-close' )
                    .click(function() {
                        self.remove( self.lis.index(li) ); // On recalcule l'index au cas où l'onglet est été déplacé
                        return false;
                    })
                    .appendTo( links );
                $( '<span></span>' ).addClass( 'ui-icon ui-icon-closethick' )
                    .text( removable ? o.texts.removeTab : o.texts.closeTab )
                    .appendTo( close );
                $( '<span></span>' ).text( removable ? o.texts.removeTab : o.texts.closeTab )
                    .appendTo( close );
            }

            if ( reloadable ) {
                var reload = $( '<a href="#"></a>' )
                    .addClass( 'nos-ostabs-reload' )
                    .click(function() {
                        var fr = $panel.find( 'iframe.nos-ostabs-panel-content' );
                        if (fr !== undefined) {
                            fr.attr("src", fr.attr("src"));
                        }
                        return false;
                    })
                    .text( o.texts.reloadTab )
                    .appendTo( links );
                $( '<span></span>' ).addClass( 'ui-icon ui-icon-refresh' )
                    .text( o.texts.reloadTab )
                    .appendTo( reload );
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
                    $( '<style type="text/css" class="tabswidth">.nos-ostabs .ui-widget-header .nos-ostabs-label {width : ' + self.labelWidth + 'px !important;}</style>' ).appendTo( 'head' );
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
                        $( '<style type="text/css" class="tabswidth">.nos-ostabs .ui-widget-header .nos-ostabs-label {width : ' + self.labelWidth + 'px !important;}</style>' ).appendTo( 'head' );
                    }
                } while ( self.tabsWidth > (width + nbLabel * 10) && self.labelWidth < o.labelMaxWidth );
            }

            if ( self.tabsWidth < self.uiOstabsTabs.width() ) {
                self.uiOstabsSuperPanel.find('.wijmo-wijsuperpanel-buttonleft, .wijmo-wijsuperpanel-buttonright').show();
            } else {
                self.uiOstabsSuperPanel.find('.wijmo-wijsuperpanel-buttonleft, .wijmo-wijsuperpanel-buttonright').hide();
            }
        },

        add: function( tab, index ) {
            var self = this;

            if ( !$.isPlainObject(tab) || tab.url === undefined ) {
                return false;
            }

            if ( index === undefined ) {
                index = self.anchors.length - 1;
            }

            var $li = self._add(tab);

            if ( index < self.lis.length ) {
                $li.insertBefore( self.lis[ index ] );
            } else {
                index = self.lis.eq($li);
            }
            self.uiOstabsTabs.sortable( 'refresh' );

            self._tabify();

            if ( self.anchors.length == 1 ) {
                self.select(0);
            }

            self._trigger( "add", tab, self._ui( $li[ 0 ] ) );
            return index;
        },

        _add: function(tab, target) {
            var self = this;

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
                iconSize: 16,
                panelId: false
            }, tab);


            var a = $( '<a href="' + tab.url + '"></a>' );
            if (tab.iframe) {
                a.data( "iframe.tabs", true );
            }
            if (tab.panelId) {
                a.data( "panelid.tabs", tab.panelId );
            }

            var icon = self._icon( tab ).appendTo( a );

            var label = $( '<span></span>' ).addClass( 'nos-ostabs-label' )
                .text( tab.label ? tab.label : 'New tab' )
                .appendTo( a );
            if ( !tab.labelDisplay ) {
                label.hide();
            }

            var li = $( '<li></li>' ).append( a )
                .attr('title', tab.label)
                .addClass( 'ui-corner-top ui-state-default').data( 'ui-ostab', tab )
                .appendTo( target );

            if ( !isNaN( tab.iconSize ) && tab.iconSize !== 16 && target !== self.uiOstabsTabs) {
                li.css({
                    height: ( tab.iconSize + 4 ) + 'px',
                    bottom: ( tab.iconSize - 35 ) + 'px'
                });
                icon.css( 'top', '2px' );
            }

            return li;
        },

        remove: function( index ) {
            var self = this;
            index = self._getIndex( index );
            var $li = self.lis.eq( index ),
                $a = self.anchors.eq( index ),
                $panel = self.element.find( self._sanitizeSelector( self.anchors[ index ].hash ) );

            if ( index == 0 && !$li.hasClass( "nos-ostabs-selected" ) ) {
                var linewtab = self.lis.filter( '.nos-ostabs-newtab' );
                if ( linewtab.hasClass( "nos-ostabs-selected" ) ) {
                    $li = linewtab;
                }
            }

            if ( $li.not( '.nos-ostabs-tray' ).not( '.nos-ostabs-appstab' ).not( '.nos-ostabs-newtab' ).length ) {
                $li.remove();
                $panel.remove();
            }

            $li.removeClass( "ui-state-active ui-state-open" );

            // Remove tab from stack opening
            for (var i = 0; i < self.stackOpening.length; i++) {
                if (self.stackOpening[i] === $a.get(0)) {
                    self.stackOpening.splice(i, 1);
                }
            }

            // Open the last tab in stack opening or the 0 index
            if (self.stackOpening.length) {
                self.select( self.anchors.index( self.stackOpening[self.stackOpening.length - 1] ) );
            } else {
                self.select( 0 );
            }

            if ( $li.not( '.nos-ostabs-appstab' ).not( '.nos-ostabs-newtab' ).length ) {
                $( '> *', $panel ).not( '.nos-ostabs-actions' ).remove();
            }
            $panel.addClass( "nos-ostabs-hide" )
                .removeData('callbacks.ostabs');

            $li.removeClass( "nos-ostabs-selected" );

            self._tabify();

            self._trigger( "remove", null, self._ui( $li[ 0 ], $panel[ 0 ] ) );
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
                $li.find( '.nos-ostabs-label' ).text( title );

                if ( o.selected == index ) {
                    $( 'title' ).text( title );
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

            var $li = self.lis.eq( index );

            tab = $.extend( {}, $li.data( 'ui-ostab' ), tab );

            if ( self.options.selected == index ) {
                $( 'title' ).text( tab.label );
            }

            var $newLi = self._add(tab),
                $newA = $newLi.find('a');

            $li.data( 'ui-ostab', tab )
                .attr('title', tab.label || '')
                .addClass($newLi.attr('class'))
                .css({
                    height: $newLi.css('height'),
                    bottom: $newLi.css('bottom')
                })
                .find('a')
                .empty()
                .append($newA.children());

            $newLi.remove();

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

            var panel = self.element.find( self._sanitizeSelector( a.hash )),
                content = $( '> *', panel ).not( '.nos-ostabs-actions' ).length;

            if (content !== 0) {
                self.element.dequeue( "tabs" );
                return;
            }

            // load remote from here on
            self.lis.eq( index ).addClass( "ui-state-processing" );

            $( "span.nos-ostabs-label", a ).each(function() {
                var $a = $( this );
                $a.data( "label.tabs", $a.html() )
                    .html( $a.data("label.tabs") ? o.texts.spinner : '' );
            });

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
                    success: function( r ) {
                        $( '<div></div>' ).addClass( 'nos-ostabs-panel-content nos-dispatcher' )
                            .data( 'nos-ostabs-index', index )
                            .prependTo( panel.data('callbacks.ostabs', {}) )
                            .html( r );

                        $.data( a, "cache.tabs", true );
                    },
                    complete: function() {
                        // take care of tab labels
                        self._cleanup();

                        self._trigger( "load", null, self._ui( self.lis[index] ) );
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
                    tabs.push( $(this).data('ui-ostab') );
                });
            return tabs;
        },

        dispatchEvent : function(event) {
            var self = this,
                o = self.options;

            if (!$.isPlainObject(event)) {
                event = {
                    event : event
                };
            }

            $.each(self.panels, function(i) {
                var $panel = $(this);
                if (i === o.selected) {
                    self._firePanelEvent($panel, event);
                } else {
                    var callbacks = $panel.data('callbacks.ostabs');
                    if ($.isPlainObject(callbacks)) {
                        callbacks[event.event + (event.type ? '.' + event.type : '')] = event;
                    }
                }
            });

            return self;
        },

        _firePanelEvent : function($dispatcher, event) {
            $dispatcher = $dispatcher.is('.nos-dispatcher') ? $dispatcher : $dispatcher.find('.nos-dispatcher');

            var e = $.Event(event.event, {
                namespace : event.type || null,
                data : event.data || null
            });

            if ($dispatcher.is('iframe')) {
                if ($dispatcher[0].contentDocument.$) {
                    $dispatcher[0].contentDocument.$('body').trigger(e);
                }
            } else {
                // @todo Figure out why we need this try catch.
                // Adding a media throws an TypeError exception : unknown method 'trigger' on DOMWindow
                try {
                    $dispatcher.trigger(e);
                } catch (e) {
                    log(e);
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

    $(function() {
        var noviusos = $('#noviusos');

        $.extend($.nos, {
            $noviusos : noviusos,

            initialize: function(configuration) {
                var nosObject = this;
                var fct = function(e) {
                    nosObject.tabs.save();
                };
                $.extend(configuration, {
                    add: fct,
                    remove: fct,
                    select: fct,
                    show: fct,
                    drag: fct
                });

                if (configuration['user_configuration']['tabs']) {
                    if (!configuration['options']) {
                        configuration['options'] = {};
                    }
                    configuration['initTabs'] = configuration['user_configuration']['tabs']['tabs'];
                    configuration['selected'] = configuration['user_configuration']['tabs']['selected'];
                }
                noviusos.ostabs(configuration);

                /*
                 if (configuration['user_configuration']['tabs']) {
                 noviusos.ostabs('setConfiguration', configuration['user_configuration']['tabs']);
                 }
                 */
            },

            tabs : {
                current : function(index) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos(window.frameElement).data('nos-ostabs-index');
                    }
                    if ($.isNumeric(index)) {
                        return index;
                    }
                    if ($.type(index) === 'object' && $.isFunction(index.parents)) {
                        return index.parents('.nos-ostabs-panel-content').data('nos-ostabs-index');
                    }
                    if (noviusos.length) {
                        return noviusos.ostabs('current').index;
                    }
                    return false;
                },
                add : function(tab, end) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.add(tab, end);
                    }
                    var index;
                    if (end !== undefined && end !== true) {
                        index = this.current(end) + 1;
                    }
                    if (noviusos.length) {
                        index = noviusos.ostabs('add', tab, index);
                        return noviusos.ostabs('select', index);
                    } else if (tab.url) {
                        window.open(tab.url);
                    }
                    return false;
                },
                open : function(tab, end) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.add(tab, end);
                    }
                    if (noviusos.length) {
                        var tabs = noviusos.ostabs('tabs'),
                            sel = false;
                        $.each(tabs, function(i, t) {
                            if (t.url === tab.url) {
                                sel = i;
                                return false;
                            }
                        });
                        if (sel !== false) {
                            return noviusos.ostabs('select', sel + 4); // Add 4 because appstab and tray are before and not return by tabs
                        } else {
                            return this.add(tab, end);
                        }
                    } else if (tab.url) {
                        window.open(tab.url);
                    }
                    return false;
                },
                update : function(index, tab) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.update(this.current(), index, tab);
                    }
                    if (tab == null) {
                        tab = index;
                    }
                    index = this.current(index);
                    if (noviusos.length) {
                        noviusos.ostabs('update', index, tab);
                    }
                    return true;
                },
                close : function(index) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.close(this.current());
                    }
                    index = this.current(index);
                    if (noviusos.length) {
                        noviusos.ostabs('remove', index);
                    }
                    return true;
                },
                replace : function(url) {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.replace(url);
                    }
                    var index = this.current();
                    this.add({url : url}, false);
                    this.close(index);
                    return true;
                },
                /** Save tabs in user configuration file
                 */
                save: function() {
                    if (window.parent != window && window.parent.$nos) {
                        return window.parent.$nos.nos.tabs.save();
                    }
                    if (noviusos.length) {
                        $nos.nos.saveUserConfiguration('tabs', {selected: noviusos.ostabs('option', 'selected'), tabs: noviusos.ostabs('tabs')});
                    }
                }
            }
        });
    });

	return $;
});
