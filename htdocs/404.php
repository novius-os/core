<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

define('NOS_ENTRY_POINT', '404');

// Boot the app
require_once __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'framework'.DIRECTORY_SEPARATOR.'bootstrap.php';

Fuel::$profiling = false;

$nos_url = Input::server('NOS_URL');

\Event::trigger_function('404.start', array(array('url' => &$nos_url)));

if (in_array($nos_url, array(
    'favicon.ico',
    'robots.txt',
    'humans.txt',
))) {
    if (is_file(DOCROOT.$nos_url)) {
        Nos\Tools_File::send(DOCROOT.$nos_url);
        exit();
    }
}


$is_media = preg_match('`^(?:cache/)?media/`', $nos_url);

if ($is_media) {
    $is_resized = \Str::sub($nos_url, 0, 6) === 'cache/';

    $media_url = '';
    if ($is_resized) {
        $pathinfo = pathinfo($nos_url);
        // Remove 12 characteres for cache/media/
        $media_url = \Str::sub(
            $pathinfo['dirname'].(empty($pathinfo['extension']) ? '' : '.'.$pathinfo['extension']),
            12
        );
    } elseif (\Str::starts_with($nos_url, 'media/')) {
        $media_url = \Str::sub($nos_url, \Str::length('media/'));
    }

    $media = false;
    $res = \DB::select()->from(\Nos\Media\Model_Media::table())->where(array(
        array('media_path', '=', '/'.parse_url($media_url, PHP_URL_PATH)),
    ))->execute()->as_array();

    if (!empty($res)) {
        $media = \Nos\Media\Model_Media::forge(reset($res));
    }

    if (false === $media || !is_file($media->path())) {
        $send_file = false;
    } else {
        if ($is_resized) {
            $toolkit_image = $media->getToolkitImage();
            try {
                if (!$toolkit_image->parse($nos_url) && !\Nos\Auth::check()) {
                    throw new \Exception();
                }
            } catch (\Exception $e) {
                header('HTTP/1.0 403 Forbidden');
                header('HTTP/1.1 403 Forbidden');
                exit();
            }

            $path_parts = pathinfo($nos_url);
            $lock_file = APPPATH.$nos_url.'.lock';
            $dir = dirname($lock_file);
            if (!is_dir($dir) && !\File::create_dir(APPPATH.'cache', substr($dir, strlen(APPPATH.'cache'.DS)))) {
                error_log("Can't create dir ".$dir);
                exit("Can't create dir ".$dir);
            }
            if (file_exists($lock_file)) {
                $time = file_get_contents($lock_file);
                if ((time() - $time) < 120) {
                    if (isset($_SERVER['REDIRECT_QUERY_STRING']) && $_SERVER['REDIRECT_QUERY_STRING'] === 'lock') {
                        header('HTTP/1.0 503 Service Unavailable');
                        header('HTTP/1.1 503 Service Unavailable');
                        exit();
                    }
                    sleep(2);
                    \Response::redirect(\Uri::base(false).$nos_url.'?lock');
                    exit();
                }
            }
            file_put_contents($lock_file, time(), LOCK_EX);

            try {
                $send_file = $toolkit_image->save();
                $target = $toolkit_image->url(false);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $send_file = false;
            }
            unlink($lock_file);
        } else {
            $send_file = $media->path();
            $target = $media->url(false);
        }
    }

    if (false !== $send_file) {
        $send_file =  \File::validOSPath($send_file);

        \Event::trigger_function('404.mediaFound', array(array('url' => $nos_url, 'media' => $media, 'send_file' => &$send_file)));

        $source = $send_file;
        $target = DOCROOT.$target;
        $dir = dirname($target);
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0755, true)) {
                Log::error("Can't create dir ".$dir);
                exit("Can't create dir ".$dir);
            }
        }

        if (!\File::relativeSymlink($source, $target)) {
            Log::error("Can't symlink in ".$source);
            exit("Can't symlink in ".$source);
        }
        $send_file = $source;
    }

    if (false !== $send_file && is_file($send_file)) {
        //Nos\Tools_File::$use_xsendfile = false;
        // This is a 404 error handler, so force status 200
        header('HTTP/1.0 200 Ok');
        header('HTTP/1.1 200 Ok');

        Nos\Tools_File::send($send_file);
    } else {
        \Event::trigger('404.mediaNotFound', array('url' => $nos_url));
    }
}

