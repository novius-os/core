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

class Model_Folder extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_media_folder';
    protected static $_primary_key = array('medif_id');

    protected static $_title_property = 'medif_title';
    protected static $_properties = array(
        'medif_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'medif_parent_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'medif_path' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'medif_dir_name' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => true,
            'convert_empty_to_null' => true,
            'character_maximum_length' => 100,
        ),
        'medif_title' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'medif_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'medif_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'medif_created_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'medif_updated_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
    );

    protected static $_has_one = array();
    protected static $_many_many = array();
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

    protected static $_has_many = array(
        'children' => array(
            'key_from'       => 'medif_id',
            'model_to'       => '\Nos\Media\Model_Folder',
            'key_to'         => 'medif_parent_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
        'media' => array(
            'key_from'       => 'medif_id',
            'model_to'       => '\Nos\Media\Model_Media',
            'key_to'         => 'media_folder_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_belongs_to = array(
        'parent' => array(
            'key_from'       => 'medif_parent_id',
            'model_to'       => '\Nos\Media\Model_Folder',
            'key_to'         => 'medif_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\Observer_CreatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'medif_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'medif_updated_at'
        )
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Tree' => array(
            'parent_relation' => 'parent',
            'children_relation' => 'children',
        ),
        'Nos\Orm_Behaviour_Virtualpath' => array(
            'virtual_name_property' => 'medif_dir_name',
            'virtual_path_property' => 'medif_path',
            'extension_property' => '/',
        ),
        'Nos\Orm_Behaviour_Author' => array(
            'created_by_property' => 'medif_created_by_id',
            'updated_by_property' => 'medif_updated_by_id',
        ),
    );

    protected $_data_events = array();
    protected $_folder_ids_for_delete = array();

    /**
     * Delete the folder from disk
     */
    public function deleteFromDisk()
    {
        $this->deleteCache();
        $path = $this->path();
        is_dir($path) and \File::delete_dir($path, true, true);
    }

    /**
     * @deprecated Use deleteFromDisk() method instead
     */
    public function delete_from_disk()
    {
        \Log::deprecated('->delete_from_disk() is deprecated, use ->deleteFromDisk() instead.', 'Chiba.2');
        return $this->deleteFromDisk();
    }

    /**
     * Delete all caches of the folder
     */
    public function deleteCache()
    {
        try {
            $dir_path = ltrim($this->medif_path, '/');
            $top = $this->medif_id != 1;

            $path_public = DOCROOT.'cache'.DS.Model_Media::$public_path.$dir_path;
            $path_public_cache = DOCROOT.Model_Media::$public_path.$dir_path;
            $path_private_cache = \Config::get('cache_dir').'media'.DS.$dir_path;

            is_dir($path_public) and \File::delete_dir($path_public, true, $top);
            is_dir($path_public_cache) and \File::delete_dir($path_public_cache, true, $top);
            is_dir($path_private_cache) and \File::delete_dir($path_private_cache, true, $top);

            if (!$top) {
                is_dir($path_public) and \File::create($path_public, '.gitkeep');
                is_dir($path_public_cache) and \File::create($path_public_cache, '.gitkeep');
                is_dir($path_private_cache) and \File::create($path_private_cache, '.gitkeep');
            }
        } catch (\Exception $e) {
            \Log::exception($e, 'Error while deleting the cache of folder '.$this->medif_id.' ('.$dir_path.'). ');
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                throw $e;
            }
        }
    }

    /**
     * @deprecated Use deleteCache() method instead
     */
    public function delete_public_cache()
    {
        \Log::deprecated('->delete_public_cache() is deprecated, use ->deleteCache() instead.', 'Chiba.2');
        return $this->deleteCache();
    }

    public function path($file = '')
    {
        return APPPATH.'data/media'.$this->medif_path.$file;
    }

    public function count_media()
    {
        /// get_ids_children($include_self)
        $folder_ids = $this->get_ids_children(true);

        return Model_Media::count(array(
            'where' => array(
                array('media_folder_id', 'IN', $folder_ids),
            ),
        ));
    }

    public function count_media_usage()
    {
        $folder_ids = $this->get_ids_children(true);

        return Model_Link::count(array(
            'related' => array('media'),
            'where' => array(
                array('media.media_folder_id', 'IN', $folder_ids),
            ),
        ));
    }

    public function _event_before_save()
    {
        parent::_event_before_save();
        $diff = $this->get_diff();

        if (!empty($diff[0]['medif_path'])) {
            $this->_data_events = $diff;
        }
    }

    public function _event_after_save()
    {
        $diff = $this->_data_events;

        if (!empty($diff[0]['medif_path'])) {
            \DB::update(Model_Media::table())
                    ->set(array(
                    'media_path' => \DB::expr('REPLACE(media_path, '.\DB::escape($diff[0]['medif_path']).', '.\DB::escape($diff[1]['medif_path']).')'),
                ))
                ->where('media_path', 'LIKE', $diff[0]['medif_path'].'%')
                ->execute();
        }
    }


    public function _event_before_delete()
    {
        $count_medias = $this->count_media();
        // Basic check to prevent false suppression
        if (!is_dir($this->path()) && $count_medias > 0) {
            throw new \Exception(__(
                'This is strange: This folder should be empty but isn’t. '.
                'Please contact your developer or Novius OS to fix this. '.
                'We apologise for the inconvenience caused.'
            ));
        }

        // Strategy : try to delete the database records first,
        // as we can sometimes (if supported) rollback with the transaction
        // Delete the files afterwards and commit the transaction if it's a success

        // find_children_recursive($include_self = true)
        $all_folders = $this->find_children_recursive(true);
        $this->_folder_ids_for_delete = array_keys($all_folders);
    }

    /**
     * Delete current folder
     *
     * @param   mixed $cascade
     *     null = use default config,
     *     bool = force/prevent cascade,
     *     array cascades only the relations that are in the array
     * @param   bool $use_transaction
     * @return  Model_Folder this instance as a new object without primary key(s)
     */
    public function delete($cascade = null, $use_transaction = false)
    {
        parent::delete($cascade, true);
    }


    public function _event_after_delete()
    {
        $escaped_folder_ids = array();
        foreach ($this->_folder_ids_for_delete as $id) {
            $escaped_folder_ids[] = (int) $id;
        }
        // Cleanup empty values
        $escaped_folder_ids = array_filter($escaped_folder_ids);
        $escaped_folder_ids = implode(',', $escaped_folder_ids);

        $table_folder = Model_Folder::table();
        $table_media  = Model_Media::table();
        $table_link   = Model_Link::table();

        // Delete linked medias
        \DB::query(
            'DELETE '.$table_link.'.* FROM '.$table_link.'
            LEFT JOIN '.$table_media.' ON media_id = medil_media_id
            WHERE media_folder_id IN ('.$escaped_folder_ids.')'
        )->execute();

        // Delete media entries
        \DB::query(
            'DELETE '.$table_media.'.* FROM '.$table_media.'
            WHERE media_folder_id IN ('.$escaped_folder_ids.')'
        )->execute();

        // Can throw an exception
        $this->deleteFromDisk();

        // Delete folder entries
        \DB::query(
            'DELETE '.$table_folder.'.* FROM '.$table_folder.'
            WHERE medif_id IN ('.$escaped_folder_ids.')'
        )->execute();
    }
}
