<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');

?>
<div id="<?= $id = uniqid('temp_') ?>" class="line blank_slate" style="margin:0.5em;">
    <div class="col c7"><a href="http://www.novius-os.org" tager="_blank"><img src="static/novius-os/img/noviusos.png" border="0" width="288" height="267" /></a></div>
    <div class="col c5">
        <h1 style="font-size:200%;">Novius OS</h1>
        <br />
        <p style="font-size:75%;"><?= __('Create Once Publish Everywhere with Novius OS, a Cross-Channel Open Source CMS.') ?></p>
        <br />
        <p><?= __('Version:').' '.$version['fullname'] ?></p>
        <br />
        <p><?= __('License:') ?> <a href="http://www.gnu.org/licenses/agpl-3.0.html" target="_blank"><?= __('GNU AGPL v3') ?></a></p>
        <br />
        <p><a href="http://www.novius-os.org" target="_blank">www.novius-os.org</a></p>
    </div>
</div>
