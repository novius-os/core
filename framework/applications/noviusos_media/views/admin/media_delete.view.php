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

$usage_count = count($item->link);
?>
<input type="hidden" name="id" value="<?= $item->{$crud['pk']} ?>" />
<div id="<?= $uniqid = uniqid('id_') ?>" class="fieldset standalone">
    <p><?php
if ($usage_count == 0) {
    ?>
    <p><?= __('The media is not used anywhere and can be safely deleted.') ?></p>
    <p><?= __('Please confirm the suppression below.') ?></p>
    <?php
} else {
    ?>
    <p><?= strtr(__(
            $usage_count == 1 ? 'The media is used <strong>one time</strong> by your applications.'
                              : 'The media is used <strong>{count} times</strong> by your applications.'
    ), array(
        '{count}' => $usage_count,
    )) ?></p>
    <p><?= __('To confirm the deletion, you need to enter this number in the field below') ?></p>
    <p><?= strtr(__('Yes, I want to delete all {count} usage of the media.'), array(
        '{count}' => '<input class="verification" data-verification="'.$usage_count.'" size="'.(mb_strlen($usage_count) + 1).'" />',
    )); ?></p>
    <?php
}
?></p>
</div>
