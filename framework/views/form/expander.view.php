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
<div class="expander fieldset" style="margin-bottom:1.5em;" <?= !empty($options) ? 'data-wijexpander-options="'.htmlspecialchars(Format::forge()->to_json($options)).'"' : '' ?>>
    <h3><?= $title ?></h3>
    <div style="overflow:visible;<?= !empty($nomargin) ? 'margin:0;padding:0;' : '' ?>">
<?php
    if (is_array($content) && !empty($content['view'])) {
        echo View::forge($content['view'], $view_params + $content['params'], false);
    } else {
        echo is_callable($content) ? $content() : $content;
    }
?>
    </div>
</div>
