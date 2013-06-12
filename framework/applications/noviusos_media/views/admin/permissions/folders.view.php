<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('noviusos_media::common');
?>
<p>
    <?= __('Note: when nothing is selected, there is no restriction and this user can access all folders. The root folder is always accessible.') ?>
</p>

<p>
<?php
foreach (\Nos\Media\Model_Folder::find('all', array(
    'where' => array(
        array('medif_parent_id', 1),
    ),
    'order_by' => 'medif_title',
)) as $folder) {
    ?>
    <label style="display:block;">
        <input type="checkbox" name="perm[noviusos_media::restrict_folders][]" value="<?= $folder->medif_id ?>" <?= (int) $role->checkPermission('noviusos_media::restrict_folders', $folder->medif_id) ? 'checked' : '' ?> />
        <?= $folder->title_item(); ?>
    </label>
    <?php
}
?>
</p>
