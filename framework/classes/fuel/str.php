<?php
/**
 * Part of the Fuel framework.
 *
 * @package    Fuel
 * @version    1.0
 * @author     Fuel Development Team
 * @license    MIT License
 * @copyright  2010 - 2012 Fuel Development Team
 * @link       http://fuelphp.com
 */

class Str extends \Fuel\Core\Str
{
    /**
     * substr
     *
     * @param   string    $str       required
     * @param   int       $start     required
     * @param   int|null  $length
     * @param   string    $encoding  default UTF-8
     * @return  string
     */
    public static function sub($str, $start, $length = null, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        // substr functions don't parse null correctly
        $length = is_null($length) ? (MBSTRING ? mb_strlen($str, $encoding) : strlen($str)) - $start : $length;

        return MBSTRING
            ? mb_substr($str, $start, $length, $encoding)
            : substr($str, $start, $length);
    }

    /**
     * strlen
     *
     * @param   string  $str       required
     * @param   string  $encoding  default UTF-8
     * @return  int
     */
    public static function length($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_strlen($str, $encoding)
            : strlen($str);
    }

    /**
     * lower
     *
     * @param   string  $str       required
     * @param   string  $encoding  default UTF-8
     * @return  string
     */
    public static function lower($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_strtolower($str, $encoding)
            : strtolower($str);
    }

    /**
     * upper
     *
     * @param   string  $str       required
     * @param   string  $encoding  default UTF-8
     * @return  string
     */
    public static function upper($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_strtoupper($str, $encoding)
            : strtoupper($str);
    }

    /**
     * lcfirst
     *
     * Does not strtoupper first
     *
     * @param   string  $str       required
     * @param   string  $encoding  default UTF-8
     * @return  string
     */
    public static function lcfirst($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_strtolower(mb_substr($str, 0, 1, $encoding), $encoding).
                mb_substr($str, 1, mb_strlen($str, $encoding), $encoding)
            : lcfirst($str);
    }

    /**
     * ucfirst
     *
     * Does not strtolower first
     *
     * @param   string $str       required
     * @param   string $encoding  default UTF-8
     * @return   string
     */
    public static function ucfirst($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_strtoupper(mb_substr($str, 0, 1, $encoding), $encoding).
                mb_substr($str, 1, mb_strlen($str, $encoding), $encoding)
            : ucfirst($str);
    }

    /**
     * ucwords
     *
     * First strtolower then ucwords
     *
     * ucwords normally doesn't strtolower first
     * but MB_CASE_TITLE does, so ucwords now too
     *
     * @param   string   $str       required
     * @param   string   $encoding  default UTF-8
     * @return  string
     */
    public static function ucwords($str, $encoding = null)
    {
        $encoding or $encoding = \Fuel::$encoding;

        return MBSTRING
            ? mb_convert_case($str, MB_CASE_TITLE, $encoding)
            : ucwords(strtolower($str));
    }

    public static function textToHtml($text)
    {
        $text = nl2br($text);
        $masque = '-a-zA-Z0-9@:%_\+~#?&//=,;';
        $text = preg_replace('{(((f|ht){1}tp://)['.$masque.'\.]+['.str_replace(',', '', $masque).'])}iu', '<a href="\\1">\\1</a>', $text);
        $text = preg_replace('#([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~\#?&//=,;]+)#iu', '\\1<a href="http://\\2">\\2</a>', $text);
        $text = preg_replace('#([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})#iu', '<a href="mailto:\\1">\\1</a>', $text);

        return $text;
    }

    public static function bbToHtml($text)
    {
        $text = stripslashes($text);
        $text = nl2br($text); //htmlentities
        $input = array(
            '#\[b\](.*)\[/b\]#Usiu',
            '#\[i\](.*)\[/i\]#Usiu',
            '#\[u\](.*)\[/u\]#Usiu',
            '#\[s\](.*)\[/s\]#Usiu',
            '#\[img\](.*)\[/img\]#Usiu',
            '#\[url\](.*)\[/url\]#Usiu',
            '#\[url=(.*)\](.*)\[/url\]#Usiu',
            '#\[left\](.*)\[/left\]#Usiu',
            '#\[center\](.*)\[/center\]#Usiu',
            '#\[right\](.*)\[/right\]#Usiu'
        );
        $output = array(
            '<strong>$1</strong>',
            '<em>$1</em>',
            '<span style="text-decoration:underline;">$1</span>',
            '<span style="text-decoration:line-through;">$1</span>',
            '<img src="$1" alt="Image" />',
            '<a href="$1">$1</a>',
            '<a href="$1">$2</a>',
            '<div style="text-align:left;">$1</div>',
            '<div style="text-align:center;">$1</div>',
            '<div style="text-align:right;">$1</div>'
        );
        $count = count($input) - 1;
        for ($i = 0; $i <= $count; $i++) {
            $text = preg_replace($input[$i], $output[$i], $text);
        }

        return $text;
    }
}
