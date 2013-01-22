<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');
?>
<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            $('#login').nosFormUI();
<?php
if (!empty($error)) {
    ?>
            $.nosNotify(<?= json_encode(array(
                'title' => $error,
                'type' => 'error',
                'addclass' => 'nos-login-error',
            )) ?>);
    <?php
}
?>
            $('#email').select();
        });
    });
</script>
<div id="login">
    <img src="static/novius-os/admin/novius-os/img/logo.png" alt="" />
    <form method="POST" action="">
        <p><input type="email" name="email" id="email" value="<?= e(\Input::post('email', '')); ?>" placeholder="<?= __('Email address') ?>" /></p>
        <p><input type="password" name="password" placeholder="<?= __('Password') ?>" /></p>
        <p>
            <input type="checkbox" id="remember_me" name="remember_me" value="1" />
            <label for="remember_me">
                <?= __('Remember me') ?>
            </label>
        </p>
        <p><input type="submit" value="<?= __('Let’s get started') ?>"></p>
    </form>
</div>
