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
        static::$fallback = (array) \Config::get('language_fallback', 'en');
        static::setLocale(\Fuel::$locale);
    }

    public static function setLocale($locale)
    {
        if (static::$_locale) {
            static::$_locale_stack[] = static::$_locale;
        }

        list($remaining, $variant) = explode('@', $locale.'@');
        list($remaining, $encoding) = explode('.', $remaining.'.');
        list($language, $country) = explode('_', $remaining.'_');
        if (!$country) {
            $country = mb_strtoupper($language);
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

        $_messages = array();
        if (empty(static::$_loaded_files[static::$_locale][$file])) {

            if ( ! isset(static::$_messages[static::$_locale])) {
                static::$_messages[static::$_locale] = array();
            }

            if ( ! isset(static::$_messages[static::$_locale][$group])) {
                static::$_messages[static::$_locale][$group] = array();
            }

            $languages = array(static::$_locale, mb_substr(static::$_locale, 0, 2), static::$fallback);

            // Priority == 'en_GB', then 'en', then 'fallback'
            foreach ($languages as $lang) {
                if ($path = \Finder::search('lang/'.$lang, $file, '.php', true)) {
                    foreach ($path as $p) {
                        static::$_messages[static::$_locale][$group] = \Arr::merge(static::$_messages[static::$_locale][$group], \Fuel::load($p));
                    }
                }
            }
            static::$_loaded_files[static::$_locale] = true;
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
            $result = $default ?: $message;
        }

        return $result;
    }

    public static function current_dictionary($list)
    {
        $dbg = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        static::$_files_dict[$dbg[0]['file']] = call_user_func('static::dictionary', (array) $list);
    }

    public static function translate_from_file($file, $message, $default)
    {
        $lookup = static::$_files_dict[$file];
        return empty($lookup) ? static::get($message, $default) : $lookup($message, $default);
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
