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
    function(module, $nos, $) {
        $nos.fn.wysiwyg = function(options) {
            var self = $(this);
            options = options || {};
            $.ajax({
                dataType: 'json',
                url: 'admin/nos/wysiwyg/enhancers',
                data : options.urlEnhancers ? {urlEnhancers : true} : null,
                success: function(enhancers) {
                    options = $.extend({
                        // Location of TinyMCE script
                        script_url : '/static/novius-os/admin/vendor/tinymce/tiny_mce' + (module.config().minified ? '' : '_src') + '.js',
                        theme      : 'nos',
                        plugins    : 'spellchecker,xhtmlxtras,style,table,advlist,inlinepopups,media,searchreplace,paste,noneditable,visualchars,nonbreaking',
                        theme_nos_enhancers : enhancers
                    }, options || {});

                    $(self).tinymce(options);

                }
            });
        };
        return $nos;
    });