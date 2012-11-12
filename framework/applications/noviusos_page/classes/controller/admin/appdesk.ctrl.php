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
    public function action_info($id)
    {
        $page = Model_Page::find($id);

        if (!empty($page)) {
            $dataset = \Arr::get($this->appdesk, 'dataset');
            $page->import_dataset_behaviours($dataset);
            unset($dataset['actions']);
            $item = array();
            foreach ($dataset as $key => $data) {
                // Array with a 'value' key
                if (is_array($data) and !empty($data['value'])) {
                    $data = $data['value'];
                }

                if (is_callable($data)) {
                    $item[$key] = call_user_func($data, $page);
                } else {
                    $item[$key] = $page->get($data);
                }
            }
        } else {
            $item = null;
        }

        \Response::json($item);
    }

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
        \Response::json(array(
            'notify' => __('Cache has been renewed.'),
        ));
    }

}
