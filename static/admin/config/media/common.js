/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define([
    'jquery-nos-appdesk'
], function($nos) {
    "use strict";
    return function(appDesk) {
        return {
            actions : {
                edit : {
                    name : 'edit',
                    primary : true,
                    icon : 'pencil',
                    label : appDesk.i18n('Edit'),
                    action : function(item, ui) {
                        $nos(ui).tab({
                            url: 'admin/nos/media/media/edit/' + item.id,
                            label: appDesk.i18n('Edit a media')._()
                        });
                    }
                },
                'delete' : {
                    name : 'delete',
                    primary : true,
                    icon : 'trash',
                    label : appDesk.i18n('Delete'),
                    action : function(item, ui) {
                        $nos(ui).dialog({
                            contentUrl: 'admin/nos/media/actions/delete_media/' + item.id,
                            ajax : true,
                            title: appDesk.i18n('Delete a media')._(),
                            width: 400,
                            height: 150
                        });
                    }
                },
                visualise : {
                    name : 'visualise',
                    //primary : true,
                    //icon : 'search',
                    iconClasses : 'nos-icon16 nos-icon16-eye',
                    label : appDesk.i18n('Visualise'),
                    action : function(item, ui) {

                        if (!item.image) {
                            window.open(item.path);
                            return;
                        }

                        var image = new Image();
                        image.onerror = function() {
                            $nos.notify('Image not found', 'error');
                        }
                        image.onload = function() {
                            // Create the lightbox
                            var lightbox = $nos('<div><a href="/' + item.path + '" rel="wijlightbox"><img src="/' + item.path + '" title="' + item.title + '" style="width:0;height:0;" /></a></div>')
                            .css({
                                position : 'absolute',
                                dislplay : 'none',
                                width : 1,
                                height: 1
                            })
                            .css($nos(ui || this).offset())
                            .appendTo(document.body)
                            .wijlightbox({
                                zIndex : 1201,
                                textPosition : 'outside',
                                player : 'img',
                                dialogButtons: 'fullsize',
                                modal : true,
                                open : function() {
                                    $nos('.wijmo-wijlightbox-overlay').css('z-index', 1200);
                                },
                                close : function(e) {
                                    lightbox.wijlightbox('destroy');
                                    lightbox.remove();
                                }
                            });

                            // Open it
                            lightbox.find('a').triggerHandler('click');
                        }
                        image.src = item.path;
                    }
                }
            },
            tab : {
                label : appDesk.i18n('Media center'),
                iconUrl : 'static/novius-os/admin/novius-os/img/32/media.png'
            },
            reload : 'nos_media_media',
            appdesk : {
                splittersVertical : 300,
                adds : {
                    media : {
                        label : appDesk.i18n('Add a media'),
                        action : function(ui) {
                            $nos(ui).tab({
                                url: 'admin/nos/media/media/add',
                                label: appDesk.i18n('Add a media')._()
                            });
                        }
                    },
                    folder : {
                        label : appDesk.i18n('Add a folder'),
                        action : function(ui) {
                            $nos(ui).tab({
                                url: 'admin/nos/media/folder/add',
                                label: 'Add a folder'
                            }, {
                                width: 600,
                                height: 250
                            });
                        }
                    }
                },
                grid : {
                    id : 'nos_media_grid',
                    proxyUrl : 'admin/nos/media/list/json',
                    columns : {
                        extension : {
                            headerText : appDesk.i18n('Ext.'),
                            dataKey : 'extension',
                            width : 60,
                            ensurePxWidth : true,
                            allowSizing : false
                        },
                        title : {
                            headerText : appDesk.i18n('Title'),
                            dataKey : 'title',
                            sortDirection : 'ascending'
                        },
                        actions : {
                            actions : ['edit', 'delete', 'visualise']
                        }
                    }
                },
                thumbnails : {
                    dataParser : function(size, item) {
                        var data = {
                            title : item.title,
                            thumbnail : (item.image ? item.thumbnail : item.thumbnailAlternate).replace(/64/g, size),
                            thumbnailAlternate : (item.image ? item.thumbnailAlternate : '').replace(/64/g, size),
                            actions : []
                        };
                        return data;
                    },
                    actions : ['edit', 'delete', 'visualise']
                },
                defaultView : 'thumbnails',
                inspectorsOrder : 'preview,folders,extensions',
                inspectors : {
                    folders : {
                        vertical : true,
                        widget_id : 'nos_media_folders',
                        label : appDesk.i18n('Folders'),
                        url : 'admin/nos/media/inspector/folder/list',
                        inputName : 'folder_id',
                        treeGrid : {
                            treeUrl : 'admin/nos/media/inspector/folder/json',
                            sortable : false,
                            columns : {
                                title : {
                                    headerText : appDesk.i18n('Folder'),
                                    dataKey : 'title'
                                },
                                actions : {
                                    showOnlyArrow : true,
                                    actions : [
                                        {
                                            name : 'add_media',
                                            label : appDesk.i18n('Add a media in this folder'),
                                            icon : 'plus',
                                            action : function(item, ui) {
                                                $nos(ui).tab({
                                                    url: 'admin/nos/media/media/add/' + item.id,
                                                    label: 'Add a media in the "' + item.title + '" folder'
                                                });
                                            }
                                        },
                                        {
                                            name : 'add_folder',
                                            label : appDesk.i18n('Add a sub-folder to this folder'),
                                            icon : 'folder-open',
                                            action : function(item, ui) {
                                                $nos(ui).tab({
                                                    url: 'admin/nos/media/folder/add/' + item.id,
                                                    label: 'Add a sub-folder in "' + item.title + '"'
                                                }, {
                                                    width: 600,
                                                    height: 250
                                                });
                                            }
                                        },
                                        {
                                            name : 'edit',
                                            label : appDesk.i18n('Edit this folder'),
                                            icon : 'pencil',
                                            action : function(item, ui) {
                                                $nos(ui).tab({
                                                    url: 'admin/nos/media/folder/edit/' + item.id,
                                                    label: 'Edit the "' + item.title + '" folder'
                                                }, {
                                                    width: 600,
                                                    height: 250
                                                });
                                            }
                                        },
                                        {
                                            name : 'delete',
                                            label : appDesk.i18n('Delete this folder'),
                                            icon : 'trash',
                                            action : function(item, ui) {
                                                $nos(ui).dialog({
                                                    contentUrl: 'admin/nos/media/actions/delete_folder/' + item.id,
                                                    ajax : true,
                                                    title: 'Delete the "' + item.title + '" folder',
                                                    width: 400,
                                                    height: 200
                                                });
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    extensions : {
                        vertical : true,
                        widget_id : 'nos_media_extensions',
                        label : appDesk.i18n('Type of file'),
                        url : 'admin/nos/media/inspector/extension/list',
                        inputName : 'media_extension[]',
                        grid : {
                            columns : {
                                title : {
                                    headerText : appDesk.i18n('Type of file'),
                                    dataKey : 'title',
                                    cellFormatter : function(args) {
                                        if ($nos.isPlainObject(args.row.data)) {
                                            var text = "";
                                            if (args.row.data.icon) {
                                                text += "<img style=\"vertical-align:middle\" src=\"static/novius-os/admin/novius-os/img/16/" + args.row.data.icon + "\"> ";
                                            }
                                            text += args.row.data.title;

                                            args.$container.html(text);

                                            return true;
                                        }
                                    }
                                },
                                hide : {
                                    visible : false
                                },
                                hide2 : {
                                    visible : false
                                }
                            }
                        }
                    },
                    preview : {
                        vertical : true,
                        widget_id : 'nos_media_preview',
                        label : appDesk.i18n('Preview'),
                        preview : true,
                        options : {
                            meta : {
                                fileName : {
                                    label : appDesk.i18n('File name:')
                                },
                                pathFolder : {
                                    label : appDesk.i18n('Path:')
                                }
                            },
                            actions : ['edit', 'delete', 'visualise'],
                            actionThumbnail: 'visualise',
                            dataParser : function(item) {
                                var data = {
                                    title : item.title,
                                    thumbnail : (item.image ? item.thumbnail.replace(/64/g, 256) : item.thumbnailAlternate),
                                    thumbnailAlternate : (item.image ? item.thumbnailAlternate : ''),
                                    meta : {
                                        fileName : item.file_name,
                                        pathFolder : item.path_folder + '/'
                                    }
                                };
                                return data;
                            }
                        }
                    }
                }
            }
        }
    }
});
