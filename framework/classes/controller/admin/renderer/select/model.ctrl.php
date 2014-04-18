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

class Controller_Admin_Renderer_Select_Model extends \Controller
{
    public function action_index()
    {
        $context = $_GET['context'];
        $model = $_GET['model'];

        $contextable = $model::behaviours(
            'Nos\Orm_Behaviour_Contextable',
            $model::behaviours('Nos\Orm_Behaviour_Twinnable', array())
        );
        $conditions = array('where' => array());
        if (!empty($contextable)) {
            $conditions['where'][] = array($contextable['context_property'] => $context);
        }

        $pk = $model::primary_key();
        $items = $model::find('all', $conditions);
        $options = array();
        foreach ($items as $item) {
            $options[] = array(
                'text' => $item->title_item(),
                'value' => $item->{$pk[0]},
            );
        }
        \Response::json($options);
    }
}
