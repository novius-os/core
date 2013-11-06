<?php

class Generate extends \Oil\Generate
{
    private static $_default_constraints = array(
        'varchar' => 255,
        'char' => 255,
        'int' => 11
    );

    public static function migration($args, $build = true)
    {
        // Get the path where files should be generated
        $working_path = static::_working_path();

        // Get the migration name
        $migration_name = \Str::lower(str_replace(array('-', '/'), '_', array_shift($args)));

        if (empty($migration_name) or mb_strpos($migration_name, ':')) {
            throw new Exception("Command is invalid.".PHP_EOL."\tphp oil g migration <migrationname> [<fieldname1>:<type1> |<fieldname2>:<type2> |..]");
        }

        // Check if a migration with this name already exists
        if (($duplicates = glob($working_path."migrations/*_{$migration_name}*")) === false) {
            throw new Exception("Unable to read existing migrations. Do you have an 'open_basedir' defined?");
        }

        if (count($duplicates) > 0) {
            // Don't override a file
            if (\Cli::option('s', \Cli::option('skip')) === true) {
                return;
            }

            // Tear up the file path and name to get the last duplicate
            $file_name = pathinfo(end($duplicates), PATHINFO_FILENAME);

            // Override the (most recent) migration with the same name by using its number
            if (\Cli::option('f', \Cli::option('force')) === true) {
                list($number) = explode('_', $file_name);
            } elseif (static::$scaffolding === false) {
                // Name clashes but this is done by hand. Assume they know what they're doing and just increment the file
                // Increment the name of this
                $migration_name = \Str::increment(mb_substr($file_name, 4), 2);
            }
        }

        // See if the action exists
        $methods = get_class_methods('Oil\Generate_Migration_Actions');

        // For empty migrations that dont have actions
        $migration = array('', '');

        // Loop through the actions and act on a matching action appropriately
        foreach ($methods as $method_name) {
            // If the miration name starts with the name of the action method
            if (mb_substr($migration_name, 0, mb_strlen($method_name)) === $method_name) {
                /**
                 *    Create an array of the subject the migration is about
                 *
                 *    - In a migration named 'create_users' the subject is 'users' since thats what we want to create
                 *        So it would be the second object in the array
                 *            array(false, 'users')
                 *
                 *    - In a migration named 'add_name_to_users' the object is 'name' and the subject is 'users'.
                 *        So again 'users' would be the second object, but 'name' would be the first
                 *            array('name', 'users')
                 *
                 */
                $subjects = array(false, false);
                $matches = explode('_', str_replace($method_name.'_', '', $migration_name));

                // create_{table}
                if (count($matches) == 1) {
                    $subjects = array(false, $matches[0]);
                } elseif (count($matches) == 3 && $matches[1] == 'to') {
                    // add_{field}_to_{table}
                    $subjects = array($matches[0], $matches[2]);
                } else {
                    // rename_field_{field}_to_{field}_in_{table} (with underscores in field names)

                    if (count($matches) >= 5 && in_array('to', $matches) && in_array('in', $matches)) {
                        $subjects = array(
                            implode('_', array_slice($matches, array_search('in', $matches) + 1)),
                            implode('_', array_slice($matches, 0, array_search('to', $matches))),
                            implode('_', array_slice($matches, array_search('to', $matches) + 1, array_search('in', $matches) - 2))
                        );
                    } else {
                        // create_{table} or drop_{table} (with underscores in table name)

                        if (count($matches) !== 0) {
                            $name = str_replace(array('create_', 'add_', '_to_'), array('create-', 'add-', '-to-'), $migration_name);

                            if (preg_match('/^(create|add)\-([a-z0-9\_]*)(\-to\-)?([a-z0-9\_]*)?$/iu', $name, $deep_matches)) {
                                switch ($deep_matches[1]) {
                                    case 'create':
                                        $subjects = array(false, $deep_matches[2]);
                                        break;

                                    case 'add':
                                        $subjects = array($deep_matches[2], $deep_matches[4]);
                                        break;
                                }
                            }
                        } else {
                            // There is no subject here so just carry on with a normal empty migration
                            break;
                        }
                    }
                }

                // We always pass in fields to a migration, so lets sort them out here.
                $fields = array();
                foreach ($args as $field) {
                    $field_array = array();

                    // Each paramater for a field is seperated by the : character
                    $parts = explode(":", $field);

                    // We must have the 'name:type' if nothing else!
                    if (count($parts) >= 2) {
                        $field_array['name'] = array_shift($parts);
                        foreach ($parts as $part_i => $part) {
                            preg_match('/([a-z0-9_-]+)(?:\[([0-9a-z\,\s]+)\])?/iu', $part, $part_matches);
                            array_shift($part_matches);

                            if (count($part_matches) < 1) {
                                // Move onto the next part, something is wrong here...
                                continue;
                            }

                            $option_name = ''; // This is the name of the option to be passed to the action in a field
                            $option = $part_matches;

                            // The first option always has to be the field type
                            if ($part_i == 0) {
                                $option_name = 'type';
                                $type = $option[0];
                                if ($type === 'string') {
                                    $type = 'varchar';
                                } elseif ($type === 'integer') {
                                    $type = 'int';
                                }

                                if (!in_array($type, array('text', 'blob', 'datetime', 'date', 'timestamp', 'time'))) {
                                    if (!isset($option[1]) || $option[1] == null) {
                                        if (isset(self::$_default_constraints[$type])) {
                                            $field_array['constraint'] = self::$_default_constraints[$type];
                                        }
                                    } else {
                                        // should support field_name:enum[value1,value2]
                                        if ($type === 'enum') {
                                            $values = explode(',', $option[1]);
                                            $option[1] = '"'.implode('","', $values).'"';

                                            $field_array['constraint'] = $option[1];
                                        } elseif (in_array($type, array('decimal', 'float'))) {
                                            // should support field_name:decimal[10,2]
                                            $field_array['constraint'] = $option[1];
                                        } else {
                                            $field_array['constraint'] = (int) $option[1];
                                        }

                                    }
                                }
                                $option = $type;
                            } else {
                                // This allows you to put any number of :option or :option[val] into your field and these will...
                                // ... always be passed through to the action making it really easy to add extra options for a field
                                $option_name = array_shift($option);
                                if (count($option) > 0) {
                                    $option = $option[0];
                                } else {
                                    $option = true;
                                }
                            }

                            $field_array[$option_name] = $option;

                        }
                        $fields[] = $field_array;
                    } else {
                        // Invalid field passed in
                        continue;
                    }
                }

                // Call the magic action which returns an array($up, $down) for the migration
                $migration = call_user_func(__NAMESPACE__."\Generate_Migration_Actions::{$method_name}", $subjects, $fields);
            }
        }

        // Build the migration
        list($up, $down) = $migration;

        $migration_name = ucfirst(mb_strtolower($migration_name));

        $migration = <<<MIGRATION
<?php

namespace Fuel\Migrations;

class {$migration_name}
{
    public function up()
    {
{$up}
    }

    public function down()
    {
{$down}
    }
}
MIGRATION;

        $number = isset($number) ? $number : static::_find_migration_number();
        $filepath = $working_path.'migrations/'.$number.'_'.mb_strtolower($migration_name).'.php';

        static::create($filepath, $migration, 'migration');

        $build and static::build();
    }

