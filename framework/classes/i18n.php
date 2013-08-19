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

class I18n
{

    private static $_messages = array();

    private static $_group;

    private static $_locale;

    private static $_encoding;

    private static $_locale_stack = array();

    private static $_loaded_files = array();

    public static $_files_dict = array();

    public static $fallback;

    public static function _init()
    {
        static::$fallback = \Config::get('language_fallback', 'en');
        static::setLocale(\Fuel::$locale);
    }

    public static function setLocale($locale)
    {
        list($remaining, $variant) = explode('@', $locale.'@');
        list($remaining, $encoding) = explode('.', $remaining.'.');
        list($language, $country) = explode('_', $remaining.'_');
        if (!$country) {
            $country = mb_strtoupper($language);
        }
        // Front-office can use any language
        if (NOS_ENTRY_POINT === Nos::ENTRY_POINT_ADMIN) {
            $available = \Config::get('novius-os.locales', array());
            // Check the language is supported (because it can be injected via GET on the login screens)
            if (!isset($available[$language.'_'.$country])) {
                list($language, $country) =  explode('_', \Config::get('novius-os.default_locale', 'en_GB'));
                $encoding = null;
                $variant = null;
            }
        }
        if (static::$_locale) {
            static::$_locale_stack[] = static::$_locale;
        }
        static::$_locale = $language.'_'.$country;
        if (!empty($encoding)) {
            static::$_encoding = $encoding;
        }
        setlocale(LC_ALL, array(
                static::$_locale.'.'.static::$_encoding.'@'.$variant,
                static::$_locale.'.'.static::$_encoding,
                static::$_locale.'@'.$variant,
                static::$_locale,
            )
        );
    }

    public static function restoreLocale()
    {
        static::$_locale = array_pop(static::$_locale_stack);
    }

    public static function load($file, $group = null)
    {
        $group = ($group === null) ? $file : $group;
        static::$_group = $group;

        if (empty(static::$_loaded_files[static::$_locale][$file])) {

            if ( ! isset(static::$_messages[static::$_locale])) {
                static::$_messages[static::$_locale] = array();
            }

            if ( ! isset(static::$_messages[static::$_locale][$group])) {
                static::$_messages[static::$_locale][$group] = array();
            }

            $languages = array(static::$_locale, mb_substr(static::$_locale, 0, 2), static::$fallback);

            if ($pos = strripos($file, '::')) {
                $namespace = substr($file, 0, $pos + 2);
                $local_file = substr($file, $pos + 2);
            } else {
                $namespace = '';
                $local_file = $file;
            }

            // Priority == 'en_GB', then 'en', then 'fallback'
            foreach ($languages as $lang) {
                if ($path = \Finder::search('lang', $namespace.$lang.DS.$local_file, '.php', true)) {
                    foreach ($path as $p) {
                        static::$_messages[static::$_locale][$group] = \Arr::merge(array_filter(\Fuel::load($p)), static::$_messages[static::$_locale][$group]);
                    }
                }
            }
            \Event::trigger_function('i18n.'.static::$_locale.'|'.$file, array(&static::$_messages[static::$_locale][$group]));
            static::$_loaded_files[static::$_locale][$file] = true;
        }
    }

    public static function get($_message, $default = null)
    {
        return static::gget(static::$_group, $_message, $default);
    }

    public static function group($group)
    {
        static::$_group = $group;
    }

    public static function gget($group, $message, $default = null)
    {
        $result = isset(static::$_messages[static::$_locale][$group][$message]) ? static::$_messages[static::$_locale][$group][$message] : false;

        if (empty($result)) {
            $result = $default === null ? $message : $default;
        }

        return $result;
    }

    public static function current_dictionary($list)
    {
        $dbg = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        $i = -1;
        do {
            $function = $dbg[++$i]['function'];
        } while ($function == '{closure}');

        static::$_files_dict[$dbg[$i]['file']] = call_user_func('static::dictionary', (array) $list);
    }

    public static function translate_from_file($file, $message, $default)
    {
        if (empty(static::$_files_dict[$file])) {
            $application_name = \Module::findFromCanonicalPath($file);
            if (!empty($application_name)) {
                static::$_files_dict[$file] = call_user_func('static::dictionary', array($application_name.'::default'));
            } else {
                return static::get($message, $default);
            }
        }
        $lookup = static::$_files_dict[$file];
        return call_user_func($lookup, $message, $default);
    }

    public static function dictionary($list)
    {
        $list = (array) $list;

        $active_group = static::$_group;
        foreach ($list as $group) {
            static::load($group);
        }
        static::$_group = $active_group;

        $messages = static::$_messages[static::$_locale];

        return function($message, $default = null) use ($list, $messages) {
            foreach ($list as $group) {
                $result = isset($messages[$group][$message]) ? $messages[$group][$message] : false;

                // If translation exists, but is empty, then it's not translated
                if (!empty($result)) {
                    break;
                }
            }
            if (empty($result)) {
                $result = $default ?: $message;
            }
            return $result;
        };
    }
}
