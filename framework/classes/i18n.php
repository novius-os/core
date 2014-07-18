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

/**
 * Provides the translation related functions.
 *
 * @package Nos
 */
class I18n
{

    private static $_messages = array();

    private static $_group;

    private static $_locale;

    private static $_language;

    private static $_encoding;

    private static $_locale_stack = array();

    private static $_loaded_files = array();

    public static $_files_dict = array();

    public static $fallback;

    protected static $_priority_messages = array();

    private static $plural_expressions = array(
        'ja' => 'Asian',
        'vi' => 'Asian',
        'ko' => 'Asian',
        'fr' => 'Zero singular',
        'pt_BR' => 'Zero singular',
        'lv' => 'Latvian',
        'ga' => 'Gaeilge',
        'ro' => 'Romanian',
        'lt' => 'Lithuanian',
        'ru' => 'Russian',
        'uk' => 'Russian',
        'be' => 'Russian',
        'sr' => 'Russian',
        'hr' => 'Russian',
        'cs' => 'Czech',
        'sk' => 'Czech',
        'pl' => 'Polish',
        'sl' => 'Slovenian',
    );

    private static $plural_rules = array(
        'Default' => '$n != 1 ? 1 : 0',
        'Asian' => '0',
        'Zero singular' => '$n > 1 ? 1 : 0',
        'Latvian' => '$n%10 == 1 && $n%100 != 11 ? 0 : $n != 0 ? 1 : 2',
        'Gaeilge' => '$n == 1 ? 0 : $n == 2 ? 1 : 2',
        'Romanian' => '$n == 1 ? 0 : ($n == 0 || ($n%100 > 0 && $n%100 < 20)) ? 1 : 2',
        'Lithuanian' => '$n%10 == 1 && $n%100 != 11 ? 0 : $n%10 >= 2 && ($n%100 < 10 || $n%100 >= 20) ? 1 : 2',
        'Russian' =>
            '$n%10 == 1 && $n%100 != 11 ? 0 : $n%10 >= 2 && $n%10 <= 4 && ($n%100 < 10 || $n%100 >= 20) ? 1 : 2',
        'Czech' => '($n == 1) ? 0 : ($n >= 2 && $n <= 4) ? 1 : 2',
        'Polish' => '$n == 1 ? 0 : $n%10 >= 2 && $n%10 <= 4 && ($n%100 < 10 || $n%100 >= 20) ? 1 : 2',
        'Slovenian' => '$n%100 == 1 ? 0 : $n%100 == 2 ? 1 : $n%100 == 3 || $n%100 == 4 ? 2 : 3',
    );

    private static $locale_plural = array();

    public static function _init()
    {
        static::$fallback = \Config::get('language_fallback', 'en');
        static::setLocale(\Fuel::$locale);
    }

    /**
     * Configure the locale to use for translations.
     *
     * @param string $locale A valid locale ('en', 'en_GB', 'en_GB.utf-8' and 'en_GB.utf-8@variant' are all valid).
     */
    public static function setLocale($locale)
    {
        list($remaining, $variant) = explode('@', $locale.'@');
        list($remaining, $encoding) = explode('.', $remaining.'.');
        list(static::$_language, $country) = explode('_', $remaining.'_');
        if (!$country) {
            $country = mb_strtoupper(static::$_language);
        }
        // Front-office can use any language
        if (NOS_ENTRY_POINT === Nos::ENTRY_POINT_ADMIN) {
            $available = \Config::get('novius-os.locales', array());
            // Check the language is supported (because it can be injected via GET on the login screens)
            if (!isset($available[static::$_language.'_'.$country])) {
                list(static::$_language, $country) =  explode('_', \Config::get('novius-os.default_locale', 'en_GB'));
                $encoding = null;
                $variant = null;
            }
        }
        if (static::$_locale) {
            static::$_locale_stack[] = static::$_locale;
        }
        static::$_locale = static::$_language.'_'.$country;
        if (!empty($encoding)) {
            static::$_encoding = $encoding;
        }
        setlocale(LC_ALL, array(
            static::$_locale.'.'.static::$_encoding.'@'.$variant,
            static::$_locale.'.'.static::$_encoding,
            static::$_locale.'@'.$variant,
            static::$_locale,
        ));
    }

