<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Page;

use Fuel\Core\Uri;

class Model_Page extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_page';
    protected static $_primary_key = array('page_id');

    protected static $_has_many = array(
        'children' => array(
            'key_from'       => 'page_id',
            'model_to'       => '\Nos\Page\Model_Page',
            'key_to'         => 'page_parent_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_belongs_to = array(
        'parent' => array(
            'key_from'       => 'page_parent_id',
            'model_to'       => '\Nos\Page\Model_Page',
            'key_to'         => 'page_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\\Observer_Self',
        'Orm\Observer_CreatedAt' => array(
            'events' => array('before_insert'),
            'mysql_timestamp' => true,
            'property'=>'page_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'events' => array('before_save'),
            'mysql_timestamp' => true,
            'property'=>'page_updated_at'
        ),
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Twinnable' => array(
            'events' => array('before_insert', 'after_insert', 'before_save', 'after_delete', 'change_parent'),
            'context_property'      => 'page_context',
            'common_id_property' => 'page_context_common_id',
            'is_main_property' => 'page_context_is_main',
            'invariant_fields'   => array(),
        ),
        'Nos\Orm_Behaviour_Tree' => array(
            'events' => array('before_query', 'after_delete'),
            'parent_relation' => 'parent',
            'children_relation' => 'children',
            'level_property' => 'page_level',
        ),
        'Nos\Orm_Behaviour_Virtualpath' => array(
            'events' => array('before_save', 'after_save', 'change_parent'),
            'virtual_name_property' => 'page_virtual_name',
            'virtual_path_property' => 'page_virtual_url',
            'extension_property' => '.html',
            'parent_relation' => 'parent',
        ),
        'Nos\Orm_Behaviour_Sortable' => array(
            'events' => array('before_insert', 'before_save', 'after_save'),
            'sort_property' => 'page_sort',
        ),
        'Nos\Orm_Behaviour_Publishable' => array(
            'publication_bool_property' => 'page_published',
        ),
    );

    protected $_page_id_for_delete = null;

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

    public static function find($id = null, array $options = array())
    {
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
    public function link()
    {
        $attr = array(
            'href' => $this->url(),
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
     * @param   array   params
     * @return string the href of the page (external link or virtual URL)
     */
    public function url($params = array())
    {
        if ($this->page_type == self::TYPE_EXTERNAL_LINK) {
            $page_external_link = $this->page_external_link;
            if (empty($page_external_link) && !$this->is_main_context()) {
                $page_external_link = $this->find_main_context()->page_external_link;
            }

            return $page_external_link;
        }
        $url = \Nos\Tools_Url::context($this->page_context);
        if (!($this->page_entrance)) {
            $url .= $this->virtual_path();
        }
        if (!empty($params['preview'])) {
            $url .= '?_preview=1';
        }

        return $url;
    }

    public function _event_after_save()
    {
        \Config::load(APPPATH.'metadata'.DS.'enhancers.php', 'data::enhancers');

        $content = '';
        foreach ($this->wysiwygs as $text) {
            $content .= $text;
        }

        static::_remove_url_enhanced($this->page_id);
        static::_remove_page_enhanced($this->page_id);

        $regexps = array(
            '`<(\w+)\s[^>]*data-enhancer="([^"]+)" data-config="([^"]+)"[^>]*>.*?</\\1>`u' => 2,
            '`<(\w+)\s[^>]*data-config="([^"]+)" data-enhancer="([^"]+)"[^>]*>.*?</\\1>`u' => 3,
        );
        foreach ($regexps as $regexp => $name_index) {
            preg_match_all($regexp, $content, $matches);
            foreach ($matches[$name_index] as $i => $name) {
                $config = \Config::get("data::enhancers.$name", false);
                if ($config && !empty($config['urlEnhancer'])) {
                    \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'data::url_enhanced');

                    $url_enhanced = \Config::get("data::url_enhanced", array());
                    $url = $this->page_entrance ? '' : $this->virtual_path(true);
                    $url_enhanced[$this->page_id] = array(
                        'url' => $url,
                        'context' => $this->page_context,
                    );
                    \Config::save(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', $url_enhanced);
                    \Config::set('data::url_enhanced', $url_enhanced);

                    \Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'data::page_enhanced');

                    $page_enhanced = \Config::get("data::page_enhanced", array());
                    $page_enhanced[$name][$this->page_id] = array(
                        'config' => (array) json_decode(strtr($matches[$name_index === 3 ? 2 : 3][$i], array('&quot;' => '"',))),
                        'context' => $this->page_context,
                        'published' => $this->published(),
                    );

                    \Config::save(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', $page_enhanced);
                    \Config::set('data::page_enhanced', $page_enhanced);
                    break 2;
                }
            }
        }
    }

    public function _event_before_delete()
    {
        $this->_page_id_for_delete = $this->page_id;
    }

    public function _event_after_delete()
    {
        static::_remove_url_enhanced($this->_page_id_for_delete);
        static::_remove_page_enhanced($this->_page_id_for_delete);
        $this->_page_id_for_delete = null;
    }

    protected static function _remove_url_enhanced($id)
    {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', 'data::url_enhanced');

        $url_enhanced = \Config::get("data::url_enhanced", array());
        if (isset($url_enhanced[$id])) {
            unset($url_enhanced[$id]);
        }

        \Config::save(APPPATH.'data'.DS.'config'.DS.'url_enhanced.php', $url_enhanced);
        \Config::set('data::url_enhanced', $url_enhanced);
    }

    protected static function _remove_page_enhanced($id)
    {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'data::page_enhanced');

        $page_enhanced = \Config::get("data::page_enhanced", array());
        $enhancers = array_filter($page_enhanced, function ($val) use ($id) {
            return isset($val[$id]);
        });

        foreach ($enhancers as $enhancer => $array) {
            unset($page_enhanced[$enhancer][$id]);
        }

        \Config::save(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', $page_enhanced);
        \Config::set('data::page_enhanced', $page_enhanced);
    }
}
