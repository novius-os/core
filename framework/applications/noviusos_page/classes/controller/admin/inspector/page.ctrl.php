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

class Controller_Admin_Inspector_Page extends \Nos\Controller_Inspector_Modeltree
{

    protected function tree(array $tree_config)
    {
        $id = \Input::get('id', null);
        // ID == 0 means we're retrieving the root itself, it's not a real item
        if ($id == 0) {
            $_GET['id'] = null;
        }
        $json = parent::tree($tree_config);

        // If we're requesting the root
        if ($id === null) {
            $json['total'] = 0;
            $__ = \Nos\I18n::dictionary('noviusos_page::common');
            $json['items'] = array(
                array(
                    '_id' => '0',
                    '_model' => 'Nos\Page\Model_Page',
                    'id' => '0',
                    'title' => $__('Root'),
                    'treeChilds' => $json['items'],
                ),
            );
        }

        return $json;
    }
}
