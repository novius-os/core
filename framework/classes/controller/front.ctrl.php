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

use Fuel\Core\Cache;
use Fuel\Core\Config;
use View;

class NotFoundException extends \Exception
{
}

class Controller_Front extends Controller
{
    protected $_url = '';
    protected $_page_url = '';
    protected $_enhancer_url = false;
    protected $_enhanced_url_path = false;
    protected $_context = '';
    protected $_contexts_possibles = array();

    protected $_template;
    protected $_view;

    protected $_is_preview = false;

    protected $_css = array();
    protected $_js_header = array();
    protected $_js_footer = array();

    protected $_base_href = '';
    protected $_context_url = '';
    protected $_title = '';
    protected $_meta_description = '';
    protected $_meta_keywords = '';
    protected $_meta_robots = 'index,follow';
    protected $_metas = array();

    protected $_page;
    protected $_page_id;

    protected $_wysiwyg_name = null;

    protected static $_properties_cached = array('_page', '_context_url', '_page_url', '_url');

    public function router($action, array $params, $status = 200)
    {
        $this->_base_href = \URI::base(false);
        $this->_context_url = \URI::base(false);

        $this->_url = \Input::server('NOS_URL');
        $url = str_replace('.html', '', $this->_url);

        $this->_is_preview = \Input::get('_preview', false);

        $cache_path = (empty($url) ? 'index/' : $url);

        // POST or preview means no cache. Ever.
        // We don't want cache in DEV except if _cache=1
        if (\Input::method() == 'POST' || $this->_is_preview) {
            $no_cache = true;
        } else {
            $no_cache = !\Input::get('_cache', \Config::get('novius-os.cache', true));
        }

        \Event::trigger('front.start');
        \Event::trigger_function('front.start', array(array('url' => &$url, 'cache_path' => &$cache_path)));

        $cache_path = str_replace(array('http://', 'https:://', '/'), array('', '', '_'), rtrim($this->_base_href, '/')).DS.rtrim($cache_path, '/');

        $cache = FrontCache::forge('pages'.DS.$cache_path);

        try {
            if ($no_cache) {
                throw new CacheNotFoundException();
            }

            // Cache exist, retrieve his content
            $content = $cache->execute($this);
        } catch (CacheNotFoundException $e) {
            // Cache not exist, try to found page for this URL

            // Build array of possibles contexts for this absolute URL
            $contexts_possibles = array();
            foreach (Tools_Context::contexts() as $context => $domains) {
                foreach ($domains as $domain) {
                    if (mb_substr(\Uri::base(false).$url.'/', 0, mb_strlen($domain)) === $domain) {
                        $contexts_possibles[$context] = $domain;
                        break;
                    }
                }
            }

            $cache->start();

            // Filter URLs enhanced : remove if not in possibles contexts, remove if url not match
            $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());
            $base_href = $this->_base_href;
            $url_enhanced = array_filter($url_enhanced, function ($page_params) use ($contexts_possibles, $base_href, $url) {
                if (!in_array($page_params['context'], array_keys($contexts_possibles))) {
                    return false;
                }
                $url_absolute = $contexts_possibles[$page_params['context']].$page_params['url'];
                return mb_substr($base_href.$url.'/', 0, mb_strlen($url_absolute)) === $url_absolute;
            });

            // Add current url to URLs enhanced
            $url_enhanced['current'] = array(
                'url' => $url.'/',
            );

            $_404 = true;
            // Loop URLs enhanced for one that not send a NotFoundException
            foreach ($url_enhanced as $page_id => $page_params) {
                $temp_url = $page_params['url'];

                if ($page_id != 'current') {
                    $this->_contexts_possibles = array($page_params['context'] => $contexts_possibles[$page_params['context']]);
                    $this->_page_id = $page_id;

                    if (!in_array($temp_url, array('', '/'))) {
                        $this->_page_url = mb_substr($temp_url, 0, -1).'.html';
                        $this->_enhanced_url_path = $temp_url;
                    } else {
                        $this->_page_url = '';
                        $this->_enhanced_url_path = '';
                    }
                    $this->_enhancer_url = mb_substr(\Uri::base(false).ltrim($url, '/'), mb_strlen($contexts_possibles[$page_params['context']].$temp_url));
                } else {
                    $this->_contexts_possibles = $contexts_possibles;
                    $this->_page_id = null;
                    $this->_page_url = $temp_url;
                }

                $_404 = false;
                try {
                    $this->_generate_cache();
                } catch (NotFoundException $e) {
                    $_404 = true;
                    $this->_page = null;
                    $this->_enhanced_url_path = false;
                    $this->_enhancer_url = false;
                    continue;
                } catch (\Database_Exception $e) {
                    // No database configuration file is found
                    if (!is_file(APPPATH.'config'.DS.'db.config.php')) {
                        // if install.php is there, redirects!
                        if (is_file(DOCROOT.'install.php')) {
                            \Response::redirect($this->_base_href.'install.php');
                        }
                    }

                    echo \View::forge('nos::errors/blank_slate_front', array(
                        'base_url' => $this->_base_href,
                        'error' => 'Database configuration error.',
                        'exception' => $e,
                    ), false);
                    exit();
                } catch (\Exception $e) {
                    // Cannot generate cache: fatal error...
                    //@todo : error page case
                    exit($e->getMessage());
                }

                $content = $this->_view->render();

                $this->_handle_head($content);
                \Event::trigger_function('front.display', array(&$content));

                echo $content;

                $cache->save($no_cache ? -1 : \Config::get('novius-os.cache_duration_page', 5), $this);
                $content = $cache->execute();

                break;
            }

            if ($_404) {
                \Event::trigger('front.404NotFound', array('url' => $this->_page_url));

                // If no redirection then we display 404
                if (!empty($url)) {
                    $_SERVER['NOS_URL'] = '';

                    return $this->router('index', $params, 404);
                } else {
                    // The DB config is there, there's probably no homepage.
                    echo \View::forge('nos::errors/blank_slate_front', array(
                        'base_url' => $this->_base_href,
                    ), false);
                    exit();
                }
            }
        }

