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
    public static $locales = array();

    public static function _init()
    {

        \Config::load('locales', true);
        static::$locales = \Config::get('locales', array());
    }

    public static function flag_url($locale)
    {
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

        return 'static/novius-os/admin/novius-os/img/flags/'.$lang.'.png';
    }

    public static function flag($locale)
    {
        return '<img src="'.static::flag_url($locale).'" title="'.\Arr::get(static::$locales, $locale, $locale).'" /> ';
    }

    public static function flag_empty()
    {
        return '<span style="display:inline-block; width:16px;"></span> ';
    }

}


