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

class Attachment
{

    /**
     * @var  int|string  The ID of the object that the file is attached
     */
    protected $attached = null;

    /**
     * @var  array  The attachment configuration
     */
    protected $config = array();

    /**
     * @var  \Fuel\Core\File_Handler_File New file handler
     */
    protected $new_file = null;

    /**
     * @var  string New file name
     */
    protected $new_file_name = null;

    /**
     * Returns a new Attachment object.
     *
     * @param   mixed   $attached Can be the object that the file is attached, or his ID
     * @param   array|string  $config The Config file or a configuration array
     * @return  Attachment
     */
    public static function forge($attached, $config)
    {
        return new static($attached, $config);
    }

    /**
     * Sets the attachment configuration.
     *
     * @param   mixed   $attached Can be the object that the file is attached, or his ID
     * @param   array|string  $config The Config file or a configuration array
     * @throws \InvalidArgumentException
     * @return \Nos\Attachment
     */
    public function __construct($attached, $config)
    {
        if (!is_array($config)) {
            $config = \Config::load($config, true);
        }

        if (!empty($config['image']) && empty($config['extensions'])) {
            $config['extensions'] = array('jpg', 'gif', 'png', 'jpeg');
            unset($config['image']);
        }

        if (empty($config['extensions']) || !is_array($config['extensions'])) {
            $config['extensions'] = !empty($config['extensions']) ? array($config['extensions']) : array();
        }
        $config['extensions'] = array_map(array('\Str', 'lower'), $config['extensions']);

        if (empty($config['dir'])) {
            throw new \InvalidArgumentException('No directory specified in the configuration.');
        }
        $config['dir'] = rtrim($config['dir'], DS).DS;

        if (empty($config['alias'])) {
            $config['alias'] = $config['dir'];
        }
        $config['alias'] = rtrim(str_replace(DS, '/', $config['alias']), '/').'/';

        $attached = preg_replace('`/`Uu', '_', $attached);

        $this->config = $config;
        $this->attached = $attached;
    }

    /**
     * Get the new Attachment file if one, FALSE if no
     *
     * @return string|bool
     */
    public function newFile()
    {
        return !empty($this->new_file) ? $this->new_file : false;
    }

    /**
     * Get the Attachment file path or FALSE if no file
     *
     * @return string|bool
     */
    public function path()
    {
        $filename = $this->filename();

        return !empty($filename) ? APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached.DS.$filename : false;
    }

    /**
     * Get the Attachment filename or FALSE if no file
     *
     * @return string|bool
     */
    public function filename()
    {
        if (is_dir(APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached)) {
            $files = \Fuel\Core\File::read_dir(APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached, 1, array('!^\.'));
        }

        return !empty($files) ? current($files) : false;
    }

    /**
     * Get the Attachment extension or FALSE if no file
     *
     * @return string|bool
     */
    public function extension()
    {
        $filename = $this->filename();

        return !empty($filename) ? pathinfo($filename, PATHINFO_EXTENSION) : false;
    }

    /**
     * Checks if the Attachment is an image.
     *
     * @return bool
     */
    public function isImage()
    {
        $extension = $this->extension();

        return !empty($extension) ? in_array($extension, array('jpg', 'png', 'gif', 'jpeg', 'bmp')) : false;
    }

    /**
     * Returns an HTML anchor tag with, by default, attachment URL in href and attachment filename in text.
     *
     * If key 'text' is set in $attributes parameter, its value replace attachment filename
     *
     * @param array $attributes Array of attributes to be applied to the anchor tag.
     * @return string
     */
    public function htmlAnchor(array $attributes = array())
    {
        $text = \Arr::get($attributes, 'text', e($this->filename()));
        \Arr::delete($attributes, 'text');

        return \Html::anchor($this->url(), $text, $attributes);
    }

    /**
     * Return a Toolkit_Image based on the attachment
     */
    public function getToolkitImage()
    {
        if (!$this->isImage()) {
            return false;
        }

        return Toolkit_Image_Attachment::forge($this);
    }

    /**
     * Get the url or FALSE if no file
     *
     * @param bool $absolute Default true, if false return relative URL
     * @return	string|bool
     */
    public function url($absolute = true)
    {
        $filename = $this->filename();
        if ($filename === false) {
            return false;
        }

        return ($absolute ? \Uri::base(false) : '').'data/files/'.$this->config['alias'].$this->attached.'/'.$filename;
    }

    /**
     * Get the url of Attachment resized or FALSE if no file or not an image.
     *
     * @param int $max_width The max width of the image.
     * @param int $max_height The max height of the image.
     * @param bool $absolute Default true, if false return relative URL
     * @return  string|bool
     */
    public function urlResized($max_width = 0, $max_height = 0, $absolute = true)
    {
        if (!$this->isImage()) {
            return false;
        }

        return $this->getToolkitImage()->shrink($max_width, $max_height)->url($absolute);
    }

    /**
     * Set a new Attachment file
     *
     * @param   string  $file File path
     * @param   string  $filename The name file
     * @throws \Fuel\Core\FileAccessException
     * @return \Nos\Attachment
     */
    public function set($file, $filename = null)
    {
        if (!is_file($file)) {
            throw new \Fuel\Core\FileAccessException('Invalid path for file.');
        }

        if (empty($filename)) {
            $filename = pathinfo($file, PATHINFO_FILENAME);
        }

        $extension = \Str::lower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!empty($this->config['extensions']) && array_key_exists($extension, $this->config['extensions'])) {
            throw new \Fuel\Core\FileAccessException('File operation not allowed: disallowed file extension.');
        }

        $this->new_file = $file;
        $this->new_file_name = $filename;

        return $this;
    }

    /**
     * Save a new Attachment file
     */
    public function save()
    {
        if (!empty($this->new_file)) {
            $attachments = \Nos\Config_Data::get('attachments', array());
            if (!isset($attachments[$this->config['alias']])) {
                $attachments[$this->config['alias']] = $this->config;

                \Nos\Config_Data::save('attachments', $attachments);
            }

            $this->delete();

            !is_dir(APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached) && \File::create_dir(APPPATH.'data', 'files'.DS.$this->config['dir'].$this->attached);
            copy($this->new_file, APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached.DS.$this->new_file_name);

            $this->new_file = null;
            $this->new_file_name = null;
        }
    }

    /**
     * Delete the Attachment file
     */
    public function delete()
    {
        if (is_dir(APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached)) {
            \File::delete_dir(APPPATH.'data'.DS.'files'.DS.$this->config['dir'].$this->attached);
        }
    }

    /**
     * Delete an alias
     */
    static public function deleteAlias($alias)
    {
        $alias = rtrim($alias, '/').'/';

        $attachments = \Nos\Config_Data::get('attachments', array());
        if (!isset($attachments[$alias])) {
            unset($attachments[$alias]);

            \Nos\Config_Data::save('attachments', $attachments);
        }
    }

    public static function implode_pk($data)
    {
        $new_file = $data->newFile();
        $path = $data->path();
        return $new_file ? $new_file : ($path ? $path : null);
    }
}
