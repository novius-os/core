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

class Images_Url_Transformations extends \Nos\Migration
{
    public function up()
    {
        try {
            \File::delete_dir(\Config::get('cache_dir').'media', true, false);
            \File::delete_dir(DOCROOT.'cache'.DS.'media', true, false);
            \File::delete_dir(DOCROOT.'media', true, false);

            \File::delete_dir(\Config::get('cache_dir').'pages', true, false);
        } catch (\InvalidPathException $e) {
            // Dir doesn't exists, no problem
        }
    }
}
