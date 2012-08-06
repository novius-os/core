<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$media_count = $view_params['item']->count_media();
?>
<input type="hidden" name="id" value="<?= $view_params['item']->{$view_params['pk']} ?>" />
<div id="<?= $uniqid = uniqid('id_') ?>" class="fieldset standalone">
<p><?php
    if ($media_count == 0) {
        ?>
        <p><?= __('The folder is empty and can be safely deleted.') ?></p>
        <p><?= __('Please confirm the suppression below.') ?></p>
        <?php
    } else {
        ?>
        <p><?= strtr(__(
                $media_count == 1 ? 'There is <strong>one media</strong> in this folder.'
                                  : 'There are <strong>{count} medias</strong> in this folder.'
        ), array(
            '{count}' => $media_count,
        )) ?></p>
        <p><?= __('To confirm the deletion, you need to enter this number in the field below') ?></p>
        <p><?= strtr(__('Yes, I want to delete all {count} files from the media centre.'), array(
            '{count}' => '<input class="verification" data-verification="'.$media_count.'" size="'.(mb_strlen($media_count) + 1).'" />',
        )); ?></p>
        <?php
    }
    ?></p>
</div>
