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
                        action : function(item, ui) {
                            $(ui).nosTabs({
                                url : 'admin/nos/page/page/crud/' + item.id,
                                label : item.title,
                                iconUrl: 'static/novius-os/admin/novius-os/img/16/page.png'
                            });
                        }
                    },
                    'delete' : {
                        label : appDesk.i18n('Delete'),
                        name : 'delete',
                        primary : true,
                        icon : 'trash',
                        action : function(item, ui) {
                            $(ui).nosConfirmationDialog({
                                contentUrl: 'admin/nos/page/page/delete_page/' + item.id,
                                title: appDesk.i18n('Delete a page')._(),
                                confirmed: function($dialog) {
                                    $dialog.nosAjax({
                                        url : 'admin/nos/page/page/delete_page_confirm',
                                        method : 'POST',
                                        data : $dialog.find('form').serialize()
                                    });
                                },
                                appDesk: appDesk
                            });
                        }
                    },
                    'visualise' : {
                        label : appDesk.i18n('Visualise'),
                        name : 'visualise',
                        primary : true,
                        iconClasses : 'nos-icon16 nos-icon16-eye',
                        action : function(item) {
                            window.open(item.previewUrl);
                        }
                    }
                },
                reloadEvent : 'Nos\\Model_Page',
                appdesk : {
                    adds: {
                        page : {
                            label : appDesk.i18n('Add a page'),
                            action : function(ui, appdesk) {
                                $(ui).nosTabs('add', {
                                    url: 'admin/nos/page/page/crud?lang=' + appdesk.lang,
                                    label: appDesk.i18n('Add a page')._(),
                                    iconUrl: 'static/novius-os/admin/novius-os/img/16/page.png'
                                });
                            }
                        }/*,
                        root : {
                            label : appDesk.i18n('Add a root'),
                            url : 'admin/nos/page/root/add'
                        }*/
                    },
                    grid : {
                        proxyUrl : 'admin/nos/page/list/json',
                        columns : {
                            title : {
                                headerText : appDesk.i18n('Title'),
                                dataKey : 'title',
                                sortDirection : 'ascending'
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
                                actions : ['edit', 'delete', 'visualise']
                            }
                        }
                    },
                    treeGrid : {
                        proxyUrl : 'admin/nos/page/list/tree_json'
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
