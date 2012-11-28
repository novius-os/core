<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (empty($publishable) && !empty($item)) {
    $publishable = $item->behaviours('Nos\Orm_Behaviour_Publishable');
}

if (empty($publishable)) {
    return;
}
?>
<td>
    <?php $published = !empty($item) ? $item->published() : false; ?>
    <table style="margin:0 2em 0 1em;" id="<?= $publishable_id = uniqid('publishable_') ?>">
        <tr>
            <td class="publishable" style="width:50px;">
                <input type="radio" name="<?= $publishable['publication_bool_property'] ?>" class="notransform" value="0" id="<?= $uniqid_no = uniqid('no_') ?>" <?= $published === false ? 'checked' : ''; ?> /><label for="<?= $uniqid_no ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-red.png" /></label>
                <input type="radio" name="<?= $publishable['publication_bool_property'] ?>" class="notransform" value="1" id="<?= $uniqid_yes = uniqid('yes_') ?>" <?= $published === true ? 'checked' : ''; ?> /><label for="<?= $uniqid_yes ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-green.png" /></label>
            </td>
            <td style="padding-left:10px;"></td>
        </tr>
    </table>
</td>

<?php
$formatter = \Format::forge();
?>
<script type="text/javascript">
require(
    ['jquery-nos-publishable'],
    function($) {
        $(function() {
            $('#<?= $publishable_id ?>').nosPublishable({
                initialStatus: '<?= empty($item) || $item->is_new() ? 'undefined' : ($published ? 'yes' : 'no') ?>',
                texts: {
                    'undefined' : {
                        0 : <?= $formatter->to_json(___('nos::generic', 'Will not be published')) ?>,
                        1 : <?= $formatter->to_json(___('nos::generic', 'Will be published')) ?>
                    },
                    'no' : {
                        0 : <?= $formatter->to_json(___('nos::generic', 'Not published')) ?>,
                        1 : <?= $formatter->to_json(___('nos::generic', 'Will be published')) ?>
                    },
                    'yes' : {
                        0 : <?= $formatter->to_json(___('nos::generic', 'Will be unpublished')) ?>,
                        1 : <?= $formatter->to_json(___('nos::generic', 'Published')) ?>
                    }
                }
            });
        });
    });
</script>
