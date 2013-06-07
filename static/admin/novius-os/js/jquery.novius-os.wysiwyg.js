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
            var self = $(this);

            var base_url = $('base').attr('href');
            options = $.extend({
                // Location of TinyMCE script
                document_base_url : base_url,
                language : $.nosLang.substr(0, 2),
                script_url : base_url + 'static/novius-os/admin/vendor/tinymce/tiny_mce_jquery' + (module.config().minified ? '' : '_src') + '.js'
            }, options || {});

            $(self).tinymce(options);
        };
        return $;
    });
