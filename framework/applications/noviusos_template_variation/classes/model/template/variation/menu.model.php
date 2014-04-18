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

class Model_Template_Variation_Menu extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_template_variation_menu';
    protected static $_primary_key = array('tvme_id');

    protected static $_properties = array(
        'tvme_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'tvme_tpvar_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'tvme_key' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'tvme_menu_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
    );

    protected static $_has_one = array();
    protected static $_has_many  = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_belongs_to = array(
        'menu' => array(
            'key_from' => 'tvme_menu_id',
            'model_to' => 'Nos\Menu\Model_Menu',
            'key_to' => 'menu_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );
}