    /**
     * Restores the previous locale.
     */
    public static function restoreLocale()
    {
        static::$_locale = array_pop(static::$_locale_stack);
        list(static::$_language) = explode('_', static::$_locale);
    }

    /**
     * Loads a dictionary for the current locale.
     *
     * @param string $file Dictionary path.
     * @param null $group Group name. Default null, use $file.
     */
    public static function load($file, $group = null)
    {
        $group = ($group === null) ? $file : $group;
        static::$_group = $group;

        if (empty(static::$_loaded_files[static::$_locale][$file])) {

            if (!isset(static::$_messages[static::$_locale])) {
                static::$_messages[static::$_locale] = array();
            }

            if (!isset(static::$_messages[static::$_locale][$group])) {
                static::$_messages[static::$_locale][$group] = array();
            }

            $languages = array(static::$_locale, static::$_language, static::$fallback);

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
                        static::$_messages[static::$_locale][$group] = \Arr::merge(
                            array_filter(\Fuel::load($p)),
                            static::$_messages[static::$_locale][$group]
                        );
                    }
                }
            }
            \Event::trigger_function(
                'i18n.'.static::$_locale.'|'.$file,
                array(&static::$_messages[static::$_locale][$group])
            );
            static::$_loaded_files[static::$_locale][$file] = true;
        }
    }

    /**
     * Retrieves a translation from the last loaded dictionary.
     *
     * @param string $_message The message to translate.
     * @param string $default The default text to return when the message is not found. Default value is the message itself.
     * @return string The translation or initial message if not founded
     */
    public static function get($_message, $default = null)
    {
        return static::gget(static::$_group, $_message, $default);
    }

    public static function group($group)
    {
        static::$_group = $group;
    }

    /**
     * The plural version of get(). Some languages have more than one form for plural messages dependent on the count.
     *
     * @param string $singular The singular form of the string to be converted. Used as the key for the search in the dictionary
     * @param string $plural The plural form
     * @param string $n Used to determine which plural form to used depending locale.
     * @return string The translation or, if not founded, $singular is returned if n == 1, otherwise $plural
     */
    public static function nget($singular, $plural, $n)
    {
        return static::ngget(static::$_group, $singular, $plural, $n);
    }

    /**
     * Retrieves a translation from a specific dictionary.
     *
     * @param string $group Which dictionary to look into.
     * @param string $message The message to translate.
     * @param string|null $default The default text to return when the message is not found. Default value is the message itself.
     * @return string The translation or initial message if not founded
     * @warning The dictionary must have been loaded manually before.
     */
    public static function gget($group, $message, $default = null)
    {
        // same as in translate_from_file
        if (isset(static::$_priority_messages[static::$_locale][$message])) {
            return static::$_priority_messages[static::$_locale][$message];
        }
        if (isset(static::$_priority_messages[static::$_language][$message])) {
            return static::$_priority_messages[static::$_language][$message];
        }

        $result = isset(static::$_messages[static::$_locale][$group][$message]) ?
            static::$_messages[static::$_locale][$group][$message] :
            false;

        if (empty($result)) {
            $result = $default === null ? $message : $default;
        }

        return $result;
    }

    /**
     * Retrieves a plural translation from a specific dictionary.
     *
     * @param string $group Which dictionary to look into.
     * @param string $singular The singular form of the string to be converted. Used as the key for the search in the dictionary
     * @param string $plural The plural form
     * @param string $n Used to determine which plural form to used depending locale.
     * @return string The translation or, if not founded, $singular is returned if n == 1, otherwise $plural
     * @warning The dictionary must have been loaded manually before.
     */
    public static function ngget($group, $singular, $plural, $n)
    {
        $result = static::gget($group, $singular, false);

        return static::plural($result, $singular, $plural, $n);
    }

    protected static function plural($result, $singular, $plural, $n)
    {
        if ($result === false) {
            return $n == 1 ? $singular : $plural;
        } elseif (is_array($result)) {
            $plural_indice = static::pluralKey($n);
            return isset($result[$plural_indice]) ? $result[$plural_indice] : current($result);
        }

        return $result;
    }

    public static function pluralKey($n)
    {
        if (!isset(static::$locale_plural[static::$_locale])) {
            $rule = static::pluralRule(static::$_locale);

            static::$locale_plural[static::$_locale] = function ($n) use ($rule) {
                return eval('return '.$rule.';');
            };
        }

        return call_user_func(static::$locale_plural[static::$_locale], $n);
    }

    public static function pluralRule($locale)
    {
        if (isset(static::$plural_expressions[$locale])) {
            $rule = static::$plural_rules[static::$plural_expressions[$locale]];
        } else {
            $lang = substr($locale, 0, 2);
            if (isset(static::$plural_expressions[$lang])) {
                $rule = static::$plural_rules[static::$plural_expressions[$lang]];
            } else {
                $rule = static::$plural_rules['Default'];
            }
        }
        return $rule;
    }

    /**
     * Set the current dictionary
     *
     * @param string|array $list A dictionary file or list of dictionaries.
     */
    public static function current_dictionary($list)
    {
        $dbg = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        $i = -1;
        do {
            $function = $dbg[++$i]['function'];
        } while ($function == '{closure}');

        static::$_files_dict[$dbg[$i]['file']] = call_user_func('static::dictionary', (array) $list);
    }

    public static function translate_from_file($file, $message, $default = null)
    {
        // same as in gget
        if (isset(static::$_priority_messages[static::$_locale][$message])) {
            return static::$_priority_messages[static::$_locale][$message];
        }
        if (isset(static::$_priority_messages[static::$_language][$message])) {
            return static::$_priority_messages[static::$_language][$message];
        }

        if (empty(static::$_files_dict[$file])) {
            $application_name = \Module::findFromCanonicalPath($file);
            if (!empty($application_name)) {
                static::$_files_dict[$file] = call_user_func(
                    'static::dictionary',
                    array($application_name.'::default')
                );
            } else {
                return static::get($message, $default);
            }
        }
        $lookup = static::$_files_dict[$file];
        return call_user_func($lookup, $message, $default);
    }

    public static function nTranslateFromFile($file, $singular, $plural, $n)
    {
        $result = static::translate_from_file($file, $singular, false);

        return static::plural($result, $singular, $plural, $n);
    }

    /**
     * Returns a closure that translate messages from a specific dictionary.
     *
     * @param string|array $list A dictionary file or list of dictionaries.
     * @return callable A callable to translate a message
     */
    public static function dictionary($list)
    {
        $list = (array) $list;

        $active_group = static::$_group;
        foreach ($list as $group) {
            static::load($group);
        }
        static::$_group = $active_group;

        $messages = static::$_messages[static::$_locale];

        return function ($message, $default = null) use ($list, $messages) {
            foreach ($list as $group) {
                $result = isset($messages[$group][$message]) ? $messages[$group][$message] : false;

                // If translation exists, but is empty, then it's not translated
                if (!empty($result)) {
                    break;
                }
            }
            if (empty($result)) {
                $result = $default === null ? $message : $default;
            }
            return $result;
        };
    }

    /**
     * Add a priority dictionary for a locale
     *
     * @param string $locale A valid locale
     * @param string $dictionary Dictionary path
     */
    public static function addPriorityDictionary($locale, $dictionary)
    {
        static::addPriorityMessages($locale, \Fuel::load($dictionary));
    }

    /**
     * Add some priorities translations for a locale
     *
     * @param string $locale A valid locale
     * @param array $messages An array of translations
     */
    public static function addPriorityMessages($locale, $messages)
    {
        if (!isset(static::$_priority_messages[$locale])) {
            static::$_priority_messages[$locale] = array();
        }
        static::$_priority_messages[$locale] = array_merge(static::$_priority_messages[$locale], $messages);
    }
}