        return \Response::forge($content, $status);
    }

    /**
     * @return string
     */
    public function getContextUrl()
    {
        return $this->_context_url;
    }

    /**
     * @return mixed
     */
    public function getPage()
    {
        return $this->_page;
    }

    /**
     * @return mixed
     */
    public function getWysiwygName()
    {
        return $this->_wysiwyg_name;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->_base_href.$this->_url;
    }

    /**
     * @return string
     */
    public function getPageUrl()
    {
        return $this->_page_url;
    }

    /**
     * @return mixed
     */
    public function getEnhancedUrlPath()
    {
        return $this->_enhanced_url_path;
    }

    /**
     * @return mixed
     */
    public function getEnhancerUrl()
    {
        return $this->_enhancer_url;
    }

    /**
     * @param $base_href
     * @return Controller_Front
     */
    public function setBaseHref($base_href)
    {
        $this->_base_href = $base_href;

        return $this;
    }

    /**
     * @param $title
     * @return Controller_Front
     */
    public function setTitle($title, $template = null)
    {
        if (!$template) {
            $template = \Config::get('title_template', null);
            if (!$template) {
                $template = ':title';
            }
        }

        $this->_title = \Str::tr($template, array('title' => $title));

        return $this;
    }

    /**
     * @param $meta_description
     * @return Controller_Front
     */
    public function setMetaDescription($meta_description)
    {
        $this->_meta_description = $meta_description;

        return $this;
    }

    /**
     * @param $meta_keywords
     * @return Controller_Front
     */
    public function setMetaKeywords($meta_keywords)
    {
        $this->_meta_keywords = $meta_keywords;

        return $this;
    }

    /**
     * @param $meta_robots
     * @return Controller_Front
     */
    public function setMetaRobots($meta_robots)
    {
        $this->_meta_robots = $meta_robots;

        return $this;
    }

    /**
     * @param $meta
     * @return Controller_Front
     */
    public function addMeta($meta)
    {
        $this->_metas[] = $meta;

        return $this;
    }

    /**
     * @param $url
     * @param  bool             $footer
     * @return Controller_Front
     */
    public function addJavascript($url, $footer = true)
    {
        if ($footer) {
            $this->_js_footer[] = $url;
        } else {
            $this->_js_header[] = $url;
        }

        return $this;
    }

    /**
     * @param $js
     * @param  bool             $footer
     * @return Controller_Front
     */
    public function addJavascriptInline($js, $footer = true)
    {
        return $this->addJavascript(array('js' => $js, 'inline' => true), $footer);
    }

    /**
     * @param $url
     * @return Controller_Front
     */
    public function addCss($url)
    {
        $this->_css[] = $url;

        return $this;
    }

    /**
     * @param $css
     * @return Controller_Front
     */
    public function addCssInline($css)
    {
        return $this->addCss(array('css' => $css, 'inline' => true));
    }

    /**
     * @return bool
     */
    public function isPreview()
    {
        return $this->_is_preview;
    }

    protected function _handle_head(&$content)
    {
        $replaces  = array(
            '_base_href'         => array(
                'pattern' => '<base [^>]*\/?>',
                'replace' => '<base href="replace" />',
            ),
            '_title'        => array(
                'pattern' => '<title>[^<]*<\/title>',
                'replace' => '<title>replace</title>',
            ),
            '_meta_description'  => array(
                'pattern' => '<meta [^>]*name=\"?description[^>]*\"? *\/?>',
                'replace' => '<meta name="description" content="replace">',
            ),
            '_meta_keywords'     => array(
                'pattern' => '<meta [^>]*name=\"?keywords[^>]*\"? *\/?>',
                'replace' => '<meta name="keywords" content="replace">',
            ),
            '_meta_robots'       => array(
                'pattern' => '<meta [^>]*name=\"?robots[^>]*\"? *\/?>',
                'replace' => '<meta name="robots" content="replace">',
            ),
        );

        $replace_fct = function($pattern, $replace) use (&$content) {
            $content_old = $content;
            $content = preg_replace(
                '`'.$pattern.'`iUu',
                $replace,
                $content,
                -1,
                $count
            );
            // if $content content none utf8 characters, preg_replace return empty string
            if (empty($content) && !empty($content_old)) {
                $content = preg_replace(
                    '`'.$pattern.'`iU',
                    $replace,
                    $content_old,
                    -1,
                    $count
                );
            }

            return $count;
        };

        $begin_head = '';
        foreach ($replaces as $prop => $replace) {
            if (!empty($this->{$prop})) {
                $count = $replace_fct($replace['pattern'], str_replace('replace', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']));
                if (!$count) {
                    $begin_head .= "\n".str_replace('replace', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']);
                }
            }
        }
        if ($begin_head) {
            $replace_fct('<head>', '<head>'.$begin_head."\n");
        }

        $head = array();
        foreach ($this->_metas as $metas) {
            $head[] = $metas;
        }
        $this->_css = array_unique($this->_css, SORT_REGULAR);
        foreach ($this->_css as $css) {
            if (is_array($css) && isset($css['inline']) && $css['inline'] && isset($css['css'])) {
                $head[] = '<style type="text/css">'.$css['css'].'</style>';
            } elseif (is_string($css) || (is_array($css) && isset($css['css']))) {
                $head[] = '<link href="'.(is_string($css) ? $css : $css['css']).'" rel="stylesheet" type="text/css">';
            }
        }
        $this->_js_header = array_unique($this->_js_header, SORT_REGULAR);
        foreach ($this->_js_header as $js) {
            if (is_array($js) && isset($js['inline']) && $js['inline'] && isset($js['js'])) {
                $head[] = '<script type="text/javascript">'.$js['js'].'</script>';
            } elseif (is_string($js) || (is_array($js) && isset($js['js']))) {
                $head[] = '<script src="'.(is_string($js) ? $js : $js['js']).'" type="text/javascript"></script>';
            }
        }
        if (count($head)) {
            $replace_fct('</head>', implode("\n", $head)."\n</head>");
        }

        $footer = array();
        $this->_js_footer = array_unique($this->_js_footer, SORT_REGULAR);
        foreach ($this->_js_footer as $js) {
            if (is_array($js) && isset($js['inline']) && $js['inline'] && isset($js['js'])) {
                $footer[] = \Str::sub($js['js'], 0, 8) === '<script ' ? $js['js'] : '<script type="text/javascript">'.$js['js'].'</script>';
            } elseif (is_string($js) || (is_array($js) && isset($js['js']))) {
                $js = is_string($js) ? $js : $js['js'];
                if (in_array($js, $this->_js_header)) {
                    continue;
                }
                $footer[] = '<script src="'.$js.'" type="text/javascript"></script>';
            }
        }
        if (count($footer)) {
            $replace_fct('</body>', implode("\n", $footer)."\n</body>");
        }
    }

    /**
     * Generate the cache. Renders all wysiwyg and assign them to the view.
     */
    protected function _generate_cache()
    {
        $this->_find_page();
        $this->_find_template();

        \Fuel::$profiling && \Profiler::console('page_id = ' . $this->_page->page_id);

        if ($this->_page->page_meta_noindex) {
            $this->setTitle($this->_page->page_title);
            $this->setMetaRobots('noindex');
        } else {
            $this->setTitle(!empty($this->_page->page_meta_title) ? $this->_page->page_meta_title : $this->_page->page_title);
            $this->setMetaDescription($this->_page->page_meta_description);
            $this->setMetaKeywords($this->_page->page_meta_keywords);
        }

        $wysiwyg = array();

        // Scan all wysiwyg
        foreach ($this->_template['layout'] as $wysiwyg_name => $layout) {
            $this->_wysiwyg_name = $wysiwyg_name;
            $wysiwyg[$wysiwyg_name] = Nos::parse_wysiwyg($this->_page->wysiwygs->{$wysiwyg_name});
        }
        $this->_wysiwyg_name = null;

        $this->_view->set('wysiwyg', $wysiwyg, false);
        $this->_view->set('title', $this->_page->page_title, false);
        $this->_view->set('page', $this->_page, false);
        $this->_view->set('main_controller', $this, false);
    }

    /**
     * Find the page in the database and fill in the page variable.
     */
    protected function _find_page()
    {
        if (!empty($this->_page_id)) {
            $where = array(array('page_id', $this->_page_id));
            if (!$this->_is_preview) {
                $where[] = array('published', 1);
            }

            $page = Page\Model_Page::find('first', array(
                    'where' => $where,
                ));

            if (!empty($page)) {
                $this->_page = $page;
            }
        } else {
            foreach ($this->_contexts_possibles as $context => $domain) {
                $url = mb_substr(\Uri::base(false).$this->_page_url, mb_strlen($domain));

                if (!in_array($url, array('', '/'))) {
                    $url = mb_substr($url, 0, -1).'.html';
                } else {
                    $url = '';
                }

                $where = array(array('page_context', $context));
                if (!$this->_is_preview) {
                    $where[] = array('published', 1);
                }
                if (empty($url)) {
                    $where[] = array('page_entrance', 1);
                } else {
                    $where[] = array('page_virtual_url', $url);
                }

                $page = \Nos\Page\Model_Page::find('first', array(
                    'where' => $where,
                ));

                if (!empty($page)) {
                    $this->_page = $page;
                    $this->_page_url = $url;
                    if ($page->page_entrance && !empty($url)) {
                        \Response::redirect($domain, 'location', 301);
                        exit();
                    }
                    break;
                }
            }
        }

        if (empty($this->_page)) {
            // Blank slate also needs the base_href to display a 404 from a sub-folder
            $this->setBaseHref($domain);
            throw new NotFoundException('The requested page was not found.');
        }

        if ($this->_page->page_type == \Nos\Page\Model_Page::TYPE_EXTERNAL_LINK) {
            \Response::redirect($this->_page->page_external_link, 'location', 301);
            exit();
        }

        $this->_context = $this->_page->get_context();
        $this->_context_url = $this->_contexts_possibles[$this->_context];
        \Nos\I18n::setLocale(\Nos\Tools_Context::localeCode($this->_page->get_context()));
    }

    protected function _find_template()
    {
        // Find the template
        $templates = \Nos\Config_Data::get('templates', array());

        if (!isset($templates[$this->_page->page_template])) {
            throw new \Exception('The template '.$this->_page->page_template.' is not configured.');
        }

        $this->_template = $templates[$this->_page->page_template];
        if (empty($this->_template['file'])) {
            throw new \Exception('The template file for '. ($this->_template['title'] ?: $this->_page->page_template ).' is not defined.');
        }

        try {
            // Try normal loading
            $this->_view = View::forge($this->_template['file']);
        } catch (\FuelException $e) {

            $template_file = \Finder::search('views', $this->_template['file']);

            if (!is_file($template_file)) {
                throw new \Exception('The template '.$this->_template['file'].' cannot be found.');
            }
            $this->_view = View::forge($template_file);
        }
    }

    public function save_cache()
    {
        foreach (static::$_properties_cached as $property) {
            $this->cache[$property] = $this->{$property};
        }

        return $this->cache;
    }

    public function rebuild_cache($cache)
    {
        foreach (static::$_properties_cached as $property) {
            if (isset($cache[$property])) {
                $this->{$property} = $cache[$property];
                unset($cache[$property]);
            }
        }
    }
}
