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
    tinymce.PluginManager.requireLangPack('nostoolbartoggle');

    tinymce.create('tinymce.plugins.NosToolbarTogglePlugin', {
        init : function(ed, url) {
            var self = this;

            self.editor = ed;

            tinymce.DOM.loadCSS(url + '/css/ui.css');
        },

        createControl : function(n, cm) {
            var self = this, ed = self.editor, s = ed.theme.settings, tbIds = [], toolbars = ['1', '2', '3'], i, resizeIframe, setState;

            if (n === 'nostoolbartoggle') {
                self.control = cm.createButton('nostoolbartoggle', {
                    title : 'nostoolbartoggle.title',
                    label : 'nostoolbartoggle.label_open',
                    'class' : 'mce_toolbar_toggle_open',
                    cmd : 'nosToggleToolbars'
                });

                for(i = 0; i < toolbars.length; i++){
                    tbIds[i] = ed.getParam('', 'toolbar' + (toolbars[i]).replace(' ',''));
                }

                resizeIframe = function(ed, dy) {
                    var toolbar_location = '';
                    tinymce.each(s, function(value, name) {
                        if (name.substr(-16) === 'toolbar_location') {
                            toolbar_location = value;
                            return false;
                        }
                        return true;
                    });
                    if (toolbar_location === 'external') {
                        var toolbar = tinymce.DOM.get(ed.id + '_external');

                        $(toolbar).css('top', ($(toolbar).position().top + dy) + 'px');
                    } else {
                        var ifr = ed.getContentAreaContainer().firstChild;

                        tinymce.DOM.setStyle(ifr, 'height', tinymce.DOM.getSize(ifr).h + dy); // Resize iframe
                        ed.theme.deltaHeight += dy; // For resize cookie
                    }
                };
                setState = function(state) {
                    var c = self.control;
                    c.setActive(state);
                    tinymce.DOM.setAttrib(tinymce.DOM.select('.mceIcon', c.id), 'class', 'mceIcon');
                    tinymce.DOM.addClass(tinymce.DOM.select('.mceIcon', c.id), state ? 'mce_toolbar_toggle_close' : 'mce_toolbar_toggle_open');
                    tinymce.DOM.setHTML(tinymce.DOM.select('.mceButtonLabel', c.id), ed.getLang(state ? 'nostoolbartoggle.label_close' : 'nostoolbartoggle.label_open', 0));
                };

                ed.addCommand('nosToggleToolbars', function() {
                    var id, j, obj, Cookie = tinymce.util.Cookie, Open_Toolbar, Toggle = Cookie.getHash("TinyMCE_toggle") || {}, resize = 0;
                    for(j = 0; j < tbIds.length; j++){

                        obj = ed.controlManager.get(tbIds[j]);
                        if(typeof obj =="undefined") {
                            continue;
                        }
                        id = obj.id;

                        if (tinymce.DOM.isHidden(id)) {
                            Open_Toolbar = 1;
                            tinymce.DOM.show(id);
                            resize = resize - 26;
                        } else {
                            Open_Toolbar = 0;
                            tinymce.DOM.hide(id);
                            resize = resize + 26;
                        }
                    }
                    resizeIframe(ed, resize);
                    setState(Open_Toolbar);

                    Toggle[ed.id] = Open_Toolbar;
                    Cookie.setHash("TinyMCE_toggle", Toggle);
                });

                ed.onPostRender.add(function(){
                    var tbId, id, toggle = tinymce.util.Cookie.getHash("TinyMCE_toggle") || {}, resize = 0, run = false;

                    // Check if value is stored in cookie
                    if(toggle[ed.id] == null){
                        run = true;
                    } else if(toggle[ed.id] === "0"){
                        run = true;
                    }

                    if (run) {
                        for(i = 0; i < toolbars.length; i++){
                            tbId = ed.getParam('', 'toolbar' + (toolbars[i]).replace(' ',''));
                            id = ed.controlManager.get(tbId).id;
                            tinymce.DOM.hide(id);
                            resize = resize + 26;
                        }
                        resizeIframe(ed, resize);
                        setState(0);
                    }
                });

                return self.control;
            }
            return null;
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nostoolbartoggle', tinymce.plugins.NosToolbarTogglePlugin);
})();
