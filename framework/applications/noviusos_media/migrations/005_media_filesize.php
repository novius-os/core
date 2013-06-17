<?php
namespace Nos\Media\Migrations;

use Nos\Media\Model_Media;

class Media_Filesize extends \Nos\Migration
{
    public function up()
    {
        parent::up();

        foreach (Model_Media::find('all') as $media) {
            $file = APPPATH.$media->get_private_path();
            if (is_file($file)) {
                $media->media_filesize = filesize($file);
                $media->save();
            }
        }
    }
}
