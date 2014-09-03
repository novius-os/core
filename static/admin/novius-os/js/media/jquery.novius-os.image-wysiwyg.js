/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-image-wysiwyg',
    ['jquery-nos', 'wijmo.wijtabs'],
    function($) {
        "use strict";

        $.fn.extend({
            nosImageWysiwyg : function(params) {
                params = params || {
                    newImg: true,
                    appdeskView: '',
                    base_url: '',
                    texts: {
                        imageFirst: 'Please choose an image first'
                    }
                };
                return this.each(function() {
                    var $container = $(this)
                            .find('> form')
                            .submit(function(e) {
                                $container.find('button[data-id=save]').triggerHandler('click');
                                e.stopPropagation();
                                e.preventDefault();
                            })
                            .end()
                            .find('a[data-id=close]')
                            .click(function(e) {
                                e.preventDefault();
                                $container.nosDialog('close');
                            })
                            .end()
                            .find('button[data-id=save]')
                            .click(function(e) {
                                var img = $('<img />');

                                if (!media || !media._id) {
                                        $.nosNotify(params.texts.imageFirst, 'error');

                                    return;
                                }

                                img.attr('height', $height.val());
                                img.attr('width',  $width.val());
                                img.attr('title',  $title.val());
                                img.attr('alt',    $alt.val());
                                img.attr('style',  $style.val());

                                img.attr('data-media', JSON.stringify(media));
                                img.attr('src', media.path);

                                $dialog.trigger('insert.media', img);
                                e.stopPropagation();
                                e.preventDefault();
                            })
                            .end()
                            .find('> ul')
                            .css({
                                width : '18%'
                                })
                            .end(),
                        $dialog = $container.closest('.ui-dialog-content')
                            .bind('select_media', function(e, data) {
                                tinymce_image_select(data);
                            })
                            .nosListenEvent({
                                name : 'Nos\\Media\\Model_Media',
                                action : 'insert'
                            }, function(e) {
                                $.ajax({
                                    method: 'GET',
                                    url: params.base_url + 'admin/noviusos_media/appdesk/info/' + e.id,
                                    dataType: 'json',
                                    success: function(item) {
                                        tinymce_image_select(item);
                                    }
                                });
                            }),
                        $library = $container.find('div:eq(0)')
                            .css({
                                width : '100%',
                                padding: 0,
                                margin: 0
                            }),
                        $thumb = $container.find('img')
                            .hide()
                            .parent()
                            .css('vertical-align', 'top')
                            .end(),
                        $height = $container.find('input[data-id=height]'),
                        $width = $container.find('input[data-id=width]')
                            .bind('change keyup', function() {
                                if ($proportional.is(':checked') && media && media.width && media.height) {
                                var width = $width.val();
                                $height.val(width == '' ? '' : Math.round(width * media.height / media.width));
                                }
                            }),
                        $title = $container.find('input[data-id=title]')
                            .bind('change keyup', function() {
                                if ($same_title_alt.is(':checked')) {
                                    $alt.val($title.val());
                                }
                            }),
                        $alt = $container.find('input[data-id=alt]'),
                        $align = $container.find('select[data-id=align]')
                            .change(function() {
                                updateStyle();
                            }),
                        $border = $container.find('input[data-id=border]')
                            .change(function() {
                                updateStyle();
                            }),
                        $vspace = $container.find('input[data-id=vspace]')
                            .change(function() {
                                updateStyle();
                            }),
                        $hspace = $container.find('input[data-id=hspace]')
                            .change(function() {
                                updateStyle();
                            }),
                        $style = $container.find('input[data-id=style]')
                            .change(function() {
                                var $img = $('<img style="' + $style.val() + '" />');
                                $align.val(getAttrib($img, 'align'));
                                $border.val(getAttrib($img, 'border'));
                                $vspace.val(getAttrib($img, 'vspace'));
                                $hspace.val(getAttrib($img, 'hspace'));
                            }),
                        $proportional = $container.find('input[data-id=proportional]')
                            .change(function() {
                                if ($proportional.is(':checked')) {
                                    $height.attr('readonly', true).addClass('ui-state-disabled');
                                    $width.triggerHandler('change');
                                } else {
                                    $height.removeAttr('readonly').removeClass('ui-state-disabled');
                                }
                            }),
                        $same_title_alt = $container.find('input[data-id=same_title_alt]')
                            .change(function() {
                                if ($same_title_alt.is(':checked')) {
                                    $alt.attr('readonly', true).addClass('ui-state-disabled');
                                } else {
                                    $alt.removeAttr('readonly').removeClass('ui-state-disabled');
                                }
                                $title.triggerHandler('change');
                            }),
                        media = null,
                        updateStyle = function() {
                                var v,
                                    $img = $('<img style="' + $style.val() + '" />');

                                // Handle align
                                v = $align.val();
                                if (v) {
                                    if (v == 'left' || v == 'right') {
                                        $img.css('float', v);
                                        $img.css('vertical-align', '');
                                    } else {
                                        $img.css('vertical-align', v);
                                        $img.css('float', '');
                                    }
                                } else {
                                    $img.css('float', '');
                                    $img.css('vertical-align', '');
                                }

                                // Handle border
                                v = $border.val();
                                if (v && v !== '0') {
                                    $img.css('border-width', v + 'px');
                                    if (!$img.css('border') && !$img.css('border-color') && !$img.css('border-style')) {
                                        $img.css('border', v + 'px solid black');
                                    }
                                } else {
                                    $img.css('border', '');
                                }

                                $img.css('margin', '');
                                // Handle hspace
                                v = $hspace.val();
                                if (v && v !== '0') {
                                    $img.css('margin-left', v + 'px');
                                    $img.css('margin-right', v + 'px');
                                }

                                // Handle vspace
                                v = $vspace.val();
                                if (v && v !== '0') {
                                    $img.css('margin-top', v + 'px');
                                    $img.css('margin-bottom', v + 'px');
                                }

                                $style.val($img.attr('style'));
                            },
                        getAttrib = function(ele, attr) {
                                var v, v2;

                                switch (attr) {
                                    case 'align':
                                        v = $(ele).css('float');
                                        if (v  && v != 'none') {
                                            return v;
                                        }
                                        if (v = $(ele).css('vertical-align')) {
                                            return v;
                                        }
                                        break;

                                    case 'hspace':
                                        v = $(ele).css('margin-left');
                                        v2 = $(ele).css('margin-right');
                                        if (v && v == v2) {
                                            v = parseInt(v.replace(/[^0-9]/g, ''));
                                            return v || '';
                                        }
                                        break;

                                    case 'vspace':
                                        v = $(ele).css('margin-top');
                                        v2 = $(ele).css('margin-bottom');
                                        if (v && v == v2) {
                                            v = parseInt(v.replace(/[^0-9]/g, ''));
                                            return v || '';
                                        }
                                        break;

                                    case 'border':
                                        v = 0;
                                        $.each(['top', 'right', 'bottom', 'left'], function(i, val) {
                                            val = $(ele).css('border-' + val + '-width');
                                            if (!val || (val != v && v !== 0)) {
                                                v = 0;
                                                return false;
                                            }
                                            if (val) {
                                                v = val;
                                            }
                                        });
                                        if (v) {
                                            v = parseInt(v.replace(/[^0-9]/g, ''));
                                            return v || '';
                                        }
                                        break;
                                }
                                return '';
                            },
                    tinymce_image_select = function(media_json, image_dom) {
                                media = media_json;

                                if (media && media.thumbnail) {
                                    $thumb.attr('src', media.thumbnail.replace(/64/g, '128'))
                                    .show();
                                }

                                if (image_dom == null) {
                                    $height.val(media_json.height);
                                    $width.val(media_json.width);
                                    $title.val(media_json.title);
                                    $alt.val(media_json.title);
                                    $align.val('');
                                    $border.val('');
                                    $vspace.val('');
                                    $hspace.val('');
                                    $style.val('');

                                    $container.wijtabs('enableTab', 1)
                                        .wijtabs('select', 1);

                                    return;
                                }

                                $height.val(image_dom.attr('height'));
                                $width.val(image_dom.attr('width'));
                                $title.val(image_dom.attr('title'));
                                $alt.val(image_dom.attr('alt'));
                                $align.val(getAttrib(image_dom, 'align'));
                                $border.val(getAttrib(image_dom, 'border'));
                                $vspace.val(getAttrib(image_dom, 'vspace'));
                                $hspace.val(getAttrib(image_dom, 'hspace'));
                                $style.val(image_dom.attr('style'));
                                updateStyle();

                                if (media && (Math.round($width.val() * media.height / media.width) != $height.val())) {
                                    $proportional.prop('checked', false).change();
                                }

                                if ($title.val() != $alt.val()) {
                                    $same_title_alt.prop('checked', false).change();
                                }
                            },
                        ed = $dialog.data('tinymce'),
                        e = ed.selection.getNode();

                        // Editing the current image
                        if (e.nodeName == 'IMG') {
                            var $img = $(e),
                            media_id = $img.data('media-id');

                            // No data available yet, we need to fetch them
                            if (media_id) {
                                $.ajax({
                                    method: 'GET',
                                    url: params.base_url + 'admin/noviusos_media/appdesk/info/' + media_id,
                                    dataType: 'json',
                                    success: function(item) {
                                        tinymce_image_select(item, $img);
                                    }
                                });
                            } else {
                                tinymce_image_select($img.data('media'), $img);
                            }
                        }

                        $container.wijtabs({
                                alignment: 'left',
                                load: function(e, ui) {
                                    var margin = $(ui.panel).outerHeight(true) - $(ui.panel).innerHeight();
                                    $(ui.panel).height($dialog.height() - margin);
                                },
                                disabledIndexes: params.newImg ? [1] : [],
                                show: function(e, ui) {
                                    $(ui.panel).nosOnShow();
                                }
                            })
                            .find('.wijmo-wijtabs-content')
                            .css({
                                width: '81%',
                                position: 'relative'
                            })
                            .addClass('box-sizing-border')
                            .end()
                            .nosFormUI();

                        $proportional.triggerHandler('change');
                        $same_title_alt.triggerHandler('change');

                        if (!params.newImg) {
                            $container.wijtabs('select', 1)
                                .bind('wijtabsshow', function() {
                                    $library.html(params.appdeskView);
                                });
                        } else {
                            $library.html(params.appdeskView);
                        }
                });
            }
        });

        return $;
    });
