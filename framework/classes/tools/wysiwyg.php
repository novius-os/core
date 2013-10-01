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
    protected static $_options = array();

    public static function _init()
    {
        \Config::load('wysiwyg', true);
        static::$_options = \Config::get('wysiwyg.default');
    }

    public static function prepare_renderer($content)
    {
        $replaces = array();
        static::parse_medias(
            $content,
            function ($media, $params) use (&$replaces) {
                if (empty($media)) {
                    $replaces[$params['content']] = '';
                } else {
                    if (!empty($params['width']) && !empty($params['height']) && ($params['width'] != $media->media_width || $params['height'] != $media->media_height)) {
                        $replaces[$params['url'].'"'] = Tools_Url::encodePath($media->urlResized($params['width'], $params['height'])).'" width="'.$params['width'].'" height="'.$params['height'].'" data-media-id="'.$media->id.'"';
                    } else {
                        $replaces[$params['url'].'"'] = Tools_Url::encodePath($media->url()).'" data-media-id="'.$media->id.'"';
                    }
                }
            }
        );

        return strtr($content, $replaces);
    }

    public static function parse_medias(&$content, $closure)
    {
        // Find all medias
        preg_match_all('`<(img|a)(?:.+?)(?:src|href)="(nos://media/(\d+)(?:/(\d+)/(\d+))?)"(?:.*?)>`u', $content, $matches);
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

    /**
     * Return an array of options for the initialisation of wysiwyg
     *
     * @param mixed $options Can be a string (the name of the default setup) or an array of options to merge with.
     * @param Orm\Model $item Model instance of the container of the wysiwyg
     * @param bool $urlEnhancers If true, the wysiwyg will accept URL enhancers in applications selector.
     * @return array Options for wysiwyg
     */
    public static function jsOptions($options = null, Orm\Model $item = null, $urlEnhancers = false)
    {
        empty($options) and $options = \Config::get('wysiwyg.active_setup', 'default');
        is_string($options) and $options = \Config::get('wysiwyg.setups.'.$options, array());

        $options = array_merge(static::$_options, $options);

        if (!empty($item)) {
            $model = get_class($item);
            $pk = \Arr::get($model::primary_key(), 0);
            $options['container'] = array(
                'model' => $model,
                'id' => $item->{$pk},
            );

            $enhancers = Config_Data::get('enhancers', array());

            if (!$urlEnhancers) {
                $enhancers = array_filter($enhancers, function ($enhancer) {
                    return empty($enhancer['urlEnhancer']);
                });
            }

            foreach ($enhancers as $key => $enhancer) {
                if (empty($enhancer['iconUrl']) && !empty($enhancer['application'])) {
                    $enhancers[$key]['iconUrl'] = \Config::icon($enhancer['application'], 16);
                }
                if (!empty($enhancer['valid_container']) && is_callable($enhancer['valid_container']) &&
                    call_user_func($enhancer['valid_container'], $enhancer, $item) === false) {

                    unset($enhancers[$key]);
                }
            }

            $options['theme_nos_enhancers'] = $enhancers;

            $item->event('wysiwygOptions', array(&$options));
        }

        return $options;
    }
}
