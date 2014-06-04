<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

use Nos\Media\Model_Media;

class Menu_Item_Media extends Menu_Item_Driver
{

    /**
     * @return string The item title
     */
    public function title()
    {
        if (!empty($this->item->mitem_title)) {
            return parent::title();
        }

        if ($this->item->mitem_media_id) {
            $media = Model_Media::find($this->item->mitem_media_id);
            if (!empty($media)) {
                return $media->media_title;
            }
        }
        return '';
    }
}
