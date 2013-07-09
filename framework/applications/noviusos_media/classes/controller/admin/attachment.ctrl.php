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

class Controller_Admin_Attachment extends \Nos\Controller_Admin_Application
{
    public function action_popup()
    {
        try {
            $attachment = $this->attachment(str_replace('data/files/', '', \Input::param('attachment', null)));
            $item = Model_Media::forge();
            $fieldset = \Fieldset::build_from_config($this->config['fields'], $item, array(
                    'before_save'=> function() use ($item, $attachment) {
                        // Empty title = auto-generated from file name
                        if (empty($item->media_title)) {
                            $item->media_title = pathinfo($attachment->filename(), PATHINFO_FILENAME);
                        }
                        if (empty($item->media_file)) {
                            $item->media_title = \Nos\Orm_Behaviour_Virtualname::friendly_slug($item->media_title);
                        }

                        $item->media_ext = $attachment->extension();

                        $item->observe('before_save');
                        $dest = $item->path();

                        if ($item->is_new()) {

                            if (is_file($dest)) {
                                throw new \Exception(__('A file with the same name already exists.'));
                            }

                            // Create the directory if needed
                            $dest_dir = dirname($dest).'/';
                            $base_dir = APPPATH.\Nos\Media\Model_Media::$private_path;
                            $remaining_dir = str_replace($base_dir, '', $dest_dir);
                            // chmod  is 0777 here because it should be restricted with by the umask
                            is_dir($dest_dir) or \File::create_dir($base_dir, $remaining_dir, 0777);

                            if (!is_writeable($dest_dir)) {
                                throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
                            }
                        }
                        if (\File::copy($attachment->path(), $dest)) {
                            chmod($dest, 0664);
                        } else {
                            throw new \Exception(__('You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.'));
                        }
                    },
                    'success' => function() use ($item) {
                        $dispatchEvent = array(
                            'name' => get_class($item),
                            'action' => 'insert',
                            'id' => (int) $item->media_id,
                        );

                        $return = array(
                            'notify' => __('Here you go, this attachment is now available in the Media Center.'),
                            'closeDialog' => true,
                            'dispatchEvent' => $dispatchEvent,
                        );

                        return $return;
                    },
                ));
            $fieldset->form()->set_config('field_template', '<tr><th class="{error_class}">{label}{required}</th><td class="{error_class}">{field} {error_msg}</td></tr>');

            $query = Model_Folder::find();
            $query->where(array('medif_parent_id' => null));
            $root = $query->get_one();
            $fieldset->field('media_folder_id')->set_value($root->medif_id);
            $fieldset->field('attachment')->set_value($attachment->url(false));
            $fieldset->field('media_title')->set_value(pathinfo($attachment->filename(), PATHINFO_FILENAME));

            $view_params = array(
                'fieldset' => $fieldset,
            );

            return \View::forge('noviusos_media::admin/attachment', $view_params, false);
        } catch (\Exception $e) {
            $this->send_error($e);
        }
    }

    protected function attachment($attachment_url)
    {
        $file = false;
        $match = preg_match('`(.+/)([^/]+)/([^/]+).([a-z]+)$`Uu', $attachment_url, $m);
        if ($match) {
            list(, $alias, $attached) = $m;

            $attachments = \Nos\Config_Data::get('attachments', array());
            if (isset($attachments[$alias])) {
                $config = $attachments[$alias];
                $attachment = \Nos\Attachment::forge($attached, $config);
                $file = $attachment->path();
                if (!empty($file)) {
                    if (isset($config['check']) && is_callable($config['check'])) {
                        $check = $config['check'];
                        if (!call_user_func($check, $attachment)) {
                            $file = false;
                        }
                    }
                }
            }
        }
        if (!$file) {
            throw new \Exception(__('This is unexpected: We cannot find the file. Please try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.'));
        }
        return $attachment;
    }
}
