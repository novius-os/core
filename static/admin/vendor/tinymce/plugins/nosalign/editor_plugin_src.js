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
