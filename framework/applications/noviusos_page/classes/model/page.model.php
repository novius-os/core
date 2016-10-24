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

use Nos\Tools_Wysiwyg;

class Model_Page extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_page';
    protected static $_primary_key = array('page_id');

    protected static $_title_property = 'page_title';
    protected static $_properties = array(
        'page_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'page_parent_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_template_variation_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_level' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_title' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => false,
        ),
        'page_context' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'page_context_common_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'page_context_is_main' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_menu_title' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_meta_title' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_sort' => array(
            'default' => null,
            'data_type' => 'float',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_menu' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_type' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_published' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_publication_start' => array(
            'default' => null,
            'data_type' => 'datetime',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_publication_end' => array(
            'default' => null,
            'data_type' => 'datetime',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_meta_noindex' => array(
            'default' => 0,
            'data_type' => 'tinyint unsigned',
            'null' => false,
        ),
        'page_lock' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_entrance' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_home' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'page_cache_duration' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_virtual_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
            'character_maximum_length' => 100,
        ),
        'page_virtual_url' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_external_link' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_external_link_type' => array(
            'default' => null,
            'data_type' => 'tinyint',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'page_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'page_meta_description' => array(
            'default' => null,
            'data_type' => 'text',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_meta_keywords' => array(
            'default' => null,
            'data_type' => 'text',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_created_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'page_updated_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
    );

    protected static $_has_one = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

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
        'template_variation' => array(
            'key_from'       => 'page_template_variation_id',
            'model_to'       => '\Nos\Template\Variation\Model_Template_Variation',
            'key_to'         => 'tpvar_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\\Observer_Self',
        'Orm\Observer_CreatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'page_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'page_updated_at'
        ),
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Twinnable' => array(
            'context_property'      => 'page_context',
            'common_id_property' => 'page_context_common_id',
            'is_main_property' => 'page_context_is_main',
        ),
        'Nos\Orm_Behaviour_Tree' => array(
            'parent_relation' => 'parent',
            'children_relation' => 'children',
            'level_property' => 'page_level',
        ),
        'Nos\Orm_Behaviour_Virtualpath' => array(
            'virtual_name_property' => 'page_virtual_name',
            'virtual_path_property' => 'page_virtual_url',
            'extension_property' => '.html',
        ),
        'Nos\Orm_Behaviour_Sortable' => array(
            'sort_property' => 'page_sort',
        ),
        'Nos\Orm_Behaviour_Publishable' => array(
            'publication_state_property' => 'page_published',
            'publication_start_property' => 'page_publication_start',
            'publication_end_property' => 'page_publication_end',
            // Permissions to deny publication is in the config file
        ),
        'Nos\Orm_Behaviour_Author' => array(
            'created_by_property' => 'page_created_by_id',
            'updated_by_property' => 'page_updated_by_id',
        ),
    );

    protected $_page_id_for_delete = null;
    protected $_old_virtual_path = null;

    const TYPE_CLASSIC       = 0;
    const TYPE_EXTERNAL_LINK = 3;

    const EXTERNAL_TARGET_NEW   = 0;
    const EXTERNAL_TARGET_SAME  = 2;

    const LOCK_UNLOCKED = 0;
    const LOCK_DELETION = 1;

    public static function find($id = null, array $options = array())
    {
        if (array_key_exists('order_by', $options)) {
            isset($options['order_by']['page_sort']) or $options['order_by']['page_sort'] = 'ASC';
        }
        return parent::find($id, $options);
    }

    /**
     * @deprecated Use htmlAnchor() method instead
     */
    public function link()
    {
        \Log::deprecated('->link() is deprecated, use ->htmlAnchor() instead.', 'Chiba.2');

        $attr = array(
            'href' => \Nos\Tools_Url::encodePath($this->url()),
        );
        if ($this->page_type == self::TYPE_EXTERNAL_LINK) {
            if ($this->page_external_link_type == self::EXTERNAL_TARGET_NEW) {
                $attr['target'] = '_blank';
            }
        }

        return array_to_attr($attr);
    }

    /**
     * Returns an HTML anchor tag with, by default, page URL in href and page title in text.
     *
     * If key 'href' is set in $attributes parameter :
     * - if is a string, used for href attribute
     * - if is an array, used as argument of ->url() method
     *
     * If key 'text' is set in $attributes parameter, its value replace page title
     *
     * @param array $attributes Array of attributes to be applied to the anchor tag.
     * @return string
     */
    public function htmlAnchor(array $attributes = array())
    {
        $text = \Arr::get($attributes, 'text', e($this->page_title));
        \Arr::delete($attributes, 'text');

        $href = \Arr::get($attributes, 'href', $this->url());
        if (is_array($href)) {
            $href = $this->url($href);
        }
        $href = \Nos\Tools_Url::encodePath($href);
        \Arr::delete($attributes, 'href');

        if ($this->page_type == self::TYPE_EXTERNAL_LINK &&
            $this->page_external_link_type == self::EXTERNAL_TARGET_NEW &&
            empty($attributes['target'])) {
            $attributes['target'] = '_blank';
        }

        return \Html::anchor($href, $text, $attributes);
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


    /**
     *  Delete the cache for this page
     */
    public function delete_cache()
    {
        if ($this->page_type == self::TYPE_EXTERNAL_LINK) {
            return;
        }
        $url = $this->page_entrance ? '' : ltrim($this->virtual_path(), '/');
        $contexts = \Nos\Tools_Context::contexts();
        foreach ($contexts[$this->page_context] as $context_url) {
            $cache = \Nos\FrontCache::forge(\Nos\FrontCache::getPathFromUrl($context_url, $url));
            $cache->delete();
        }

        if ($this->page_menu || $this->is_changed('page_menu')) {
            static::delete_cache_context($this->page_context);
        }
    }

    /**
     * Delete the cache for this context
     *
     * @param  $context  string  Context to delete (e.g. 'main::en_GB')
     */
    public static function delete_cache_context($context)
    {
        $contexts = \Nos\Tools_Context::contexts();
        foreach ($contexts[$context] as $context_url) {
            $host = parse_url($context_url, PHP_URL_HOST);
            $path = trim(parse_url($context_url, PHP_URL_PATH), '/');

            \Nos\FrontCache::deleteDir('pages'.DS.$host.DS.$path);
        }
    }

    public function _event_before_change_virtual_path()
    {
        $this->_old_virtual_path = \Arr::get($this->get_diff(), '0.page_virtual_url', $this->page_virtual_url);
    }

    public function _event_after_change_virtual_path()
    {
        $old_virtual_path = preg_replace('`\.html$`iUu', '/', $this->_old_virtual_path);
        $new_virtual_path = $this->virtual_path(true);

        \Nos\Config_Data::load('enhancers');

        $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());
        // No need for try / catch because it's a page, we know it's contextable
        $context = $this->get_context();
        foreach ($url_enhanced as $page_id => $enhanced) {
            if ($context == $enhanced['context'] && \Str::starts_with($enhanced['url'], $old_virtual_path)) {
                $url_enhanced[$page_id]['url'] = $new_virtual_path . \Str::sub($url_enhanced[$page_id]['url'], \Str::length($old_virtual_path));
            }
        }
        \Nos\Config_Data::save('url_enhanced', $url_enhanced);
    }

    public function _event_after_save()
    {
        \Nos\Config_Data::load('enhancers');

        //Get the wysiwyg keys used into the page template
        $wysiwyg_keys = array();
        if (!empty($this->template_variation)) {
            $template = $this->template_variation->configCompiled();
            $wysiwyg_keys = array_keys(\Arr::get($template, 'layout', array()));
        }

        $content = '';
        foreach ($this->wysiwygs as $key => $text) {
            //If no keys are defined (variation problem ?) take in count all wysiwygs
            if (empty($wysiwyg_keys) || in_array($key, $wysiwyg_keys)) {
                $content .= $text;
            }
        }

        static::_remove_url_enhanced($this->page_id);
        static::_remove_page_enhanced($this->page_id);

        $page = $this;
        Tools_Wysiwyg::parseEnhancers(
            $content,
            function ($enhancer, $data_config, $tag) use ($page) {
                $config = \Nos\Config_Data::get('enhancers.'.$enhancer, false);
                if ($config && !empty($config['urlEnhancer'])) {
                    $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());
                    $url = $page->page_entrance ? '' : $page->virtual_path(true);
                    $url_enhanced[$page->page_id] = array(
                        'url' => $url,
                        'context' => $page->page_context,
                    );
                    \Nos\Config_Data::save('url_enhanced', $url_enhanced);

                    $page_enhanced = \Nos\Config_Data::get('page_enhanced', array());
                    $page_enhanced[$enhancer][$page->page_id] = array(
                        // (array) json_decode(strtr($data_config, array('&quot;' => '"',))) doesn't
                        // recursively transform an object to an array
                        'config' => json_decode(strtr($data_config, array('&quot;' => '"',)), true),
                        'context' => $page->page_context,
                        'published' => $page->planificationStatus() == 2 ? array(
                            'start' => $page->publicationStart(),
                            'end' => $page->publicationEnd(),
                        ) : $page->published(),
                    );

                    \Nos\Config_Data::save('page_enhanced', $page_enhanced);
                }
            }
        );

        $this->delete_cache();
    }

    public function _event_before_delete()
    {
        $this->_page_id_for_delete = $this->page_id;
    }

    public function _event_after_delete()
    {
        static::_remove_url_enhanced($this->_page_id_for_delete);
        static::_remove_page_enhanced($this->_page_id_for_delete);
        $this->delete_cache();
        $this->_page_id_for_delete = null;
    }

    protected static function _remove_url_enhanced($id)
    {
        $url_enhanced = \Nos\Config_Data::get('url_enhanced', array());
        if (isset($url_enhanced[$id])) {
            unset($url_enhanced[$id]);
        }

        \Nos\Config_Data::save('url_enhanced', $url_enhanced);
    }

    protected static function _remove_page_enhanced($id)
    {
        $page_enhanced = \Nos\Config_Data::get('page_enhanced', array());
        $enhancers = array_filter($page_enhanced, function ($val) use ($id) {
            return isset($val[$id]);
        });

        foreach ($enhancers as $enhancer => $array) {
            unset($page_enhanced[$enhancer][$id]);
        }

        \Nos\Config_Data::save('page_enhanced', $page_enhanced);
    }
}