$is_attachment = preg_match('`^(?:cache/)?data/files/`', $nos_url);
if ($is_attachment) {
    $is_resized = \Str::sub($nos_url, 0, 6) === 'cache/';

    $attachment_url = '';
    if ($is_resized) {
        $pathinfo = pathinfo($nos_url);
        // Remove 12 characteres for cache/data/files/
        $attachment_url = \Str::sub($pathinfo['dirname'].'.'.$pathinfo['extension'], 17);
    } elseif (\Str::starts_with($nos_url, 'data/files/')) {
        $attachment_url = \Str::sub($nos_url, \Str::length('data/files/'));
    }

    $send_file = false;
    $check = false;
    $match = preg_match('`(.+/)([^/]+)/([^/]+).([a-z]+)$`iUu', $attachment_url, $m);
    if ($match) {
        list(, $alias, $attached, $filename, $extension) = $m;

        \Event::trigger_function('404.attachmentMatch', array(array('alias' => &$alias, 'attached' => &$attached, 'filename' => &$filename, 'extension' => &$extension)));

        $attachments = \Nos\Config_Data::get("attachments", array());
        if (isset($attachments[$alias])) {
            $config = $attachments[$alias];
            $attachment = \Nos\Attachment::forge($attached, $config);

            $send_file = $attachment->path();
            if (!empty($send_file)) {
                if (isset($config['check']) && is_callable($config['check'])) {
                    $check = $config['check'];
                    if (!call_user_func($check, $attachment)) {
                        $send_file = false;
                    }
                }
            }
        }

        if ($send_file && $is_resized) {
            $toolkit_image = $attachment->getToolkitImage();
            try {
                if (!$toolkit_image->parse($nos_url)) {
                    throw new \Exception();
                }
            } catch (\Exception $e) {
                header('HTTP/1.0 403 Forbidden');
                header('HTTP/1.1 403 Forbidden');
                exit();
            }

            try {
                $send_file = $toolkit_image->save();
                $target_relative = $toolkit_image->url(false);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $send_file = false;
            }
        } else if ($send_file) {
            $target_relative = $attachment->url(false);
        }
    }

    if (false !== $send_file) {
        \Event::trigger_function('404.attachmentFound', array(array('url' => $nos_url, 'attachment' => $attachment, 'send_file' => &$send_file)));

        if ($check === false) {
            $source = $send_file;
            $target = DOCROOT.$target_relative;
            $dir = dirname($target);
            if (!is_dir($dir)) {
                if (!@mkdir($dir, 0755, true)) {
                    Log::error("Can't create dir ".$dir);
                    exit("Can't create dir ".$dir);
                }
            }
            if (!\File::relativeSymlink($source, $target)) {
                Log::error("Can't symlink in ".$source);
                exit("Can't symlink in ".$source);
            }
            $send_file = $source;
        }
    }

    if (false !== $send_file && is_file($send_file)) {
        //Nos\Tools_File::$use_xsendfile = false;
        // This is a 404 error handler, so force status 200
        header('HTTP/1.0 200 Ok');
        header('HTTP/1.1 200 Ok');

        Nos\Tools_File::send($send_file);
    } else {
        \Event::trigger('404.attachmentNotFound', array('url' => $nos_url));
    }
}

\Event::trigger('404.end', array('url' => $nos_url));

// real 404
if (!$is_attachment && !$is_media && pathinfo($nos_url, PATHINFO_EXTENSION) == 'html') {
    $response = Request::forge('nos/front/index', false)->execute()->response();
    $response->send(true);
}

\Response::forge(\View::forge('nos::errors/404', array(
    'base_url' => \Uri::base(false),
), false), 404)->send();
