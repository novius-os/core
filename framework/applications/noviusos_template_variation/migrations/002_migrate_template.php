<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Template\Variation\Migrations;

use Nos\Template\Variation\Model_Template_Variation;

class Migrate_Template extends \Nos\Migration
{
    public function up()
    {
        parent::up();

        $templates = \Nos\Config_Data::get('templates', array());

        $templates_context = \DB::select('page_template', 'page_context')->from('nos_page')->distinct()->execute();
        foreach ($templates_context->as_array() as $template_context) {
            $template = \Arr::get($templates, $template_context['page_template'], array());
            $template_variation = Model_Template_Variation::forge();
            $template_variation->tpvar_template = $template_context['page_template'];
            $template_variation->tpvar_title = \Arr::get($template, 'title', $template_context['page_template']);
            $template_variation->tpvar_context = $template_context['page_context'];
            $template_variation->save();
        }
    }
}
