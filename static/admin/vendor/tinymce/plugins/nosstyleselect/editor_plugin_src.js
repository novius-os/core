/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

(function() {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('nosstyleselect');

    tinymce.create('tinymce.plugins.NosStyleSelectPlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            self.nosstyleselect_formats = ed.getParam('nosstyleselect_formats', [
                { block : 'p', title : 'nosstyleselect.paragraph'},
                { block : 'address', title : 'nosstyleselect.address'},
                { block : 'pre', title : 'nosstyleselect.pre'},
                { block : 'h1', title : 'nosstyleselect.h1'},
                { block : 'h2', title : 'nosstyleselect.h2'},
                { block : 'h3', title : 'nosstyleselect.h3'},
                { block : 'h4', title : 'nosstyleselect.h4'},
                { block : 'h5', title : 'nosstyleselect.h5'},
                { block : 'h6', title : 'nosstyleselect.h6'},
                { block : 'div', title : 'nosstyleselect.div'},
                { block : 'blockquote', title : 'nosstyleselect.blockquote'},
                { block : 'code', title : 'nosstyleselect.code'},
                { block : 'dt', title : 'nosstyleselect.dt'},
                { block : 'dd', title : 'nosstyleselect.dd'},
                { block : 'samp', title : 'nosstyleselect.samp'}
            ]);

            ed.onNodeChange.add(function(ed, cm, n, co, ob) {
                var c;

                if (c = cm.get('nosstyleselect')) {
                    if (!c.isMenuRendered) {
                        c.renderMenu();
                        c.isMenuRendered = true;
                    }

                    formatNames = [];
                    tinymce.each(c.items, function(item) {
                        formatNames.push(item.value);
                    });

                    matches = ed.formatter.matchAll(formatNames);
                    c.select(matches[0]);
                    tinymce.each(matches, function(match, index) {
                        if (index > 0) {
                            c.mark(match);
                        }
                    });
                }
            });
        },

        createControl : function(n, cm) {
            var self = this, ed = self.editor, ctrl;

            if (n === 'nosstyleselect') {
                // Generates a preview for a format
                function getPreviewCss(ed, fmt) {
                    var name, previewElm, dom = ed.dom, previewCss = '', parentFontSize, previewStylesName;

                    previewStyles = ed.settings.preview_styles;

                    // No preview forced
                    if (previewStyles === false)
                        return '';

                    // Default preview
                    if (!previewStyles)
                        previewStyles = 'font-family font-size font-weight text-decoration text-transform color background-color';

                    // Removes any variables since these can't be previewed
                    function removeVars(val) {
                        return val.replace(/%(\w+)/g, '');
                    };

                    // Create block/inline element to use for preview
                    name = fmt.block || fmt.inline || 'span';
                    previewElm = dom.create(name);

                    // Add format styles to preview element
                    tinymce.each(fmt.styles, function(value, name) {
                        value = removeVars(value);

                        if (value)
                            dom.setStyle(previewElm, name, value);
                    });

                    // Add attributes to preview element
                    tinymce.each(fmt.attributes, function(value, name) {
                        value = removeVars(value);

                        if (value)
                            dom.setAttrib(previewElm, name, value);
                    });

                    // Add classes to preview element
                    tinymce.each(fmt.classes, function(value) {
                        value = removeVars(value);

                        if (!dom.hasClass(previewElm, value))
                            dom.addClass(previewElm, value);
                    });

                    // Add the previewElm outside the visual area
                    dom.setStyles(previewElm, {position: 'absolute', left: -0xFFFF});
                    ed.getBody().appendChild(previewElm);

                    // Get parent container font size so we can compute px values out of em/% for older IE:s
                    parentFontSize = dom.getStyle(ed.getBody(), 'fontSize', true);
                    parentFontSize = /px$/.test(parentFontSize) ? parseInt(parentFontSize, 10) : 0;

                    tinymce.each(previewStyles.split(' '), function(name) {
                        var value = dom.getStyle(previewElm, name, true);

                        // If background is transparent then check if the body has a background color we can use
                        if (name == 'background-color' && /transparent|rgba\s*\([^)]+,\s*0\)/.test(value)) {
                            value = dom.getStyle(ed.getBody(), name, true);

                            // Ignore white since it's the default color, not the nicest fix
                            if (dom.toHex(value).toLowerCase() == '#ffffff') {
                                return;
                            }
                        }

                        // Old IE won't calculate the font size so we need to do that manually
                        if (name == 'font-size') {
                            if (/em|%$/.test(value)) {
                                if (parentFontSize === 0) {
                                    return;
                                }

                                // Convert font size from em/% to px
                                value = parseFloat(value, 10) / (/%$/.test(value) ? 100 : 1);
                                value = (value * parentFontSize) + 'px';
                            }
                        }

                        previewCss += name + ':' + value + ';';
                    });

                    dom.remove(previewElm);

                    return previewCss;
                };

                // Setup style select box
                ctrl = cm.createListBox('nosstyleselect', {
                    title : 'nosstyleselect.style_select',
                    onselect : function(name) {
                        var matches, formatNames = [], removedFormat;

                        tinymce.each(ctrl.items, function(item) {
                            formatNames.push(item.value);
                        });

                        ed.focus();
                        ed.undoManager.add();

                        // Toggle off the current format(s)
                        matches = ed.formatter.matchAll(formatNames);
                        tinymce.each(matches, function(match) {
                            if (!name || match == name) {
                                if (match)
                                    ed.formatter.remove(match);

                                removedFormat = true;
                            }
                        });

                        if (!removedFormat)
                            ed.formatter.apply(name);

                        ed.undoManager.add();
                        ed.nodeChanged();

                        return false; // No auto select
                    }
                });

                var formats = self.nosstyleselect_formats;

                ed.onPreInit.add(function() {
                    var counter = 0;

                    tinymce.each(formats, function(fmt) {
                        var name, keys = 0;

                        tinymce.each(fmt, function() {keys++;});

                        if (keys > 1) {
                            name = fmt.name = fmt.name || 'style_' + (counter++);
                            ed.formatter.register(name, fmt);
                            ctrl.add(fmt.title, name, {
                                style: function() {
                                    return getPreviewCss(ed, fmt);
                                }
                            });
                        } else
                            ctrl.add(fmt.title);
                    });
                });

                return ctrl;
            }
            return null;
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nosstyleselect', tinymce.plugins.NosStyleSelectPlugin);
})();
