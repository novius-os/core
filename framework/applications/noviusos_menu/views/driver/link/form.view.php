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
    <h3><?= __('Link') ?></h3>

    <div style="overflow:visible;">
        <div class="field">
            <label for="attribute_url">URL</label>
            <input type="text" name="attributes.url" id="attribute_url"
                   value="<?= e(!empty($item->url) ? $item->url : '') ?>"/>
        </div>
        <div class="field">
            <label for="attribute_url">Ouvrir le lien dans une nouvelle fenêtre/onglet ?</label>

            <div class="radios">
                <input type="radio" name="attributes.url_blank" id="attribute_url_blank_yes"
                       value="1" <?= !empty($item->url_blank) ? 'checked="checked" ' : '' ?>/>
                Oui
                <input type="radio" name="attributes.url_blank" id="attribute_url_blank_no"
                       value="0" <?= empty($item->url_blank) ? 'checked="checked"' : '' ?>/>
                Non
            </div>
        </div>
    </div>
</div>
<?php
echo $content;
