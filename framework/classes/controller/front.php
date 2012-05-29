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

class NotFoundException extends \Exception {}

class Controller_Front extends Controller {


    public $template;
    public $is_preview = false;

    protected $_view;

    public $assets_css = array();
    public $assets_js  = array();
    public $raw_css    = array();
    public $raw_js     = array();

	public $base_href        = '';
	public $page_title       = '';
    public $meta_description = '';
    public $meta_keywords    = '';
    public $meta_robots      = 'index,follow';
    public $metas            = array();

    public $page;

    public function router($action, $params) {

	    // Strip out leading / and trailing .html
	    $this->base_href = \URI::base();
	    $this->url = mb_substr($_SERVER['REDIRECT_URL'], 1);
	    $url = str_replace('.html', '', $this->url);

        //print_r($_SERVER['REDIRECT_URL']);

        $this->is_preview = \Input::get('_preview', false);

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
			        $this->pageUrl = $temp_url != '/' ? mb_substr($temp_url, 0, -1).'.html' : '';
			        $this->enhancerUrlPath = $temp_url != '/' ? $temp_url : '';
			        $this->enhancerUrl = ltrim(str_replace(mb_substr($temp_url, 0, -1), '', $url), '/');
			        try {
				        $this->_generate_cache();
			        } catch (NotFoundException $e) {
				        $_404 = true;
				        continue;
			        } catch (\Exception $e) {
				        // Cannot generate cache: fatal error...
				        //@todo : cas de la page d'erreur

                        $_404 = true;
				        exit($e->getMessage());
			        }

		            echo $this->_view->render();
			        $cache->save($nocache ? -1 : CACHE_DURATION_PAGE, $this);
			        $content = $cache->execute();
			        break;
		        }
	        }

	        if ($_404) {
                if (!\Event::trigger('front.404NotFound', array('url' => $this->pageUrl))) {
                    // If no redirection then we display 404
                    $_SERVER['REDIRECT_URL'] = '/';
                    return $this->router('index', $params);
                }
	        }
        }
		$this->_handle_head($content);

		foreach(\Event::trigger('front.display', null, 'array') as $c) {
			is_callable($c) && call_user_func_array($c, array(&$content));
		}
		return $content;
    }

    protected function _handle_head(&$content) {
	    $replaces  = array(
		    'base_href'         => array(
			    'pattern' => '/<base [^>]*\/?>/iu',
			    'replace' => '<base href="content" />',
		    ),
		    'page_title'        => array(
			    'pattern' => '/<title>[^<]*<\/title>/iu',
			    'replace' => '<title>content</title>',
		    ),
		    'meta_description'  => array(
			    'pattern' => '/<meta [^>]*name=\"?description[^>]*\"? *\/?>/iu',
			    'replace' => '<meta name="description" content="content">',
		    ),
		    'meta_keywords'     => array(
			    'pattern' => '/<meta [^>]*name=\"?keywords[^>]*\"? *\/?>/iu',
			    'replace' => '<meta name="keywords" content="content">',
		    ),
		    'meta_robots'       => array(
			    'pattern' => '/<meta [^>]*name=\"?robots[^>]*\"? *\/?>/iu',
			    'replace' => '<meta name="robots" content="content">',
		    ),
	    );
	    $begin_head = '';
	    foreach ($replaces as $prop => $replace) {
		    if (!empty($this->{$prop})) {
			    $content = preg_replace($replace['pattern'], str_replace('content', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']), $content, -1, $count);
			    if (!$count) {
				    $begin_head .= "\n".preg_replace('/content/iu', htmlspecialchars($this->{$prop}, ENT_COMPAT, 'UTF-8', false), $replace['replace']);
			    }
		    }
	    }
	    if ($begin_head) {
		    $content = preg_replace('/<head>/ui', '<head>'.$begin_head."\n", $content);
	    }

	    $head = array();

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

        $this->page_title = $this->page->page_title;

        $wysiwyg = array();

        // Scan all wysiwyg
        foreach ($this->template['layout'] as $wysiwyg_name => $layout) {

            $wysiwyg[$wysiwyg_name] = Nos::parse_wysiwyg($this->page->wysiwygs->{$wysiwyg_name}, $this);
        }
        $this->_view->set('wysiwyg', $wysiwyg, false);
    }

    /**
     * Find the page in the database and fill in the page variable.
     */
    protected function _find_page() {
        $where = array();
        if (!$this->is_preview) {
            $where[] = array('page_published', 1);
        }
        if (empty($this->pageUrl)) {
            $where[] = array('page_entrance', 1);
        } else {
            $where[] = array('page_virtual_url', $this->pageUrl);
            //$where[] = array('page_parent_id', 'IS NOT', null);
        }

        // Liste toutes les pages ayant le bon nom
        $pages = Model_Page::find('all', array(
            'where' => $where,
        ));

        if (empty($pages)) {
            //var_dump($this->url);
            throw new NotFoundException('The requested page was not found.');
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
        $this->page = new Model_Page();
        foreach ($cache['page'] as $field => $value) {
            $this->page->{'page_'.$field} = $value;
        }
        $this->page->freeze();
        unset($cache['page']);
        return parent::rebuild_cache($cache);
    }
}