    public static function help()
    {
        $output = <<<HELP
Usage:
  php oil [g|generate] [controller|model|migration|scaffold|views] [options]

Runtime options:
  -f, [--force]    # Overwrite files that already exist
  -s, [--skip]     # Skip files that already exist
  -q, [--quiet]    # Supress status output
  -t, [--speak]    # Speak errors in a robot voice

Description:
  The 'oil' command can be used to generate MVC components, database migrations
  and run specific tasks.

Examples:
  php oil generate controller <controllername> [<action1> |<action2> |..]
  php oil g model <modelname> [<fieldname1>:<type1> |<fieldname2>:<type2> |..]
  php oil g migration <migrationname> [<fieldname1>:<type1> |<fieldname2>:<type2> |..]
  php oil g scaffold <modelname> [<fieldname1>:<type1> |<fieldname2>:<type2> |..]
  php oil g scaffold/template_subfolder <modelname> [<fieldname1>:<type1> |<fieldname2>:<type2> |..]
  php oil g config <filename> [<key1>:<value1> |<key2>:<value2> |..]

Note that the next two lines are equivalent:
  php oil g scaffold <modelname> ...
  php oil g scaffold/crud <modelname> ...

Documentation:
  http://docs.fuelphp.com/packages/oil/generate.html
HELP;

        \Cli::write($output);
    }

    // Helper methods

    private static function _working_path()
    {
        $module = \Cli::option('module', \Cli::option('m'));
        if ($module) {
            foreach (\Config::get('module_paths') as $m) {
                if (is_dir($m.$module)) {
                    return $m.$module.DS;
                }
            }
        }

        return APPPATH;
    }

    private static function _find_migration_number()
    {
        $glob = glob(static::_working_path().'migrations/*_*.php');
        list($last) = explode('_', basename(end($glob)));

        return str_pad($last + 1, 3, '0', STR_PAD_LEFT);
    }
}
