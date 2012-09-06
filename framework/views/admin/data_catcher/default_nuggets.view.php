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
<table class="fieldset">
<?php
    if (isset($nugget[\Nos\DataCatcher::TYPE_TITLE])) {
        echo '<tr><th><label>', htmlspecialchars(__('Name:')) ,'</label></th>';
        echo '<td>', htmlspecialchars($nugget[\Nos\DataCatcher::TYPE_TITLE]) ,'</td></tr>';
    }
    if (isset($nugget[\Nos\DataCatcher::TYPE_URL])) {
        echo '<tr><th><label>', htmlspecialchars(__('Url:')) ,'</label></th>';
        echo '<td>', htmlspecialchars($nugget[\Nos\DataCatcher::TYPE_URL]) ,'</td></tr>';
    }
    if (isset($nugget[\Nos\DataCatcher::TYPE_IMAGE])) {
        echo '<tr><th><label>', htmlspecialchars(__('Image:')) ,'</label></th>';
        echo '<td>', Nos\Model_Media::find($nugget[\Nos\DataCatcher::TYPE_IMAGE])->get_img_tag(array('max_width' => '200', 'max_height' => '300')) ,'</td></tr>';
    }
    if (isset($nugget[\Nos\DataCatcher::TYPE_TEXT])) {
        echo '<tr><th><label>', htmlspecialchars(__('Description:')) ,'</label></th>';
        echo '<td>', htmlspecialchars($nugget[\Nos\DataCatcher::TYPE_TEXT]) ,'</td></tr>';
    }
?>
</table>
<div class="nos-datacatchers-buttons">
    <button><?= htmlspecialchars(__('Customise')) ?></button>
</div>
