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
use Fuel\Core\Request;
use View;

class NotFoundException extends \Exception {}

class Controller_Front extends Controller {

    protected $_url = '';
    protected $_page_url = '';
    protected $_enhancer_url = false;
    protected $_enhanced_url_path = false;

    protected $_template;
    protected $_view;

    protected $_is_preview = false;

    protected $_css = array();
    protected $_js_header = array();
    protected $_js_footer = array();

    protected $_base_href = '';
    protected $_title = '';
    protected $_meta_description = '';
    protected $_meta_keywords = '';
    protected $_meta_robots = 'index,follow';
    protected $_metas = array();

    protected $_page;

    public function router($action, array $params) {

	    // Strip out leading / and trailing .html
	    $this->_base_href = str_replace(array('http:', 'https:'), '', \URI::base());
	    $this->_url = mb_substr($_SERVER['REDIRECT_URL'], 1);
	    $url = str_replace('.html', '', $this->_url);

        $this->_is_preview = \Input::get('_preview', false);

        $cache_path = $url;
        $cache_path = (empty($url) ? 'index/' : $url).$cache_path;
        $cache_path = rtrim($cache_path, '/');

		$nocache = \Input::method() == 'POST' || \Fuel::$env === \Fuel::DEVELOPMENT;

		\Event::trigger('front.start');

        $cache = FrontCache::forge('pages'.DS.$cache_path);

        try {
            $content = $cache->execute($this);
        } catch (CacheNotFoundException $e) {
            $cache->start();


	        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'url_enhanced');
	        $url_enhanced = \Config::get("url_enhanced", array());
	        $url_enhanced[$url.'/'] = 0;

	        $_404 = true;
	        foreach ($url_enhanced as $temp_url => $page_id) {
                if (mb_substr($url.'/', 0, mb_strlen($temp_url)) === $temp_url) {
                    $_404 = false;
                    if (!in_array($temp_url, array('', '/'))) {
                        $this->_page_url = mb_substr($temp_url, 0, -1).'.html';
                        $this->_enhanced_url_path = $temp_url;
                    } else {
                        $this->_page_url = '';
                        $this->_enhanced_url_path = '';
                    }
			        $this->_enhancer_url = ltrim(str_replace(mb_substr($temp_url, 0, -1), '', $url), '/');
                    try {
				        $this->_generate_cache();
			        } catch (NotFoundException $e) {
				        $_404 = true;
                        $this->_enhanced_url_path = false;
                        $this->_enhancer_url = false;
                        continue;
			        } catch (\Exception $e) {
				        // Cannot generate cache: fatal error...
				        //@todo : cas de la page d'erreur
				        exit($e->getMessage());
			        }

		            echo $this->_view->render();
			        $cache->save($nocache ? -1 : CACHE_DURATION_PAGE, $this);
			        $content = $cache->execute();

			        break;
		        }
	        }

	        if ($_404) {
                $event_404 = \Event::trigger('front.404NotFound', array('url' => $this->_page_url));
                $event_404 = array_filter($event_404);
                if (empty($event_404)) {
                    // If no redirection then we display 404
                    if (!empty($url)) {
                        $_SERVER['REDIRECT_URL'] = '/';
                        return $this->router('index', $params);
                    } else {
                        echo \View::forge('nos::errors/blank_slate_front');
                        exit();
                    }
                }
	        }
        }

		$this->_handle_head($content);

		foreach(\Event::trigger('front.display', null, 'array') as $c) {
			is_callable($c) && call_user_func_array($c, array(&$content));
		}

