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

class FrontIgnoreTemplateException extends \Exception
{
}

class Controller_Front extends Controller
{
    protected $_url = '';
    protected $_extension = '';
    protected $_page_url = '';
    protected $_enhancer_url = false;
    protected $_enhanced_url_path = false;
    protected $_context = '';
    protected $_contexts_possibles = array();

    protected $_template;
    protected $_view;
    protected $_content;

    protected $_is_preview = false;

    protected $_css = array();
    protected $_js_header = array();
    protected $_js_footer = array();

    protected $_base_href = '';
    protected $_context_url = '';
    protected $_title = '';
    protected $h1 = '';
    protected $_meta_description = '';
    protected $_meta_keywords = '';
    protected $_meta_robots = 'index,follow';
    protected $_metas = array();

    protected $_page;
    protected $_page_id;
    protected $item_displayed;

    protected $_wysiwyg_name = null;

    protected $_cache;
    protected $_use_cache = true;
    protected $_cache_duration = 60;
    protected $_custom_data = array();
    protected $_status = 200;
    protected $_headers = array();

    protected $_custom_data_cached = array();
    protected static $_properties_cached = array('_page', '_context', '_context_url', '_page_url', '_url', '_status', '_headers');

    protected $pageFoundAlreadyTriggered = false;

    public static function _init() {
        /**
         * For pages that use the default cache duration, we need to invalidate the cache if the current default cache duration is smaller.
         * For pages that use a custom cache duration, the cache is invalidated anyway when saving the page
         */
        \Event::register('front.cache.checkExpires', function($params) {
            $cache_params = \Arr::get($params, 'cache_params', array());
            // Only for pages that use the default cache duration
            if (!empty($cache_params['page_id']) && empty($cache_params['page_cache_duration'])) {
                // Checks if the cache duration is greater than the current default cache duration
                if (\Arr::get($params, 'cache_duration') > \Nos\FrontCache::$cache_duration) {
                    // Invalidates the cache
                    throw new CacheExpiredException();
                }
            }
        });
    }

    public function before()
    {
        parent::before();
        $this->_cache_duration = \Config::get('novius-os.cache_duration_page', FrontCache::$cache_duration);
    }

