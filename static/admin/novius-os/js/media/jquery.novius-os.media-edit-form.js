/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-media-edit-form',
    ['jquery-nos', 'static/novius-os/admin/config/media/seo_compliant'],
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

                    $file.change(function() {
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
                        $title.val(path).triggerHandler('change');
                    });

                    // Same title and description (alt)
                    $title.bind('change keyup', function() {
                        if ($same_title.is(':checked')) {
                            $slug.val($.seoCompliant($title.val()));
                        }
                    });
                    $same_title.change(function() {
                        if ($(this).is(':checked')) {
                            $slug.attr('readonly', true).addClass('ui-state-disabled').removeClass('ui-state-default');
                            $title.triggerHandler('change');
                        } else {
                            $slug.removeAttr('readonly').addClass('ui-state-default').removeClass('ui-state-disabled');
                        }
                    }).triggerHandler('change');

                    $container.find('form').bind('ajax_success', function() {
                        $(this).nosDialog('close');
                    });
                });
            }
        });

        return $;
    });
