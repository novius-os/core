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

class Application
{
    public static function _init()
    {
        // @todo repair that
        //\Module::load('data', APPPATH.'data');
        \Config::load(APPPATH.'data/config/app_installed.php', 'data::app_installed');
    }

    /**
     *
     * @param string $name
     * @param array $real_metadata Optional
     * @return Application
     */
    public static function forge($name, $real_metadata = array())
    {
        return new static($name, $real_metadata);
    }

    /**
     *
     * @param string[] $repositories
     * @return Application
     */
    public static function search_all($repositories = array())
    {
        $repositories = array(
            'local' => APPPATH.'applications'.DS,
        );
        // @todo use config.modules_path?

        $applications = array();
        foreach ($repositories as $where => $path)
        {
            $list = \File::read_dir($path, 1);

            // idc = I don't care
            foreach ($list as $folder => $idc)
            {
                $app_name = trim($folder, '/\\');
                $applications[$app_name] = static::forge($app_name);
            }
        }
        return $applications;
    }

    protected $folder;
    protected $metadata = array();
    protected $real_metadata = array();

    public function __construct($folder, $metadata = array(), $real_metadata = array())
    {
        $this->folder = $folder;
        $this->metadata = \Config::get('data::app_installed.'.$this->folder, array());
        $this->real_metadata = $real_metadata;
    }

    /**
     * Computes the application name (from cached metadata, real metadata or folder basename)
     * @return string
     */
    public function get_name()
    {
        $metadata = $this->metadata;
        if (empty($metadata))
        {
            $metadata = $this->get_real_metadata();
        }
        return isset($metadata['name']) ? $metadata['name'] : $this->folder;
    }

    /**
     * Returns the cached metadata for this application
     * @return array
     */
    public function get_metadata()
    {
        return $this->metadata;
    }

    /**
     * Read the actual metadata from the application's config file
     * @return array
     */
    public function get_real_metadata()
    {
        if (empty($this->real_metadata))
        {
            \Config::load($this->folder.'::metadata', true);
            $this->real_metadata = \Config::get($this->folder.'::metadata');
        }
        return $this->real_metadata;
    }

    /**
     *  Check whether an application is installed
     * @return bool
     */
    public function is_installed()
    {
        return!empty($this->metadata);
    }

    /**
     *  Check whether an application is correctly installed
     * @return bool
     */
    public function is_dirty()
    {
        return ($this->folder != 'local' && !$this->check_install()) || !$this->check_metadata();
    }

    protected function check_install()
    {
        return is_dir(APPPATH.'applications'.DS.$this->folder) && $this->is_link('static') && $this->is_link('htdocs');
    }

    /**
     * Check whether the cached and real metadata are different
     * @return bool
     */
    public function check_metadata()
    {
        $diff_metadata = $this->diff_metadata();
        return empty($diff_metadata);
    }

    /**
     * Returns the differences between the cached and real metadata
     * @return array
     */
    public function diff_metadata()
    {
        $diff_metadata = array();
        static::array_diff_key_assoc($this->get_metadata(), $this->get_real_metadata(), $diff_metadata);
        return $diff_metadata;
    }

    /**
     * Install an application:
     * - Authorise the user who added the application to access it
     * - Create the symbolic links
     * - Update the cached metadata
     *
     * @return bool
     * @throws \Exception
     */
    public function install()
    {
        $this->addPermission();

        $old_metadata = \Config::get('data::app_installed.'.$this->folder, array());
        \Config::load($this->folder.'::metadata', true);
        $new_metadata = \Config::get($this->folder.'::metadata');

        // Check if the installation is compatible with other applications
        $config = $this->prepare_config($old_metadata, $new_metadata);

        // If symlinks are created, save the config
        if ($this->folder != 'local' && !$this->check_install())
        {
            $this->unsymlink('static') && $this->unsymlink('htdocs');
            $this->symlink('static') && $this->symlink('htdocs');
        }

        // Cache the metadata used to install the application
        $config['app_installed'] = \Config::get('data::app_installed', array());
        $config['app_installed'][$this->folder] = $new_metadata;
        $this->save_config($config);

        return true;
    }

