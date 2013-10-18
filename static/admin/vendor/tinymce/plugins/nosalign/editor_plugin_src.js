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
    tinymce.PluginManager.requireLangPack('nosalign');

    tinymce.create('tinymce.plugins.NosAlignPlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            ed.onNodeChange.add(function(ed, cm, n, co, ob) {
                var c;

                if (c = cm.get('justifycontrols')) {
                    tinymce.each(c.items, function(item, i) {
                        if (ed.queryCommandState(item.cmd)) {
                            c.selectByIndex(i)
                        }
                    });
                }
            });
        },

        createControl : function(n, cm) {
            var ed = this.editor, ctrl, tab_justify;

            if (n === 'nosalign') {
                tab_justify = {
                    justifyleft : {
                        title : 'nosalign.left_desc',
                        cmd : 'JustifyLeft'
                    },
                    justifycenter : {
                        title : 'nosalign.center_desc',
                        cmd : 'JustifyCenter'
                    },
                    justifyright : {
                        title : 'nosalign.right_desc',
                        cmd : 'JustifyRight'
                    },
                    justifyfull : {
                        title : 'nosalign.full_desc',
                        cmd : 'JustifyFull'
                    }
                };

                ctrl = cm.createListBox('nosalign', {
                    title : 'nosalign.select',
                    onselect : function(name) {
                        var align = tab_justify[name];

                        ed.execCommand(align.cmd, false);

                        return false; // No auto select
                    }
                }, tinymce.ui.NosListBox);

                ed.onInit.add(function() {
                    tinymce.each(tab_justify, function(item, key) {
                        ctrl.add(item.title, key, tinymce.extend(item, {
                            icon : key
                        }));
                    });
                });

                return ctrl;
            }
            return null;
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nosalign', tinymce.plugins.NosAlignPlugin);
})();
(function(tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;

    tinymce.create('tinymce.ui.NosListBox:tinymce.ui.ListBox', {
        NosListBox : function(id, s, ed) {
            this.parent(id, s, ed);
        },

        renderMenu : function() {
            var t = this, m;

            m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
                menu_line : 1,
                'class' : t.classPrefix + 'Menu',
                max_width : 150,
                max_height : 150
            });

            m.onHideMenu.add(function() {
                t.hideMenu();
                t.focus();
            });

            m.add({
                title : t.settings.title,
                'class' : 'mceMenuItemTitle',
                onclick : function() {
                    if (t.settings.onselect('') !== false)
                        t.select(''); // Must be runned after
                }
            });

            each(t.items, function(o) {
                // No value then treat it as a title
                if (o.value === undefined) {
                    m.add({
                        title : o.title,
                        role : "option",
                        'class' : 'mceMenuItemTitle',
                        onclick : function() {
                            if (t.settings.onselect('') !== false)
                                t.select(''); // Must be runned after
                        }
                    });
                } else {
                    o.id = DOM.uniqueId();
                    o.role= "option";
                    o.onclick = function() {
                        if (t.settings.onselect(o.value) !== false)
                            t.select(o.value); // Must be runned after
                    };

                    m.add(o);
                }
            });

            t.onRenderMenu.dispatch(t, m);
            t.menu = m;
        }
    });
})(tinymce);
