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
            $query = Model_Folder::query();
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
}
