<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media;

use Fuel\Core\Config;

class Controller_Admin_Appdesk extends \Nos\Controller_Admin_Appdesk
{
    public function before()
    {
        try {
            parent::before();
        } catch (\Nos\Access_Exception $e) {
            if (\Input::is_ajax()) {
                \Response::json(array(
                    'error' => 'We’re afraid you’ve not be given access to the Media Centre. Don’t blame us though, we’re not the ones who decide the permissions.'
                ));
            } else {
                throw $e;
            }
        }
    }

    public function action_info($id)
    {
        $media = Model_Media::find($id);

        if (!empty($media)) {
            $dataset = \Arr::get($this->config, 'dataset');
            $media->event('dataset', array(&$dataset));
            unset($dataset['actions']);
            $item = array();
            foreach ($dataset as $key => $data) {
                // Array with a 'value' key
                if (is_array($data) and !empty($data['value'])) {
                    $data = $data['value'];
                }

                if ($data === true) {
                    continue;
                }

                if (is_callable($data)) {
                    $item[$key] = call_user_func($data, $media);
                } else if (is_array($data)) {
                    $item[$key] = $media->get($data['column']);
                } else {
                    $item[$key] = $media->get($data);
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
            $folder = Model_Folder::find(1);
            $folder->deleteCache();
        } catch (\Exception $e) {
            $this->send_error($e);
        }
        $__ = \Nos\I18n::dictionary('noviusos_media::common');
        \Response::json(array(
            'notify' => $__('The cache has been renewed. All ready for you to enjoy!'),
        ));
    }
}
