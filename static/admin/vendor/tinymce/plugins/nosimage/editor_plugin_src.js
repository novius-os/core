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
    tinymce.PluginManager.requireLangPack('nosimage');

    tinymce.create('tinymce.plugins.NosImagePlugin', {
        init : function(ed, url) {
            var self = this, mediaCached = {};

            self.editor = ed;

            ed.addCommand('nosImage', function(ui, metadata, edit) {
                self._nosImage(ui, metadata, edit);
            });

            ed.addButton('nosimage', {
                title : 'nosimage.title',
                label : 'nosimage.label',
                cmd : 'nosImage',
                'class' : 'mce_image'
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

                p = getParent('IMG');
                if (c = cm.get('nosimage')) {
                    var temp =!co && !!p && n.className.indexOf('mceItem') == -1;
                    c.setActive(!co && !!p && n.className.indexOf('mceItem') == -1);
                }
            });
        },

        _nosImage : function(ui, val) {
            var ed = this.editor;

            // Internal image object like a flash placeholder
            if (ed.dom.getAttrib(ed.selection.getNode(), 'class', '').indexOf('mceItem') != -1)
                return;

            var editCurrentImage = ed.selection.getNode().nodeName == 'IMG';

            var bookmark = ed.selection.getBookmark(1);

            var dialog = null;
            dialog = $nos(ed.getElement()).nosDialog({
                contentUrl: 'admin/nos/wysiwyg/image' + (editCurrentImage ? '/edit' : ''),
                title: editCurrentImage ? ed.getLang('nosimage.edit') : ed.getLang('nosimage.insert'),
                ajax: true,
                open : function(e) {
                    $(e.target).data('tinymce', ed);
                }
            });
            dialog.bind('insert.media', function(e, img) {
                // Cleanup
                dialog.nosDialog('close');

                if (tinymce.isIE) {
                    ed.selection.moveToBookmark(bookmark);
                }

                var $img = $(img);

                if (editCurrentImage) {
                    var node = ed.selection.getNode();
                    if (node.nodeName == 'IMG') {
                        var args = {};
                        $.each('src title alt width height style'.split(' '), function(i, name) {
                            var value = $img.attr(name);
                            args[name] = value;
                        });
                        args['data-media-id'] = $img.data('media').id;
                        $(node).data('media-id', args['data-media-id']);
                        ed.dom.setAttribs(node, args);
                        ed.execCommand('mceRepaint');
                        ed.undoManager.add();
                    }
                } else {
                    var html = $('<div></div>').append($(img).addClass('nosMedia').attr('data-media-id', $(img).data('media').id)).html();
                    ed.execCommand('mceInsertContent', false, html, {skip_undo : 1});
                }
                ed.execCommand("mceEndUndoLevel");
            });
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nosimage', tinymce.plugins.NosImagePlugin);
})();
