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

use Fuel\Core\Uri;

class Model_Page extends \Nos\Orm\Model {

    protected static $_table_name = 'nos_page';
    protected static $_primary_key = array('page_id');

	protected static $_has_many = array(
		'children' => array(
			'key_from'       => 'page_id',
			'model_to'       => '\Nos\Model_Page',
			'key_to'         => 'page_parent_id',
			'cascade_save'   => false,
			'cascade_delete' => false,
		),
	);

	protected static $_belongs_to = array(
		'parent' => array(
			'key_from'       => 'page_parent_id',
			'model_to'       => '\Nos\Model_Page',
			'key_to'         => 'page_id',
			'cascade_save'   => false,
			'cascade_delete' => false,
		),
		'racine' => array(
			'key_from'       => 'page_root_id',
			'model_to'       => '\Nos\Model_Page_Root',
			'key_to'         => 'root_id',
			'cascade_save'   => false,
			'cascade_delete' => false,
		),
	);

	protected static $_observers = array('Orm\\Observer_Self');

	protected static $_behaviours = array(
		'Nos\Orm_Behaviour_Translatable' => array(
			'events' => array('before_insert', 'after_insert', 'before_save', 'after_delete', 'before_change_parent', 'after_change_parent'),
			'lang_property'      => 'page_lang',
			'common_id_property' => 'page_lang_common_id',
			'single_id_property' => 'page_lang_single_id',
            'invariant_fields'   => array(
                //'page_parent_id', // Depends on the lang, cannot be updated automagically
                'page_template',
                'page_level',
                'page_raw_html',
                'page_sort',
                'page_menu',
                'page_type',
                'page_lock',
                'page_entrance',
                'page_home',
                'page_cache_duration',
            ),
		),
		'Nos\Orm_Behaviour_Tree' => array(
			'events' => array('before_find', 'after_delete'),
			'parent_relation' => 'parent',
			'children_relation' => 'children',
		),
		'Nos\Orm_Behaviour_Sortable' => array(
			'events' => array('after_sort'),
			'sort_property' => 'page_sort',
		),
		'Nos\Orm_Behaviour_Publishable' => array(
			'publication_bool_property' => 'page_published',
		),
	);

	protected $_data_events = array();

	const TYPE_CLASSIC       = 0;
	const TYPE_POPUP         = 1;
	const TYPE_FOLDER        = 2;
	const TYPE_EXTERNAL_LINK = 3;
	const TYPE_INTERNAL_LINK = 4;
	const TYPE_OTHER_PAGE    = 5;

    const EXTERNAL_TARGET_NEW   = 0;
    const EXTERNAL_TARGET_POPUP = 1;
    const EXTERNAL_TARGET_SAME  = 2;

    const LOCK_UNLOCKED = 0;
    const LOCK_DELETION = 1;
    const LOCK_EDITION  = 2;

	public static function find($id = null, array $options = array()) {
		if (array_key_exists('order_by', $options)) {
			isset($options['order_by']['page_sort']) or $options['order_by']['page_sort'] = 'ASC';
		}
		return parent::find($id, $options);
	}

    /**
     * Returns the href and target attributes for an HTML link <a>
     *
     * @return string
     */
    public function get_link() {
        $attr = array(
            'href' => $this->get_href(),
        );
        if ($this->page_type == self::TYPE_EXTERNAL_LINK) {
            if ($this->page_external_link_type == self::EXTERNAL_TARGET_NEW) {
                $attr['target'] = '_blank';
            }
        }
        return array_to_attr($attr);
    }

    /**
     *
     * @param int $params Id of the page
     * @return type
     */
    public static function get_url($params) {
        if (is_numeric($params)) {
            return static::find($params)->get_href();
        }
    }

    public static function get_url_absolute($params) {
        if (is_numeric($params)) {
            return static::find($params)->get_href(array(
                'absolute' => true,
            ));
        }
    }

    /**
     *
     * @param   array   params
     * @return  string  the href of the page (external link or virtuak URL)
     */
    public function get_href($params = array()) {
        if ($this->page_type == self::TYPE_EXTERNAL_LINK) {
            $page_external_link = $this->page_external_link;
            if (empty($page_external_link) && !$this->is_main_lang()) {
                $page_external_link = $this->find_main_lang()->page_external_link;
            }
            return $page_external_link;
        }
        $url = !empty($params['absolute']) ? Uri::base(false) : '';

        if (!$this->page_home || !$this->is_main_lang()) {
            $url .= $this->page_virtual_url;
        }
        return $url;
    }

