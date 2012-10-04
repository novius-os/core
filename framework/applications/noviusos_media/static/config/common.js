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
                appdesk : {
                    thumbnails : {
                        dataParser : function(size, item) {
                            var data = {
                                title : item.title,
                                thumbnail : (item.image ? item.thumbnail : item.thumbnailAlternate).replace(/64/g, size),
                                thumbnailAlternate : (item.image ? item.thumbnailAlternate : '').replace(/64/g, size),
                                actions : []
                            };
                            return data;
                        }
                    },
                    inspectors : {
                        extensions : {
                            grid : {
                                columns : {
                                    title : {
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
                                    }
                                }
                            }
                        },
                        preview : {
                            options : {
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
            };
        };
    });
