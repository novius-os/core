<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('nos::common', 'noviusos_media::common'));

return array(
    'all' => array(
        'view' => 'nos::form/accordion',
        'params' => array(
            'accordions' => array(
                'general' => array(
                    'title' => __('Permissions for this application'),
                    'view' => 'noviusos_media::admin/permissions/general',
                ),
                'folders' => array(
                    'title' => __('Restrict access to specific folders'),
                    'view' => 'noviusos_media::admin/permissions/folders',
                ),
            ),
        ),
    ),
);
