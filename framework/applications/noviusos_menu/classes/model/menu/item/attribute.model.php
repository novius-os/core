<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

use Orm\Model;

class Model_Menu_Item_Attribute extends Model
{
    protected static $_table_name = 'nos_menu_item_attribute';
    protected static $_primary_key = array('miat_id');

    protected static $_title_property = 'miat_key';
    protected static $_properties = array(
        'miat_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'miat_mitem_id' => array(
            'default' => null,
            'data_type' => 'int',
            'null' => false,
        ),
        'miat_key' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => false,
        ),
        'miat_value' => array(
            'default' => '',
            'data_type' => 'varchar',
            'null' => false,
        ),
    );

    /**
     * @param Model_Menu_Item $item : The original item, attributes will duplicate FROM
     * @param integer $duplicatedItemId
     */
    public function duplicate(Model_Menu_Item_Attribute $attribute, $duplicatedItemId)
    {
        $clone = clone $attribute;
        $clone->miat_mitem_id = $duplicatedItemId;
        $clone->save();
    }
}
