<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));

$media_count = $item->count_media();
?>
<input type="hidden" name="id" value="<?= $item->{$crud['pk']} ?>" />
<div id="<?= $uniqid = uniqid('id_') ?>" class="fieldset standalone">
<p>
<?php
if ($media_count == 0) {
    ?>
    <p><?= __('The folder is empty and can be safely deleted.') ?></p>
    <?php
} else {
    ?>
    <p><?=
        strtr(
            n__(
                'There is <strong>one media file</strong> in this folder.',
                'There are <strong>{{count}} media files</strong> in this folder.',
                $media_count
            ),
            array(
                '{{count}}' => $media_count,
            )
        ) ?></p>
    <p><?= $crud['config']['i18n']['deleting confirmation number'] ?></p>
    <p><?= strtr(__('Yes, I want to delete this folder and the {{count}} media files it contains.'), array(
        '{{count}}' => '<input class="verification" data-verification="'.$media_count.'" size="'.(mb_strlen($media_count) + 1).'" />',
    )); ?></p>
    <?php
}
?>
</p>
    <input type="checkbox" name="contexts[]" class="count" data-count="1" value="all" checked style="display:none;" />
</div>
