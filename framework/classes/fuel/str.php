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
    public static function textToHtml($text) {
        $text   = nl2br($text);
        $masque = '-a-zA-Z0-9@:%_\+~#?&//=,;';
        $text   = preg_replace('{(((f|ht){1}tp://)['.$masque.'\.]+['.str_replace(',', '', $masque).'])}i', '<a href="\\1">\\1</a>', $text);
        $text   = preg_replace('#([[:space:]()[{}])(www.[-a-zA-Z0-9@:%_\+.~\#?&//=,;]+)#i', '\\1<a href="http://\\2">\\2</a>', $text);
        $text   = preg_replace('#([_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.)+[a-z]{2,3})#i', '<a href="mailto:\\1">\\1</a>', $text);
        return $text;
    }
}


