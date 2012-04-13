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
use Fuel\Core\View;


class Controller_Front extends Controller {

    public $page;

    public $template;

    protected $_view;

    public $assets_css = array();
    public $assets_js  = array();
    public $raw_css    = array();
    public $raw_js     = array();

    public $page_title       = '';
    public $meta_description = '';
    public $meta_keywords    = '';
    public $meta_robots      = 'index,follow';
    public $metas            = array();

    public function router($action, $params) {

	    // Strip out leading / and trailing .html
	    $url = substr($_SERVER['REDIRECT_URL'], 1, -5);

        $cache_path = $url;
        $cache_path = (empty($url) ? 'index/' : $url).$cache_path;
        $cache_path = rtrim($cache_path, '/');

		$nocache = \Fuel::$env === \Fuel::DEVELOPMENT;

		\Event::trigger('front.start');

        $publi_cache = PubliCache::forge('pages'.DS.$cache_path);

        try {
            $content = $publi_cache->execute($this);
        } catch (CacheNotFoundException $e) {
            $publi_cache->start();

	        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'url_enhanced');
	        $url_enhanced = \Config::get("url_enhanced", array());
	        $url_enhanced[$url.'/'] = $url.'/';

	        $_404 = true;
	        foreach ($url_enhanced as $tempurl) {
		        if (substr($url.'/', 0, strlen($tempurl)) === $tempurl) {
			        $_404 = false;
			        $this->url = $tempurl != '/' ? substr($tempurl, 0, -1).'.html' : '';
			        $this->enhancerUrlPath = $tempurl != '/' ? $tempurl : '';
			        $this->enhancerUrl = ltrim(str_replace(substr($tempurl, 0, -1), '', $url), '/');
			        try {
				        $this->_generate_cache();
			        } catch (NotFoundException $e) {
				        $_404 = true;
				        continue;
			        } catch (\Exception $e) {
				        // Cannot generate cache: fatal error...
				        //@todo : cas de la page d'erreur
				        exit($e->getMessage());
			        }

		            echo $this->_view->render();
			        $publi_cache->save($nocache ? -1 : CACHE_DURATION_PAGE, $this);
			        $content = $publi_cache->execute();
			        break;
		        }
	        }
	        if ($_404) {
		        //@todo : cas du 404
	        }
        }
		$this->_handle_head($content);

		foreach(\Event::trigger('front.display', null, 'array') as $c) {
			is_callable($c) && call_user_func_array($c, array(&$content));
		}
		return $content;
    }

    protected function _handle_head(&$content) {
        $head = array();

        if (!empty($this->page_title)) {
            $head[] = '<title>'.$this->page_title.'</title>';
			//$content = str_ireplace('<head>', '<head><title>'.$this->page_title.'</title>', $content);
        }

        if (!empty($this->meta_robots)) {
            $head[] = '<meta name="robots" content="'.$this->meta_robots.'">';
        }
        if (!empty($this->meta_keywords)) {
            $head[] = '<meta name="keywords" content="'.$this->meta_keywords.'">';
        }
        if (!empty($this->meta_description)) {
            $head[] = '<meta name="description" content="'.$this->meta_description.'">';
        }

        foreach ($this->assets_css as $css) {
            $head[] = '<link href="'.$css.'" rel="stylesheet" type="text/css">';
        }
        foreach ($this->raw_css as $raw_css) {
            $head[] = '<style type="text/css">'.$raw_css.'</style>';
        }
        foreach ($this->assets_js as $js) {
            $head[] = '<script src="'.$js.'" type="text/javascript"></script>';
        }
        foreach ($this->raw_js as $raw_js) {
            $head[] = '<script type="text/javascript">'.$raw_js.'</script>';
        }
        foreach ($this->metas as $metas) {
            $head[] = $metas;
        }

        $content = str_ireplace('</head>', implode("\n", $head).'</head>', $content);
    }

    /**
     * Generate the cache. Renders all wysiwyg and assign them to the view.
     */
    protected function _generate_cache() {

        $this->_find_page();
        $this->_find_template();

        \Fuel::$profiling && \Profiler::console('page_id = ' . $this->page->page_id);

        // Scan all wysiwyg
        foreach ($this->template['layout'] as $wysiwyg_name => $layout) {
            $content = \Nos::parse_wysiwyg($this->page->wysiwygs->{$wysiwyg_name}, $this);

            $this->page_title = $this->page->page_title;

            $this->_view->set('wysiwyg_'.$wysiwyg_name, $content, false);
        }
    }

    /**
     * Find the page in the database and fill in the page variable.
     */
    protected function _find_page() {
        $where = array(array('page_published', 1));
        if (empty($this->url)) {
            $where[] = array('page_entrance', 1);
        } else {
            $where[] = array('page_virtual_url', $this->url);
        }

        // Liste toutes les pages ayant le bon nom
        $pages = Model_Page_Page::find('all', array(
            'where' => $where,
        ));

        if (empty($pages)) {
            var_dump($this->url);
            throw new \Exception('The requested page was not found.');
        }

        // Get the first page
        reset($pages);
        $this->page = current($pages);
    }

    protected function _find_template() {

        // Find the template
        Config::load(APPPATH.'data'.DS.'config'.DS.'templates.php', 'templates');
        $templates = Config::get('templates', array());

        if (!isset($templates[$this->page->page_template])) {
            throw new \Exception('The template '.$this->page->page_template.' is not configured.');
        }

        $this->template = $templates[$this->page->page_template];
		if (empty($this->template['file'])) {
			throw new \Exception('The template file for '. ($this->template['title'] ?: $this->page->page_template ).' is not defined.');
		}

        try {
			// @todo : always load from the template directory?
            // Try normal loading
            $this->_view = View::forge($this->template['file']);
        } catch (\FuelException $e) {

			$template_file = \Finder::search('views', $this->template['file']);

            if (!is_file($template_file)) {
                throw new \Exception('The template '.$this->template['file'].' cannot be found.');
            }
            $this->_view = View::forge($template_file);
        }
    }

    public function save_cache() {
        $page_fields = array('id', 'root_id', 'parent_id', 'level', 'title', 'menu_title', 'meta_title', 'type', 'meta_noindex', 'entrance', 'home', 'virtual_name', 'virtual_url', 'external_link', 'external_link_type', 'meta_description', 'meta_keywords');
        $this->cache['page'] = array();
        foreach ($page_fields as $field) {
            $this->cache['page'][$field] = $this->page->{'page_'.$field};
        }
        return parent::save_cache();
    }

    public function rebuild_cache($cache) {
        $this->page = new Model_Page_Page();
        foreach ($cache['page'] as $field => $value) {
            $this->page->{'page_'.$field} = $value;
        }
        $this->page->freeze();
        unset($cache['page']);
        return parent::rebuild_cache($cache);
    }
}
