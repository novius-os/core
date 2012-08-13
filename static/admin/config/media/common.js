/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define(
    ['jquery-nos-appdesk'],
    function($) {
        "use strict";
        return function(appDesk) {
            return {
                actions : {
                    edit : {
                        name : 'edit',
                        primary : true,
                        icon : 'pencil',
                        label : appDesk.i18n('Edit'),
                        action : {
                            action : 'nosTabs',
                            tab : {
                                url: 'admin/nos/media/media/insert_update/{{id}}',
                                label: appDesk.i18n('Edit a media')._()
                            }
                        }
                    },
                    'delete' : {
                        name : 'delete',
                        primary : true,
                        icon : 'trash',
                        label : appDesk.i18n('Delete'),
                        action : {
                            action : 'nosConfirmationDialog',
                            dialog : {
                                contentUrl: 'admin/nos/media/media/delete/{{id}}',
                                title: appDesk.i18n('Delete a media')._(),
                                confirmedUrl: 'admin/nos/media/media/delete_confirm',
                                appDesk: appDesk
                            }
                        }
                    },
                    visualise : {
                        name : 'visualise',
                        //primary : true,
                        //icon : 'search',
                        iconClasses : 'nos-icon16 nos-icon16-eye',
                        label : appDesk.i18n('Visualise'),
                        action : {
                            action : 'nosMediaVisualise'
                        }
                    }
                },
                tab : {
                    label : appDesk.i18n('Media center'),
                    iconUrl : 'static/novius-os/admin/novius-os/img/32/media.png'
                },
                reloadEvent : [
                    'Nos\\Model_Media',
                    {
                        name : 'Nos\\Model_Media_Folder',
                        action : 'delete'
                    }
                ],
                appdesk : {
                    splittersVertical : 300,
                    adds : {
                        media : {
                            label : appDesk.i18n('Add a media'),
                            action : {
                                action : 'nosTabs',
                                method : 'add',
                                tab : {
                                    url: 'admin/nos/media/media/insert_update',
                                    label: appDesk.i18n('Add a media')._()
                                }
                            }
                        },
                        folder : {
                            label : appDesk.i18n('Add a folder'),
                            action : {
                                action : 'nosTabs',
                                method : 'add',
                                tab : {
                                    url: 'admin/nos/media/folder/insert_update',
                                    label: 'Add a folder'
                                },
                                dialog : {
                                    width: 600,
                                    height: 250
                                }
                            }
                        }
                    },
                    grid : {
                        id : 'nos_media_grid',
                        proxyUrl : 'admin/nos/media/appdesk/json',
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
                            label : appDesk.i18n('Folders'),
                            url : 'admin/nos/media/inspector/folder/list',
                            inputName : 'folder_id',
                            reloadEvent : 'Nos\\Model_Media_Folder',
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
                                                action : {
                                                    action : 'nosTabs',
                                                    tab : {
                                                        url: 'admin/nos/media/media/insert_update?context_id={{id}}',
                                                        label: 'Add a media in the "{{title}}" folder'
                                                    }
                                                }
                                            },
                                            {
                                                name : 'add_folder',
                                                label : appDesk.i18n('Add a sub-folder to this folder'),
                                                icon : 'folder-open',
                                                action : {
                                                    action : 'nosTabs',
                                                    tab : {
                                                        url: 'admin/nos/media/folder/insert_update?context_id={{id}}',
                                                        label: 'Add a sub-folder in "{{title}}"'
                                                    },
                                                    dialog : {
                                                        width: 600,
                                                        height: 250
                                                    }
                                                }
                                            },
                                            {
                                                name : 'edit',
                                                label : appDesk.i18n('Edit this folder'),
                                                icon : 'pencil',
                                                action : {
                                                    action : 'nosTabs',
                                                    tab : {
                                                        url: 'admin/nos/media/folder/insert_update/{{id}}',
                                                        label: 'Edit the "{{title}}" folder'
                                                    },
                                                    dialog : {
                                                        width: 600,
                                                        height: 250
                                                    }
                                                }
                                            },
                                            {
                                                name : 'delete',
                                                label : appDesk.i18n('Delete this folder'),
                                                icon : 'trash',
                                                action : {
                                                    action : 'nosConfirmationDialog',
                                                    dialog : {
                                                        contentUrl: 'admin/nos/media/folder/delete/{{id}}',
                                                        title: appDesk.i18n('Delete a folder')._(),
                                                        confirmedUrl: 'admin/nos/media/folder/delete_confirm',
                                                        appDesk: appDesk
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        extensions : {
                            vertical : true,
                            label : appDesk.i18n('Type of file'),
                            url : 'admin/nos/media/inspector/extension/list',
                            inputName : 'media_extension[]',
                            grid : {
                                columns : {
                                    title : {
                                        headerText : appDesk.i18n('Type of file'),
                                        dataKey : 'title',
                                        cellFormatter : function(args) {
                                            if ($.isPlainObject(args.row.data)) {
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
                            reloadEvent : 'Nos\\Model_Media',
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
