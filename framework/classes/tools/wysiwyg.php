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

    /**
     * Parse a wysiwyg content for edition
     *
     * @param  string $content Wysiwyg content to parse
     * @return string Wysiwyg content parsed
     */
    public static function prepare_renderer($content)
    {
        $replaces = array();
        static::parse_medias(
            $content,
            function ($media, $params) use (&$replaces) {
                if ($params['tag'] === 'a') {
                    return;
                }
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

    /**
     * Parse a wysiwyg content
     *
     * @param  string $content Wysiwyg content to parse
     * @return string Wysiwyg content parsed
     */
    public static function parse($content)
    {
        // Parsing enhancers
        // Fetch the available functions
        Config_Data::load('enhancers');

        \Fuel::$profiling && \Profiler::mark('Recherche des fonctions dans la page');

        \Event::trigger_function('front.before_parse_wysiwyg', array(&$content));

        $callback = array('Nos\Tools_Enhancer', 'content');
        static::parseEnhancers(
            $content,
            function ($enhancer, $config, $tag) use (&$content, $callback) {
                $function_content = call_user_func($callback, $enhancer, $config);
                $content = str_replace($tag, $function_content, $content);
            }
        );

        // Parsing medias
        static::parse_medias(
            $content,
            function ($media, $params) use (&$content) {
                if (empty($media)) {
                    if ($params['tag'] == 'img') {
                        // Remove dead images
                        $content = str_replace($params['content'], '', $content);
                    } elseif ($params['tag'] == 'a') {
                        // Remove href for links (they become anchor)?
                        // http://stackoverflow.com/questions/11144653/a-script-links-without-href
                        //$content = str_replace('href="'.$params['url'].'"', '', $content);
                    }
                } else {
                    if ($media->isImage()) {
                        $mediaToolkit = $media->getToolkitImage();
                        if (!empty($params['height'])) {
                            $mediaToolkit = $mediaToolkit->resize($params['width'], $params['height']);
                        }
                        \Event::trigger_function('front.parse_media_toolkit', array(&$mediaToolkit, $params));
                        $media_url = $mediaToolkit->url();
                    } else {
                        if (!empty($params['height'])) {
                            $media_url = $media->urlResized($params['width'], $params['height']);
                        } else {
                            $media_url = $media->url();
                        }
                    }
                    $new_content = preg_replace('`'.preg_quote($params['url'], '`').'(?!\d)`u', Tools_Url::encodePath($media_url), $params['content']);
                    $content = str_replace($params['content'], $new_content, $content);
                }
            }
        );

        // Replace internal links
        preg_match_all('`nos://page/(\d+)`u', $content, $matches);
        if (!empty($matches[0])) {
            $page_ids = array();
            foreach ($matches[1] as $match_id => $page_id) {
                $page_ids[] = $page_id;
            }
            $pages = \Nos\Page\Model_Page::find('all', array('where' => array(array('page_id', 'IN', $page_ids))));
            foreach ($matches[1] as $match_id => $page_id) {
                if (isset($pages[$page_id])) {
                    $content = preg_replace('`'.preg_quote($matches[0][$match_id], '`').'(?!\d)`u', Tools_Url::encodePath($pages[$page_id]->url()), $content);
                } else {
                    $content = str_replace('href="'.$matches[0][$match_id].'"', '', $content);
                }
            }
        }

        if (NOS_ENTRY_POINT === Nos::ENTRY_POINT_FRONT) {
            $content = preg_replace(
                '`href="#([^#"])`iUu',
                'href="'.\Nos\Tools_Url::encodePath(Nos::main_controller()->getUrl()).(!empty($_SERVER['QUERY_STRING']) ? '?'.$_SERVER['QUERY_STRING'] : '').'#\\1',
                $content
            );
        }

        $content = str_replace(
            'href="##',
            'href="#',
            $content
        );

        \Event::trigger_function('front.parse_wysiwyg', array(&$content));

        return $content;
    }

    public static function parseEnhancers($content, $closure)
    {
        preg_match_all('`<(\w+)\s[^>]*data-enhancer=[^>]*>.*?</\\1>`u', $content, $matches);
        foreach ($matches[0] as $enhancer_content) {
            if (preg_match_all('`data-enhancer="([^"]+)"`u', $enhancer_content, $matches2)) {
                $enhancer = $matches2[1][0];
            } elseif (preg_match_all('`data-enhancer=\'([^\']+)\'`u', $enhancer_content, $matches2)) {
                $enhancer = $matches2[1][0];
            }
            if (preg_match_all('`data-config="([^"]+)"`u', $enhancer_content, $matches2)) {
                $config = $matches2[1][0];
            } elseif (preg_match_all('`data-config=\'([^\']+)\'`u', $enhancer_content, $matches2)) {
                $config = $matches2[1][0];
            }

            if (!empty($enhancer) && !empty($config)) {
                $closure($enhancer, $config, $enhancer_content);
            }
        }
    }

    public static function parse_medias(&$content, $closure)
    {
        $media_matches = array();
        $media_ids = array();

        // Find all medias
        $tags = array(
            'a' => 'href',
            'img' => 'src',
        );
        foreach ($tags as $tag => $tag_url) {
            preg_match_all('`<'.$tag.'(?:.+?)'.$tag_url.'="(nos://media/(\d+)(?:/(\d+)/(\d+))?)"(?:.*?)>`u', $content, $matches);
            if (!empty($matches[0])) {
                foreach ($matches[2] as $match_id => $media_id) {
                    $media_ids[] = $media_id;
                    $media_matches[] = array(
                        'id' => $media_id,
                        'content' => $matches[0][$match_id],
                        'tag' => $tag,
                        'url' => $matches[1][$match_id],
                        'width' => \Arr::get($matches[3], $match_id, null),
                        'height' => \Arr::get($matches[4], $match_id, null),
                    );
                }
            }
        }
        if (!empty($media_matches)) {
            $medias = \Nos\Media\Model_Media::find('all', array('where' => array(array('media_id', 'IN', $media_ids))));
            foreach ($media_matches as $media_match) {
                $closureImage = \Arr::get($medias, $media_match['id'], null);
                \Event::trigger_function('front.parse_media', array(&$medias, &$media_match, &$closureImage));

                $closure(
                    $closureImage,
                    $media_match
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
        }

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

        $options['nosenhancer_enhancers'] = $enhancers;

        if (!empty($item)) {
            $item->event('wysiwygOptions', array(&$options));
        }

        return $options;
    }
}
