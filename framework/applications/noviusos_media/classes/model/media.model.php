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

class Model_Media extends \Nos\Orm\Model
{
    protected static $_table_name = 'nos_media';
    protected static $_primary_key = array('media_id');

    protected static $_title_property = 'media_title';
    protected static $_properties = array(
        'media_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'media_folder_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => false,
        ),
        'media_path' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'media_file' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'media_ext' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'media_title' => array(
            'default' => null,
            'data_type' => 'varchar',
            'null' => false,
        ),
        'media_protected' => array(
            'default' => 0,
            'data_type' => 'tinyint',
            'null' => false,
        ),
        'media_width' => array(
            'default' => null,
            'data_type' => 'smallint unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'media_height' => array(
            'default' => null,
            'data_type' => 'smallint unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'media_filesize' => array(
            'default' => null,
            'data_type' => 'smallint unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'media_created_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'media_updated_at' => array(
            'data_type' => 'timestamp',
            'null' => false,
        ),
        'media_created_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
        'media_updated_by_id' => array(
            'default' => null,
            'data_type' => 'int unsigned',
            'null' => true,
            'convert_empty_to_null' => true,
        ),
    );

    public static $private_path = 'data/media/';
    public static $public_path  = 'media/';

    protected static $_has_one = array();
    protected static $_many_many = array();

    protected static $_belongs_to = array(
        'folder' => array(
            'key_from'       => 'media_folder_id',
            'model_to'       => 'Nos\Media\Model_Folder',
            'key_to'         => 'medif_id',
            'cascade_save'   => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_has_many = array(
        'link' => array(
            'key_from' => 'media_id',
            'model_to' => 'Nos\Media\Model_Link',
            'key_to' => 'medil_media_id',
            'cascade_save' => false,
            'cascade_delete' => false,
        ),
    );

    protected static $_observers = array(
        'Orm\Observer_Self' => array(
        ),
        'Orm\Observer_CreatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'media_created_at'
        ),
        'Orm\Observer_UpdatedAt' => array(
            'mysql_timestamp' => true,
            'property'=>'media_updated_at'
        ),
    );

    protected static $_behaviours = array(
        'Nos\Orm_Behaviour_Author' => array(
            'created_by_property' => 'media_created_by_id',
            'updated_by_property' => 'media_updated_by_id',
        ),
    );

    /**
     * Properties
     * media_id
     * media_folder_id
     * media_file
     * media_ext
     * media_title
     * media_application
     * media_protected
     * media_width
     * media_height
     */

    public function delete_from_disk()
    {
        $file = APPPATH.$this->get_private_path();
        if (is_file($file)) {
            \File::delete($file);
        }

        return true;
    }

    public function delete_public_cache()
    {
        // Delete cached media entries
        $path_public     = DOCROOT.$this->get_public_path();
        $path_thumbnails = dirname(DOCROOT.str_replace('media/', 'cache/media', static::$public_path).$this->media_path);
        try {
            // delete_dir($path, $recursive, $delete_top)
            \File::is_link($path_public)    and \File::delete($path_public);
            is_dir($path_thumbnails) and \File::delete_dir($path_thumbnails, true, true);

            return true;
        } catch (\Exception $e) {
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                throw $e;
            }
        }
    }

    public function get_path()
    {
        return ltrim($this->virtual_path(), '/');
    }

    public function get_private_path()
    {
        return static::$private_path.$this->get_path();
    }

    public function get_img_tag($params = array())
    {
        if (!$this->is_image()) {
            return false;
        }
        $params_default = array(
            'max_width' => null,
            'max_height' => null,
        );
        $params = array_merge($params_default, $params);

        list($src, $width, $height) = $this->get_img_infos($params['max_width'], $params['max_height']);

        $params = array_diff_key(array_merge(array(
            'width' => $width,
            'height' => $height,
            'alt' => $this->media_title,
        ), $params), $params_default);

        return \Html::img($src, $params);
    }

    public function get_img_tag_resized($max_width = null, $max_height = null, $params = array())
    {
        return $this->get_img_tag(array_merge($params, array(
            'max_width'  => $max_width,
            'max_height' => $max_height,
        )));
    }

    public function get_img_infos($max_width = null, $max_height = null)
    {
        if (!$this->is_image()) {
            return false;
        }
        if (!empty($max_width) || !empty($max_height)) {
            list($width, $height, $ratio) = \Nos\Tools_Image::calculate_ratio($this->media_width, $this->media_height, $max_width, $max_height);
            $src = $this->get_public_path_resized($max_width, $max_height);
        } else {
            list($width, $height) = array($this->media_width, $this->media_height);
            $src = $this->get_public_path();
            $ratio = 1;
        }

        return array($src, $width, $height, $ratio);
    }

    public function is_image()
    {
        return in_array($this->media_ext, array('jpg', 'png', 'gif', 'jpeg', 'bmp'));
    }

    public function getImageToolkit()
    {
        if (!$this->is_image()) {
            return false;
        }

        return \Nos\Toolkit_Image::forge($this);
    }

    public function get_public_path()
    {
        return static::$public_path.$this->get_path();
    }

    public function get_public_path_resized($max_width = 0, $max_height = 0)
    {
        if (!$this->is_image()) {
            return false;
        }

        return $this->getImageToolkit()->shrink($max_width, $max_height)->url();
    }

    public function _event_before_save()
    {
        parent::_event_before_save();

        $file = APPPATH.$this->get_private_path();
        if (is_file($file)) {
            $is_image = @getimagesize($file);
            if ($is_image !== false) {
                list($this->media_width, $this->media_height) = $is_image;
            }

            $this->media_filesize = filesize($file);
        }
    }
}
