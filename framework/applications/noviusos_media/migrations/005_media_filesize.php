<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Media\Migrations;

use Nos\Media\Model_Media;

class Media_Filesize extends \Nos\Migration
{
    public function up()
    {
        parent::up();

        foreach (Model_Media::find('all') as $media) {
            $file = $media->path();
            if (is_file($file)) {
                $media->media_filesize = filesize($file);
                $media->save();
            }
        }
    }
}
