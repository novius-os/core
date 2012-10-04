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
        return '<img src="'.static::flag_url($context).'" title="'.(!empty($site_locale['locale']) && !empty($site_locale['locale']['title']) ? $site_locale['locale']['title'] : $site_locale['locale']).'" style="vertical-align:middle;" /> ';
    }

    public static function flag_empty()
    {
        return '<span style="display:inline-block; width:16px;"></span> ';
    }

    public static function context_label($context, array $options = array())
    {
        $options = array_merge(array(
                'alias' => false,
                'template' => '{locale} {site}',
                'flag' => true,
            ), $options);

        $site_locale = self::site_locale($context);
        $sites = \Config::get('sites');
        $locales = \Config::get('locales');
        $site_label = $options['alias'] && !empty($site_locale['site']['alias']) ? '<span title="'.(!empty($site_locale['site']['title']) ? $site_locale['site']['title'] : '').'">'.$site_locale['site']['alias'].'</span>' : '';
        $site_label = empty($site_label) && !empty($site_locale['site']['title']) ? $site_locale['site']['title'] : $site_label;
        $site_label = empty($site_label) ? $context : $site_label;

        if (count($sites) === 1) {
            $label = !empty($site_locale['locale']['title']) ? $site_locale['locale']['title'] : $context;
        } elseif (count($locales) === 1) {
            $label = $site_label;
        } else {
            $label = strtr($options['template'], array('{locale}' => $options['flag'] ? Helper::flag($context) : (!empty($site_locale['locale']['title']) ? $site_locale['locale']['title'] : $context), '{site}' => $site_label));
        }

        return $label;
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
