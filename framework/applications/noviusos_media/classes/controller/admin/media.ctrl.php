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
    public function prepare_i18n()
    {
        parent::prepare_i18n();
        \Nos\I18n::current_dictionary('noviusos_media::common');
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

        // File must be provided for a new media
        if ($this->is_new && !$is_uploaded) {
            throw new \Exception(__('Please pick a file from your hard drive.'));
        }

        // Retrieve pathinfo, either from uploaded or existing file
        if ($is_uploaded) {

            if ($_FILES['media']['error'] == UPLOAD_ERR_INI_SIZE) {
                throw new \Exception(__('We’re afraid you’re not allowed to upload files this big. Don’t blame Novius OS though, your developer or system administrator are the ones who make the rules.'));
            }
            $pathinfo = pathinfo(mb_strtolower($_FILES['media']['name']));

            $disallowed_extensions = \Config::get('novius-os.upload.disabled_extensions', array('php'));
            if (in_array($pathinfo['extension'], $disallowed_extensions)) {
                throw new \Exception(__('This extension is not allowed due to security reasons.'));
            }
        } elseif (!$this->is_new) {
            $pathinfo = pathinfo($media->path());
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
        $dest = $media->path();
        $is_renamed = $this->clone->path() != $dest;

        // Check duplicate / write permissions
        if ($this->is_new || $is_renamed) {
            if (is_file($dest)) {
                throw new \Exception(__('A file with the same name already exists.'));
            }
        }

        // Create the directory if needed
        $dest_dir = dirname($dest);
        $base_dir = APPPATH.Model_Media::$private_path;
        $remaining_dir = str_replace($base_dir, '', $dest_dir);
        // chmod  is 0777 here because it should be restricted with by the umask
        is_dir($dest_dir) or \File::create_dir($base_dir, $remaining_dir, 0777);

        if (!is_writeable($dest_dir)) {
            throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
        }

        // Delete old files
        if (!$this->is_new) {
            // A new file will be copied, we don't need the old one
            if ($is_uploaded) {
                $this->clone->deleteFromDisk();
            }
            // Don't delete the old file, we'll rename it
            if ($is_renamed) {
                $this->clone->deleteCache();
            }
        }

        // Write the file
        if ($is_uploaded) {
            // From upload
            if (move_uploaded_file($_FILES['media']['tmp_name'], $dest)) {
                chmod($dest, 0664);
            } else {
                throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
            }
        } else if ($is_renamed) {
            // From existing file
            \File::rename($this->clone->path(), $dest);
        }
    }

    public function save($item, $data)
    {
        $return = parent::save($item, $data) + array(
            'thumbnailUrl' => $this->item->urlResized(512, 512),
        );
        if ($this->item->isImage() != $this->clone->isImage()) {
            $return += array(
                'replaceTab' => $this->config['controller_url'].'/insert_update/'.$item->{$this->pk},
            );
        }
        return $return;
    }

    public function delete()
    {
        // Delete database & relations (link)
        $this->item->delete();
        // Delete file and cached entries from the hard drive
        $this->item->deleteFromDisk();
    }
}
