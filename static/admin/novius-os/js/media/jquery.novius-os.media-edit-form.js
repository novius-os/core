/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-media-edit-form',
    ['jquery-nos', 'static/apps/noviusos_media/config/seo_compliant'],
    function($) {
        "use strict";

        $.fn.extend({
            nosMediaEditForm : function() {
                return this.each(function() {
                    var $container = $(this),
                        $file       = $container.find(':file[name=media]'),
                        $title      = $container.find('input[name=media_title]'),
                        $slug       = $container.find('input[name=media_file]'),
                        $same_title = $container.find('input[data-id=same_title]');

                    // Same title and description (alt)
                    $title.bind('change keyup', function() {
                        if ($same_title.is(':checked')) {
                            $slug.val($.seoCompliant($title.val()));
                        }
                    });
                    $same_title.change(function() {
                        if ($(this).is(':checked')) {
                            $slug.attr('readonly', true).addClass('ui-state-disabled');
                            $title.triggerHandler('change');
                        } else {
                            $slug.removeAttr('readonly').removeClass('ui-state-disabled');
                        }
                    }).triggerHandler('change');

                    $container.closest('form').bind('ajax_success', function(e, json) {
                        if (json.thumbnailUrl) {
                            $container.find('.preview_zone img').attr({
                                src: json.thumbnailUrl + '?' + (new Date().getTime())
                            });
                        }
                        if (json.dataset.file) {
                            $slug.val(json.dataset.file);
                        }
                        if (json.dataset.ext) {
                            $container.find('.media_extension').text(json.dataset.ext);
                        }
                        if (json.dataset.filesize) {
                            $container.find('.media_filesize').text(json.dataset.filesize);
                        }
                        if (json.dataset.dimensions) {
                            $container.find('.media_dimensions').text(json.dataset.dimensions);
                        }
                    });
                });
            }
        });

        return $;
    });
