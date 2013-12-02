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
    tinymce.PluginManager.requireLangPack('nospaste');

    tinymce.create('tinymce.plugins.NosPastePlugin', {
        init : function(ed, url) {
            var self = this, command;

            self.editor = ed;
            self.url = url;

            tinymce.DOM.loadCSS(url + '/css/ui.css');

            ed.addCommand('nosPasteHtml', function(ui, metadata, edit) {
                self._nosPasteHtml(ui, metadata, edit);
            });
        },

        createControl : function(n, cm) {
            var ed = this.editor, c;

            if (n === 'nospaste') {
                c = cm.createSplitButton('paste', {
                    title : 'nospaste.paste_desc',
                    cmd : 'nosPaste',
                    'class' : 'mce_pastebouton'
                });

                c.onRenderMenu.add(function(c, m) {
                    m.add({
                        title : 'nospaste.paste_desc',
                        'class' : 'mceMenuItemTitle'
                    }).setDisabled(1);

                    m.add({
                        title : 'nospaste.paste_desc',
                        icon : 'paste',
                        cmd : 'nosPaste'
                    });

                    m.addSeparator();

                    m.add({
                        title : 'paste.paste_text_desc',
                        icon : 'pastetext',
                        onclick : function() {
                            ed.execCommand('mcePasteText', true, '');
                        }
                    });

                    m.add({
                        title : 'paste.paste_word_desc',
                        icon : 'pasteword',
                        onclick : function() {
                            ed.execCommand('mcePasteWord', true, '');
                        }
                    });

                    m.add({
                        title : 'nospaste.paste_html_desc',
                        icon : 'pastehtml',
                        onclick : function() {
                            ed.execCommand('nosPasteHtml', true, '');
                        }
                    });
                });
                return c;
            }
            return null;
        },

        _nosPasteHtml : function(ui, val) {
            var ed = this.editor;

            ed.windowManager.open({
                url : this.url + '/pastehtml.htm',
                width : 600,
                height : 420,
                inline : true
            }, {
                theme_url : this.url
            });
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nospaste', tinymce.plugins.NosPastePlugin, ['paste']);
})();
