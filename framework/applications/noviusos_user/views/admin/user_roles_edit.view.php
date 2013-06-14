<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('noviusos_user::common');

$roles = Nos\User\Model_Role::find('all');
$selected = array_keys($user->roles);

?>
<table class="fieldset" id="<?= $uniqid = uniqid('role_') ?>">
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
        <td style="width:50%">
            <a class="link_to_role" href="#" data-auto-init="nosAction" data-action="<?= htmlspecialchars(\Format::forge()->to_json(array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_user/role/insert_update/'.$role->role_id,
                ),
            ))) ?>"><span class="nos-icon16 nos-icon16-eye"></span> <?= __('View and edit permissions') ?></a>
        </td>
    </tr>
    <?php
}
?>
</table>
<script type="text/javascript">
require(['jquery-nos'], function($) {
    $(function() {
        $('#<?= $uniqid ?>').find('a.link_to_role').on('click', function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.nosAction($this.data('action'));
        })
    });
});
</script>
