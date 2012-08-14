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
                tab : {
                    label : appDesk.i18n('Pages'),
                    iconUrl : 'static/novius-os/admin/novius-os/img/32/page.png'
                },
                actions : {
                    edit : {
                        label : appDesk.i18n('Edit'),
                        name : 'edit',
                        primary : true,
                        icon : 'pencil',
                        action : {
                            action : 'nosTabs',
                            tab : {
                                url : 'admin/nos/page/page/insert_update/{{id}}',
                                label : '{{title}}',
                                iconUrl: 'static/novius-os/admin/novius-os/img/16/page.png'
                            }
                        }
                    },
                    'delete' : {
                        label : appDesk.i18n('Delete'),
                        name : 'delete',
                        primary : false,
                        icon : 'trash',
                        action : {
                            action : 'confirmationDialog',
                            dialog : {
                                contentUrl: 'admin/nos/page/page/delete/{{id}}',
                                title: appDesk.i18n('Delete a page')._()
                            }
                        }
                    },
                    'visualise' : {
                        label : appDesk.i18n('Visualise'),
                        name : 'visualise',
                        primary : true,
                        iconClasses : 'nos-icon16 nos-icon16-eye',
                        action : {
                            action : 'window.open',
                            url : '{{previewUrl}}'
                        }
                    },
                    'set_homepage' : {
                        label : appDesk.i18n('Set as homepage'),
                        name : 'set_homepage',
                        primary : false,
                        icon : 'home',
                        action : {
                            action : 'nosAjax',
                            params : {
                                url : 'admin/nos/page/page/set_homepage',
                                method : 'POST',
                                data : {
                                    id : '{{id}}'
                                }
                            }
                        }
                    }
                },
                reloadEvent : 'Nos\\Model_Page',
                appdesk : {
                    adds: {
                        page : {
                            label : appDesk.i18n('Add a page'),
                            action : {
                                action : 'nosTabs',
                                method : 'add',
                                tab : {
                                    url: 'admin/nos/page/page/insert_update?lang={{lang}}',
                                    label: appDesk.i18n('Add a page')._(),
                                    iconUrl: 'static/novius-os/admin/novius-os/img/16/page.png'
                                }
                            }
                        }
                    },
                    grid : {
                        proxyUrl : 'admin/nos/page/appdesk/json',
                        columns : {
                            title : {
                                headerText : appDesk.i18n('Title'),
                                //dataKey : 'title',
                                sortDirection : 'ascending',
                                cellFormatter : function(args) {
                                    if ($.isPlainObject(args.row.data)) {
                                        var text = "";
                                        if (args.row.data.is_home) {
                                            text += ' <span class="ui-icon ui-icon-home" style="float:left;"></span> ';
                                        }
                                        text += args.row.data.title;

                                        args.$container.html(text);

                                        return true;
                                    }
                                }
                            },
                            lang : {
                                lang : true
                            },
                            url : {
                                headerText : appDesk.i18n('Virtual url'),
                                visible : false,
                                dataKey : 'url'
                            },
                            published : {
                                headerText : appDesk.i18n('Status'),
                                dataKey : 'publication_status'
                            },
                            actions : {
                                actions : ['edit', 'visualise', 'delete', 'set_homepage']
                            }
                        }
                    },
                    treeGrid : {
                        proxyUrl : 'admin/nos/page/appdesk/tree_json'
                    },
                    defaultView : 'treeGrid',
                    inspectors : {
                        roots : {
                            reloadEvent : 'Nos\\Model_Page_Root',
                            vertical : true,
                            hide : true,
                            label : appDesk.i18n('Roots'),
                            url : 'admin/nos/page/inspector/root/list',
                            inputName : 'rac_id',
                            grid : {
                                urlJson : 'admin/nos/page/inspector/root/json',
                                columns : {
                                    title : {
                                        headerText : appDesk.i18n('Root'),
                                        dataKey : 'title'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
