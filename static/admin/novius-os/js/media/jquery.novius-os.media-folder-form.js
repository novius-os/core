/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-media-folder-form',
    ['jquery-nos', 'static/apps/noviusos_media/config/seo_compliant'],
    function($) {
        "use strict";

        $.fn.extend({
            nosMediaFolderForm : function(params) {
                params = params || {
                    containerParentId: null
                };
                return this.each(function() {
                    var $container = $(this).nosFormUI(),
                        $title      = $container.find('input[name=medif_title]'),
                        $seo_title  = $container.find('input[name=medif_dir_name]'),
                        $same_title = $container.find('input[data-id=same_title]');

                    // Same title and description (alt)
                    $title.bind('change keyup', function() {
                        if ($same_title.is(':checked')) {
                            $seo_title.val($.seoCompliant($title.val()));
                        }
                    });
                    $same_title.change(function() {
                        if ($(this).is(':checked')) {
                            $seo_title.attr('readonly', true).addClass('ui-state-disabled');
                            $title.triggerHandler('change');
                        } else {
                            $seo_title.removeAttr('readonly').removeClass('ui-state-disabled');
                        }
                    }).triggerHandler('change');

                    var $path_prefix = $container.find('span[data-id=path_prefix]');
                    if (params.containerParentId) {
                        $container.find(params.containerParentId).delegate('input[name=medif_parent_id]', 'selectionChanged', function(e, row_data) {
                            $path_prefix.text(row_data && row_data.path ? row_data.path : '');
                        });
                    }

                    $container.closest('form').bind('ajax_success', function(e, json) {
                        if (json.medif_dir_name) {
                            $seo_title.val(json.medif_dir_name);
                        }
                    });
                });
            }
        });

        return $;
    });
