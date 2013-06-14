/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-link-wysiwyg',
    ['jquery-nos', 'wijmo.wijtabs'],
    function($) {
        "use strict";

        $.fn.extend({
            nosLinkWysiwyg : function(params) {
                params = params || {
                    expert: false,
                    newlink: true,
                    base_url: '',
                    texts: {
                        titleAppdeskPage: 'Pick a new link',
                        titleAppdeskMedia: 'Pick a new media',
                        titleProperties2: 'Edit properties',
                        titleProperties3: 'Edit properties'
                    }
                };
                return this.each(function() {
                    var $container = $(this)
                            .find('a[data-id=close]')
                            .click(function(e) {
                                e.preventDefault();
                                $container.nosDialog('close');
                            })
                            .end(),
                        id = $container.attr('id'),
                        link_type,
                        appdesk_loaded,

                        $radios_type = $container.find(':radio[name=link_type]')
                            .click(function() {
                                var type = $(this).val();
                                if (type !== link_type) {
                                    $input_url.val('');
                                }
                                link_type = type;
                                choose_type(link_type, true);
                            }),

                        $panel_properties = $container.find('#' + id + '_properties')
                            .find('> form')
                            .nosFormValidate({
                                submitHandler : function() {
                                    if (link_type === 'external' && !/^\w+\:/.test($input_url.val())) {
                                        $input_url.val('http://' + $input_url.val());
                                    }
                                    var a = {
                                        href : $input_url.val() + (link_type === 'internal' ? $input_url_params.val() : ''),
                                        title : $input_title.val()
                                    };
                                    if ($.inArray('target', types_properties[link_type]) !== -1) {
                                        a.target = $panel_properties.find(':radio[name=target]:checked').val()
                                    }

                                    $dialog.trigger('insert.link', a);
                                }
                            })
                            .end(),

                        $input_url = $container.find('#' + id + '_url'),
                        $input_url_params = $container.find('#' + id + '_url_params'),
                        $input_title = $container.find('#' + id + '_tooltip'),
                        $select_anchors = $container.find('#' + id + '_anchor')
                            .change(function() {
                                var value = $(this).find('option:selected').val();
                                $input_url.val(value ? value : '')
                            }),
                        $input_email = $container.find('#' + id + '_email')
                            .change(function() {
                                var value = $(this).val();
                                $input_url.val(value ? 'mailto:' + value : '')
                            }),
                        $input_phone = $container.find('#' + id + '_phone')
                            .change(function() {
                                var value = $(this).val();
                                $input_url.val(value ? 'tel:' + value : '');
                            }),
                        $real_url = $container.find('#' + id + '_url_real'),
                        $title = $container.find('#' + id + '_title'),
                        $ul = $container.find('> ul')
                            .css({
                                width : '18%'
                            }),
                        $a_properties = $ul.find('li:last a'),

                        $dialog = $container.closest('.ui-dialog-content')
                            .bind('select_media', function(e, media) {
                                $title.text(media.title);
                                $real_url.text(params.base_url + media.path);
                                $input_url.val('nos://media/' + media.id);
                                $container.wijtabs('enableTab', 2)
                                    .wijtabs('select', 2);
                            })
                            .bind('select_page', function(e, page) {
                                $title.text(page.page_title);
                                $real_url.text(page.url);
                                $input_url.val('nos://page/' + page.id);
                                $container.wijtabs('enableTab', 2)
                                    .wijtabs('select', 2);
                            }),

                        choose_type = function(type, select) {
                                switch (type) {
                                    case 'internal':
                                    case 'media':
                                        var title = type === 'internal' ? params.texts.titleAppdeskPage : params.texts.titleAppdeskMedia

                                        if ($ul.find('li').size() === 2) {
                                            $container.wijtabs('add', '#' + id + '_appdesk', title, 1);
                                            $a_properties.text(params.texts.titleProperties3);
                                        } else {
                                            $ul.find('li:eq(1) a').text(title);
                                        }
                                        break;

                                    case 'external':
                                    case 'anchor':
                                    case 'email':
                                    case 'phone':
                                        if ($ul.find('li').size() > 2) {
                                            $container.wijtabs('remove', 1);
                                            appdesk_loaded = null;
                                            $a_properties.text(params.texts.titleProperties2);
                                        }
                                        $container.wijtabs('enableTab', 1)
                                        break;
                                }
                                if (select) {
                                    $container.wijtabs('select', 1);
                                }
                            },

                        properties = ['title', 'url', 'anchor', 'email', 'phone', 'url_params', 'tooltip', 'target'],
                        types_properties = {
                                internal : ['title', 'url', 'url_params', 'tooltip', 'target'],
                                external : ['url', 'tooltip', 'target'],
                                media : ['title', 'url', 'tooltip', 'target'],
                                anchor : ['anchor', 'tooltip'],
                                email : ['email', 'tooltip'],
                                phone : ['phone', 'tooltip']
                            },

                        editor = $dialog.data('tinymce'),
                        node = editor.dom.getParent(editor.selection.getNode(), 'A'),
                        anchors = editor.dom.select('a.mceItemAnchor,img.mceItemAnchor');

                    $.each(anchors, function(i, anchor) {
                        var name = editor.dom.getAttrib(anchor, "name");
                        if (name) {
                            $('<option></option>').val('#' + name)
                                .text(name)
                                .appendTo($select_anchors);
                        }
                    });

                    $.each(properties, function(i, property) {
                        $panel_properties.find('#tr_' + id + '_' + property).hide();
                    });

                    // Editing the current link
                    if (node) {
                        var $a = $(node),
                            href = $a.attr('href'),
                            found;

                        $input_url.val(href);
                        $input_title.val($a.attr('title'));
                        $panel_properties.find(':radio[name=target]').eq($a.attr('target') ? 0 : 1).prop('checked', true);

                        if (href.substr(0, 11) === 'nos://page/') {
                            found = href.match(/nos:\/\/page\/(\d+)(.*)/i)
                            if (found) {
                                link_type = 'internal';
                                $.ajax({
                                    method: 'GET',
                                    url: params.base_url + 'admin/noviusos_page/appdesk/info/' + found[1],
                                    dataType: 'json',
                                    success: function(page) {
                                        $title.text(page.page_title);
                                        $real_url.text(page.url);
                                    }
                                });
                                $input_url_params.val(found[2]);
                            }
                        } else if (href.substr(0, 12) === 'nos://media/') {
                            found = href.match(/nos:\/\/media\/(\d+)/i)
                            if (found) {
                                link_type = 'media';
                                $.ajax({
                                    method: 'GET',
                                    url: params.base_url + 'admin/noviusos_media/appdesk/info/' + found[1],
                                    dataType: 'json',
                                    success: function(media) {
                                        $title.text(media.title);
                                        $real_url.text(params.base_url + media.path);
                                    }
                                });
                            }
                        } else if (href.substr(0, 1) === '#') {
                            link_type = 'anchor';
                            $select_anchors.find('option[value="' + href + '"]').prop('selected', true);
                        } else if (href.substr(0, 7) === 'mailto:') {
                            link_type = 'email';
                            $input_email.val(href.replace('mailto:', ''));
                        } else if (href.substr(0, 4) === 'tel:') {
                            link_type = 'phone';
                            $input_phone.val(href.replace('tel:', ''));
                        } else {
                            link_type = 'external';
                        }
                        $radios_type.filter('[value=' + link_type + ']').prop('checked', true);
                    }

                    $container.wijtabs({
                            alignment: 'left',
                            load: function(e, ui) {
                                var margin = $(ui.panel).outerHeight(true) - $(ui.panel).innerHeight();
                                $(ui.panel).height($dialog.height() - margin);
                            },
                            disabledIndexes: params.newlink ? [1] : [],
                            select: function(e, ui) {
                                var $panel = $(ui.panel);
                                if ($panel.attr('id') === (id + '_appdesk')) {
                                    $panel.addClass('box-sizing-border');
                                    if (appdesk_loaded != link_type) {
                                        $panel.empty()
                                            .show()
                                            .css({
                                                width : '100%',
                                                padding: 0,
                                                margin: 0
                                            })
                                            .load(link_type === 'internal' ? 'admin/noviusos_page/appdesk/index/link_pick' : 'admin/noviusos_media/appdesk/index/media_pick');
                                        appdesk_loaded = link_type;
                                    }
                                } else if (ui.panel === $panel_properties[0]) {
                                    var visible_properties = types_properties[link_type],
                                        $target = $panel_properties.find(':radio[name=target]:checked');

                                    $select_anchors.add($input_email).add($input_phone).removeClass('required');
                                    $container.find('#' + id + '_' + visible_properties[0]).addClass('required');

                                    $.each(properties, function(i, property) {
                                        $panel_properties.find('#tr_' + id + '_' + property)
                                            [$.inArray(property, visible_properties) === -1 ? 'hide' : 'show']();
                                    });
                                    if (!params.expert && link_type !== 'external') {
                                        $panel_properties.find('#tr_' + id + '_url').hide();
                                        $panel_properties.find('#tr_' + id + '_url_params').hide();
                                    }
                                    if (!$target.size()) {
                                        $panel_properties.find(':radio[name=target]').eq(link_type === 'internal' ? 1 : 0).prop('checked', true);
                                    }
                                    if ($.inArray(link_type, ['media', 'internal']) !== -1) {
                                        $real_url.show();
                                        $input_url.hide();
                                    } else {
                                        $real_url.hide();
                                        $input_url.show();
                                    }
                                }
                            },
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

                    // Editing the current link
                    if (node) {
                        choose_type(link_type);
                        $container.wijtabs('select', $ul.find('li').size() - 1);
                    }
                });
            }
        });

        return $;
    });
