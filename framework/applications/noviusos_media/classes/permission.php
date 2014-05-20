<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media;

/**
 * Wrapper class to centralise all permissions checks for the Media application
 * @package Nos\Media
 */
class Permission
{
    public static function checkPermissionDraft($media)
    {
        return \Nos\User\Permission::atMost('noviusos_media::media', '1_draft_only', '2_full_access');
    }

    public static function checkMediaVisible($media)
    {
        return !static::checkPermissionDraft($media);
    }

    public static function checkFolderDisabled($folder)
    {
        return \Nos\User\Permission::exists('noviusos_media::folder', 'no');
    }

    public static function checkFolderVisible($folder)
    {
        return !static::checkFolderDisabled($folder);
    }

    public static function isMediaInRestrictedFolder($media)
    {

        return !$media->folder || $media->folder->medif_id == 1 ? false : static::isFolderRestricted($media->folder);
    }

    public static function isFolderRestricted($folder)
    {
        $restricted_folder_ids = static::getRestrictedFoldersIds();

        if (empty($restricted_folder_ids)) {
            return false;
        }

        static::_loadAllFoldersRelations();

        do {
            if (in_array($folder->medif_id, $restricted_folder_ids)) {
                // This folder is allowed
                return false;
            }
            $folder = $folder->get_parent();
        } while (!empty($folder));

        return true;
    }

    public static function getRestrictedFoldersIds()
    {
        // Check for the non-existant ID _ to see if any role has no folder restriction
        $full_access = \Nos\User\Permission::check('noviusos_media::restrict_folders', '_', true);
        if ($full_access) {
            return array();
        }
        return \Nos\User\Permission::listPermissionCategories('noviusos_media::restrict_folders');
    }

    public static function getRestrictedFolders()
    {
        $restricted_folder_ids = static::getRestrictedFoldersIds();
        if (empty($restricted_folder_ids)) {
            return array();
        }
        return \Nos\Media\Model_Folder::find('all', array(
            'where' => array(
                array('medif_id', 'IN', $restricted_folder_ids),
            ),
        ));
    }

    protected static function _loadAllFoldersRelations()
    {
        static $folders_loaded = false;
        if ($folders_loaded) {
            return;
        }
        $folders_loaded = true;

        // Load the parent relation, it's what we need to check permissions
        \Nos\Media\Model_Folder::find('all', array(
            'related' => array('parent'),
        ));
    }
}
