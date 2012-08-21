<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Tools_Wysiwyg {

    public static function prepare_widget($content) {

        preg_match_all('`src="nos://media/(\d+)(?:/(\d+)/(\d+))?"`u', $content, $matches);
        $ids      = array();
        $replaces = array();
        foreach ($matches[1] as $id)
        {
            $ids[] = $id;
        }
        $medias = \Nos\Model_Media::find($ids);
        foreach ($matches[1] as $k => $id)
        {
            $media = \Nos\Model_Media::find($id);
            list($width, $height) = array($matches[2][$k], $matches[3][$k]);
            if ($width && $height && ($width != $media->media_width || $height != $media->media_height))
            {
                $replaces[$matches[0][$k]] = 'src="'.\Uri::base(true).$media->get_public_path_resized($width, $height).'" width="'.$width.'" height="'.$height.'" data-media-id="'.$id.'"';
            }
            else
            {
                $replaces[$matches[0][$k]] = 'src="'.\Uri::base(true).$media->get_public_path().'" data-media-id="'.$id.'"';
            }
        }

        return strtr($content, $replaces);
    }
}