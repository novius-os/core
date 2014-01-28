/**
 * editor_template_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function(tinymce) {
    var DOM = tinymce.DOM, extend = tinymce.extend;

    // Tell it to load theme specific language pack(s)


    tinymce.ThemeManager.load('advanced', tinyMCE.baseURI.toAbsolute("themes/advanced/editor_template" + tinymce.suffix + ".js"), function() {
        tinymce.ThemeManager.requireLangPack('nos');

        tinymce.create('tinymce.themes.NosTheme:tinymce.themes.AdvancedTheme', {

            init : function(ed, url) {
                var t = this, s = {};

                ed.settings.popup_css = "skins/" + s.skin + "/dialog.css";

                t.controls = extend(t.controls, {
                    cut : ['cut_desc', 'nosCut'],
                    copy : ['copy_desc', 'nosCopy'],
                    paste : ['paste_desc', 'nosPaste']
                });

                ed.addButton('mediawithlabel', {
                    title : 'advanced.media_title',
                    label : 'advanced.media_label',
                    'class' : 'mce_media',
                    cmd : 'mceMedia'
                });

                this.parent(ed, url.replace('/themes/nos', '/themes/advanced'));

                if (ed.settings.skin === 'bootstrap') {
                    ed.contentCSS.push(ed.baseURI.toAbsolute(url + "/skins/" + ed.settings.skin + "/content.css"));

                    DOM.loadCSS(url + "/skins/" + ed.settings.skin + "/ui.css");
                }
            },

            execCommand : function(cmd, ui, val) {
                var ed = this.editor;

                switch (cmd) {
                    case 'nosCut':
                    case 'nosCopy':
                    case 'nosPaste':
                        ed.windowManager.alert(ed.getLang('advanced.nos_clipboard_msg'));
                        try {
                            ed.getDoc().execCommand(cmd.replace('nos', ''), ui, val);
                        } catch (ex) {
                            if (this.isGecko) {
                                ed.windowManager.alert(ed.getLang('advanced.nos_clipboard_msg'));
                            } else {
                                ed.windowManager.alert(ed.getLang('clipboard_no_support'));
                            }
                        }

                        return true;
                        break;
                }
                return this.parent(cmd, ui, val);
            },

            getInfo : function() {
                return {
                    longname : 'Nos theme',
                    author : 'Novius-OS',
                    authorurl : 'http://www.novius-os.org',
                    version : '2'
                }
            },

            _simpleLayout : function(s, tb, o, p) {
                var t = this, ed = t.editor, lo = s.theme_advanced_toolbar_location, ic;

                ic = this.parent(s, tb, o, p);

                // Create external toolbar
                if (lo == 'external') {

                    ed.onInit.add(function() {
                        var e = DOM.get(ed.id + '_external');
                        DOM.setStyle(ed.id + '_external', 'z-index', '999');
                    });

                    ed.onMouseUp.add(function() {
                        var toolbarRect = DOM.getRect(ed.id + '_tblext');

                        if (toolbarRect.w + toolbarRect.x > window.innerWidth) {
                            DOM.setStyle(e, 'left', window.innerWidth - toolbarRect.w - toolbarRect.x - 1);
                        }
                    });
                }

                return ic;
            }
    });

        tinymce.ThemeManager.add('nos', tinymce.themes.NosTheme);
    });


}(tinymce));

