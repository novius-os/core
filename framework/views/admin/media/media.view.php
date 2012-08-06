<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if ($object->is_new()) {
    echo \View::forge('nos::admin/media/media_add', array(
        'fieldset' => $fieldset,
        'folder' => $context,
    ), false);
} else {
    $pathinfo = pathinfo($object->media_file);
    $filename = $pathinfo['filename'];

    echo \View::forge('nos::admin/media/media_edit', array(
        'fieldset' => $fieldset,
        'media' => $object,
        'checked' => $filename === \Nos\Model_Media_Folder::friendly_slug($object->media_title),
    ), false);
}
?>
