/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define(
    [
        'jquery-nos-wysiwyg',
        'jquery-nos'
    ],
    function($) {
        "use strict";
        return function(wysiwyg_options) {

            var $container = $(this);
            wysiwyg_options = wysiwyg_options || {};
            if ($container.data('already-processed')) {
                return;
            }

            $container.find('input[name=page_meta_noindex]').change(function() {
                $(this).closest('p').nextAll()[$(this).is(':checked') ? 'hide' : 'show']();
            }).change();


            $container.find('input[name=page_menu]').change(function(e) {
                if ($(this).is(':disabled')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                var $siblings = $(this).closest('p').nextAll();
                if ($(this).is(':checked')) {
                    $siblings.show();
                } else {
                    $siblings.hide();
                }
            }).change();

            var $page_id = $container.find('input[name=page_id]');
            var $from_id = $container.find('input[name=create_from_id]');
            var from_id = $page_id.val() || $from_id.val() || 0;
            $container.find('select[name=page_template]').bind('change', function() {
                $container.data('already-processed', true);
                var $wysiwyg = $container.find('[data-id=wysiwyg]');
                var save = {};
                // tinyMCE won't be initialised until the first Wysiwyg is transformed
                if (window.tinyMCE) {
                    tinyMCE.triggerSave();
                    $wysiwyg.find('[name^=wysiwyg]').each(function() {
                        var $this = $(this);
                        // Extract name between [ and ]. Example "wysiwyg[content]" will save "content"
                        save[$this.attr('name').match(/\[([^\]]+)\]/)[1]] = $this.val();
                    })
                }
                $.ajax({
                    url: 'admin/noviusos_page/ajax/wysiwyg/' + from_id,
                    data: {
                        template_id: $(this).val()
                    },
                    dataType: 'json',
                    success: function(data) {

                        $wysiwyg.nosOnShow('one', function() {
                            var ratio = $wysiwyg.width() * 3 / 5;
                            $wysiwyg.empty().css({
                                height: ratio,
                                overflow: 'visible'
                            });
                            $.each(data.layout, function(i) {
                                var coords = this.split(',');
                                var bloc = $('<div></div>').css({
                                    position: 'absolute',
                                    left:   Math.round(coords[0] / data.cols * 100) + '%',
                                    top:    Math.round(coords[1] / data.rows * ratio),
                                    width:  Math.round(coords[2] / data.cols * 100) + '%',
                                    height: Math.round(coords[3] / data.rows * ratio)
                                }).append(
                                    $('<textarea></textarea>')
                                    .val(save[i] || data.content[i])
                                    .attr({name: 'wysiwyg[' + i + ']'})
                                    .addClass('wysiwyg')
                                    .css({
                                        display: 'block',
                                        width: '100%',
                                        height: Math.round(coords[3] / data.rows * ratio),
                                        border: 0,
                                        boxShadow: 'inset 0px 0px 2px 2px  #888'
                                    }));
                                $wysiwyg.append(bloc);
                                // The bottom row from TinyMCE is roughly 21px
                                $wysiwyg.find('[name="wysiwyg[' + i + ']"]').wysiwyg($.extend({}, wysiwyg_options, {
                                    height: (coords[3] / data.rows * ratio) - 21,
                                    content_css: data.content_css || ''
                                }));
                            });
                        });
                    }
                })
            });

            var $page_virtual_name_container = $container.find('input[name=page_virtual_name]').closest('.wijmo-wijaccordion-content');
            var $page_meta_title_container = $container.find('input[name=page_meta_noindex]').closest('.wijmo-wijaccordion-content');
            var $accordion = $container.find('.accordion');

            var $template_unit = $container.find('select[name=page_template]').closest('td');
            $container.find('select[name=page_type]').change(function() {
                var val = $(this).val();
                var $wysiwyg = $container.find('[data-id=wysiwyg]');
                var $external = $container.find('[data-id=external]');

                // 0 = Classic
                // 3 = External link

                // 0 = Classic
                if (val == 0) {
                    $wysiwyg.show().nosOnShow().siblings().hide();
                    $template_unit.show().end().change();

                    // Show .accordion-header
                    $page_virtual_name_container.prev().show();
                    $page_meta_title_container.prev().show();
                }

                // 3 = External link
                if (val == 3) {
                    $external.show().nosOnShow().siblings().hide();
                    $template_unit.hide();

                    // We need to select the appropriate index with wijaccordion() prior to changing the style or it's all messed up
                    var selected_index = $accordion.wijaccordion('option', 'selectedIndex');
                    if ($accordion.children().eq(selected_index * 2 + 1).find('input[name=page_virtual_name], input[name=page_meta_title]').length > 0) {
                        $accordion.wijaccordion({selectedIndex: 0});
                        // wijaccordion('activate', 0) does not work properly.
                    }

                    // Hide .accordion-header and .accordion-content
                    $page_virtual_name_container.hide().prev().hide();
                    $page_meta_title_container.hide().prev().hide();
                }
            }).change();

            var $title      = $container.find('input[name=page_title]');
            var $menu_title = $container.find('input[name=page_menu_title]');
            var $checkbox_menu   = $container.find('input[data-id=same_menu_title]');
            $title.bind('change keyup', function() {
                if ($checkbox_menu.is(':checked')) {
                    $menu_title.val($title.val());
                }
            });
            if ($title.val() == $menu_title.val() || $menu_title.val() == '') {
                $checkbox_menu.prop('checked', true);
            }
            $checkbox_menu.change(function() {
                if ($(this).is(':checked')) {
                    $menu_title.attr('readonly', true).addClass('ui-state-disabled').removeClass('ui-state-default');
                    $title.triggerHandler('change');
                } else {
                    $menu_title.removeAttr('readonly').addClass('ui-state-default').removeClass('ui-state-disabled');
                }
            }).triggerHandler('change');
        }
    });
