<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
if (!isset($options)) {
    $options = array();
}
?>
<label class="tooltip" id="<?= $uniqid = uniqid('tooltip_') ?>" title="<?= empty($title) ? '' : e($title) ?>">
    <img src="static/novius-os/admin/novius-os/img/24/help.png" />
    <div class="content">
        <?= $content ?>
    </div>
</label>

<script type="text/javascript">
    require(['jquery-nos', 'wijmo.wijtooltip'], function($) {
        $(function() {
            var $this = $('#<?= $uniqid ?>');
            var defaultOptions = {
                showCallout: false,
                calloutFilled : true,
                closeBehavior: 'sticky',
                position : {
                    my : 'right center',
                    at : 'left center',
                    offset : '0 0'
                },
                triggers : 'click',
                title : $this.attr('title'),
                content : $(this).find('div.content').html(),
                showing: function(e, ui) {

                    // http://stackoverflow.com/questions/152975/how-to-detect-a-click-outside-an-element
                    ui._tooltipCache._$tooltip.addClass('tooltip').on('click', function(e) {
                        e.stopPropagation();
                    });
                    $('body').on('click.wijtooltip', function(e) {
                        $this.wijtooltip('hide');
                    });
                },
                hiding: function(e, ui) {
                    $('body').off('click.wijtooltip');
                }
            };
            $this.wijtooltip($.extend(defaultOptions, <?= \Format::forge($options)->to_json() ?>));
        })
    })
</script>