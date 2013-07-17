<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\User;

class Permission
{
    /**
     * @alias Use exists() instead
     */
    public static function check($permissionName, $categoryKey = null, $allowEmpty = false)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('Exists', $permissionName, $categoryKey, $allowEmpty);
    }

    /**
     * Check whether a permissions exists
     *
     * @param $permissionName Name of the permission
     * @param null $categoryKey (optional) If the permission has categories, the category key to check against
     * @return bool
     */
    public static function exists($permissionName, $categoryKey = null, $allowEmpty = false)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('Exists', $permissionName, $categoryKey, $allowEmpty);
    }

    /**
     * Check whether a permissions exists or is not configured
     *
     * @param $permissionName Name of the permission
     * @param null $categoryKey (optional) If the permission has categories, the category key to check against
     * @return bool
     */
    public static function existsOrEmpty($permissionName, $categoryKey = null)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('ExistsOrEmpty', $permissionName, $categoryKey);
    }

    /**
     * Check against a binary permission (value is either 0 or 1).
     *
     * @param $permissionName  Name of the permission
     * @param bool $allowEmpty Should we grant access when nothing is configured?
     * @return bool
     */
    public static function isAllowed($permissionName, $allowEmpty = false)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('IsAllowed', $permissionName, $allowEmpty);
    }

    /**
     * Check against a numeric (range) permission.
     *
     * @param $permissionName  Name of the permission
     * @param $threshold Minimum value to grant access
     * @param bool $valueWhenEmpty Default value to compare with when nothing is configured?
     * @return bool
     */
    public static function atLeast($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('AtLeast', $permissionName, (int) $threshold, $valueWhenEmpty);
    }

    /**
     * Check against a numeric (range) permission.
     *
     * @param $permissionName  Name of the permission
     * @param $threshold Maximum value to grant access
     * @param bool $valueWhenEmpty Default value to compare with when nothing is configured?
     * @return bool
     */
    public static function atMost($permissionName, $threshold, $valueWhenEmpty = 0)
    {
        $user = \Session::user();
        return !empty($user) && $user->checkRolesPermission('AtMost', $permissionName, (int) $threshold, (int) $valueWhenEmpty);
    }

    public static function listPermissionCategories($permissionName)
    {
        $user = \Session::user();
        return !empty($user) && $user->listPermissionCategories($permissionName);
    }

    /**
     * Check whether a user can access a particular application
     *
     * @param  $applicationName  Name of the application
     * @return bool
     */
    public static function isApplicationAuthorised($applicationName)
    {
        // If it's in the database, it's authorised
        // Alternatively, load the 'app_installed' metadata file to see if the application wants permissions
        return static::check('nos::access', $applicationName) || !static::permissionsExistsInMetadata($applicationName);
    }

    protected static function permissionsExistsInMetadata($application_name)
    {
        // Don't translated the file
        $metadata = \Nos\Config_Data::load('app_installed', false);
        return isset($metadata[$application_name]['permission']);
    }

    /**
     * Retrieve the list of contexts available to the connected user
     *
     * @see Nos\Tools_Context::contexts
     * @return array
     */
    public static function contexts()
    {
        static $contexts = null;
        if ($contexts !== null) {
            return $contexts;
        }

        $contexts = \Nos\Tools_Context::contexts();

        $full_access = static::check('nos::context', 'does_not_exists', true);
        if (!$full_access) {
            $allowedContexts = static::listPermissionCategories('nos::context');
            $contexts = array_intersect_key(array_combine($allowedContexts, $allowedContexts), $contexts);
        }

        return $contexts;
    }

    /**
     * Retrieve the list of locales available to the connected user
     *
     * @see Nos\Tools_Context::locales
     * @return array
     */
    public static function locales()
    {
        static $locales = null;
        if ($locales !== null) {
            return $locales;
        }

        $locales = \Nos\Tools_Context::locales();

        foreach (static::contexts() as $context => $config) {
            $allowedLocales[\Nos\Tools_Context::localeCode($context)] = true;
        }

        foreach ($locales as $code => $locale) {
            if (!isset($allowedLocales[$code])) {
                unset($locales[$code]);
            }
        }
        return $locales;
    }

    /**
     * Retrieve the list of sites available to the connected user
     *
     * @see Nos\Tools_Context::sites
     * @return array
     */
    public static function sites()
    {
        static $sites = null;
        if ($sites !== null) {
            return $sites;
        }

        $sites = \Nos\Tools_Context::sites();

        foreach (static::contexts() as $context => $config) {
            $allowedSites[\Nos\Tools_Context::siteCode($context)] = true;
        }

        foreach ($sites as $code => $site) {
            if (!isset($allowedSites[$code])) {
                unset($sites[$code]);
            }
        }
        return $sites;
    }
}
