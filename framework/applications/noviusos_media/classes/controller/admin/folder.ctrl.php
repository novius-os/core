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

class Controller_Admin_Folder extends \Nos\Controller_Admin_Crud
{
    protected function init_item()
    {
        parent::init_item();
        if (empty($this->item_environment)) {
            $query = Model_Folder::find();
            $query->where(array('medif_parent_id' => null));
            $root = $query->get_one();
            $this->item->medif_parent_id = $root->medif_id;
        }
    }

    public function before_save($folder, $data)
    {
        parent::before_save($folder, $data);
        $folder->observe('before_save');

        if (!$folder->is_new()) {
            if ($folder->path() != $this->clone->path()) {
                if (is_dir($this->clone->path())) {
                    if (!\File::rename_dir($this->clone->path(), $folder->path())) {
                        $folder->medif_path = $this->clone->medif_path;
                    }
                }

                $this->clone->deleteCache();
            }
        }
    }

    public function save($item, $data)
    {
        return parent::save($item, $data) + array(
            'medif_dir_name' => $item->medif_dir_name,
        );
    }

    public function delete()
    {
        $count_medias = $this->item->count_media();
        // Basic check to prevent false suppression
        if (!is_dir($this->item->path()) && $count_medias > 0) {
            throw new \Exception(__('This is strange: This folder should be empty but isn’t. Please contact your developer or Novius OS to fix this. We apologise for the inconvenience caused.'));
        }

        // Strategy : try to delete the database records first, as we can sometimes (if supported) rollback with the transaction
        // Delete the files afterwards and commit the transaction if it's a success

        \DB::start_transaction();
        // find_children_recursive($include_self = true)
        $all_folders = $this->item->find_children_recursive(true);
        $folder_ids = array_keys($all_folders);

        $escaped_folder_ids = array();
        foreach ($folder_ids as $id) {
            $escaped_folder_ids[] = (int) $id;
        }
        // Cleanup empty values
        $escaped_folder_ids = array_filter($escaped_folder_ids);
        $escaped_folder_ids = implode(',', $escaped_folder_ids);

        $table_folder = Model_Folder::table();
        $table_media  = Model_Media::table();
        $table_link   = Model_Link::table();

        // Delete linked medias
        \DB::query("
            DELETE $table_link.* FROM $table_link
            LEFT JOIN $table_media ON media_id = medil_media_id
            WHERE
                media_folder_id IN ($escaped_folder_ids)")->execute();

        // Delete media entries
        \DB::query("
            DELETE $table_media.* FROM $table_media
            WHERE
                media_folder_id IN ($escaped_folder_ids)")->execute();

        // Can throw an exception
        $this->item->deleteFromDisk();

        // Delete folder entries
        \DB::query("
            DELETE $table_folder.* FROM $table_folder
            WHERE
                medif_id IN ($escaped_folder_ids)")->execute();

        \DB::commit_transaction();
    }
}
