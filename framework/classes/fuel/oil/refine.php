<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Refine extends Oil\Refine
{

    public static function run($task, $args)
    {
        $task = strtolower($task);

        // Make sure something is set
        if (empty($task) or $task === 'help') {
            static::help();

            return;
        }

        $module = false;
        list($module, $task) = array_pad(explode('::', $task), 2, null);

        if ($task === null) {
            $task = $module;
            $module = false;
        }

        // Just call and run() or did they have a specific method in mind?
        list($task, $method) = array_pad(explode(':', $task), 2, 'run');

        // Added support for FuelPHP 2 tasks
        if ($module) {
            if ($module == 'local') {
                $namespace = 'Local';
            } else if ($module == 'nos') {
                $namespace = 'Nos';
            } else {
                $namespaces = \Nos\Config_Data::load('app_namespaces', true);
                $namespace = $namespaces[$module];
            }
            $class = $namespace.'\\Task_'.ucfirst($task);
            if (class_exists($class)) {
                $new_task = new $class;
                echo call_user_func_array(array($new_task, $method), $args);
                return;
            }
        }

        $path = false;
        if ($module) {
            if ($module == 'nos') {
                $path = NOSPATH;
            } else {
                try {
                    \Module::load($module);
                    $path = \Module::exists($module);
                    \Finder::instance()->add_path($path);
                } catch (\FuelException $e) {
                    throw new Exception(sprintf('Module "%s" does not exist.', $module));
                }
            }
        }

        $files = \Finder::search('tasks', $task, '.php', true);
        $file = false;
        // Multiple files can have the same names... Lines below allow to select the correct file depending on which
        // module / local / core we want to call the task on.
        if (count($files) > 0) {
            $file = $files[0];
        }
        if ($path != false) {
            foreach ($files as $f) {
                if ($module) {
                    if (\Str::starts_with($f, $path)) {
                        $file = $f;
                        break;
                    }
                }
            }
        }

        // Find the task
        if (!$file) {
            $files = \Finder::instance()->list_files('tasks');
            $possibilities = array();
            foreach ($files as $file) {
                $possible_task = pathinfo($file, \PATHINFO_FILENAME);
                $difference = levenshtein($possible_task, $task);
                $possibilities[$difference] = $possible_task;
            }

            ksort($possibilities);

            if ($possibilities and current($possibilities) <= 5) {
                throw new Exception(sprintf('Task "%s" does not exist. Did you mean "%s"?', $task, current($possibilities)));
            } else {
                throw new Exception(sprintf('Task "%s" does not exist.', $task));
            }

            return;
        }

        require_once $file;

        $originalTask = $task;
        if ($module == false) {
            $task = \Autoloader::generateSuffixedNamespace('nos', 'package', 'Tasks').ucfirst($task);
            if (!class_exists($task)) {
                $task = \Autoloader::generateSuffixedNamespace('default', 'app', 'Tasks').ucfirst($originalTask);
            }
        } else {
            if ($module == 'local') {
                $task = \Autoloader::generateSuffixedNamespace('default', 'app', 'Tasks').ucfirst($originalTask);
            } else if ($module == 'nos') {
                $task = \Autoloader::generateSuffixedNamespace('nos', 'package', 'Tasks').ucfirst($originalTask);
            } else {
                $task = \Autoloader::generateSuffixedNamespace($module, 'module', 'Tasks').ucfirst($task);
            }
        }

        $new_task = new $task;

        // Testing if we are using Cli (we can't use the Cli class if Refine is called from a webpage).
        if (\Fuel::$is_cli) {
            // The help option hs been called, so call help instead
            if (\Cli::option('help') && is_callable(array($new_task, 'help'))) {
                $method = 'help';
            }

            if ($return = call_user_func_array(array($new_task, $method), $args)) {
                \Cli::write($return);
            }
        } else {
            echo call_user_func_array(array($new_task, $method), $args);
        }
    }
}
