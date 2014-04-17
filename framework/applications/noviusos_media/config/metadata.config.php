<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
    'name'      => 'Media Centre',
    'namespace' => 'Nos\Media',
    'version'   => '4.2 (Dubrovka)',
    'provider'  => array(
        'name'  => 'Novius OS',
    ),
    'permission' => array(),
    'i18n_file' => 'noviusos_media::metadata',
    'launchers' => array(
        'noviusos_media' => array(
            'name' => 'Media Centre',
            'action' => array(
                'action' => 'nosTabs',
                'tab' => array(
                    'url' => 'admin/noviusos_media/appdesk/index',
                ),
            ),
        ),
    ),
    'icons' => array(
        64 => 'static/apps/noviusos_media/img/media-64.png',
        32 => 'static/apps/noviusos_media/img/media-32.png',
        16 => 'static/apps/noviusos_media/img/media-16.png',
    ),
);
