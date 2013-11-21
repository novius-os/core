/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('jquery-nos-permissions',
    ['jquery', 'jquery-nos'],
    function($) {
        "use strict";
        var undefined = void(0);

        return function($form) {
            var $ul = $form.find('div[class~="nos::access"]');
            var preventCheckAction = false;

            $form.find('.check_all').on('change', function onChangeCheckAll(e) {
                e.stopPropagation();
                preventCheckAction = true;
                var checked = $(this).is(':checked');
                $ul.find(':checkbox').prop('checked', checked);
                preventCheckAction = false;

                if (!checked) {
                    $ul.find('li.ui-state-active :checkbox').trigger('change');
                }
            });

            // Augment hit area
            $ul.find('.checkbox_hit_area').on('click', function(e) {
                e.stopPropagation();
                var $checkbox = $(this).find(':checkbox');
                var checked = $checkbox.is(':checked');
                $checkbox.prop('checked', !checked).trigger('change');
            });

            // Allow selecting applications by clicking on the list item rather than the checkbox
            $ul.find('li').on('click', function onClickCheckboxAccess(e) {
                if (!$(this).hasClass('ui-state-active')) {
                    e.preventDefault();
                    var $checkbox = $(this).find(':checkbox');
                    if ($checkbox.is(':checked')) {
                        // Already checked
                        $checkbox.trigger('change');
                    } else {
                        // Not checked yet
                        $checkbox.trigger('click');
                    }
                }
            });

            // When a checkbox is checked or unchecked, select the application
            $ul.find(':checkbox:not(.check_all)').on('change', function onChangeCheckboxAccess() {
                if (preventCheckAction) {
                    return;
                }
                var $this = $(this);
                var $li = $this.closest('li');
                var $accordion = $form.find('div.' + $this.val());

                if ($this.is(':checked')) {
                    $li.addClass('ui-state-active').siblings().removeClass('ui-state-active');
                    $form.find('.preview_arrow').parent().hide();
                    $accordion.show().nosOnShow()
                        .css('marginTop', $li.offset().top - $this.closest('.line').offset().top);
                } else {
                    $li.removeClass('ui-state-active');
                    $accordion.hide();
                }
            }).on('click', function(e) {
                e.stopPropagation();
            });

            $form.find(':checkbox.valueUnchecked').each(function normaliseCheckboxes() {
                var $checkbox = $(this);
                var name     = $checkbox.attr('name');
                var $hidden   = $('<input type="hidden" value="' + ($checkbox.attr('value-unchecked') || '') + '" />');
                $hidden.insertAfter($checkbox);
                $checkbox.on('change', function() {
                    $hidden.attr('name', $(this).is(':checked') ? '' : name);
                }).trigger('change');
            });
        };
    }
);
