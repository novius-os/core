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
    );

    protected static $_has_one = array();
    protected static $_many_many = array();

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
            'events' => array('before_insert'),
            'mysql_timestamp' => true,
            'property'=>'medif_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'events' => array('before_save'),
            'mysql_timestamp' => true,
            'property'=>'medif_updated_at'
        )
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Tree' => array(
            'events' => array('before'),
            'parent_relation' => 'parent',
            'children_relation' => 'children',
        ),
        'Nos\Orm_Behaviour_Virtualpath' => array(
            'events' => array('before_save', 'after_save', 'change_parent'),
            'virtual_name_property' => 'medif_dir_name',
            'virtual_path_property' => 'medif_path',
            'extension_property' => '/',
        ),
    );

    protected $_data_events = array();

    /**
     * Delete all the public/cache entries (image thumbnails) for this folder
     */
    public function delete_public_cache()
    {
        // Delete cached media entries
        $path_public     = DOCROOT.Model_Media::$public_path.ltrim($this->medif_path, '/');
        $path_thumbnails = str_replace(DOCROOT.'media/', DOCROOT.'cache/media/', $path_public);

        try {
            // delete_dir($path, $recursive, $delete_top)
            is_dir($path_public) and \File::delete_dir($path_public, true, true);
            is_dir($path_thumbnails) and \File::delete_dir($path_thumbnails, true, true);

            return true;
        } catch (\Exception $e) {
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                throw $e;
            }
            return false;
        }
    }

    public function delete_from_disk()
    {
        $path = $this->path();
        if (is_dir($path)) {
            // delete_dir($path, $recursive, $delete_top)
            return is_dir($path) and \File::delete_dir($path, true, true);
        }

        return true;
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
}
