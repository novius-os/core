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

        if ($module) {
            try {
                \Module::load($module);
                $path = \Module::exists($module);
                \Finder::instance()->add_path($path);
            } catch (\FuelException $e) {
                throw new Exception(sprintf('Module "%s" does not exist.', $module));
            }
        }

        // Just call and run() or did they have a specific method in mind?
        list($task, $method) = array_pad(explode(':', $task), 2, 'run');

        // Find the task
        if (!$file = \Finder::search('tasks', $task)) {
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
        $task = '\\Nos\\Tasks\\'.ucfirst($task);
        if (!class_exists($task)) {
            $task = '\\Fuel\\Tasks\\'.ucfirst($originalTask);
        }

        $new_task = new $task;

        // The help option hs been called, so call help instead
        if (\Cli::option('help') && is_callable(array($new_task, 'help'))) {
            $method = 'help';
        }

        if ($return = call_user_func_array(array($new_task, $method), $args)) {
            \Cli::write($return);
        }
    }
}
