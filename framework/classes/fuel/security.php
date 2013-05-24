<?php
class Security extends \Fuel\Core\Security
{
    public static function html_entity_decode($string, $flags = null, $encoding = null)
    {
        is_null($flags) and $flags = \Config::get('security.htmlentities_flags', ENT_QUOTES);
        is_null($encoding) and $encoding = \Fuel::$encoding;

        return html_entity_decode($string, $flags, $encoding);
    }
}