    /**
     * Uninstall an application:
     * - Remove the symbolic links
     * - Update the cached metadata
     *
     * @return bool
     * @throws \Exception
     */
    public function uninstall()
    {
        $old_metadata = \Config::get('data::app_installed.'.$this->folder);
        $new_metadata = array();

        // Check if the installation is compatible with other applications
        $config = $this->prepare_config($old_metadata, $new_metadata);

        if ($this->unsymlink('static') && $this->unsymlink('htdocs'))
        {
            // Remove the application
            $config['app_installed'] = \Config::get('data::app_installed', array());
            unset($config['app_installed'][$this->folder]);
            $this->save_config($config);
        }
        return true;
    }

    protected function prepare_config($old_metadata, $new_metadata)
    {
        // Load current data
        $data_path = APPPATH.'data'.DS.'config'.DS;
        foreach (array('templates', 'enhancers', 'launchers', 'models_url_enhanced') as $config_file)
        {
            \Config::load($data_path.$config_file.'.php', 'data::'.$config_file);
            ${$config_file} = \Config::get('data::'.$config_file, true);
        }

        if (!isset($new_metadata['templates']))
        {
            $new_metadata['templates'] = array();
        }
        if (!isset($new_metadata['launchers']))
        {
            $new_metadata['launchers'] = array();
        }
        if (!isset($new_metadata['enhancers']))
        {
            $new_metadata['enhancers'] = array();
        }
        if (!isset($old_metadata['templates']))
        {
            $old_metadata['templates'] = array();
        }
        if (!isset($old_metadata['launchers']))
        {
            $old_metadata['launchers'] = array();
        }
        if (!isset($old_metadata['enhancers']))
        {
            $old_metadata['enhancers'] = array();
        }

        $removed_templates = array();
        $removed_launchers = array();
        $removed_enhancers = array();

        if (empty($old_metadata))
        {
            // Add
            $added_templates = $new_metadata['templates'];
            $added_launchers = $new_metadata['launchers'];
            $added_enhancers = $new_metadata['enhancers'];
        }
        else
        {
            // Repair
            $added_templates   = array_diff_key($new_metadata['templates'], $old_metadata['templates']);
            $removed_templates = array_diff_key($old_metadata['templates'], $new_metadata['templates']);
            $added_launchers   = array_diff_key($new_metadata['launchers'], $old_metadata['launchers']);
            $removed_launchers = array_diff_key($old_metadata['launchers'], $new_metadata['launchers']);
            $added_enhancers   = array_diff_key($new_metadata['enhancers'], $old_metadata['enhancers']);
            $removed_enhancers = array_diff_key($old_metadata['enhancers'], $new_metadata['enhancers']);
        }

        // Check duplicate templates
        if (!empty($added_templates)) {
            $duplicates = array_intersect_key($templates, $added_templates);
            if (count($duplicates) > 0)
            {
                throw new \Exception(count($duplicates).' templates from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        if (!empty($removed_templates)) {
            // Check template usage in the page
            $pages = Model_Page::find('all', array('where' => array(array('page_template', 'IN', array_keys($removed_templates)))));
            if (count($pages) > 0)
            {
                throw new \Exception(count($pages).' pages use a template from this application.');
            }
        }

        // Check duplicate launchers
        if (!empty($added_launchers)) {
            $duplicates = array_intersect_key($launchers, $added_launchers);
            if (count($duplicates) > 0)
            {
                throw new \Exception(count($duplicates).' launchers from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        // Check duplicate enhancers
        if (!empty($added_enhancers)) {
            $duplicates = array_intersect_key($enhancers, $added_enhancers);
            if (count($duplicates) > 0)
            {
                throw new \Exception(count($duplicates).' enhancers from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        // Update actual configuration
        // TEMPLATES
        $templates = array_merge($templates, $added_templates);
        $templates = array_diff_key($templates, $removed_templates);

        // LAUNCHERS
        $launchers = array_merge($launchers, $added_launchers);
        $launchers = array_diff_key($launchers, $removed_launchers);

        // ENHANCERS
        $enhancers = array_merge($enhancers, $added_enhancers);
        $enhancers = array_diff_key($enhancers, $removed_enhancers);

        foreach ($added_enhancers as $key => $enhancer)
        {
            foreach ($enhancer['models_url_enhanced'] as $model)
            {
                $models_url_enhanced[$model][] = $key;
            }
        }

        foreach ($removed_enhancers as $key => $enhancer)
        {
            foreach ($enhancer['models_url_enhanced'] as $model)
            {
                $remove = array_search($key, $models_url_enhanced[$model]);
                unset($models_url_enhanced[$model][$remove]);
            }
        }

        return array(
            'templates' => $templates,
            'enhancers' => $enhancers,
            'launchers' => $launchers,
            'models_url_enhanced' => $models_url_enhanced,
        );
    }

    protected function save_config($config)
    {
        $data_path = APPPATH.'data'.DS.'config'.DS;
        foreach ($config as $file => $content)
        {
            \Config::save($data_path.$file.'.php', $content);
            \Config::set('data::'.$file, $content);
        }
    }

    protected function symlink($folder)
    {
        if (!$this->is_link($folder))
        {
            $private = APPPATH.'applications'.DS.$this->folder.DS.$folder;
            if (is_dir($private))
            {
                $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
                if (is_link($public))
                {
                    unlink($public);
                }
                if (!symlink($private, $public))
                {
                    throw new \Exception('Can\'t create symlink for "'.$folder.DS.'apps'.DS.$this->folder.'"');
                }
            }
        }
        return true;
    }

    protected function unsymlink($folder)
    {
        $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
        if (is_link($public) || file_exists($public))
        {
            return unlink($public);
        }
        return true;
    }

    protected function is_link($folder)
    {
        $private = APPPATH.'applications'.DS.$this->folder.DS.$folder;
        $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
        if (file_exists($private))
        {
            return is_link($public) && readlink($public) == $private;
        }
        return!is_link($public);
    }

    protected static function _refresh_dependencies(array $params = array())
    {
        $add = isset($params['add']) ? $params['add'] : false;
        $remove = isset($params['remove']) ? $params['remove'] : false;
        $app_refresh = $add ? $add : $remove;

        $dependencies = array();
        if ($add)
        {
            \Config::load($app_refresh.'::metadata', true);
            $config = \Config::get($app_refresh.'::metadata', array());

            if (isset($config['extends']))
            {
                if (!isset($dependencies[$config['extends']]))
                {
                    $dependencies[$config['extends']] = array();
                }
                $dependencies[$config['extends']][] = $app_refresh;
            }
        }

        \Config::load(APPPATH.'data/config/app_installed.php', 'data::app_installed');
        $app_installed = \Config::get('data::app_installed', array());

        foreach ($app_installed as $app_name => $app)
        {
            if ($app_refresh !== $app_name)
            {
                \Config::load($app_name.'::metadata', true);
                $config = \Config::get($app_name.'::metadata', array());
                if (isset($config['extends']))
                {
                    if (!isset($dependencies[$config['extends']]))
                    {
                        $dependencies[$config['extends']] = array();
                    }
                    $dependencies[$config['extends']][] = $app_name;
                }
            }
        }

        \Config::set('app_dependencies', $dependencies);
        \Config::save(APPPATH.'data'.DS.'config'.DS.'app_dependencies.php', $dependencies);
    }

    public function addPermission()
    {
        Permission::add($this->folder, 'access');
    }

    public function __get($property)
    {
        if (method_exists($this, 'get_'.$property))
        {
            return $this->{'get_'.$property}();
        }
        return $this->$property;
    }

    /**
     * Computes the diff between 2 arrays, bith on keys and values.
     * @param type $arr1  First array to compare
     * @param type $arr2  Second array to compare
     * @param type $diff  Returns the diff between the 2 array
     */
    protected static function array_diff_key_assoc($arr1, $arr2, &$diff = array())
    {
        foreach ($arr1 as $k => $v)
        {
            if (!isset($arr2[$k]))
            {
                $diff[$k] = array($v, null);
            }
            else if (is_array($v))
            {
                unset($subdiff);
                static::array_diff_key_assoc($v, $arr2[$k], $subdiff);
                if (!empty($subdiff))
                {
                    $diff[$k] = $subdiff;
                }
            }
            else if ($arr2[$k] !== $v)
            {
                $diff[$k] = array($v, $arr2[$k]);
            }
        }
        foreach ($arr2 as $k => $v)
        {
            if (!isset($arr1[$k]))
            {
                $diff[$k] = array(null, $v);
            }
        }
    }

}