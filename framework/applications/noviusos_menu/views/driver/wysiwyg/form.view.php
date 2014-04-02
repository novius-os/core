<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
?>
<div class="expander fieldset"
     data-wijexpander-options="<?= htmlspecialchars(\Format::forge()->to_json($expander_options)); ?>">
    <h3><?= __('Wysiwyg') ?></h3>

    <div style="overflow:visible;">
        <?= \Nos\Renderer_Wysiwyg::renderer($renderer) ?>
    </div>
</div>
<?php
echo $content;
