<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

?>
<div id="<?= $id = uniqid() ?>"></div>
<script type="text/javascript">
    require(['jquery-nos'],
        function ($) {
            $(function() {
                var $div = $('#<?= $id ?>');
                $div.nosOnShow('bind', function() {
                    var $form = $div.parents('.renderer-menu-items-li-form');
                    $form.find('.menu_item_page_id')
                        .on('nositempickerpick', function(e, data) {
                            $form.find('.menu_item_title').attr('placeholder', data._title || '').trigger('keyup');
                        });
                });
            });
        }
    );
</script>

