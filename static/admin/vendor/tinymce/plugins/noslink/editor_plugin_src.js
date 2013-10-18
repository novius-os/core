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
    tinymce.PluginManager.requireLangPack('noslink');

    tinymce.create('tinymce.plugins.NosLinkPlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            // Register commands
            ed.addCommand('mceNosLink', function(ui, metadata, edit) {
                self._nosLink(ui, metadata, edit);
            });

            ed.onNodeChange.add(function(ed, cm, n, co, ob) {
                var p, c;

                function getParent(name) {
                    var i, parents = ob.parents, func = name;

                    if (typeof(name) == 'string') {
                        func = function(node) {
                            return node.nodeName == name;
                        };
                    }

                    for (i = 0; i < parents.length; i++) {
                        if (func(parents[i]))
                            return parents[i];
                    }
                }

                p = getParent('A');
                if (c = cm.get('noslink')) {
                    c.setDisabled(!p && co);
                    c.setActive(!!p);
                }
            });
        },

        createControl : function(n, cm) {
            var self = this, c;

            if (n === 'noslink') {
                c = cm.createSplitButton('noslink', {
                    title : 'noslink.link_title',
                    label : 'noslink.link_label',
                    onclick: function(){
                        self.editor.execCommand('mceNosLink', true, '');
                    },
                    'class' : 'mce_link'
                }, tinymce.ui.NosSplitButton);

                c.onRenderMenu.add(function(c, m) {
                    m.add({
                        title : 'noslink.link_title',
                        'class' : 'mceMenuItemTitle'
                    }).setDisabled(1);

                    m.add({
                        title : 'noslink.link_title',
                        icon : 'link',
                        onclick: function(){
                            self.editor.execCommand('mceNosLink', true, '');
                        },
                        id : 'link'
                    });

                    m.add({
                        title : 'noslink.unlink_desc',
                        icon : 'unlink',
                        onclick: function(){
                            self.editor.execCommand('unlink', false, '');
                        },
                        id : 'unlink'
                    });

                    m.onShowMenu.add(function(m) {
                        var n = self.editor.selection.getNode(), p, link, anchor;

                        p = tinymce.DOM.getParent(n, 'A');
                        link = !!p;
                        anchor = link && (p.name || (p.id && !p.href));

                        m.items['link'].setDisabled(anchor);
                        m.items['link'].setActive(link && !anchor);
                        m.items['unlink'].setDisabled(!link);
                    });
                });

                return c;
            }
            return null;
        },

        _nosLink : function(ui, val) {
            var ed = this.editor,
                e = ed.dom.getParent(ed.selection.getNode(), 'A');

            var bookmark = ed.selection.getBookmark(1);

            var dialog = null;
            dialog = $nos(ed.getElement()).nosDialog({
                contentUrl: 'admin/nos/wysiwyg/link' + (e ? '/edit' : ''),
                title: e ? ed.getLang('nos.link_edit') : ed.getLang('nos.link_insert'),
                ajax: true,
                open : function(event) {
                    $(event.target).data('tinymce', ed);
                }
            });
            dialog.bind('insert.link', function(event, link) {
                // Cleanup
                dialog.nosDialog('close');

                if (tinymce.isIE) {
                    ed.selection.moveToBookmark(bookmark);
                }

                if (e == null) {
                    ed.getDoc().execCommand("unlink", false, null);
                    ed.execCommand("mceInsertLink", false, "#mce_temp_url#", {skip_undo : 1});

                    tinymce.each(ed.dom.select("a"), function(n) {
                        if (ed.dom.getAttrib(n, 'href') == '#mce_temp_url#') {
                            e = n;

                            ed.dom.setAttribs(e, {
                                href : link.href,
                                title : link.title,
                                target : link.target
                            });
                        }
                    });
                } else {
                    ed.dom.setAttribs(e, {
                        href : link.href,
                        title : link.title,
                        target : link.target
                    });
                }

                // Don't move caret if selection was image
                if (e.childNodes.length != 1 || e.firstChild.nodeName != 'IMG') {
                    ed.focus();
                    ed.selection.select(e);
                    ed.selection.collapse(0);
                    ed.windowManager.bookmark = ed.selection.getBookmark(1);
                }

                ed.execCommand("mceEndUndoLevel");
            });

        }
    });

    // Register plugin
    tinymce.PluginManager.add('noslink', tinymce.plugins.NosLinkPlugin);
})();
