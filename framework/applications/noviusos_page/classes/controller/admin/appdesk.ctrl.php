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

class Controller_Admin_Appdesk extends \Nos\Controller_Admin_Appdesk
{
    public function post_clear_cache()
    {
        try {
            // delete_dir($path, $recursive, $delete_top);
            \File::delete_dir(\Config::get('cache_dir').'pages', true, false);
        } catch (\InvalidPathException $e) {
            // Dir doesn't exists, no problem
        } catch (\Exception $e) {
            $this->send_error($e);
        }
        $__ = \Nos\I18n::dictionary('noviusos_page::common');
        \Response::json(array(
            'notify' => $__('The cache has been renewed. All ready for you to enjoy!'),
        ));
    }
}
