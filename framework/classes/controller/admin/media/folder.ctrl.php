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

class Controller_Admin_Media_Folder extends Controller_Admin_Crud
{
    protected function check_permission($action)
    {
        parent::check_permission($action);
        if ($action === 'insert' && !static::check_permission_action('add', 'controller/admin/media/inspector/folder')) {
            throw new \Exception('Permission denied');
        }
        if ($action === 'update' && !static::check_permission_action('add', 'controller/admin/media/inspector/folder')) {
            throw new \Exception('Permission denied');
        }
        if ($action === 'delete' && !static::check_permission_action('delete', 'controller/admin/media/inspector/folder', $this->item)) {
            throw new \Exception('Permission denied');
        }
    }

    protected function init_item()
    {
        parent::init_item();
        if (empty($this->item_environment)) {
            $query = Model_Media_Folder::find();
            $query->where(array('medif_parent_id' => null));
            $root = $query->get_one();
            $this->item->medif_parent_id = $root->medif_id;
        }
    }

    public function before_save($folder, $data)
    {
        parent::before_save($folder, $data);

        if (!$folder->is_new()) {
            if ($folder->path() != $this->clone->path()) {
                if (is_dir($this->clone->path())) {
                    if (!\File::rename_dir($this->clone->path(), $folder->path())) {
                        $folder->medif_path = $this->clone->medif_path;
                    }
                }

                $this->clone->delete_public_cache();
            }
        }
    }

    public function delete()
    {
        $count_medias = $this->item->count_media();
        // Basic check to prevent false supression
        if (!is_dir($this->item->path()) && $count_medias > 0) {
            throw new \Exception(strtr('{count} medias were found, but folder was nonexistent.', array(
                '{count}' => $count_medias,
            )));
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

        $pk = Model_Media::primary_key();
        $pk = $pk[0];
        $table_folder = Model_Media_Folder::table();
        $table_media  = Model_Media::table();
        $table_link   = Model_Media_Link::table();

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
        $this->item->delete_from_disk();
        $this->item->delete_public_cache();

            // Delete folder entries
        \DB::query("
            DELETE $table_folder.* FROM $table_folder
            WHERE
                medif_id IN ($escaped_folder_ids)")->execute();

        \DB::commit_transaction();
    }
}
