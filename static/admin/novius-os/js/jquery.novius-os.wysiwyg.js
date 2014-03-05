/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-wysiwyg',
    [
        'module',
        'jquery-nos',
        'jquery',
        'tinymce'
    ],
    function(module, $) {
        $.fn.wysiwyg = function(options) {
            var self = $(this), s = {}, plugins, toolbar, i = 1, buttons = [];

            var base_url = $('base').attr('href');

            $.each(options || {}, function(key, value) {
                if (key.substr(0, 10) == 'theme_nos_') {
                    var new_key = 'theme_advanced_' + key.substr(10);
                    if (!options[new_key]) {
                        s[new_key] = value;
                    }
                } else {
                    s[key] = value;
                }
            });
            if (s.theme === 'advanced') {
                s.theme === 'nos';
            }

            if (!s.theme_advanced_buttons1) {
                s = $.extend({
                    theme_advanced_toolbar_location : 'external',

                    theme_advanced_buttons1 : "tablecontrols",
                    theme_advanced_buttons2 : "underline,strikethrough,sub,sup,|,forecolor,backcolor,|,outdent,indent,blockquote,|,anchor,charmap,hr,nonbreaking,nosbrclearall,|,styleprops,removeformat",
                    theme_advanced_buttons3 : "search,replace,|,spellchecker,|,newdocument,nosvisualhtml,code",
                    theme_advanced_buttons4 : "nosimage,mediawithlabel,noslink,nosenhancer",
                    theme_advanced_buttons5 : "nosstyleselect,bold,italic,nosalign,bullist,numlist,|,cut,copy,nospaste,undo,redo,|,nostoolbartoggle"
                }, s);
            }

            options = $.extend({
                // Location of TinyMCE script
                document_base_url : base_url,
                language : $.nosLang.substr(0, 2),
                script_url : base_url + 'static/novius-os/admin/vendor/tinymce/tiny_mce_jquery' + (module.config().minified ? '' : '_src') + '.js'
            }, s);

            plugins = options.plugins.split(',');
            toolbar = options.theme_advanced_buttons1;
            while (toolbar) {
                buttons = buttons.concat(toolbar.split(','));
                i++;
                toolbar = options['theme_advanced_buttons' + i];
            }
            $.each(buttons, function(i, button) {
                if (button.substr(0, 3) === 'nos' && $.inArray(button, plugins) === -1) {
                    plugins.push(button);
                }
            });
            options.plugins = plugins.join(',');

            $(self).tinymce(options);
        };
        return $;
    });
