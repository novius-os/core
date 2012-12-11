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

class Controller_Admin_Media extends \Nos\Controller_Admin_Crud
{
    protected function check_permission($action)
    {
        parent::check_permission($action);
        if ($action === 'insert' && !static::check_permission_action('add', 'controller/admin/media/appdesk/list')) {
            throw new \Exception('Permission denied');
        }
        if ($action === 'update' && !static::check_permission_action('add', 'controller/admin/media/appdesk/list')) {
            throw new \Exception('Permission denied');
        }
        if ($action === 'delete' && !static::check_permission_action('delete', 'controller/admin/media/appdesk/list', $this->item)) {
            throw new \Exception('Permission denied');
        }
    }

    protected function init_item()
    {
        parent::init_item();
        if (empty($this->item_environment)) {
            $query = Model_Folder::find();
            $query->where(array('medif_parent_id' => null));
            $root = $query->get_one();
            $this->item->media_folder_id = $root->medif_id;
        }
        $pathinfo = pathinfo($this->item->media_file);
        $this->item->media_file = $pathinfo['filename'];
    }

    protected function fieldset($fieldset)
    {
        $fieldset = parent::fieldset($fieldset);
        $form_attributes = $fieldset->get_config('form_attributes', array());
        $form_attributes['enctype'] = 'multipart/form-data';
        $fieldset->set_config('form_attributes', $form_attributes);

        if (!$this->is_new) {
            $fieldset->field('media')->set_label(__('Change the file:'));
        }

        return $fieldset;
    }

    public function before_save($media, $data)
    {
        $is_uploaded = isset($_FILES['media']) and is_uploaded_file($_FILES['media']['tmp_name']);
        if ($is_uploaded) {
            $pathinfo = pathinfo(mb_strtolower($_FILES['media']['name']));

            $disallowed_extensions = \Config::get('novius-os.upload.disabled_extensions', array('php'));
            if (in_array($pathinfo['extension'], $disallowed_extensions)) {
                throw new \Exception(__('This extension is not allowed due to security reasons.'));
            }
        } elseif (!$media->is_new()) {
            $pathinfo = pathinfo(APPPATH.$media->get_private_path());
        } else {
            throw new \Exception(__('Please pick a file from your hard drive.'));
        }

        // Empty title = auto-generated from file name
        if (empty($media->media_title)) {
            if (!$media->is_new() && empty($pathinfo['basename'])) {
                throw new \Exception('Please provide a title.');
            }
            $media->media_title = $pathinfo['basename'];
        }
        if (empty($media->media_file)) {
            $media->media_title = \Nos\Orm_Behaviour_Virtualname::friendly_slug($media->media_title);
        }

        $media->media_ext = $pathinfo['extension'];

        parent::before_save($media, $data);

        $media->observe('before_save');
        $dest = APPPATH.$media->get_private_path();

        if ($media->is_new()) {

            if (is_file($dest)) {
                throw new \Exception(__('A file with the same name already exists.'));
            }

            // Create the directory if needed
            $dest_dir = dirname($dest).'/';
            $base_dir = APPPATH.\Nos\Media\Model_Media::$private_path;
            $remaining_dir = str_replace($base_dir, '', $dest_dir);
            // chmod  is 0777 here because it should be restricted with by the umask
            is_dir($dest_dir) or \File::create_dir($base_dir, $remaining_dir, 0777);

            if (!is_writeable($dest_dir)) {
                throw new \Exception(__('No write permission. This is not your fault, but rather a misconfiguration from the server admin. Tell her/him off!'));
            }
        } else {
            if ($this->clone->get_private_path() != $media->get_private_path()) {
                if (is_file($dest)) {
                    throw new \Exception(__('A file with the same name already exists.'));
                }

                if ($is_uploaded) {
                    $this->clone->delete_from_disk();
                } else {
                    // Create the directory if needed
                    $dest_dir = dirname($dest);
                    $base_dir = APPPATH.\Nos\Media\Model_Media::$private_path;
                    $remaining_dir = str_replace($base_dir, '', $dest_dir);
                    // chmod  is 0777 here because it should be restricted with by the umask
                    is_dir($dest_dir) or \File::create_dir($base_dir, $remaining_dir, 0777);

                    if (!is_writeable($dest_dir)) {
                        throw new \Exception(__('No write permission. This is not your fault, but rather a misconfiguration from the server admin. Tell her/him off!'));
                    }
                    \File::rename(APPPATH.$this->clone->get_private_path(), $dest);
                }
                $this->clone->delete_public_cache();
            }
        }
        if ($is_uploaded) {
            // Move the file
            if (move_uploaded_file($_FILES['media']['tmp_name'], $dest)) {
                chmod($dest, 0664);
            } else {
                throw new \Exception(__('No write permission. This is not your fault, but rather a misconfiguration from the server admin. Tell her/him off!'));
            }
        }
    }

    public function delete()
    {
        // Delete database & relations (link)
        $this->item->delete();
        // Delete file from the hard drive
        $this->item->delete_from_disk();
        // Delete cached entries (image thumbnails)
        $this->item->delete_public_cache();
    }
}
