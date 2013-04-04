<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */


$roles = Nos\User\Model_Role::find('all');
$selected = array_keys($user->roles);

?>
<table class="fieldset">
<?php
foreach ($roles as $role) {
    ?>
    <tr>
        <th></th>
        <td>
            <label>
                <input type="checkbox" name="roles[]" value="<?= $role->role_id ?>" <?= in_array($role->role_id, $selected) ? 'checked' : '' ?>>
                <?= htmlspecialchars($role->role_name) ?>
            </label>
        </td>
    </tr>
    <?php
}
?>
</table>
