<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

?>
<div id="<?= $uniqid = uniqid('id_'); ?>" style="margin: 3em;" class="blank_slate">
    <h1 class="title"><?= __('Sorry, you won\'t get much help here for now...') ?></h1>

    <p>&nbsp;</p>
    <ul>
        <li>
            <span class="ui-icon ui-icon-bullet" style="display:inline-block;"></span>
            <p style="display:inline-block;"><?= strtr(__('You can {contact us on Twitter} if you have questions.'), array(
                '{' => '<a href="http://www.twitter.com/noviusos/" target="_blank">',
                '}' => '</a>',
            )); ?></p>
        </li>
        <li><p>&nbsp;</p></li>
        <li>
            <span class="ui-icon ui-icon-bullet" style="display:inline-block;"></span>
            <img src="static/novius-os/admin/novius-os/img/flags/fr.png" />
            <p style="display:inline-block;"><?= strtr(__('{Forums} are also available on our website.'), array(
                '{' => '<a href="http://www.novius-os.org/support-forums.html" target="_blank">',
                '}' => '</a>',
            )); ?></p>
            <p></p>
        </li>
    </ul>
</div>
