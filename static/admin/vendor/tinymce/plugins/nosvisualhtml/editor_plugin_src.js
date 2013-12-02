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
    tinymce.PluginManager.requireLangPack('nosvisualhtml');

    tinymce.create('tinymce.plugins.NosVisualHtmlPlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            ed.addCommand('nosVisualHtml', function() {
                if(ed.dom.select('body.debug') == '') {
                    ed.dom.addClass(ed.dom.select('body'), 'debug');
                } else {
                    ed.dom.removeClass(ed.dom.select('body'), 'debug');
                }
            });

            ed.addButton('nosvisualhtml', {
                title : 'nosvisualhtml.desc',
                cmd : 'nosVisualHtml',
                'class': 'mce_visualchars'
            });

            ed.onInit.add(function(ed) {
                ed.dom.loadCSS(url + '/css/content.css');
            });

            ed.onNodeChange.add(function(ed, cm, n) {
                cm.setActive('nosvisualhtml',!(ed.dom.select('body.debug') == ''));
            });
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nosvisualhtml', tinymce.plugins.NosVisualHtmlPlugin);
})();