    public function get_possible_lang() {
        $parent = $this->find_parent();
        if (!empty($parent)) {
            return $parent->get_all_lang();
        }
        return array_keys(\Config::get('locales'));
    }

    public function _event_after_change_parent() {

        $parent = $this->find_parent();
        $this->page_virtual_url = $parent !== null ? str_replace('.html', '', $parent->page_virtual_url).'/' : '';
        $this->page_virtual_url .= $this->page_virtual_name.'.html';
    }

	public function _event_before_save() {
		$diff = $this->get_diff();

		if (!empty($diff[0]['page_virtual_name'])) {
			$diff[0]['page_virtual_url'] = $this->page_virtual_url;
			$this->page_virtual_url = str_replace($diff[0]['page_virtual_name'].'.html', $diff[1]['page_virtual_name'].'.html', $this->page_virtual_url);
			$diff[1]['page_virtual_url'] = $this->page_virtual_url;
			$this->_data_events = $diff;
		}
	}

	public function _event_after_save() {
		$diff = $this->_data_events;

		if (!empty($diff[0]['page_virtual_name'])) {

			$old_virtual_url = str_replace('.html', '/', $diff[0]['page_virtual_url']);
			$new_virtual_url = str_replace($diff[0]['page_virtual_name'].'/', $this->page_virtual_name.'/', $old_virtual_url);
			\DB::update($this->table())
				->set(array(
					'page_virtual_url' => \DB::expr('REPLACE(page_virtual_url, '.\DB::escape($old_virtual_url).', '.\DB::escape($new_virtual_url).')'),
				))
				->where('page_virtual_url', 'LIKE', $old_virtual_url.'%')
				->execute();
		}

		\Config::load(APPPATH.'data'.DS.'config'.DS.'enhancers.php', 'enhancers');

		$content = '';
		foreach ($this->wysiwygs as $text) {
			$content .= $text;
		}

		static::_remove_url_enhanced($this->page_id);
		static::_remove_page_enhanced($this->page_id);

		$urlEnhancer = false;
		$regexps = array(
			'`<(\w+)\s[^>]+data-enhancer="([^"]+)" data-config="([^"]+)">.*?</\\1>`u' => 2,
			'`<(\w+)\s[^>]+data-config="([^"]+)" data-enhancer="([^"]+)">.*?</\\1>`u' => 3,
		);
		foreach ($regexps as $regexp => $name_index) {
			preg_match_all($regexp, $content, $matches);
			foreach ($matches[$name_index] as $i => $name) {
				$config = \Config::get("enhancers.$name", false);
				if ($config && !empty($config['urlEnhancer'])) {
					\Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'url_enhanced');

					$url_enhanced = \Config::get("url_enhanced", array());
					$url = str_replace('.html', '/', $this->page_virtual_url);
					$url_enhanced[$url] = $this->page_id;

					\Config::save(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', $url_enhanced);

					\Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'page_enhanced');

					$page_enhanced = \Config::get("page_enhanced", array());
					$page_enhanced[$name][$this->page_id] = array(
						'config' => (array) json_decode(strtr($matches[$name_index === 3 ? 2 : 3][$i], array('&quot;' => '"',))),
						'lang' => $this->page_lang,
					);

					\Config::save(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', $page_enhanced);
					break 2;
				}
			}
		}
	}

	public function _event_after_delete() {
		static::_remove_url_enhanced($this->page_id);
		static::_remove_page_enhanced($this->page_id);
	}

	static protected function _remove_url_enhanced($id) {
		\Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'url_enhanced');

		$url_enhanced = \Config::get("url_enhanced", array());

		foreach (array_keys($url_enhanced, $id) as $url => $id) {
			unset($url_enhanced[$url]);
		}

		\Config::save(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', $url_enhanced);
	}

	static protected function _remove_page_enhanced($id) {
		\Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'page_enhanced');

		$page_enhanced = \Config::get("page_enhanced", array());
		$enhancers = array_filter($page_enhanced, function ($val) use ($id) {
			return isset($val[$id]);
		});

		foreach ($enhancers as $enhancer => $array) {
			unset($page_enhanced[$enhancer][$id]);
		}

		\Config::save(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', $page_enhanced);
	}
}
