<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

	$uniqid = uniqid('tabs_');
    $id_type = $uniqid.'_type';
    $id_appdesk = $uniqid.'_appdesk';
    $id_properties = $uniqid.'_properties';
    $title_appdesk_page = $edit ? __('Pick a new link') : __('2. Pick a link');
    $title_appdesk_media = $edit ? __('Pick a new media') : __('2. Pick a media');
    $title_properties_2 = $edit ? __('Edit properties') : __('2. Set the properties');
    $title_properties_3 = $edit ? __('Edit properties') : __('3. Set the properties');
?>
<style type="text/css">
	.box-sizing-border {
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		height: 100%;
	}
    .target_radio .wijmo-wijradio, .target_radio label {
        display: inline-block;
    }
</style>
<div id="<?= $uniqid ?>" class="box-sizing-border">
	<ul>
        <li><a href="#<?= $id_type ?>"><?= $edit ? __('Choose a new link type') : __('1. Choose a link type') ?></a></li>
		<li><a href="#<?= $id_properties ?>"><?= $title_properties_2 ?></a></li>
	</ul>
    <div id="<?= $id_type ?>">
        <form action="#" >
            <table class="fieldset">
                <tr><td><label><input type="radio" value="internal" name="link_type" /> <?= __('Internal link') ?></label></td></tr>
                <tr><td><label><input type="radio" value="external" name="link_type" /> <?= __('External link') ?></label></td></tr>
                <tr><td><label><input type="radio" value="media" name="link_type" /> <?= __('Link to a media') ?></label></td></tr>
                <tr><td><label><input type="radio" value="anchor" name="link_type" /> <?= __('Link to anchor') ?></label></td></tr>
                <tr><td><label><input type="radio" value="email" name="link_type" /> <?= __('Link to an email') ?></label></td></tr>
                <tr><td><label><input type="radio" value="phone" name="link_type" /> <?= __('Link to a phone') ?></label></td></tr>
            </table>
        </form>
    </div>

    <div id="<?= $id_properties ?>">
        <form action="#">
            <table class="fieldset" >
                <tr id="tr_<?= $uniqid ?>_url">
                    <th><label for="<?= $uniqid ?>_url"><?= __('URL:') ?> </label></th>
                    <td colspan="6"><span id="<?= $uniqid ?>_url_real"></span><input name="url" type="text" value="" size="60" id="<?= $uniqid ?>_url" class="required" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_anchor">
                    <th><label for="<?= $uniqid ?>_anchor"><?= __('Anchor name:') ?> </label></th>
                    <td colspan="6"><select name="anchorlist" id="<?= $uniqid ?>_anchor"><option value="">---</option></select></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_email">
                    <th><label for="<?= $uniqid ?>_email"><?= __('Email:') ?> </label></th>
                    <td colspan="6"><input type="text" name="email" size="60" id="<?= $uniqid ?>_email" class="email" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_phone">
                    <th><label for="<?= $uniqid ?>_phone"><?= __('Phone:') ?> </label></th>
                    <td colspan="6"><input type="text" name="phone" size="60" id="<?= $uniqid ?>_phone" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_url_params">
                    <th><label for="<?= $uniqid ?>_url_params"><?= __('URL parameters:') ?> </label></th>
                    <td colspan="6"><input type="text" name="url_params" size="60" id="<?= $uniqid ?>_url_params" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_tooltip">
                    <th><label for="<?= $uniqid ?>_tooltip"><?= __('Tooltip:') ?> </label></th>
                    <td colspan="6"><input type="text" name="title" size="60" id="<?= $uniqid ?>_tooltip" /></td>
                </tr>

                <tr id="tr_<?= $uniqid ?>_target">
                    <th><label><?= __('Opening type:') ?> </label></th>
                    <td colspan="2"><label><input type="radio" name="target" value="_blank" /> <?= __('New window') ?></label></td>
                    <td colspan="2"><label><input type="radio" name="target" value="" /> <?= __('Same window') ?></label></td>
                </tr>
                <tr>
                    <th></th>
                    <td colspan="6"><button type="submit" class="primary" data-icon="check" data-id="save"><?= $edit ? __('Update this link') : __('Insert this link') ?></button> &nbsp; <?= __('or') ?> &nbsp; <a data-id="close" href="#"><?= __('Cancel') ?></a></td>
                </tr>
            </table>
        </form>
    </div>
</div>
<script type="text/javascript">
require(
    ['jquery-nos', 'wijmo.wijtabs'],
    function($) {
        $(function() {

            var id = '<?= $uniqid ?>',
                newlink = !'<?= $edit ?>',
                link_type,
                appdesk_loaded,
                base_url = '<?= \Uri::base(true) ?>',

                $container = $('#' + id)
                    .find('a[data-id=close]')
                    .click(function(e) {
                        e.preventDefault();
                        $container.nosDialog('close');
                    })
                    .end(),

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
                $ul = $container.find('> ul')
                    .css({
                        width : '18%'
                    }),
                $a_properties = $ul.find('li:last a'),

                $dialog = $container.closest('.ui-dialog-content')
                    .bind('select_media', function(e, media) {
                        $real_url.text(base_url + media.path);
                        $input_url.val('nos://media/' + media.id);
                        $container.wijtabs('enableTab', 2)
                            .wijtabs('select', 2);
                    })
                    .bind('select_page', function(e, page) {
                        $real_url.text(base_url + page.url);
                        $input_url.val('nos://page/' + page.id);
                        $container.wijtabs('enableTab', 2)
                            .wijtabs('select', 2);
                    }),

                choose_type = function(type, select) {
                        switch (type) {
                            case 'internal':
                            case 'media':
                                var title = type === 'internal' ? <?= \Format::forge($title_appdesk_page)->to_json() ?> : <?= \Format::forge($title_appdesk_media)->to_json() ?>

                                if ($ul.find('li').size() === 2) {
                                    $container.wijtabs('add', '#' + id + '_appdesk', title, 1);
                                    $a_properties.text(<?= \Format::forge($title_properties_3)->to_json() ?>);
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
                                    $a_properties.text(<?= \Format::forge($title_properties_2)->to_json() ?>);
                                }
                                $container.wijtabs('enableTab', 1)
                                break;
                        }
                        if (select) {
                            $container.wijtabs('select', 1);
                        }
                    },

                properties = ['url', 'anchor', 'email', 'phone', 'url_params', 'tooltip', 'target'],
                types_properties = {
                        internal : ['url', 'url_params', 'tooltip', 'target'],
                        external : ['url', 'tooltip', 'target'],
                        media : ['url', 'tooltip', 'target'],
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
                            url: base_url + 'admin/nos/page/appdesk/info/' + found[1],
                            dataType: 'json',
                            success: function(page) {
                                $real_url.text(base_url + page.url);
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
                            url: base_url + 'admin/nos/media/appdesk/info/' + found[1],
                            dataType: 'json',
                            success: function(media) {
                                $real_url.text(base_url + media.path);
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
                    disabledIndexes: newlink ? [1] : [],
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
                                    .load(link_type === 'internal' ? 'admin/nos/page/appdesk/index/link_pick' : 'admin/nos/media/appdesk/index/media_pick');
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
                .css('width', '81%')
                .addClass('box-sizing-border')
                .end()
                .nosFormUI();

            // Editing the current link
            if (node) {
                choose_type(link_type);
                $container.wijtabs('select', $ul.find('li').size() - 1);
            }
        });
    });
</script>