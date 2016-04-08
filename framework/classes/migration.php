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
    public static $complete_sql = array();
    public $path = null;
    public $sql_file = null;

    public function __construct($path)
    {
        $this->path     = $path;
        $this->sql_file = substr($path, 0, strlen($path) - 4).'.sql';
    }

    public function up()
    {
        if (file_exists($this->sql_file)) {
            static::executeSqlFile($this->sql_file);
            $this->clearFuelCache();
        }
    }

    public static function executeSqlFile($sql_file)
    {
        $content = file_get_contents($sql_file);
        $formatted_sql_filename = str_replace(NOSROOT, 'NOSROOT'.DIRECTORY_SEPARATOR, $sql_file);
        $line = '# |'.str_repeat('-', strlen($formatted_sql_filename) + 2)."|\n";
        $header = $line;
        $header .= '# | '.$formatted_sql_filename." |\n";
        $header .= $line."\n";
        static::$complete_sql[] = $header.$content."\n\n";
        $queries = explode(';', $content);//@todo: might not work everywhere (; in values)
        foreach ($queries as $query) {
            if (trim($query) != '') {
                // @todo: might not work for comments
                \DB::query($query)->execute();
            }
        }
    }

    protected function clearFuelCache()
    {
        $fuelCachePath = NOSROOT.'public/cache/fuelphp';
        if (file_exists($fuelCachePath)) {
            \File::delete_dir($fuelCachePath, true, false);
        }
    }

    public function down()
    {

    }

    public static function getCompleteSql()
    {
        return implode("\n", static::$complete_sql);
    }
}
