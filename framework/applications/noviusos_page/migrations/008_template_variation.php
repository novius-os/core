<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Page\Migrations;

use Nos\Migration;

class Template_Variation extends Migration
{
    public function up()
    {
        $template_variation = \Db::list_tables('nos_template_variation');
        $template_variation_id = \Db::list_columns('nos_page', 'page_template_variation_id');
        if (!empty($template_variation) && empty($template_variation_id)) {
            // Same request that in Template Variation migration 002_migrate_page
            // In case this migration is run after the Template Variation migration 002_migrate_page
            // Can be in a fresh install
            \DB::query(
                'ALTER TABLE `nos_page` ADD `page_template_variation_id` INT UNSIGNED  '.
                'DEFAULT NULL AFTER `page_template`'
            )->execute();

            \DB::query('ALTER TABLE `nos_page` DROP `page_template`')->execute();
        }
    }
}
