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
                    inspectors : {
                        extension : {
                            grid : {
                                columns : {
                                    title : {
                                        cellFormatter : function(args) {
                                            if ($.isPlainObject(args.row.data)) {
                                                var text = "";
                                                if (args.row.data.icon) {
                                                    text += "<img style=\"vertical-align:middle\" src=\"static/apps/noviusos_media/icons/16/" + args.row.data.icon + "\"> ";
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
                                    return $.extend(true, {}, item, {
                                        title : item.media_title,
                                        thumbnail : (item.image ? item.thumbnail.replace(/64/g, 256) : item.thumbnailAlternate),
                                        thumbnailAlternate : (item.image ? item.thumbnailAlternate : ''),
                                        fileName : item.file + '.' + item.ext
                                    });
                                }
                            }
                        }
                    }
                }
            };
        };
    });
