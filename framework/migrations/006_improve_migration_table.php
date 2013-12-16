<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Migrations;

class Improve_Migration_Table extends \Nos\Migration
{
    public function up()
    {
        if (\DB::query('SHOW COLUMNS IN nos_migration WHERE field="id"')->execute() == 0) {
            parent::up();
        }
    }
}
