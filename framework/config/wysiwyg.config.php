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
    'default' => array(
        // IE 10 bugfix to make div:hover working in CSS (to show enhancer actions)
        'doctype' => '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
        'theme' => 'nos',
        'skin' => 'bootstrap',
        'plugins' => 'spellchecker,xhtmlxtras,style,table,advlist,inlinepopups,media,searchreplace,paste,noneditable,visualchars,nonbreaking',
        'paste_text_use_dialog' => true,
    ),

    'active_setup' => 'default',

    'setups' => array(
        'default' => array(),
    ),
);
