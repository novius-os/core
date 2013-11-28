/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-media-add-form',
    ['jquery-nos', 'static/apps/noviusos_media/config/seo_compliant'],
    function($) {
        "use strict";

        $.fn.extend({
            nosMediaAddForm : function() {
                return this.each(function() {
                    var $container = $(this),
                        $file = $container.find(':file[name=media]')
                            .change(function() {
                                var path = $file.val();

                                // Get the filename only
                                // Remove the dirname
                                path = path.replace(/^.*[\/\\]/g, '');
                                // Remove the extension
                                path = path.split('.');
                                if (path.length > 1) {
                                    path.pop();
                                }
                                path = path.join('.');

                                // Format a bit the title
                                // Cleanup
                                path = path.replace(/[^a-z0-9A-Z]/g, ' ').replace(/\s+/g, ' ');
                                // Ucwords
                                path = path.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                                    return $1.toUpperCase();
                                });
                                if (!$title.val()) {
                                    $title.val(path).triggerHandler('change');
                                }
                            }),
                    // Same title and description (alt)
                        $title = $container.find('input[name=media_title]')
                            .bind('change keyup', function() {
                                if ($same_title.is(':checked')) {
                                    $slug.val($.seoCompliant($title.val()));
                                }
                            }),
                        $slug = $container.find('input[name=media_file]'),
                        $same_title = $container.find('input[data-id=same_title]')
                            .change(function() {
                                if ($(this).is(':checked')) {
                                    $slug.attr('readonly', true).addClass('ui-state-disabled');
                                    $title.triggerHandler('change');
                                } else {
                                    $slug.removeAttr('readonly').removeClass('ui-state-disabled');
                                }
                            });

                    $same_title.triggerHandler('change');
                });
            }
        });

        return $;
    });
