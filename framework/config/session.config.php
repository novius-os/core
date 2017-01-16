<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

/**
 * NOTICE:
 *
 * If you need to make modifications to the default configuration, copy
 * this file to your app/config folder, and make them in there.
 *
 * This will allow you to upgrade fuel without losing your custom config.
 */

return array(
    /**
    * global configuration
    */

    // set it to false to prevent the static session from auto-initializing, know that it might make your session
    // expire sooner because it's not updated when it's not used. note that auto-initializing always loads the default driver
    'auto_initialize'    => ini_get('session.auto_start'),

    // if no session type is requested, use the default
    'driver'            => 'file',

    // check for an IP address match after loading the cookie (optional, default = false)
    'match_ip'            => false,

    // check for a user agent match after loading the cookie (optional, default = true)
    'match_ua'            => true,

    // cookie domain  (optional, default = '')
    'cookie_domain'     => ini_get('session.cookie_domain'),

    // cookie path  (optional, default = '/')
    'cookie_path'        => ini_get('session.cookie_path'),

    // cookie secure flag  (optional, default = use the cookie class default)
    'cookie_secure'     => ini_get('session.cookie_secure'),

    // cookie http_only flag  (optional, default = use the cookie class default)
    'cookie_http_only'    => ini_get('session.cookie_httponly'),

    // if true, the session expires when the browser is closed (optional, default = false)
    'expire_on_close'    => true,

    // session expiration time, <= 0 means 2 years! (optional, default = 2 hours)
    'expiration_time'    => ini_get('session.cookie_lifetime'),

    // session ID rotation time  (optional, default = 300)
    'rotation_time'        => 300,

    // default ID for flash variables  (optional, default = 'flash')
    'flash_id'            => 'flash',

    // if false, expire flash values only after it's used  (optional, default = true)
    'flash_auto_expire'    => true,

    // for requests that don't support cookies (i.e. flash), use this POST variable to pass the cookie to the session driver
    'post_cookie_name'    => '',

    /**
    * specific driver configurations. to override a global setting, just add it to the driver config with a different value
    */

    // specific configuration settings for file based sessions
    'file'                => array(
        'path'                =>    session_save_path() ?: '/tmp',                    // path where the session files should be stored
        'gc_probability'    => round(ini_get('session.gc_probability') / ini_get('session.gc_divisor')),                        // probability % (between 0 and 100) for garbage collection
    ),
);
