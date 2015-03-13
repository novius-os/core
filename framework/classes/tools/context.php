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
 * The Tools_Context class allows you to work with contexts,
 * locales and sites of your Novius OS instance.
 */
class Tools_Context
{
    static protected $_contexts = null;
    static protected $_sites = null;
    static protected $_locales = null;

    /**
     * get an array of all contexts Novius OS instance
     * a context key is the concatenation of site_code and locale_code, separate by ::
     *
     * @return array context_code => array()
     */
    public static function contexts()
    {
        if (!is_array(static::$_contexts)) {
            $all_domains = array();

            \Config::load('contexts', true);
            $sites = static::sites();
            $locales = static::locales();
            $contexts = \Config::get('contexts.contexts', array());
            static::$_contexts = array();
            foreach ($contexts as $context_code => $domains) {
                $site = static::siteCode($context_code);
                $locale = static::localeCode($context_code);
                if (isset($sites[$site]) && isset($locales[$locale])) {
                    if (empty($domains)) {
                        if (!in_array(\Uri::base(false), $all_domains)) {
                            $domains = array(\Uri::base(false));
                        } else {
                            $domains = array(\Uri::base(false).$site.'/'.$locale.'/');
                        }
                    }
                    foreach ($domains as $i => $domain) {
                        $domain = rtrim($domain, '/').'/';
                        $domains[$i] = $domain;

                        if (in_array($domain, $all_domains)) {
                            unset($domains[$i]);
                        } else {
                            $all_domains[] = $domain;
                        }
                    }
                    if (empty($domains)) {
                        $domains = array(\Uri::base(false).$site.'/'.$locale.'/');
                    }

                    static::$_contexts[$context_code] = $domains;
                }
            }
            if (empty(static::$_contexts)) {
                throw new \RuntimeException('No context has been defined.');
            }
        }

        return static::$_contexts;
    }

    public static function useCurrentContext() {
        \Config::load('contexts', true);
        return \Config::get('contexts.use_current', false);
    }

    /**
     * get an array of all sites Novius OS instance
     *
     * @return array site_code => array(title, alias)
     */
    public static function sites()
    {
        if (!is_array(static::$_sites)) {
            static::$_sites = array();
            \Config::load('contexts', true);
            $sites = \Config::get('contexts.sites', array());
            foreach ($sites as $site_code => $site_params) {
                if (!is_array($site_params)) {
                    $site_params = array('title' => $site_params);
                }
                if (empty($site_params['title'])) {
                    $site_params['title'] = $site_code;
                }
                if (empty($site_params['alias'])) {
                    $site_params['alias'] = $site_params['title'];
                }
                static::$_sites[$site_code] = $site_params;
            }
        }

        return static::$_sites;
    }

    /**
     * get an array of all locales Novius OS instance
     *
     * @return array locales_code => array(title, flag)
     */
    public static function locales()
    {
        if (!is_array(static::$_locales)) {
            static::$_locales = array();
            \Config::load('contexts', true);
            $locales = \Config::get('contexts.locales', array());
            foreach ($locales as $locale_code => $locale_params) {
                if (!is_array($locale_params)) {
                    $locale_params = array('title' => $locale_params);
                }
                if (empty($locale_params['title'])) {
                    $locale_params['title'] = $locale_code;
                }
                if (empty($locale_params['flag'])) {
                    // Convert lang_LOCALE to locale
                    $lang = static::langLocaleToLang($locale_code);
                    switch ($lang) {
                        case 'en':
                            $lang = 'gb';
                            break;
                    }

                    $locale_params['flag'] = $lang;
                }
                static::$_locales[$locale_code] = $locale_params;
            }
        }

        return static::$_locales;
    }


    /**
     * @param $lang_locale
     * @return string
     */
    public static function langLocaleToLang($lang_locale)
    {
        // Convert lang_LOCALE to locale
        list($lang, $locale) = explode('_', $lang_locale.'_');
        if (!empty($locale)) {
            $lang = mb_strtolower($locale);
        }

        return mb_strtolower($lang);
    }

    /**
     * @param $context
     * @return string
     */
    public static function flag($context)
    {
        $locale = self::locale($context);
        return '<img src="static/novius-os/admin/novius-os/img/flags/'.$locale['flag'].'.png" alt="'.htmlspecialchars($locale['title']).'" title="'.htmlspecialchars($locale['title']).'" style="vertical-align:middle;" />';
    }

    /**
     * @param $context
     * @return string
     */
    public static function flagUrl($context)
    {
        $locale = self::locale($context);
        return 'static/novius-os/admin/novius-os/img/flags/'.$locale['flag'].'.png';
    }

    /**
     * @param $context
     * @param array $options
     * @return string
     */
    public static function contextLabel($context, array $options = array())
    {
        $options = array_merge(array(
                'short' => false,
                'template' => '{site} {locale}',
            ), $options);

        $site = self::site($context);
        $locale = self::locale($context);
        $site_label = $options['short'] ? '<span title="'.htmlspecialchars($site['title']).'">'.$site['alias'].'</span>' : $site['title'];
        if (count(static::sites()) === 1) {
            $label = $options['short'] ? static::flag($context) : $locale['title'].' '.static::flag($context);
        } elseif (count(static::locales()) === 1) {
            $label = $site_label;
        } else {
            $label = strtr($options['template'], array('{locale}' => static::flag($context), '{site}' => $site_label));
        }

        return $label;
    }

    /**
     * @return string
     */
    public static function defaultContext()
    {
        $contexts = static::contexts();

        return key($contexts);
    }

    /**
     * @param $context
     * @return mixed
     */
    public static function localeCode($context)
    {
        list(, $locale) = explode('::', $context, 2);
        if (empty($locale)) {
            $locale = $context;
        }

        return $locale;
    }

    /**
     * @param $context
     * @return array
     */
    public static function locale($context)
    {
        $locales = static::locales();
        $locale_code = self::localeCode($context);
        if (empty($locales[$locale_code])) {
            return array(
                'title' => $locale_code,
                'flag' => static::langLocaleToLang($locale_code),
            );
        } else {
            return $locales[$locale_code];
        }
    }

    /**
     * @param $context
     * @return mixed
     */
    public static function siteCode($context)
    {
        list($site) = explode('::', $context, 2);

        return $site;
    }

    /**
     * @param $context
     * @return array
     */
    public static function site($context)
    {
        $sites = static::sites();
        $site_code = self::siteCode($context);
        if (empty($sites[$site_code])) {
            return array(
                'code' => $site_code,
                'title' => $site_code,
                'alias' => $site_code,
            );
        } else {
            return array_merge(array('code' => $site_code), $sites[$site_code]);
        }
    }
}
