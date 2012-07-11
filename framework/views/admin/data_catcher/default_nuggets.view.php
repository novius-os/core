<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */
    if (isset($default_nuggets[\Nos\DataCatcher::TYPE_TITLE])) {
        echo '<label>', htmlspecialchars(__('Name:')) ,'</label>';
        echo '<div>', htmlspecialchars($default_nuggets[\Nos\DataCatcher::TYPE_TITLE]) ,'</div>';
    }
    if (isset($default_nuggets[\Nos\DataCatcher::TYPE_URL])) {
        echo '<label>', htmlspecialchars(__('Url:')) ,'</label>';
        echo '<div>', htmlspecialchars($default_nuggets[\Nos\DataCatcher::TYPE_URL]) ,'</div>';
    }
    if (isset($default_nuggets[\Nos\DataCatcher::TYPE_IMAGE])) {
        echo '<label>', htmlspecialchars(__('Image:')) ,'</label>';
        echo '<div>', Nos\Model_Media::find($default_nuggets[\Nos\DataCatcher::TYPE_IMAGE])->get_img_tag(array('max_width' => '200', 'max_height' => '300')) ,'</div>';
    }
?>
<button><?= htmlspecialchars(__('Customize')) ?></button>