		return $content;
    }

    /**
     * @return mixed
     */
    public function getPage() {
        return $this->_page;
    }

    /**
     * @return string
     */
    public function getUrl() {
        return $this->_url;
    }

    /**
     * @return string
     */
    public function getPageUrl() {
        return $this->_page_url;
    }

    /**
     * @return mixed
     */
    public function getEnhancedUrlPath() {
        return $this->_enhanced_url_path;
    }

    /**
     * @return mixed
     */
    public function getEnhancerUrl() {
        return $this->_enhancer_url;
    }

    /**
     * @param $base_href
     * @return Controller_Front
     */
    public function setBaseHref($base_href) {
        $this->_base_href = $base_href;
        return $this;
    }

    /**
     * @param $title
     * @return Controller_Front
     */
    public function setTitle($title) {
        $this->_title = $title;
        return $this;
    }

    /**
     * @param $meta_description
     * @return Controller_Front
     */
    public function setMetaDescription($meta_description) {
        $this->_meta_description = $meta_description;
        return $this;
    }

    /**
     * @param $meta_keywords
     * @return Controller_Front
     */
    public function setMetaKeywords($meta_keywords) {
        $this->_meta_keywords = $meta_keywords;
        return $this;
    }

    /**
     * @param $meta_robots
     * @return Controller_Front
     */
    public function setMetaRobots($meta_robots) {
        $this->_meta_robots = $meta_robots;
        return $this;
    }

    /**
     * @param $meta
     * @return Controller_Front
     */
    public function addMeta($meta) {
        $this->_metas[] = $meta;
        return $this;
    }

    /**
     * @param $url
     * @param bool $footer
     * @return Controller_Front
     */
    public function addJavascript($url, $footer = true) {
        if ($footer) {
            $this->_js_footer[] = $url;
        } else {
            $this->_js_header[] = $url;
        }
        return $this;
    }

    /**
     * @param $js
     * @param bool $footer
     * @return Controller_Front
     */
    public function addJavascriptInline($js, $footer = true) {
        return $this->addJavascript(array('js' => $js, 'inline' => true), $footer);
    }

    /**
     * @param $url
     * @return Controller_Front
     */
    public function addCss($url) {
        $this->_css[] = $url;
        return $this;
    }

    /**
     * @param $css
     * @return Controller_Front
     */
    public function addCssInline($css) {
        return $this->addCss(array('css' => $css, 'inline' => true));
    }

    /**
     * @return bool
     */
    public function isPreview() {
        return $this->_is_preview;
    }

    protected function _handle_head(&$content) {
        $replaces  = array(
            '_base_href'         => array(
                'pattern' => '/<base [^>]*\/?>/iU',
                'replace' => '<base href="replace" />',
            ),
            '_title'        => array(
                'pattern' => '/<title>[^<]*<\/title>/iU',
                'replace' => '<title>replace</title>',
            ),
            '_meta_description'  => array(
                'pattern' => '/<meta [^>]*name=\"?description[^>]*\"? *\/?>/iU',
                'replace' => '<meta name="description" content="replace">',
            ),
            '_meta_keywords'     => array(
                'pattern' => '/<meta [^>]*name=\"?keywords[^>]*\"? *\/?>/iU',
                'replace' => '<meta name="keywords" content="replace">',
            ),
            '_meta_robots'       => array(
                'pattern' => '/<meta [^>]*name=\"?robots[^>]*\"? *\/?>/iU',
                'replace' => '<meta name="robots" content="replace">',
            ),
        );
        $begin_head = '';
        foreach ($replaces as $prop => $replace) {
            if (!empty($this->{$prop})) {
                $content = preg_replace(
                    $replace['pattern'],
                    str_replace('replace', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']),
                    $content,
                    -1,
                    $count
                );
                if (!$count) {
                    $begin_head .= "\n".str_replace('replace', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']);
                }
            }
        }
        if ($begin_head) {
            $content = preg_replace('/<head>/Ui', '<head>'.$begin_head."\n", $content);
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
                $head[] = '<script type="text/javascript">'.$js['js'].'</script>';
            } elseif (is_string($js) || (is_array($js) && isset($js['js']))) {
                $head[] = '<script src="'.(is_string($js) ? $js : $js['js']).'" type="text/javascript"></script>';
            }
        }
        if (count($head)) {
            $content = str_ireplace('</head>', implode("\n", $head).'</head>', $content);
        }

        $footer = array();
        foreach ($this->_js_footer as $js) {
            if (is_array($js) && isset($js['inline']) && $js['inline'] && isset($js['js'])) {
                $footer[] = '<script type="text/javascript">'.$js['js'].'</script>';
            } elseif (is_string($js) || (is_array($js) && isset($js['js']))) {
                $footer[] = '<script src="'.(is_string($js) ? $js : $js['js']).'" type="text/javascript"></script>';
            }
        }
        if (count($footer)) {
            $content = str_ireplace('</body>', implode("\n", $footer), $content);
        }
    }

    /**
     * Generate the cache. Renders all wysiwyg and assign them to the view.
     */
    protected function _generate_cache() {

        $this->_find_page();
        $this->_find_template();

        \Fuel::$profiling && \Profiler::console('page_id = ' . $this->_page->page_id);

        $this->_title = $this->_page->page_title;

        $wysiwyg = array();

        // Scan all wysiwyg
        foreach ($this->_template['layout'] as $wysiwyg_name => $layout) {
            $wysiwyg[$wysiwyg_name] = Nos::parse_wysiwyg($this->_page->wysiwygs->{$wysiwyg_name}, $this);
        }

        $this->_view->set('wysiwyg', $wysiwyg, false);
        $this->_view->set('title', $this->_title, false);
    }

    /**
     * Find the page in the database and fill in the page variable.
     */
    protected function _find_page() {
        $where = array();
        if (!$this->_is_preview) {
            $where[] = array('page_published', 1);
        }
        if (empty($this->_page_url)) {
            $where[] = array('page_entrance', 1);
        } else {
            $where[] = array('page_virtual_url', $this->_page_url);
            //$where[] = array('page_parent_id', 'IS NOT', null);
        }

        // Liste toutes les pages ayant le bon nom
        $pages = Model_Page::find('all', array(
            'where' => $where,
        ));

        if (empty($pages)) {
            //var_dump($this->_url);
            throw new NotFoundException('The requested page was not found.');
        }

        // Get the first page
        reset($pages);
        $this->_page = current($pages);
        \Nos\I18n::setLocale($this->_page->get_lang());
    }

    protected function _find_template() {

        // Find the template
        Config::load(APPPATH.'data'.DS.'config'.DS.'templates.php', 'templates');
        $templates = Config::get('templates', array());

        if (!isset($templates[$this->_page->page_template])) {
            throw new \Exception('The template '.$this->_page->page_template.' is not configured.');
        }

        $this->_template = $templates[$this->_page->page_template];
		if (empty($this->_template['file'])) {
			throw new \Exception('The template file for '. ($this->_template['title'] ?: $this->_page->page_template ).' is not defined.');
		}

        try {
			// @todo : always load from the template directory?
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

    public function save_cache() {
        $page_fields = array('id', 'root_id', 'parent_id', 'level', 'title', 'menu_title', 'meta_title', 'type', 'meta_noindex', 'entrance', 'home', 'virtual_name', 'virtual_url', 'external_link', 'external_link_type', 'meta_description', 'meta_keywords');
        $this->cache['page'] = array();
        foreach ($page_fields as $field) {
            $this->cache['page'][$field] = $this->_page->{'page_'.$field};
        }
        //return parent::save_cache();
        return $this->cache; //@todo: to be reviewed
    }

    public function rebuild_cache($cache) {
        $this->_page = new Model_Page();
        foreach ($cache['page'] as $field => $value) {
            $this->_page->{'page_'.$field} = $value;
        }
        $this->_page->freeze();
        unset($cache['page']);
        //return parent::rebuild_cache($cache); @todo: to be reviewed
    }
}
