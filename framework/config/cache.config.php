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

    'file'  => array(
        'path'  =>    APPPATH.'cache/fuelphp/',
    ),
    'media' => array(
        // Configuration relative to the concurrent access
        // checks wheile generating a media cache
        'generation' => array(
            // Maximum time to generate a media before the process
            // is considered as failed and another is allowed
            // to try to generate the media.
            'timeout'     => '+45 seconds',

            // Redirect every x (int) seconds if the media is requested
            // while another process is already generating it.
            'retry_delay' => 2,
        ),
    ),
);
