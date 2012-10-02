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

class Helper
{
    public static function flag_url($context)
    {
        $site_locale = self::site_locale($context);
        if (!empty($site_locale['locale']) && !empty($site_locale['locale']['flag'])) {
            $lang = $site_locale['locale']['flag'];
        } else {
            $site_locale = self::site_locale_code($context);
            $locale = $site_locale['locale'];
            if (empty($locale)) {
                $locale = $site_locale['site'];
            }
            // Convert lang_LOCALE to locale
            list($lang, $country) = explode('_', $locale.'_');
            if (!empty($country)) {
                $lang = mb_strtolower($country);
            }
            switch ($lang) {
                case 'en':
                    $lang = 'gb';
                    break;
            }
        }

        return 'static/novius-os/admin/novius-os/img/flags/'.$lang.'.png';
    }

    public static function flag($context)
    {
        $site_locale = self::site_locale($context);
        return '<img src="'.static::flag_url($context).'" title="'.(!empty($site_locale['locale']) && !empty($site_locale['locale']['title']) ? $site_locale['locale']['title'] : $site_locale['locale']).'" /> ';
    }

    public static function flag_empty()
    {
        return '<span style="display:inline-block; width:16px;"></span> ';
    }

    public static function site_locale_code($context)
    {
        list($site, $locale) = explode('::', $context, 2);

        return array(
            'site' => $site,
            'locale' => $locale,
        );
    }

    public static function site_locale($context)
    {
        $locales = \Config::get('locales', array());
        $sites = \Config::get('sites', array());
        $site_locale = self::site_locale_code($context);

        return array(
            'site' => $sites[$site_locale['site']],
            'locale' => $locales[$site_locale['locale']],
        );
    }
}
