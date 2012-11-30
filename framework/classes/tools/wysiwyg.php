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

class Tools_Wysiwyg
{
    public static function prepare_renderer($content)
    {
        $replaces = array();
        static::parse_medias(
            $content,
            function($media, $params) use (&$replaces) {
                if (empty($media)) {
                    $replaces[$params['content']] = '';
                } else {
                    if (!empty($params['width']) && !empty($params['height']) && ($params['width'] != $media->media_width || $params['height'] != $media->media_height)) {
                        $replaces[$params['url'].'"'] = \Uri::base(true).$media->get_public_path_resized($params['width'], $params['height']).'" width="'.$params['width'].'" height="'.$params['height'].'" data-media-id="'.$media->id.'"';
                    } else {
                        $replaces[$params['url'].'"'] = \Uri::base(true).$media->get_public_path().'" data-media-id="'.$media->id.'"';
                    }
                }
            }
        );

        return strtr($content, $replaces);
    }

    public static function parse_medias(&$content, $closure)
    {
        // Find all medias
        preg_match_all('`<(img|a)(?:.+?)(?:src|href)="(nos://media/(\d+)(?:/(\d+)/(\d+))?)"(?:.+?)>`u', $content, $matches);
        if (!empty($matches[0])) {
            $media_ids = array();
            foreach ($matches[3] as $match_id => $media_id) {
                $media_ids[] = $media_id;
            }
            $medias = \Nos\Media\Model_Media::find('all', array('where' => array(array('media_id', 'IN', $media_ids))));
            foreach ($matches[3] as $match_id => $media_id) {
                $closure(
                    \Arr::get($medias, $media_id, null),
                    array(
                        'content' => $matches[0][$match_id],
                        'tag' => $matches[1][$match_id],
                        'url' => $matches[2][$match_id],
                        'width' => \Arr::get($matches[4], $match_id, null),
                        'height' => \Arr::get($matches[5], $match_id, null),
                    )
                );
            }
        }
    }
}
