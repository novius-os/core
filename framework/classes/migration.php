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
        }
    }

    public static function executeSqlFile($sql_file)
    {
        $queries = explode(';', file_get_contents($sql_file));//@todo: might not work everywhere (; in values)
        foreach ($queries as $query) {
            if (trim($query) != '') {
                // @todo: might not work for comments
                \DB::query($query)->execute();
            }
        }
    }

    public function down()
    {

    }

    public function canUpdateMetadata()
    {
        if (\Config::get('migrations.enabled_types.metadata')) {
            if (is_writeable(APPPATH.'metadata')) {
                return true;
            } else {
                throw new \Exception('Metadata folder is not writeable.');
            }
        } else {
            return false;
        }
    }
}