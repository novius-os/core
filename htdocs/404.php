<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

// Boot the app
require_once __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'framework'.DIRECTORY_SEPARATOR.'bootstrap.php';

$redirect_url = mb_substr(Input::server('REDIRECT_SCRIPT_URL', Input::server('REDIRECT_URL')), 1);

if (in_array($redirect_url, array(
    'favicon.ico',
    'robots.txt',
    'humans.txt',
))) {
     is_file(DOCROOT.$redirect_url) && Nos\Tools_File::send(DOCROOT.$redirect_url);
     exit();
}

$is_media = preg_match('`^(?:cache/)?media/`', $redirect_url);

if ($is_media) {
    $is_resized = preg_match('`cache/media/(.+/(\d+)-(\d+)(?:-(\w+))?.([a-z]+))$`u', $redirect_url, $m);

    if ($is_resized) {
        list(, $path, $max_width, $max_height, $verification, $extension) = $m;
        $media_url = str_replace("/$max_width-$max_height-$verification", '', $path);
        $media_url = str_replace("/$max_width-$max_height", '', $media_url);
    } else {
        $media_url = str_replace('media/', '', $redirect_url);
    }

    $media = false;
    $res = \DB::select()->from(\Nos\Media\Model_Media::table())->where(array(
                array('media_path', '=', '/'.$media_url),
            ))->execute()->as_array();

    if (!empty($res)) {
        $media = \Nos\Media\Model_Media::forge(reset($res));
    }

    if (false === $media) {
        $send_file = false;
    } else {
        if ($is_resized) {
            $source = APPPATH.$media->get_private_path();
            $dest = DOCROOT.$m[0];
            $dir = dirname($dest);
            if (!is_dir($dir)) {
                if (!@mkdir($dir, 0755, true)) {
                    exit("Can't create dir ".$dir);
                }
            }
            try {
                \Nos\Tools_Image::resize($source, $max_width, $max_height, $dest);
                $send_file = $dest;
            } catch (\Exception $e) {
                $send_file = false;
            }
        } else {
            $source = APPPATH.$media->get_private_path();
            $target = DOCROOT.$media->get_public_path();
            $dir = dirname($target);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            symlink(Nos\Tools_File::relativePath(dirname($target), $source), $target);
            $send_file = $source;
        }
    }

    if (false !== $send_file && is_file($send_file)) {
        //Nos\Tools_File::$use_xsendfile = false;
        // This is a 404 error handler, so force status 200
        header('HTTP/1.0 200 Ok');
        header('HTTP/1.1 200 Ok');

        Nos\Tools_File::send($send_file);
    }
}

// real 404
if (!$is_media && pathinfo($redirect_url, PATHINFO_EXTENSION) == 'html') {
    $response = Request::forge('nos/front/index', false)->execute()->response();
    $response->send(true);
}

header('HTTP/1.0 404 Ok');
header('HTTP/1.1 404 Ok');

// Fire off the shutdown event
Event::shutdown();

// Make sure everything is flushed to the browser
ob_end_flush();
