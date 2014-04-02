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
<div class="expander fieldset" data-wijexpander-options="<?= htmlspecialchars(\Format::forge()->to_json($expander_options)); ?>">
    <h3><?= __('Text') ?></h3>
	<div style="overflow:visible;">
		<div class="field">
		<label for="mitem_attributes_text">Text</label>
			<textarea name="attributes.text" id="mitem_attributes_text" rows="5" style="width: 100%"></textarea>
        </div>
        <div class="field">
			<input type="checkbox" name="attributes.is_html" value="1" />
			<?= __('Interpret as HTML code') ?>
		</div>
	</div>
</div>
<?= $content ?>
