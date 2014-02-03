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
$uniqid = uniqid('login');
?>
<script type="text/javascript">
require(
    ['jquery-nos'],
    function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>').nosFormUI().nosFormAjax();
            $container.closest(':wijmo-wijdialog').wijdialog({
                title : <?= \Format::forge()->to_json(__("You’ve been inactive for too long. We need to make sure this is really you.")) ?>
            });
            $('#<?= $uniqid ?>_email').select();
        });
    });
</script>
<div id="<?= $uniqid ?>" class="login_popup blank_slate">
    <div align="center"><img src="static/novius-os/admin/novius-os/img/logo.png" alt="" /></div>
    <form method="POST" action="/admin/nos/login/popup<?= $lang ? '?lang='.htmlspecialchars($lang) : '' ?>">
        <p><input type="email" name="email" id="<?= $uniqid ?>_email" value="<?= e(\Input::post('email', '')); ?>" placeholder="<?= __('Email address') ?>" /></p>
        <p><input type="password" name="password" placeholder="<?= __('Password') ?>" /></p>
        <p>
            <input type="checkbox" id="remember_me" name="remember_me" value="1" />
            <label for="remember_me">
                <?= __('Remember me') ?>
            </label>
        </p>
        <p><input type="submit" value="<?= __('Resume my work') ?>"></p>
    </form>
</div>
