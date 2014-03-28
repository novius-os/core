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

use Nos\Template\Variation\Model_Template_Variation;
use Nos\Tools_Wysiwyg;

class Controller_Admin_Ajax extends \Controller
{
    public function action_wysiwyg($page_id = null)
    {
        $id = $_GET['tpvar_id'];
        $tpvar = Model_Template_Variation::find($id);
        $data = $tpvar->configCompiled();

        $page = empty($page_id) ? null : Model_Page::find($page_id);
        foreach ($data['layout'] as $wysiwyg => $coords) {
            \Arr::set(
                $data,
                'content.'.$wysiwyg,
                empty($page) ? '' : Tools_Wysiwyg::prepare_renderer($page->wysiwygs->{$wysiwyg})
            );
        }

        \Response::json($data);
    }

    public function action_template_variation()
    {
        $context = $_GET['context'];

        $options = array();
        $templates_variations = Model_Template_Variation::find('all', array(
            'where' => array(array('tpvar_context' => $context)),
            'order_by' => array(
                'tpvar_default' => 'DESC',
                'tpvar_title',
            ),
        ));
        foreach ($templates_variations as $template_variation) {
            $options[] = array(
                'text' => $template_variation->tpvar_title,
                'value' => $template_variation->tpvar_id,
                'selected' => $template_variation->tpvar_default,
            );
        }

        \Response::json($options);
    }
}
