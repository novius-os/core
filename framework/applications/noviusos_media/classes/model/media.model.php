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
            'character_maximum_length' => 100,
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
    protected static $_twinnable_has_one = array();
    protected static $_twinnable_has_many = array();
    protected static $_twinnable_belongs_to = array();
    protected static $_twinnable_many_many = array();

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

    /**
     * Delete the media from disk
     */
    public function deleteFromDisk()
    {
        $this->deleteCache();
        $file = $this->path();
        is_file($file) and \File::delete($file);
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
     * Delete all caches of the media
     */
    public function deleteCache()
    {
        try {
            $image_url = $this->url(false);
            $pathinfo = pathinfo($image_url);
            $path = ltrim($pathinfo['dirname'], '/').DS.$pathinfo['filename'];

            $path_public = DOCROOT.$image_url;
            $path_public_cache = DOCROOT.'cache'.DS.$path;
            $path_private_cache = \Config::get('cache_dir').$path;

            \File::is_link($path_public) and \File::delete($path_public);
            is_dir($path_public_cache) and \File::delete_dir($path_public_cache, true, true);
            is_dir($path_private_cache) and \File::delete_dir($path_private_cache, true, true);
        } catch (\Exception $e) {
            \Log::exception($e, 'Error while deleting the cache of media '.$this->media_id.' ('.$path.'). ');
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

    /**
     * Return the media virtual path.
     *
     * @return	string
     */
    protected function _getVirtualPath()
    {
        return ltrim($this->virtual_path(), '/');
    }

    /**
     * @deprecated Use getPath() method instead
     */
    public function get_path()
    {
        \Log::deprecated('->get_path() is deprecated, use ->_getVirtualPath() instead.', 'Chiba.2');
        return $this->_getVirtualPath();
    }

    /**
     * Return the path of the media relative to APPPATH
     *
     * @return	string
     */
    public function path()
    {
        return APPPATH.static::$private_path.$this->_getVirtualPath();
    }

    /**
     * @deprecated Use get_private_path() method instead
     */
    public function get_private_path()
    {
        \Log::deprecated('->get_private_path() is deprecated, use ->path() instead.', 'Chiba.2');
        return \Str::sub($this->path(), \Str::length(APPPATH));
    }

    /**
     * Return an html image tag of the media
     *
     * Sets width, height, alt attributes is not supplied.
     *
     * @param   array   $params the attributes array
     * @return	string	The image tag
     */
    public function htmlImg($params = array())
    {
        if (!$this->isImage()) {
            return false;
        }

        $toolkit_image = $this->getToolkitImage();

        if (isset($params['transformations'])) {
            $transformations = (array) $params['transformations'];
            $toolkit_image->transformations($transformations);
            unset($params['transformations']);
        }

        return $toolkit_image->html($params);
    }

    /**
     * Return an html image tag of the media resized
     *
     * Sets width, height, alt attributes is not supplied.
     *
     * @param   int     $max_width The max width of the image.
     * @param   int     $max_height The max height of the image.
     * @param   array   $params the attributes array
     * @return	string	The image tag
     */
    public function htmlImgResized($max_width = null, $max_height = null, $params = array())
    {
        if (!isset($params['transformations'])) {
            $params['transformations'] = array();
        }
        $params['transformations'][] = array('shrink', $max_width, $max_height);

        return $this->htmlImg($params);
    }

    /**
     * Returns an HTML anchor tag with, by default, media URL in href and media title in text.
     *
     * If key 'text' is set in $attributes parameter, its value replace media title
     *
     * @param array $attributes Array of attributes to be applied to the anchor tag.
     * @return string
     */
    public function htmlAnchor(array $attributes = array())
    {
        $text = \Arr::get($attributes, 'text', e($this->media_title));
        \Arr::delete($attributes, 'text');

        return \Html::anchor($this->url(), $text, $attributes);
    }

    /**
     * @deprecated Use htmlImg() method instead
     */
    public function get_img_tag($params = array())
    {
        if (isset($params['max_width']) || isset($params['max_height'])) {
            \Log::deprecated('->get_img_tag() is deprecated, use ->htmlImg() instead. Use a "transformations" key with array value, filled with a item array("shrink", $max_width, $max_height) instead of keys "max_width" and "max_height" in the array parameter', 'Chiba.2');
            if (!isset($params['transformations'])) {
                $params['transformations'] = array();
            }
            $max_width = isset($params['max_width']) ? $params['max_width'] : null;
            $max_height = isset($params['max_height']) ? $params['max_height'] : null;
            unset($params['max_width']);
            unset($params['max_height']);
            $params['transformations'][] = array('shrink', $max_width, $max_height);
        } else {
            \Log::deprecated('->get_img_tag() is deprecated, use ->htmlImg() instead.', 'Chiba.2');
        }
        return $this->htmlImg($params);
    }

    /**
     * @deprecated Use htmlImgResized() method instead
     */
    public function get_img_tag_resized($max_width = null, $max_height = null, $params = array())
    {
        \Log::deprecated('->get_img_tag_resized() is deprecated, use ->htmlImgResized() instead.', 'Chiba.2');
        return $this->htmlImgResized($max_width, $max_height, $params);
    }

    /**
     * Checks if the Attachment is an image.
     *
     * @return bool
     */
    public function isImage()
    {
        return in_array($this->media_ext, array('jpg', 'png', 'gif', 'jpeg', 'bmp'));
    }

    /**
     * @deprecated Use isImage() method instead
     */
    public function is_image()
    {
        \Log::deprecated('->is_image() is deprecated, use ->isImage() instead.', 'Chiba.2');
        return $this->isImage();
    }

    public function getToolkitImage()
    {
        if (!$this->isImage()) {
            return false;
        }

        return Toolkit_Image::forge($this);
    }

    /**
     * Get the url of the media
     *
     * @param bool $absolute Default true, if false return relative URL
     * @return string
     */
    public function url($absolute = true)
    {
        return ($absolute ? \Uri::base(false) : '').static::$public_path.$this->_getVirtualPath();
    }

    /**
     * Get the url of the media resized or FALSE if not an image.
     *
     * @param int $max_width The max width of the image.
     * @param int $max_height The max height of the image.
     * @param bool $absolute Default true, if false return relative URL
     * @return  string|bool
     */
    public function urlResized($max_width, $max_height = null, $absolute = true)
    {
        if (!$this->isImage()) {
            return false;
        }

        return $this->getToolkitImage()->shrink($max_width, $max_height)->url($absolute);
    }

    /**
     * @deprecated Use url() method instead
     */
    public function get_public_path()
    {
        \Log::deprecated('->get_public_path() is deprecated, use ->url() instead.', 'Chiba.2');
        return $this->url(false);
    }

    /**
     * @deprecated Use urlResized() method instead
     */
    public function get_public_path_resized($max_width = 0, $max_height = 0)
    {
        \Log::deprecated('->get_public_path_resized() is deprecated, use ->urlResized() instead.', 'Chiba.2');
        if ($max_width === 0) {
            $max_width = null;
        }
        if ($max_height === 0) {
            $max_height = null;
        }
        return $this->urlResized($max_width, $max_height, false);
    }

    public function _event_before_save()
    {
        parent::_event_before_save();

        $file = $this->path();
        if (is_file($file)) {
            $is_image = @getimagesize($file);
            if ($is_image !== false) {
                list($this->media_width, $this->media_height) = $is_image;
            }

            $this->media_filesize = filesize($file);
        }
    }

    public function _event_after_delete()
    {
        $this->deleteFromDisk();
    }
}
