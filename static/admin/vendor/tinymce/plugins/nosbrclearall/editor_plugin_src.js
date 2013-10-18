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
    tinymce.PluginManager.requireLangPack('nosbrclearall');

    tinymce.create('tinymce.plugins.NosBrClearAllPlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            ed.addCommand('nosBrClearAll', function() {
                br = '<br style="clear: both"/>';

                ed.execCommand("mceInsertContent", false, br);
            });

            ed.addButton('nosbrclearall', {
                title : 'nosbrclearall.desc',
                cmd : 'nosBrClearAll',
                image : url + '/img/brclearall.gif'
            });
        }    });

    // Register plugin
    tinymce.PluginManager.add('nosbrclearall', tinymce.plugins.NosBrClearAllPlugin);
})();
