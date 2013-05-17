<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_media::common', 'nos::common'));

return array(
    'fields' => array(
        'attachment' => array(
            'form' => array(
                'type'  => 'hidden',
            ),
        ),
        'media_folder_id' => array(
            'renderer' =>  'Nos\Media\Renderer_Folder',
            'form' => array(
                'type'  => 'hidden',
            ),
            'label' => __('Select a folder where to put your media file:'),
        ),
        'media_title' => array(
            'form' => array(
                'type' => 'text',
            ),
            'label' => __('Title:'),
        ),
        'media_file' => array(
            'form' => array(
                'type' => 'text',
            ),
            'label' => __('SEO, Media URL:'),
        ),
        'save' => array(
            'label' => '',
            'form' => array(
                'type' => 'submit',
                'tag' => 'button',
                // Note to translator: This is a submit button
                'value' => __('Add'),
                'class' => 'ui-priority-primary',
                'data-icon' => 'check',
            ),
        ),
    ),
);
