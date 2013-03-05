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
    protected static $repositories;
    protected static $rawAppInstalled;

    public static function _init()
    {
        list($file) = \Nos\Config_Data::getFile('app_installed');
        static::$rawAppInstalled = \Fuel::load($file);

        \Config::load('nos::applications_repositories', true);
        \Config::load('local::applications_repositories', true);
        static::$repositories = \Arr::merge(
            \Config::get('nos::applications_repositories', array()),
            \Config::get('local::applications_repositories', array())
        );
    }

    public static function get_application_path($application)
    {
        foreach (static::$repositories as $repository) {
            $path = $repository['path'].$application;
            if (is_dir($path)) {
                return $path;
            }
        }
        return false;
    }

    public static function installNativeApplications()
    {

        foreach (static::$repositories as $where => $repository) {
            if ($repository['native']) {

                $list = \File::read_dir($repository['path'], 1);

                // idc = I don't care
                foreach ($list as $folder => $idc) {
                    $app_name = trim($folder, '/\\');
                    $application = static::forge($app_name);
                    $application->install(false);
                }
            }
        }
    }

    public static function areNativeApplicationsDirty()
    {
        foreach (static::$repositories as $where => $repository) {
            if ($repository['native']) {
                $list = \File::read_dir($repository['path'], 1);
                foreach ($list as $folder => $idc) {
                    $app_name = trim($folder, '/\\');
                    $application = static::forge($app_name);
                    if ($application->is_dirty()) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public static function cleanApplications()
    {
        foreach (static::$rawAppInstalled as $key => $application) {
            \Module::exists($key);
        }
    }

    /**
     *
     * @param  string      $name
     * @param  array       $real_metadata Optional
     * @return Application
     */
    public static function forge($name, $real_metadata = array())
    {
        return new static($name, $real_metadata);
    }

    /**
     *
     * @param  string[]    $repositories
     * @return Application
     */
    public static function search_all()
    {
        $applications = array();
        foreach (static::$repositories as $where => $repository) {
            if ($repository['visible']) {
                $list = \File::read_dir($repository['path'], 1);

                // idc = I don't care
                foreach ($list as $folder => $idc) {
                    $app_name = trim($folder, '/\\');
                    $applications[$app_name] = static::forge($app_name);
                }
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
        $this->metadata = \Arr::get(static::$rawAppInstalled, $this->folder, array());
        $this->real_metadata = $real_metadata;
    }

    /**
     * Computes the application name (from cached metadata, real metadata or folder basename)
     * @return string
     */
    public function get_name()
    {
        $metadata = $this->metadata;
        if (empty($metadata)) {
            $metadata = $this->getRealMetadata();
        }

        return isset($metadata['name']) ? $metadata['name'] : $this->folder;
    }

    /**
     * Computes the application name (from cached metadata, real metadata or folder basename)
     * @return string
     */
    public function get_name_translated()
    {
        $metadata = $this->metadata;
        if (empty($metadata)) {
            $metadata = $this->getRealMetadata();
        }
        $i18n_file = \Arr::get($metadata, 'i18n_file', false);
        $name = isset($metadata['name']) ? $metadata['name'] : $this->folder;
        if (!empty($i18n_file)) {
            $i18n = \Nos\I18n::dictionary($i18n_file);
            $name = $i18n($name);
        }

        return $name;
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
    public function getRealMetadata()
    {
        if (empty($this->real_metadata)) {
            $this->real_metadata = \Config::metadata($this->folder);
        }

        return $this->real_metadata;
    }

    /**
     *  Check whether an application is installed
     * @return bool
     */
    public function is_installed()
    {
        return !empty($this->metadata);
    }

    /**
     *  Check whether an application is correctly installed
     * @return bool
     */
    public function is_dirty()
    {
        return ($this->folder != 'local' && $this->folder != 'nos' && !$this->check_install()) || !$this->check_metadata();
    }

    protected function check_install()
    {
        return static::get_application_path($this->folder) !== false && $this->is_link('static') && $this->is_link('htdocs');
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
        static::array_diff_key_assoc($this->get_metadata(), $this->getRealMetadata(), $diff_metadata);

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
    public function install($add_permission = true)
    {
        if ($add_permission) {
            $this->addPermission();
        }
        $old_metadata = \Arr::get(static::$rawAppInstalled, $this->folder, array());
        $new_metadata = $this->getRealMetadata();

        // Check if the installation is compatible with other applications
        $config = $this->prepare_config($old_metadata, $new_metadata);

        // If symlinks are created, save the config
        if ($this->folder != 'local' && $this->folder != 'nos' && !$this->check_install()) {
            $this->unsymlink('static') && $this->unsymlink('htdocs');
            $this->symlink('static') && $this->symlink('htdocs');
        }

        // Cache the metadata used to install the application
        $config['app_installed'] = static::$rawAppInstalled;
        $config['app_installed'][$this->folder] = $new_metadata;
        $this->save_config($config);
        static::$rawAppInstalled = $config['app_installed'];

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
        $old_metadata = \Arr::get(static::$rawAppInstalled, $this->folder);
        $new_metadata = array();

        // Check if the installation is compatible with other applications
        $config = $this->prepare_config($old_metadata, $new_metadata);

        if ($this->unsymlink('static') && $this->unsymlink('htdocs')) {
            // Remove the application
            $config['app_installed'] = static::$rawAppInstalled;
            unset($config['app_installed'][$this->folder]);
            $this->save_config($config);
            static::$rawAppInstalled = $config['app_installed'];
        }

        return true;
    }

    protected function prepare_config($old_metadata, $new_metadata)
    {
        // Load current data
        $config = array();
        foreach (array('templates', 'enhancers', 'launchers', 'app_dependencies', 'app_namespaces', 'data_catchers') as $section) {
            $config[$section] = \Nos\Config_Data::load($section, false, true);
        }

        foreach (array('templates', 'enhancers', 'launchers', 'data_catchers') as $section) {
            if (!isset($new_metadata[$section])) {
                $new_metadata[$section] = array();
            }
            if (!isset($old_metadata[$section])) {
                $old_metadata[$section] = array();
            }
            $removed[$section] = array();

            if (empty($old_metadata)) {
                // Add
                $added[$section] = $new_metadata[$section];
            } else {
                // Repair
                $added[$section]   = array_diff_key($new_metadata[$section], $old_metadata[$section]);
                $removed[$section] = array_diff_key($old_metadata[$section], $new_metadata[$section]);
            }
        }

        // Check duplicate templates
        if (!empty($added['templates'])) {
            $duplicates = array_intersect_key($config['templates'], $added['templates']);
            if (count($duplicates) > 0) {
                throw new \Exception(count($duplicates).' templates from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        if (!empty($removed['templates'])) {
            // Check template usage in the page
            $pages = \Nos\Page\Model_Page::find('all', array('where' => array(array('page_template', 'IN', array_keys($removed['templates'])))));
            if (count($pages) > 0) {
                $usedTemplates = array();
                $pageTitles = array();
                foreach ($pages as $page) {
                    $usedTemplates[$page->page_template] = true;
                    $pageTitles[] = $page->page_id; // page_title? too long...
                }
                throw new \Exception(count($pages).' pages use a template from this application. Used templates are: '.implode(', ', array_keys($usedTemplates)).'. Pages ids are: '.implode(', ', $pageTitles));
            }
        }

        // Check duplicate launchers
        if (!empty($added['launchers'])) {
            $duplicates = array_intersect_key($config['launchers'], $added['launchers']);
            if (count($duplicates) > 0) {
                throw new \Exception(count($duplicates).' launchers from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        // Check duplicate enhancers
        if (!empty($added['enhancers'])) {
            $duplicates = array_intersect_key($config['enhancers'], $added['enhancers']);
            if (count($duplicates) > 0) {
                throw new \Exception(count($duplicates).' enhancers from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        // Check duplicate data catchers
        if (!empty($added['data_catchers'])) {
            $duplicates = array_intersect_key($config['data_catchers'], $added['data_catchers']);
            if (count($duplicates) > 0) {
                throw new \Exception(count($duplicates).' data catchers from this application have the same name that in your local configuration: '.implode(', ', array_keys($duplicates)));
            }
        }

        // Update actual configuration
        foreach (array('templates', 'enhancers', 'launchers', 'data_catchers') as $section) {
            // Update
            $updated = array_intersect_key($new_metadata[$section], $old_metadata[$section]);
            foreach ($updated as $k => $v) {
                $config[$section][$k] = $v;
            }

            $config[$section] = array_merge($config[$section], $added[$section]);
            $config[$section] = array_diff_key($config[$section], $removed[$section]);
        }

        // More treatment for enhancers

        $old_namespace = \Arr::get($old_metadata, 'namespace', '');
        $new_namespace = \Arr::get($new_metadata, 'namespace', '');

        if ($old_namespace != $new_namespace) {
            unset($config['app_namespaces'][$this->folder]);
            if ($new_namespace != '') {
                $config['app_namespaces'][$this->folder] = $new_namespace;
            }
        }

        $old_dependency = \Arr::get($old_metadata, 'extends', '');
        $new_dependency = \Arr::get($new_metadata, 'extends', '');

        if ($old_dependency != $new_dependency) {
            // Add new dependency
            if ($new_dependency != '') {
                if (empty($config['app_dependencies'][$new_dependency])) {
                    $config['app_dependencies'][$new_dependency] = array();
                }
                $config['app_dependencies'][$new_dependency][] = $this->folder;
            }

            // Remove old dependency
            if (!empty($config['app_dependencies'][$old_dependency])) {
                foreach (array_keys($config['app_dependencies'][$old_dependency], $this->folder) as $key) {
                    unset($config['app_dependencies'][$old_dependency][$key]);
                }
            }
        }

        return $config;
    }

    protected function save_config($config)
    {
        foreach ($config as $file => $content) {
            \Nos\Config_Data::save($file, $content);
        }
    }

    protected function symlink($folder)
    {
        if (!$this->is_link($folder)) {
            $private = static::get_application_path($this->folder).DS.$folder;
            if (is_dir($private)) {
                $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
                if (is_link($public)) {
                    unlink($public);
                }

                // It seems that symlink() does not work every time (confs, right?)
                // Several trials with native version and exec(), in relative and absolute
                // http://forums.novius-os.org/support-forums/contributions/petit-probleme,feed,98.html

                $dirname = dirname($public);
                $relative = Tools_File::relativePath($dirname, $private);
                if (symlink($relative, $public)) {
                    return true;
                }

                exec('cd '.$dirname.'; ln -s '.$relative.' '.$this->folder);
                if (is_link($public)) {
                    return true;
                }

                if (symlink($private, $public)) {
                    return true;
                }

                exec('cd '.$dirname.'; ln -s '.$private.' '.$this->folder);
                if (is_link($public)) {
                    return true;
                }

                \Log::error('cd '.$dirname.'; ln -s '.$private.' '.$this->folder);
                throw new \Exception('Can\'t create symlink for "'.$folder.DS.'apps'.DS.$this->folder.'"');
            }
        }

        return true;
    }

    protected function unsymlink($folder)
    {
        $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
        if (is_link($public) || file_exists($public)) {
            return unlink($public);
        }

        return true;
    }

    protected function is_link($folder)
    {
        $private =  static::get_application_path($this->folder).DS.$folder;
        $public = DOCROOT.$folder.DS.'apps'.DS.$this->folder;
        if (file_exists($private)) {
            return is_link($public) && in_array(readlink($public), array(
                $private,
                Tools_File::relativePath(dirname($public), $private)
            ));
        }

        return !is_link($public);
    }

    public function addPermission()
    {
        Permission::add($this->folder, 'access');
    }

    public function __get($property)
    {
        if (method_exists($this, 'get_'.$property)) {
            return $this->{'get_'.$property}();
        }

        return $this->$property;
    }

    /**
     * Computes the diff between 2 arrays, bith on keys and values.
     * @param type $arr1 First array to compare
     * @param type $arr2 Second array to compare
     * @param type $diff Returns the diff between the 2 array
     */
    protected static function array_diff_key_assoc($arr1, $arr2, &$diff = array())
    {
        foreach ($arr1 as $k => $v) {
            if (!isset($arr2[$k])) {
                $diff[$k] = array($v, null);
            } elseif (is_array($v)) {
                unset($subdiff);
                static::array_diff_key_assoc($v, $arr2[$k], $subdiff);
                if (!empty($subdiff)) {
                    $diff[$k] = $subdiff;
                }
            } elseif ($arr2[$k] !== $v) {
                $diff[$k] = array($v, $arr2[$k]);
            }
        }
        foreach ($arr2 as $k => $v) {
            if (!isset($arr1[$k])) {
                $diff[$k] = array(null, $v);
            }
        }
    }

    public static function getCurrent()
    {
        // Get current application called on controllers
        return \Nos\Controller::getCurrentApplication();
    }

}
