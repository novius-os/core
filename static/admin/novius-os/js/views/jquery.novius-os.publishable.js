/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
define('jquery-nos-publishable',
    ['jquery-nos', 'jquery-ui.button'],
    function($) {
        "use strict";

        $.fn.extend({
            nosPublishable : function(params) {
                params = params || {
                    initialStatus: 'undefined',
                    texts: {
                        'undefined' : {
                            0 : 'Will not be published',
                            1 : 'Will be published'
                        },
                        'no' : {
                            0 : 'Not published',
                            1 : 'Will be published'
                        },
                        'yes' : {
                            0 : 'Will be unpublished',
                            1 : 'Published'
                        }
                    }
                };
                return this.each(function() {
                    var $container = $(this),
                        $label = $container.find('td:last'),
                        $buttonset = $container.find('td:first');

                    $buttonset.buttonset({
                            text : false,
                            icons : {
                                primary:'ui-icon-locked'
                            }
                        });
                    $buttonset.find(':radio')
                        .change(function() {
                            $label.text(params.texts[params.initialStatus][$(this).val()]);
                        });
                    $buttonset.find(':checked')
                        .triggerHandler('change');
                    $buttonset.closest('form')
                        .bind('ajax_success', function(e, json) {
                            if (json.publication_initial_status == null) {
                                log('Potential error: publication_initial_status in JSON response.');

                                return;
                            }
                            params.initialStatus = json.publication_initial_status == 1 ? 'yes' : 'no';
                            $buttonset.find(':checked').triggerHandler('change');
                        });
                });
            }
        });

        return $;
    });
