<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Template\Variation;

use Nos\Config_Data;

class Model_Template_Variation extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_template_variation';
    protected static $_primary_key = array('tpvar_id');

    protected static $_properties = array(
        'tpvar_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'tpvar_template' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'tpvar_title' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => false,
        ),
        'tpvar_context' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'tpvar_default' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'tpvar_data' => array(
            'default' => null,
            'data_type' => 'serialize',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'tpvar_created_at' => array(
            'default' => null,
            'data_type' => 'datetime',
            'null' => false,
        ),
        'tpvar_updated_at' => array(
            'default' => null,
            'data_type' => 'datetime',
            'null' => false,
        ),
        'tpvar_created_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'tpvar_updated_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
    );

    protected static $_has_many = array(
        'pages' => array(
            'key_from'       => 'tpvar_id',
            'model_to'       => '\Nos\Page\Model_Page',
            'key_to'         => 'page_template_variation_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
        'linked_menus' => array(
            'key_from'       => 'tpvar_id',
            'model_to'       => '\Nos\Template\Variation\Model_Template_Variation_Menu',
            'key_to'         => 'tvme_tpvar_id',
            'cascade_save'   => true,
            'cascade_delete' => true,
        ),
    );

    protected static $_has_one = array();
    protected static $_belongs_to  = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_observers = array(
        '\Orm\Observer_Typing',
        'Orm\\Observer_CreatedAt' => array(
            'mysql_timestamp' => true,
            'property' => 'tpvar_created_at',
        ),
        'Orm\\Observer_UpdatedAt' => array(
            'mysql_timestamp' => true,
            'property' => 'tpvar_updated_at',
        ),
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Contextable' => array(
            'context_property'      => 'tpvar_context',
        ),
        'Nos\Orm_Behaviour_Author' => array(
            'created_by_property' => 'tpvar_created_by_id',
            'updated_by_property' => 'tpvar_updated_by_id',
        ),
    );

    protected static $_providers = array(
        'menus' => array(
            'relation' => 'linked_menus',
            'key_property' => 'tvme_key',
            'value_property' => 'tvme_menu_id',
            'value_relation' => 'menu',
        ),
    );

    protected $config_compiled = null;

    public function __clone()
    {
        parent::__clone();
        $this->tpvar_default = 0;
    }

    public function configCompiled($reload = false)
    {
        if (empty($this->config_compiled) || $reload) {

            if (empty($this->tpvar_template)) {
                return array();
            }

            $templates = Config_Data::get('templates', array());
            $template_metadata = \Arr::get($templates, $this->tpvar_template, array());
            $config = array_merge(
                $template_metadata,
                \Config::load($template_metadata['application'].'::variation/'.$this->tpvar_template, true)
            );

            $wysiwyg_layout = \Arr::get($config, 'layout', array());
            if (is_callable($wysiwyg_layout)) {
                $wysiwyg_layout = $wysiwyg_layout($this);
            }
            \Arr::set($config, 'layout', (array) $wysiwyg_layout);

            $file = \Arr::get($config, 'file', '');
            if (is_callable($file)) {
                $file = $file($this);
            }
            \Arr::set($config, 'file', $file);

            $screenshot = \Arr::get($config, 'screenshot', '');
            if (is_callable($screenshot)) {
                $screenshot = $screenshot($this);
            }
            \Arr::set($config, 'screenshot', $screenshot);

            $this->config_compiled = $config;
        }
        return $this->config_compiled;
    }

    protected function templateConfig()
    {
        if (empty($this->tpvar_template)) {
            return array();
        }

        $templates = Config_Data::get('templates', array());
        $template_metadata = \Arr::get($templates, $this->tpvar_template, array());
        $template_config = \Config::load($template_metadata['application'].'::variation/'.$this->tpvar_template, true);

        return array_merge($template_metadata, $template_config);
    }

    public static function getTemplateVariationDefault($context)
    {
        return Model_Template_Variation::find('first', array(
            'where' => array(
                array('tpvar_default', '=', 1),
                array('tpvar_context', $context),
            ),
        ));
    }
}
