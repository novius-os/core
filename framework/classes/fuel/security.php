<?php
class Security extends \Fuel\Core\Security
{
    public static function html_entity_decode($string, $flags = null, $encoding = null)
    {
        is_null($flags) and $flags = \Config::get('security.htmlentities_flags', ENT_QUOTES);
        is_null($encoding) and $encoding = \Fuel::$encoding;

        return html_entity_decode($string, $flags, $encoding);
    }

    public static function htmlspecialchars($string, $flags = null, $encoding = null, $double_encode = null)
    {
        is_null($flags) and $flags = \Config::get('security.htmlentities_flags', ENT_QUOTES);
        is_null($encoding) and $encoding = \Fuel::$encoding;
        is_null($double_encode) and $double_encode = \Config::get('security.htmlentities_double_encode', false);

        return htmlspecialchars($string, $flags, $encoding, $double_encode);
    }
}