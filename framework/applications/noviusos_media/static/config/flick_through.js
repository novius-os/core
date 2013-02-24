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
], function() {
    "use strict";
    return function(appDesk) {
        return {
            appdesk : {
                thumbnails : {
                    thumbnailSize : 128
                },
                inspectors : {
                    folder : {
                        hide : true
                    },
                    extension : {
                        hide : true
                    },
                    preview : {
                        hide : true
                    }
                }
                // Another solution is to remove the extensions inspector in the "Order" property
                //inspectorsOrder : 'folders,preview'
            }
        };
    };
});
