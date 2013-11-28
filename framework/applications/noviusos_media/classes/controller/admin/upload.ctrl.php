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

class Controller_Admin_Upload extends \Nos\Controller_Admin_Application
{
    protected static $_disallowed_extensions = array();

    protected $_dispatchEvent = array();

    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));
    }

    public function action_index()
    {
        $view_params = array(
            'tab_params' => array(
                'iconUrl' => 'static/apps/noviusos_media/img/media-16.png',
                'label' => __('Mass upload'),
                'url' => 'admin/noviusos_media/upload',
            ),
        );
        $view_params['view_params'] = &$view_params;

        return \View::forge('noviusos_media::admin/upload', $view_params, false);
    }

    public function post_save()
    {
        $unzip = \Input::post('unzip', 'unzip') == 'unzip';

        if (!isset($_FILES['media'])) {
            $this->send_error(new \Exception(__('Please pick a file from your hard drive.')));
        }

        $media_folder_id = \Input::post('media_folder_id', 1);
        $media_folder_id = empty($media_folder_id) ? 1 : $media_folder_id;
        $folder = \Nos\Media\Model_Folder::find($media_folder_id);

        $tempdir = realpath(\Config::get('novius-os.temp_dir', APPPATH.'data')).DS.'massupload';
        register_shutdown_function(function ($tempdir) {
            is_dir($tempdir) && \File::delete_dir($tempdir, true, true);
        }, $tempdir);

        try {
            static::$_disallowed_extensions = \Config::get('novius-os.upload.disabled_extensions', array('php'));
            foreach ($_FILES['media']['tmp_name'] as $i => $tmp_name) {
                $file_info = \File::file_info($tmp_name);
                if ($unzip && $file_info['mimetype'] === 'application/zip') {
                    $unzip = new \Unzip;

                    $area = \File_Area::forge(array('basedir' => $tempdir));
                    if (is_dir($tempdir)) {
                        if (!\File::delete_dir($tempdir, true, true, $area)) {
                             throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
                        }
                    }
                    if (!\File::create_dir(dirname($tempdir), 'massupload')) {
                        throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
                    }

                    $unzip->extract($tmp_name, $tempdir);

                    $files = \File::read_dir($tempdir, -1, null, $area);
                    $this->_importFiles($files, $tempdir.'/', $folder);
                } else {
                    $pathinfo = pathinfo($_FILES['media']['name'][$i]);
                    if (in_array(\Str::lower($pathinfo['extension']), static::$_disallowed_extensions)) {
                        throw new \Exception(__('This extension is not allowed due to security reasons.'));
                    }

                    $this->_importMedia($tmp_name, $pathinfo, $folder);
                }
            }
        } catch (\Exception $e) {
            $this->send_error($e);
        }

        $dispatchEvent = array();
        foreach ($this->_dispatchEvent as $model => $true) {
            $dispatchEvent[] = array(
                'name' => $model,
                'action' => 'insert',
            );
        }

        \Response::json(array(
            'notify' => __('Done! All files have been uploaded.'),
            'dispatchEvent' => $dispatchEvent,
        ));
    }

    protected function _importFiles($files, $path, $folder)
    {
        foreach ($files as $dir => $file) {
            if (is_array($file)) {
                $name = rtrim($dir, '/');
                $folder = $this->_importFolder($name, $folder);
                $this->_importFiles($file, $path.$dir, $folder);
            } else {
                $pathinfo = pathinfo($file);
                if (!in_array(\Str::lower($pathinfo['extension']), static::$_disallowed_extensions)) {
                    $this->_importMedia($path.$file, $pathinfo, $folder);
                }
            }
        }
    }

    protected function _importMedia($file, $pathinfo, \Nos\Media\Model_Folder $folder)
    {
        $filename = \Str::lower($pathinfo['filename']);
        $extension = \Str::lower($pathinfo['extension']);
        $media = \Nos\Media\Model_Media::find('first', array(
            'where' => array(
                'media_folder_id' => $folder->medif_id,
                'media_file' => $filename,
                'media_ext' => $extension,
            ),
        ));

        if (!empty($media)) {
            if (\File::get_size($file) === \File::get_size(APPPATH.$media->get_private_path())) {
                return $media;
            } else {
                $pathinfo['filename'] = $pathinfo['filename'].'-import';
                return $this->_importMedia($file, $pathinfo, $folder);
            }
        }

        $media = \Nos\Media\Model_Media::forge();

        $media->media_title = $pathinfo['filename'];
        $media->media_file = $filename;
        $media->media_folder_id = $folder->medif_id;
        $media->media_ext = $extension;
        $media->observe('before_save');
        $dest = APPPATH.$media->get_private_path();

        if (is_file($dest)) {
            $pathinfo['filename'] = $pathinfo['filename'].'-import';
            return $this->_importMedia($file, $pathinfo, $folder);
        }

        // Create the directory if needed
        $dest_dir = dirname($dest);
        $base_dir = APPPATH.\Nos\Media\Model_Media::$private_path;
        $remaining_dir = str_replace($base_dir, '', $dest_dir);
        // chmod  is 0777 here because it should be restricted with by the umask
        is_dir($dest_dir) or \File::create_dir($base_dir, $remaining_dir, 0777);

        if (!is_writeable($dest_dir)) {
            throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
        }

        // From upload
        if (\File::rename($file, $dest)) {
            chmod($dest, 0664);
        } else {
            throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
        }

        $media->save();
        $this->_dispatchEvent[get_class($media)] = true;

        return $media;
    }

    protected function _importFolder($name, \Nos\Media\Model_Folder $parent)
    {
        $dirname = \Str::lower($name);
        $folder = \Nos\Media\Model_Folder::find('first', array(
            'where' => array(
                'medif_parent_id' => $parent->medif_id,
                'medif_dir_name' => $dirname,
            ),
        ));

        if (empty($folder)) {
            $folder = \Nos\Media\Model_Folder::forge();
            $folder->medif_dir_name = $dirname;
            $folder->medif_title = $name;
            $folder->medif_parent_id = $parent->medif_id;
            $folder->observe('before_save');
            $folder->save();

            $this->_dispatchEvent[get_class($folder)] = true;
        }

        return $folder;
    }
}
