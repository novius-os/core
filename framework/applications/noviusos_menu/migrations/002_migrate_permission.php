<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu\Migrations;

use Nos\Migration;

class Migrate_Permission extends Migration
{
    public function up()
    {
        $permission = \Db::list_tables('nos_role_permission');
        if (!empty($permission)) {
            \DB::delete('nos_role_permission')
                ->where('perm_category_key', '=', 'noviusos_menu')
                ->execute();

            $subquery = \DB::select('perm_role_id', 'perm_name', \DB::expr(\DB::quote('noviusos_menu')))
                ->from('nos_role_permission')
                ->where('perm_name', '=', 'nos::access')
                ->where('perm_category_key', '=', 'noviusos_appmanager');

            \DB::insert('nos_role_permission')
                ->columns(array('perm_role_id', 'perm_name', 'perm_category_key'))
                ->select($subquery)
                ->execute();
        }
    }
}
