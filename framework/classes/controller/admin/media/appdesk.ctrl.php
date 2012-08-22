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

use Fuel\Core\Config;

class Controller_Admin_Media_Appdesk extends Controller_Admin_Appdesk {

    public function action_info($id)
    {
        $media = Model_Media::find($id);

        if (!empty($media)) {
            $dataset = \Arr::get($this->config, 'dataset');
            $media->import_dataset_behaviours($dataset);
            unset($dataset['actions']);
            $item = array();
            foreach ($dataset as $key => $data)
            {
                // Array with a 'value' key
                if (is_array($data) and !empty($data['value'])) {
                    $data = $data['value'];
                }

                if (is_callable($data)) {
                    $item[$key] = call_user_func($data, $media);
                } else {
                    $item[$key] = $media->get($data);
                }
            }
        } else {
            $item = null;
        }

        \Response::json($item);
    }
}