    public function router($action, $params, $status = 200)
    {
        $this->_status = $status;

        $this->_base_href = \URI::base(false);
        $this->_context_url = \URI::base(false);

        $this->_url = \Input::server('NOS_URL');
        $this->_extension = pathinfo($this->_url, PATHINFO_EXTENSION);
        $url = $this->_url;
        if (!empty($this->_extension)) {
            $url = \Str::sub($url, 0, - strlen($this->_extension) - 1);
        }

        // Why Session::get() instead of Auth::check()? See https://github.com/novius-os/core/pull/52#issuecomment-21237309
        $this->_is_preview = \Input::get('_preview', false) && \Session::get('logged_user_id', false);

        $cache_path = (empty($this->_url) ? 'index/' : $this->_url);
        if ($status == 404) {
            $cache_path = '404.error/'.$cache_path;
        }

        // POST or preview means no cache. Ever.
        // We don't want cache in DEV except if _cache=1
        if ($this->_is_preview || \Input::method() == 'POST') {
            $this->_use_cache = false;
        } else {
            $this->_use_cache = \Input::get('_cache', \Config::get('novius-os.cache', true));
        }

        \Event::trigger('front.start');

        \Event::trigger_function('front.start', array(array('url' => &$url, 'cache_path' => &$cache_path)));

        $cache_path = \Nos\FrontCache::getPathFromUrl($this->_base_href, $cache_path);
        $this->_cache = FrontCache::forge($cache_path);
        \Nos\FrontCache::$cache_duration = $this->_cache_duration;

        try {
            if (!$this->_use_cache) {
                throw new CacheNotFoundException();
            }

            // Cache exist, retrieve his content
            $this->_content = $this->_cache->execute($this);
        } catch (CacheNotFoundException $e) {
            // Cache not exist, try to found page for this URL

            // Build array of possibles contexts for this absolute URL
            $contexts_possibles = array();
            try {
                foreach (Tools_Context::contexts() as $context => $domains) {
                    foreach ($domains as $domain) {
                        if (mb_substr(\Uri::base(false).$url.'/', 0, mb_strlen($domain)) === $domain) {
                            $contexts_possibles[$context] = $domain;
                            break;
                        }
                    }
                }
            } catch (\RuntimeException $e) {
                if (!is_file(APPPATH.'config'.DS.'contexts.config.php')) {
                    // if install.php is there, redirects!
                    if (is_file(DOCROOT.'htdocs'.DS.'install.php')) {
                        \Response::redirect($this->_base_href.'install.php');
                    }
                }

                echo \View::forge('nos::errors/blank_slate_front', array(
                    'base_url' => $this->_base_href,
                    'error' => 'Context configuration error.',
                    'exception' => $e,
                ), false);
                exit();
            }

            $this->_cache->start();

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
                    $this->_cache->reset();
                    $this->_findPage();

                    if (!$this->pageFoundAlreadyTriggered) {
                        \Event::trigger('front.pageFound', array('page' => $this->getPage()));
                        $this->pageFoundAlreadyTriggered = true;
                    }

                    $this->_generateCache();

                    $this->_content = $this->_view->render();

                    $this->_handleHead();

                    \Event::trigger_function('front.display', array(&$this->_content));
                    echo $this->_content;

                    $this->_cache->save(!$this->_use_cache ? -1 : $this->_cache_duration, $this);
                    $this->_content = $this->_cache->execute();

                    break;
                } catch (FrontIgnoreTemplateException $e) {
                    echo $this->_content;

                    $this->_cache->save(!$this->_use_cache ? -1 : $this->_cache_duration, $this);
                    $this->_content = $this->_cache->execute();

                    break;
                } catch (NotFoundException $e) {
                    $_404 = true;
                    $this->setPage();
                    $this->_enhanced_url_path = false;
                    $this->_enhancer_url = false;
                    continue;
                } catch (\Database_Exception $e) {
                    // No database configuration file is found
                    if (!is_file(APPPATH.'config'.DS.'db.config.php')) {
                        // if install.php is there, redirects!
                        if (is_file(DOCROOT.'htdocs'.DS.'install.php')) {
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
            }

            if ($_404) {
                \Event::trigger('front.404NotFound', array('url' => rtrim($this->_page_url, '/')));

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

        if ($this->_is_preview) {
            $this->setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            $this->setHeader('Pragma', 'no-cache');
            $this->setHeader('Expires', '0');
        }

        \Event::trigger_function('front.response', array(array('content' => &$this->_content, 'status' => &$this->_status, 'headers' => &$this->_headers)));

        return \Response::forge($this->_content, $this->_status, $this->_headers);
    }

    /**
     * @return string The current context
     */
    public function getContext()
    {
        return $this->_context;
    }

    /**
     * @return string Absolute URL of the current context
     */
    public function getContextUrl()
    {
        return $this->_context_url;
    }

    /**
     * @return \Nos\Page\Model_Page Current Model_Page displayed.
     */
    public function getPage()
    {
        return $this->_page;
    }

    protected function setPage(Page\Model_Page $page = null)
    {
        $this->_page = $page;
        if (!empty($this->_page)) {

            if ($this->_page->page_meta_noindex) {
                $replaces = array();
                $this->setMetaRobots('noindex');
            } else {
                $replaces = array(
                   'title' => !empty($this->_page->page_meta_title) ? $this->_page->page_meta_title : $this->_page->page_title,
                   'meta_description' => $this->_page->page_meta_description,
                   'meta_keywords' => $this->_page->page_meta_keywords,
                );
            }
            $this->setItemDisplayed($this->_page, $replaces);

            $this->_context = $this->_page->get_context();
            $this->_context_url = $this->_contexts_possibles[$this->_context];
            I18n::setLocale(Tools_Context::localeCode($this->_context));

            \Fuel::$profiling && \Profiler::console('page_id = ' . $this->_page->page_id);

            // Sets the page ID as cache param
            $this->_cache->setCacheParam('page_id', $this->_page->page_id);

            // Sets the page's custom cache duration
            if (!empty($this->_page->page_cache_duration)) {
                $this->_cache_duration = $this->_page->page_cache_duration;
                \Nos\FrontCache::$cache_duration = $this->_cache_duration;
                $this->_cache->setCacheParam('page_cache_duration', true);
            }
        }

        return $this;
    }

    /**
     * @return \Nos\Template\Variation\Model_Template_Variation Current Model_Template_Variation displayed.
     */
    public function getTemplateVariation()
    {
        return $this->_page->template_variation;
    }

    /**
     * @return mixed Current wysiwyg ID processed.
     */
    public function getWysiwygName()
    {
        return $this->_wysiwyg_name;
    }

    /**
     * @return string Current absolute URL.
     */
    public function getUrl()
    {
        return $this->_base_href.$this->_url;
    }

    /**
     * @return string Relative (to getContextUrl()) URL of the current page.
     */
    public function getPageUrl()
    {
        return $this->_page_url;
    }

    /**
     * @return mixed Relative (to getContextUrl()) URL of the current URL enhancer. False if no current URL enhancer.
     */
    public function getEnhancedUrlPath()
    {
        return $this->_enhanced_url_path;
    }

    /**
     * @return mixed Part of the URL processed by the URL enhancer. False if no current URL enhancer.
     */
    public function getEnhancerUrl()
    {
        return $this->_enhancer_url;
    }

    /**
     * @return \Nos\Orm\Model Current Model instance displayed.
     */
    public function getItemDisplayed()
    {
        return $this->item_displayed;
    }

    /**
     * @param Orm\Model $item The current Model instance displayed.
     * @param array $properties Array of properties
     * @param array $templates Array of templates use to set properties
     * @return Controller_Front
     */
    public function setItemDisplayed(Orm\Model $item, array $properties = array(), array $templates = array())
    {
        $this->item_displayed = $item;

        $title_item = \Arr::get($properties, 'title_item', $item->title_item());
        $properties = array_merge(array(
            'title' => $title_item,
            'h1' => $title_item,
        ), $properties);

        $this->setTitle(\Arr::get($properties, 'title'), \Arr::get($templates, 'title', null));
        $this->setH1(\Arr::get($properties, 'h1'), \Arr::get($templates, 'h1', null));

        $value = \Arr::get($properties, 'meta_description', null);
        !empty($value) && $this->setMetaDescription($value, \Arr::get($templates, 'meta_description', null));

        $value = \Arr::get($properties, 'meta_keywords', null);
        !empty($value) && $this->setMetaKeywords($value, \Arr::get($templates, 'meta_keywords', null));

        \Event::trigger('front.setItemDisplayed', array(
            'item' => $item,
            'properties' => $properties,
            'templates' => $templates
        ));

        return $this;
    }

    /**
     * Sets a new <base href=""> for the current HTML output.
     *
     * @param string $base_href The new <base href="">.
     * @return Controller_Front
     */
    public function setBaseHref($base_href)
    {
        $this->_base_href = $base_href;

        return $this;
    }

    /**
     * Set a new title for the current HTML.
     *
     * @param string    $title      The new title.
     * @param string    $template   If set, use it to calculate the title. Placeholder :title will be replaced by $title and :page_title by the page title.
     * @return Controller_Front
     */
    public function setTitle($title, $template = null)
    {
        if (!$template) {
            $template = \Config::get('title_template', ':title');
        }

        $this->_title = \Str::tr($template, array('title' => $title, 'page_title' => $this->_page->page_title));

        return $this;
    }

    /**
     * Set a new h1 for the current HTML.
     *
     * @param string $h1        The new h1.
     * @param string $template  If set, use it to calculate the title. Placeholder :h1 will be replaced by $h1.
     * @return Controller_Front
     */
    public function setH1($h1, $template = null)
    {
        if (!$template) {
            $template = ':h1';
        }

        $this->h1 = \Str::tr($template, array('h1' => $h1));

        return $this;
    }

    /**
     * Set a meta description for the current HTML output.
     *
     * @param string $meta_description The new meta description.
     * @param string $template         If set, use it to calculate the meta description. Placeholder :meta_description will be replaced by $meta_description and :page_meta_description by the page meta description.
     * @return Controller_Front
     */
    public function setMetaDescription($meta_description, $template = null)
    {
        if (!$template) {
            $template = \Config::get('meta_description_template', ':meta_description');
        }

        $this->_meta_description = \Str::tr($template, array(
            'meta_description' => $meta_description,
            'page_meta_description' => $this->_page->page_meta_description,
        ));

        return $this;
    }

    /**
     * Set a meta keywords for the current HTML output.
     *
     * @param string $meta_keywords The new meta keywords.
     * @param string $template      If set, use it to calculate the meta description. Placeholder :meta_description will be replaced by $meta_description and :page_meta_description by the page meta description.
     * @return Controller_Front
     */
    public function setMetaKeywords($meta_keywords, $template = null)
    {
        if (!$template) {
            $template = \Config::get('meta_keywords_template', ':meta_keywords');
        }

        $this->_meta_keywords = \Str::tr($template, array(
            'meta_keywords' => $meta_keywords,
            'page_meta_keywords' => $this->_page->page_meta_keywords,
        ));

        return $this;
    }

    /**
     * Set a meta robots for the current HTML output.
     *
     * @param string $meta_robots The new meta robots.
     * @return Controller_Front
     */
    public function setMetaRobots($meta_robots)
    {
        $this->_meta_robots = $meta_robots;

        return $this;
    }

    /**
     * Add a HTML meta tag in the current HTML output.
     *
     * @param string $meta A HTML meta tag.
     * @return Controller_Front
     */
    public function addMeta($meta)
    {
        $this->_metas[] = $meta;

        return $this;
    }

    /**
     * Add a JavaScript library in the current HTML output.
     *
     * @param string    $url    URL of a JavaScript library.
     * @param boolean   $footer If true, add script at the end of HTML output. If false, add in the <head>.
     * @return Controller_Front
     */
    public function addJavascript($url, $footer = true)
    {
        if (is_string($url) || (is_array($url) && isset($url['js']))) {
            $lib_url = is_string($url) ? $url : $url['js'];
            if (in_array($lib_url, $footer ? $this->_js_footer : $this->_js_header)) {
                return $this;
            }
        }

        if ($footer) {
            $this->_js_footer[] = $url;
        } else {
            $this->_js_header[] = $url;
        }

        return $this;
    }

    /**
     * Add JavaScript code in the current HTML output.
     *
     * @param string    $js     Javascript code
     * @param boolean   $footer If true, add at the end of HTML output. If false, add in the <head>.
     * @return Controller_Front
     */
    public function addJavascriptInline($js, $footer = true)
    {
        return $this->addJavascript(array('js' => $js, 'inline' => true), $footer);
    }

    /**
     * Add a CSS file in the current HTML output.
     *
     * @param string $url URL of a CSS file.
     * @return Controller_Front
     */
    public function addCss($url)
    {
        if (is_string($url) || (is_array($url) && isset($url['css']))) {
            $lib_url = is_string($url) ? $url : $url['css'];
            if (in_array($lib_url, $this->_css)) {
                return $this;
            }
        }

        $this->_css[] = $url;

        return $this;
    }

    /**
     * Add CSS code in the current HTML output.
     *
     * @param string $css CSS code.
     * @return Controller_Front
     */
    public function addCssInline($css)
    {
        return $this->addCss(array('css' => $css, 'inline' => true));
    }

    /**
     * @return boolean True if current page is requested in the preview mode.
     */
    public function isPreview()
    {
        return $this->_is_preview;
    }

    protected function _handleHead()
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

        $content = $this->_content;
        $replace_fct = function ($pattern, $replace) use (&$content) {
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
        foreach ($this->_css as $css) {
            if (is_array($css) && isset($css['inline']) && $css['inline'] && isset($css['css'])) {
                $head[] = '<style type="text/css">'.$css['css'].'</style>';
            } elseif (is_string($css) || (is_array($css) && isset($css['css']))) {
                $head[] = '<link href="'.(is_string($css) ? $css : $css['css']).'" rel="stylesheet" type="text/css">';
            }
        }
        foreach ($this->_js_header as $js) {
            if (is_array($js) && isset($js['inline']) && $js['inline'] && isset($js['js'])) {
                $head[] = \Str::starts_with($js['js'], '<script ') || \Str::starts_with($js['js'], '<script>')?
                    $js['js'] :
                    '<script type="text/javascript">'.$js['js'].'</script>';
            } elseif (is_string($js) || (is_array($js) && isset($js['js']))) {
                $head[] = '<script src="'.(is_string($js) ? $js : $js['js']).'" type="text/javascript"></script>';
            }
        }
        if (count($head)) {
            $replace_fct('</head>', implode("\n", $head)."\n</head>");
        }

        $footer = array();
        foreach ($this->_js_footer as $js) {
            if (is_array($js) && isset($js['inline']) && $js['inline'] && isset($js['js'])) {
                $footer[] = \Str::starts_with($js['js'], '<script ') || \Str::starts_with($js['js'], '<script>') ?
                    $js['js'] :
                    '<script type="text/javascript">'.$js['js'].'</script>';
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
        $this->_content = $content;
    }

    /**
     * Generate the cache. Renders all wysiwyg and assign them to the view.
     */
    protected function _generateCache()
    {
        $this->_findTemplate();

        $wysiwyg = array();

        // Scan all wysiwyg
        foreach ($this->_template['layout'] as $wysiwyg_name => $layout) {
            $this->_wysiwyg_name = $wysiwyg_name;
            $wysiwyg[$wysiwyg_name] = Tools_Wysiwyg::parse($this->_page->wysiwygs->{$wysiwyg_name});
        }
        $this->_wysiwyg_name = null;

        $this->_view->set('wysiwyg', $wysiwyg, false);
        $this->_view->set('title', $this->h1, false);
        $this->_view->set('page', $this->_page, false);
        $this->_view->set('main_controller', $this, false);
    }

    /**
     * Find the page in the database and fill in the page variable.
     */
    protected function _findPage()
    {
        if (!empty($this->_page_id)) {
            $where = array(array('page_id', $this->_page_id));
            if (!$this->_is_preview) {
                $where[] = array('published', 1);
            }

            $page = Page\Model_Page::find('first', array(
                    'where' => $where,
                    'related' => ('template_variation'),
                ));
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
                    'related' => array('template_variation' => array('related' => 'linked_menus')),
                ));

                if (!empty($page)) {
                    if ($page->page_entrance && !empty($url)) {
                        \Response::redirect($domain, 'location', 301);
                        exit();
                    }

                    $this->_page_url = $url;
                    break;
                }
            }
        }

        if (empty($page)) {
            throw new NotFoundException('The requested page was not found.');
        }

        if ($page->page_type == \Nos\Page\Model_Page::TYPE_EXTERNAL_LINK) {
            \Response::redirect($page->page_external_link, 'location', 301);
            exit();
        }

        $this->setPage($page);
    }

    protected function _findTemplate()
    {
        if (!isset($this->_page->template_variation)) {
            throw new \Exception('This page have no template variation configured.');
        }

        $this->_template = $this->_page->template_variation->configCompiled();
        if (empty($this->_template['file'])) {
            throw new \Exception(
                'The template file for '.
                (\Arr::get($this->_template, 'title') ?: $this->_page->template_variation->tpvar_template ).' is not defined.'
            );
        }

        try {
            $this->_view = View::forge($this->_template['file']);
        } catch (\FuelException $e) {
            throw new \Exception('The template '.$this->_template['file'].' cannot be found.');
        }
    }

    public function getCache()
    {
        $cache = array();
        foreach (static::$_properties_cached as $property) {
            $cache[$property] = $this->{$property};
        }

        $cache['_custom_data'] = array();
        foreach ($this->_custom_data_cached as $property) {
            \Arr::set($cache['_custom_data'], $property, \Arr::get($this->_custom_data, $property, null));
        }

        return $cache;
    }

    public function rebuildCache($cache)
    {
        $_properties_cached = static::$_properties_cached + array('_custom_data');
        foreach ($_properties_cached as $property) {
            if (isset($cache[$property])) {
                $this->{$property} = $cache[$property];
                unset($cache[$property]);
            }
        }

        I18n::setLocale(Tools_Context::localeCode($this->_context));

        if (!$this->pageFoundAlreadyTriggered) {
            \Event::trigger('front.pageFound', array('page' => $this->getPage()));
            $this->pageFoundAlreadyTriggered = true;
        }
    }

    /**
     * Disable caching and cache retrieve of the current page.
     *
     * @return Controller_Front
     */
    public function disableCaching()
    {
        $this->_use_cache = false;

        return $this;
    }

    /**
     * Set the cache duration of the current cache.
     *
     * @param int $cache_duration The new cache duration
     * @return Controller_Front
     */
    public function setCacheDuration($cache_duration)
    {
        $this->_cache_duration = $cache_duration;
        \Nos\FrontCache::$cache_duration = $this->_cache_duration;

        return $this;
    }

    /**
     * Set a new response status of the current response. This status will be saved in cache.
     *
     * @param int $status The new response status
     * @return Controller_Front
     */
    public function setStatus($status)
    {
        $this->_status = $status;

        return $this;
    }

    /**
     * Add or replace a header to current response. Headers will be saved in cache.
     *
     * @param string    $name       The header name
     * @param string    $value      The header value
     * @param boolean   $replace    Whether to replace existing value for the header, will never overwrite/be overwritten when false
     * @return Controller_Front
     */
    public function setHeader($name, $value, $replace = true)
    {
        if ($replace) {
            $this->_headers[$name] = $value;
        } else {
            $this->_headers[] = array($name, $value);
        }

        return $this;
    }

    /**
     * Returns a (dot notated) custom data of the current process.
     *
     * @param string    $item       Name of the custom data, can be dot notated
     * @param mixed     $default    The return value if the custom data isn't found
     * @return  mixed The custom data or default if not found
     */
    public function getCustomData($item, $default = null)
    {
        return \Arr::get($this->_custom_data, $item, $default);
    }

    /**
     * Sets a (dot notated) custom data to the current process.
     *
     * @param string    $item   A (dot notated) custom data key
     * @param mixed     $value  The custom data value
     * @param boolean   $cached If custom data have to be cached
     * @return Controller_Front
     */
    public function setCustomData($item, $value, $cached = false)
    {
        \Arr::set($this->_custom_data, $item, $value);
        if ($cached) {
            $this->_custom_data_cached[] = $item;
        }
        return $this;
    }

    /**
     * Replace the template by a specific content and stop treatments
     *
     * @param mixed $content The new content, can be a string or a View
     * @throws FrontIgnoreTemplateException Internal exception for stopping treatments
     */
    public function sendContent($content)
    {
        $this->_content = $content;

        throw new FrontIgnoreTemplateException();
    }

    /**
     * Add a cache suffix handler for the current page
     *
     * @param array $handler The cache suffix handler
     * @return null|\Nos\FrontCache The cache instance if the cache path have changed, null otherwise
     */
    public function addCacheSuffixHandler(array $handler)
    {
        return $this->_cache->addSuffixHandler($handler);
    }

    /**
     * Deletes current cache file
     */
    public function deleteCache()
    {
        $this->_cache->delete();
    }
}
