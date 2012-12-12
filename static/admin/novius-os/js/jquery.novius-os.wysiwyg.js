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
            options = options || {};
            $.ajax({
                dataType: 'json',
                url: 'admin/nos/wysiwyg/enhancers',
                data : options.urlEnhancers ? {urlEnhancers : true} : null,
                success: function(enhancers) {
                    var base_url = $('base').attr('href');
                    options = $.extend({
                        // Location of TinyMCE script
                        language : $.nosLang.substr(0, 2),
                        script_url : base_url + 'static/novius-os/admin/vendor/tinymce/tiny_mce_jquery' + (module.config().minified ? '' : '_src') + '.js',
                        theme      : 'nos',
                        plugins    : 'spellchecker,xhtmlxtras,style,table,advlist,inlinepopups,media,searchreplace,paste,noneditable,visualchars,nonbreaking',
                        paste_text_use_dialog : true,
                        theme_nos_enhancers : enhancers,
                        theme_nos_context: self.closest('.nos-dispatcher').data('nosContext'),
                        // extended_valid_elements: http://www.tinymce.com/wiki.php/Configuration:extended_valid_elements
                        // Fixes issue: http://www.tinymce.com/develop/bugtracker_view.php?id=5522
                        // Rule sets inspired by: http://www.tinymce.com/wiki.php/Configuration:valid_elements
                        extended_valid_elements: "div[id|data-enhancer|data-config|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|"
                            + "onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|"
                            + "onkeydown|onkeyup],img[longdesc|data-media|data-media-id|usemap|"
                            + "src|border|style|alt=|title|hspace|vspace|width|height|align]"
                    }, options || {});

                    $(self).tinymce(options);

                }
            });
        };
        return $;
    });