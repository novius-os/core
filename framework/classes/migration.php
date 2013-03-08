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

class Migration
{
    static $sql_file = null;

    public function up() {
        if (static::$sql_file === null) {
            $backtrace = debug_backtrace();
            static::$sql_file = $backtrace[2]['args'][0][1]['path'];
        }
        $sql_file = substr(static::$sql_file, 0, strlen(static::$sql_file) - 4).'.sql';
        if (file_exists($sql_file)) {
            $queries = explode(';', file_get_contents($sql_file)); // @todo: might not work everywhere (; in values)
            foreach ($queries as $query) {
                if (trim($query) != '') { // @todo: might not work for comments
                    \DB::query($query)->execute();
                }
            }
        }
    }

    public function down() {

    }
}