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

use Nos\Config_Data;
use Nos\Migration;
use Nos\Template\Variation\Model_Template_Variation;

class Migrate_Page extends Migration
{
    public function up()
    {
        $page = \Db::list_tables('nos_page');
        if (!empty($page)) {
            $templates = Config_Data::get('templates', array());

            $templates_context = \DB::select('page_template', 'page_context')->from('nos_page')->distinct()->execute();
            foreach ($templates_context->as_array() as $template_context) {
                if (!empty($template_context['page_template'])) {
                    $template = \Arr::get($templates, $template_context['page_template'], array());
                    $template_variation = Model_Template_Variation::forge();
                    $template_variation->tpvar_template = $template_context['page_template'];
                    $template_variation->tpvar_title = \Arr::get($template, 'title', $template_context['page_template']);
                    $template_variation->tpvar_context = $template_context['page_context'];
                    $template_variation->save();
                }
            }

            // Same request that in Page migration 008_template_variation
            // In case this migration is run after the Page migration 008_template_variation
            \DB::query(
                'ALTER TABLE `nos_page` ADD `page_template_variation_id` INT UNSIGNED  '.
                'DEFAULT NULL AFTER `page_template`'
            )->execute();

            \DB::query(
                'UPDATE `nos_page`, `nos_template_variation` '.
                'SET `page_template_variation_id` = `tpvar_id` '.
                'WHERE `page_context` = `tpvar_context` '.
                'AND `page_template` = `tpvar_template`'
            )->execute();

            \DB::query('ALTER TABLE `nos_page` DROP `page_template`')->execute();
        }
    }
}
