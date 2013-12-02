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
        'plugins' => 'spellchecker,xhtmlxtras,style,table,advlist,inlinepopups,media,searchreplace,noneditable,nonbreaking',
        'paste_text_use_dialog' => true,
    ),

    'active_setup' => 'default',

    'setups' => array(
        'default' => array(
            'theme_advanced_toolbar_location' => 'external',

            'theme_advanced_buttons1' => "tablecontrols",
            'theme_advanced_buttons2' => "underline,strikethrough,sub,sup,|,forecolor,backcolor,|,outdent,indent,blockquote,|,anchor,charmap,hr,nonbreaking,nosbrclearall,|,styleprops,removeformat",
            'theme_advanced_buttons3' => "search,replace,|,spellchecker,|,newdocument,nosvisualhtml,code",
            'theme_advanced_buttons4' => "nosimage,mediawithlabel,noslink,nosenhancer",
            'theme_advanced_buttons5' => "nosstyleselect,bold,italic,nosalign,bullist,numlist,|,cut,copy,nospaste,undo,redo,|,nostoolbartoggle",
        ),
    ),
);
