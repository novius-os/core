/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

(function() {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('nosenhancer');

    tinymce.create('tinymce.plugins.NosEnhancerPlugin', {
        init : function(ed, url) {
            var self = this, mediaCached = {};

            self.editor = ed;
            self.url = url;

            self.nosenhancer_enhancers = ed.getParam('nosenhancer_enhancers', []);

            if (self.nosenhancer_enhancers) {
                tinymce.each(self.nosenhancer_enhancers, function(f, id) {
                    self.nosenhancer_enhancers[id].id = id;
                    if (!self.nosenhancer_enhancers[id].previewUrl) {
                        self.nosenhancer_enhancers[id].previewUrl = 'admin/nos/enhancer/preview';
                    }
                });
            }

            if (!self.nosenhancer_enhancers) {
                return false;
            }

            // Register commands
            ed.addCommand('mceNosEnhancer', function(ui, metadata, edit) {
                self._nosEnhancer(ui, metadata, edit);
            });

            ed.onInit.add(function(ed) {
                ed.dom.loadCSS(url + '/css/content.css');
            });

            function enhancerEmptyPreview(content) {
                // Empty enhancer previews (data and useful informations are stored as html attributes on the higest div)
                content.filter('.nosEnhancer, .nosEnhancerInline').empty();
                content.find('.nosEnhancer, .nosEnhancerInline').empty();
            }

            function enhancerRestorePreview(content) {
                content.find('.nosEnhancer, .nosEnhancerInline').each(function() {
                    var enhancer = $(this);
                    enhancer.html(ed.getLang('nosenhancer.loading'));
                    self.onEnhancerAdd(enhancer);

                    var enhancer_id = $(this).data('enhancer');
                    var metadata  = self.nosenhancer_enhancers[enhancer_id];
                    var data      = $.extend(true, {enhancer: enhancer_id}, $(this).data('config'));
                    $.ajax({
                        url: metadata.previewUrl,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function(json) {
                            enhancer.html(json.preview);
                            self.onEnhancerAdd(enhancer, metadata);
                        },
                        error: function() {
                            enhancer.html(ed.getLang('nosenhancer.loading_error'));
                            self.onEnhancerAdd(enhancer);
                        }
                    });
                });
            }

            function mediaTransformSrcIntoNos(content) {
                content.find('img').each(function() {
                    var $img = $(this);
                    var media_id = $img.attr('data-media-id');
                    if (!media_id) {
                        return;
                    }
                    var origSrc = $img.attr('src');
                    if (origSrc.substr(0, 6) !== 'nos://') {
                        var src = 'nos://media/' + media_id;
                        var width = $img.attr('width');
                        var height = $img.attr('height');

                        if (width && height) {
                            src += '/' + width + '/' + height;
                            var resolution = width * height;
                        } else {
                            resolution = 0;
                        }

                        // Store src in the cache when: 1. it doesn't exists yet or 2. the resolution is higher than the stored one
                        // resolution == 0 means it's the larger possible size
                        if (resolution == 0 || !mediaCached[media_id] || resolution > mediaCached[media_id].resolution) {
                            mediaCached[media_id] = {
                                attrs : {
                                    src: $img.attr('src'),
                                    'data-media-id' : media_id
                                },
                                resolution: resolution
                            };
                        }

                        $img.attr({
                            src: src
                        }).removeClass('nosMedia').removeAttr('data-media').removeAttr('data-media-id');
                    }
                    $img.removeData().attr('data-mce-src', origSrc).removeAttr('data-mce-src');
                });
            }

            function mediaRestoreSrc(content) {
                content.find('img').each(function() {
                    var $img = $(this);
                    $img.removeData().removeAttr('data-mce-src');
                    var origSrc = $img.attr('src');
                    if (origSrc.substr(0, 6) == 'nos://') {
                        // remove 'nos://media/'
                        var media_id = origSrc.substr(12).split('/')[0];
                        if (media_id && mediaCached[media_id]) {
                            $img.attr(mediaCached[media_id]['attrs']).addClass('nosMedia');
                        }
                    }
                });
            }

            // When editing HTML content, we clean up enhancer preview, we'll make them nice again after
            ed.onGetContent.add(function(ed, o) {
                var content = $(o.content);
                // Empty enhancer previews (data and useful informations are stored as html attributes on the higest div)
                enhancerEmptyPreview(content);
                mediaTransformSrcIntoNos(content);
                o.content = $('<div></div>').append(content).html();
            });

            ed.onSetContent.add(function(ed, o) {
                setTimeout(function() {
                    var content = $(ed.getBody());
                    enhancerRestorePreview(content);
                    mediaRestoreSrc(content);
                }, 1);
            });

            // Global onClick handlers to execute actions from the enhancers
            // We need that to play nicefully with undo/redo
            ed.onClick.add(function(ed, e) {
                var target = $(e.target);
                var action = target.data('action');

                // Enhancers are non-editable, so we can't add new paragraphs by pressing "Enter"
                // This allow insertion before or after the display:block enhancer

                var p = null;

                // Add a new paragraph before a display:block enhancer
                if (action == 'addParagraphBefore') {
                    p = $('<p></p>').text(ed.getLang('nosenhancer.new_paragraph'));
                    target.closest('.nosEnhancer, .nosEnhancerInline').before(p);
                    // All 3 commands are needed to select the node and focus the editor
                    ed.selection.select(p.get(0), true);
                    ed.focus(false);
                    // Tell undoManager to add a checkpoint
                    ed.execCommand("mceEndUndoLevel");
                    e.preventDefault();
                }

                // Add a new paragraph after a display:block enhancer
                if (action == 'addParagraphAfter') {
                    p = $('<p></p>').text(ed.getLang('nosenhancer.new_paragraph'));
                    target.closest('.nosEnhancer, .nosEnhancerInline').after(p);
                    // All 3 commands are needed to select the node and focus the editor
                    ed.selection.select(p.get(0), true);
                    ed.focus(false);
                    // Tell undoManager to add a checkpoint
                    ed.execCommand("mceEndUndoLevel");
                    e.preventDefault();
                }

                if (action == 'editEnhancer') {
                    var enhancer   = target.closest('.nosEnhancer, .nosEnhancerInline');
                    var metadata = self.nosenhancer_enhancers[$(enhancer).data('enhancer')];
                    self._nosEnhancer(null, metadata, enhancer);
                    e.preventDefault();
                }

                if (action == 'removeEnhancer') {
                    target.closest('.nosEnhancer, .nosEnhancerInline').remove();
                    // Tell undoManager to add a checkpoint
                    ed.execCommand("mceEndUndoLevel");
                    e.preventDefault();
                }
            });
        },

        createControl : function(n, cm) {
            var self = this, c;

            if (n === 'nosenhancer') {
                c = cm.createMenuButton('nosenhancer', {
                    title : 'nosenhancer.desc',
                    label : 'nosenhancer.desc',
                    image : self.url + '/img/enhancer.gif',
                    cmd : 'mceNosEnhancer'
                });

                c.onRenderMenu.add(function(c, m) {
                    m.settings.max_height = 300;
                    m.add({
                        title : 'nosenhancer.desc',
                        'class' : 'mceMenuItemTitle'
                    }).setDisabled(1);

                    tinymce.each(self.nosenhancer_enhancers, function(f) {
                        m.add({
                            title : f.title,
                            //icon_src: f.iconUrl,
                            style : 'background: url(' + f.iconUrl + ') no-repeat 5px center;',
                            id : 'enhancer_' + f.id,
                            onclick : function() {
                                self.editor.execCommand('mceNosEnhancer', false, f);
                            }
                        });
                    });
                });

                return c;
            }
            return null;
        },

        _nosEnhancer : function(ui, metadata, edit) {
            var ed = tinyMCE.activeEditor;

            // Keep reference to the nosDialog node, so we can close the popup manually
            var dialog = null,
                self   = this,
                config = (function() {
                    var data = edit ? $(edit).attr('data-config') : {};
                    if ($.type(data) === 'string') {
                        data = $.parseJSON(data);
                    }
                    return data;
                })(),
                data_config = edit ? $.extend(true, {
                    nosContext : $(ed.getElement()).closest('.nos-dispatcher').data('nosContext'),
                    enhancer: metadata.id,
                    enhancerAction: 'update'
                }, config) : {
                    nosContext : $(ed.getElement()).closest('.nos-dispatcher').data('nosContext'),
                    enhancer: metadata.id,
                    enhancerAction: 'insert'
                },
                save = function(json) {

                    if (edit) {
                        edit = edit[0];
                    } else {
                        // @todo inserts div or span depending on enhancer
                        ed.execCommand('mceInsertContent', false, ed.dom.createHTML('div', {
                            id : '__mce_tmp',
                            'class' : 'mceNonEditable'
                        }), {skip_undo : 1});
                        edit = ed.dom.get('__mce_tmp');
                    }
                    $(edit).attr({
                        'data-config':$.type(json.config) === 'string' ? json.config : JSON.stringify(json.config),
                        'data-enhancer': metadata.id
                    })
                        .removeAttr('id')
                        .html($(json.preview).html());

                    // Add special links (this is also called onInit())
                    self.onEnhancerAdd(edit, metadata);

                    ed.focus(true);
                };

            if (!$.isPlainObject(metadata.dialog) || !metadata.dialog.contentUrl) {
                $.ajax({
                    url: metadata.previewUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        enhancer: metadata.id
                    },
                    success: save,
                    error: function() {
                        console.log('Error: unable to add the enhancer in the Wysiwyg (no popup)');
                    }
                });
                return;
            }

            // Open the dialog popup (it returns the node inserted in the body)
            if (metadata.dialog.ajax || !edit) {
                dialog = $nos(ed.getElement()).nosDialog($.extend({
                    title: metadata.title
                }, $.extend({}, metadata.dialog, {ajax : true, ajaxData : data_config})));
            } else {
                // Open empty dialog
                dialog = $nos(ed.getElement()).nosDialog($.extend({
                    title: metadata.title
                }, $.extend({}, metadata.dialog, {contentUrl : null})));

                // Post edit content in iframe in the empty dialog
                var form = $('<form></form>')
                        .attr('action', metadata.dialog.contentUrl)
                        .attr('method', 'post')
                        .attr('target', 'tinymce_dialog')
                        .appendTo(dialog),
                    iframe = $('<iframe></iframe>')
                        .attr('src', /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank')
                        .attr('frameborder', '0')
                        .attr('name', 'tinymce_dialog')
                        .css({
                            width : '100%',
                            height : '99%'
                        })
                        .appendTo(dialog),
                    addInput = function(key, val) {
                        if ($.isArray(val)) {
                            $.each(val, function(i, val) {
                                addInput(key + '[]', val);
                            });
                        } else {
                            $('<input type="hidden" name="' + key + '">').attr('value', val)
                                .appendTo(form);
                        }
                    };

                $.each(data_config || {}, function(key, val) {
                    addInput(key, val);
                });
                dialog.css('padding', '0px');

                form.submit();
            }

            dialog.bind('save.enhancer', function(e, json) {
                save(json);
                dialog.nosDialog('close');
            });
        },

        onEnhancerAdd: function(container, metadata) {

            var ed = tinyMCE.activeEditor;
            container = $(container);

            // Don't bind click handlers here, it will mess up when using undo/redo, which only tracks the HTML content
            // Instead, use a global click handler and detect the action using data-action="..."
            // Ctrf + F using an action name (removeEnhancer or addParagraphAfter) to find where this is :)
            var deleteLink = $('<a href="#" data-action="removeEnhancer"></a>')
                    .text(ed.getLang('nosenhancer.delete'))
                    .attr('title', ed.getLang('nosenhancer.delete'))
                    .addClass('nos_enhancer_action nos_enhancer_action_delete'),
                editLink = $('<a href="#" data-action="editEnhancer"></a>')
                    .text(ed.getLang('nosenhancer.options'))
                    .attr('title', ed.getLang('nosenhancer.options'))
                    .addClass('nos_enhancer_action nos_enhancer_action_edit'),
                insertAfter = $('<a href="#" data-action="addParagraphAfter"></a>')
                    .text(ed.getLang('nosenhancer.p_after'))
                    .attr('title', ed.getLang('nosenhancer.p_after'))
                    .addClass('nos_enhancer_action nos_enhancer_action_after'),
                insertBefore = $('<a href="#" data-action="addParagraphBefore"></a>')
                    .text(ed.getLang('nosenhancer.p_before'))
                    .attr('title', ed.getLang('nosenhancer.p_before'))
                    .addClass('nos_enhancer_action nos_enhancer_action_before');

            if (container.is('span')) {
                container.addClass('nosEnhancerInline')
                container.append(document.createTextNode(' '));
                if (metadata && $.isPlainObject(metadata.dialog) && metadata.dialog.contentUrl) {
                    container.append(editLink);
                }
                container.append(deleteLink);
                container.before($('<span> </span>'));
                container.after($('<span> </span>'));
            } else {
                container.addClass('nosEnhancer');
                container.prepend(insertAfter.addClass('nos_enhancer_action_block'));
                container.prepend(insertBefore.addClass('nos_enhancer_action_block'));
                if (metadata && $.isPlainObject(metadata.dialog) && metadata.dialog.contentUrl) {
                    container.prepend(editLink.addClass('nos_enhancer_action_block'));
                }
                container.prepend(deleteLink.addClass('nos_enhancer_action_block'));
            }
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nosenhancer', tinymce.plugins.NosEnhancerPlugin);
})();
