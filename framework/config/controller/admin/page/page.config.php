<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Config::load(APPPATH.'metadata'.DS.'templates.php', 'data::templates');
$templates = array();
foreach (Config::get('data::templates', array()) as $tpl_key => $template) {
    $templates[$tpl_key] = $template['title'];
}

$i18n = Nos\I18n::dictionnary('nos::admin/page/page', 'nos::admin/crud');

return array(
    'controller_url'  => 'admin/nos/page/page',
    'model' => 'Nos\\Model_Page',
    'i18n_file' => 'nos::admin/page/page',
    'context_relation' => 'parent',
    'tab' => array(
        'iconUrl' => 'static/novius-os/admin/novius-os/img/16/page.png',
        'labels' => array(
            'insert' => $i18n('Add a page'),
            'blankSlate' => $i18n('Translate a page'),
        ),
    ),
    'actions' => array(
        'visualise' => function($item) use($i18n) {
            if (!$item->is_new())
            {
                return array(
                    'label' => $i18n('Visualise'),
                    'iconClasses' => 'nos-icon16 nos-icon16-eye',
                    'action' => array(
                        'action' => 'window.open',
                        'url' => $item->get_href() . '?_preview=1',
                    ),
                );
            }
            else
            {
                return array();
            }
        }
    ),
    'layout' => array(
        'form' => array(
            'view' => 'nos::form/layout_standard',
            'params' => array(
                'title' => 'page_title',
                'medias' => array(),
                'large' => true,
                'save' => 'save',
                'subtitle' => array('page_type', 'page_template'),
                'content' => array(
                    'content' => array(
                        'view' => 'nos::form/expander',
                        'params' => array(
                            'title'   => $i18n('Content'),
                            'nomargin' => true,
                            'options' => array(
                                'allowExpand' => false,
                            ),
                            'content' => array(
                                'view' => 'nos::form/fields',
                                'params' => array(
                                    'begin' => '<div data-id="external"><table>',
                                    'fields' => array(
                                        'page_external_link',
                                        'page_external_link_type',
                                    ),
                                    'end' => '</table>
                                        </div>
                                        <div data-id="internal" style="display:none;">
                                            <p style="padding:1em;">We\'re sorry, internal links are not supported yet. We need a nice page selector before that.</p>
                                        </div>
                                        <div data-id="wysiwyg" style="display:none;"></div>',
                                ),
                            ),
                        ),
                    ),
                ),
                'menu' => array(
                    'accordion' => array(
                        'view' => 'nos::form/accordion',
                        'params' => array(
                            'accordions' => array(
                                'menu' => array(
                                    'title' => $i18n('Menu'),
                                    'fields' => array('page_parent_id', 'page_menu', 'page_menu_title'),
                                ),
                                'url' => array(
                                    'title' => $i18n('URL (page address)'),
                                    'fields' => array('page_virtual_name'),
                                ),
                                'seo' => array(
                                    'title' => $i18n('SEO'),
                                    'fields' => array('page_meta_noindex', 'page_meta_title', 'page_meta_description', 'page_meta_keywords'),
                                ),
                                'admin' => array(
                                    'title' => $i18n('Admin'),
                                    'header_class'  => 'faded',
                                    'content_class' => 'faded',
                                    'fields'        => array('page_cache_duration', 'page_lock'),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'js' => array(
            'view' => 'nos::admin/page/page_form',
        ),
    ),
    'fields' => array(
        'page_id' => array (
            'label' => $i18n('ID: '),
            'form' => array(
                'type' => 'hidden',
            ),
        ),
        'page_title' => array(
            'label' => $i18n('Title'),
            'form' => array(
                'type' => 'text',
            ),
            'validation' => array(
                'required',
                'min_length' => array(2),
            ),
        ),
        'page_parent_id' => array(
            'widget' => 'Nos\Widget_Page_Selector',
            'widget_options' => array(
                'width' => '250px',
                'height' => '250px',
            ),
            'label' => $i18n('Location: '),
            'form' => array(
            ),
        ),
        'page_template' => array(
            'label' => $i18n('Template: '),
            'form' => array(
                'type' => 'select',
                'options' => $templates,
            ),
        ),
        'page_virtual_name' => array(
            'label' => $i18n('URL: '),
            'widget' => 'Nos\Widget_Virtualname',
            'validation' => array(
                'required',
                'min_length' => array(2),
            ),
        ),
        'page_meta_title' => array(
            'label' => $i18n('SEO title: '),
            'form' => array(
                'type' => 'text',
            ),
        ),
        'page_meta_description' => array(
            'label' => $i18n('Description: '),
            'form' => array(
                'type' => 'textarea',
                'rows' => 6,
            ),
        ),
        'page_meta_keywords' => array(
            'label' => $i18n('Keywords: '),
            'form' => array(
                'type' => 'textarea',
                'rows' => 3,
            ),
        ),
        'page_meta_noindex' => array(
            'label' => $i18n("Don't index on search engines"),
            'form' => array(
                'type' => 'checkbox',
                'value' => '1',
                'empty' => '0',
            ),
        ),
        'page_menu' => array(
            'label' => $i18n("Shows in the menu"),
            'form' => array(
                'type' => 'checkbox',
                'value' => '1',
                'empty' => '0',
            ),
        ),
        'page_menu_title' => array(
            'label' => $i18n('What\'s the page called in the menu: '),
            'form' => array(
                'type' => 'text',
            ),
        ),
        'page_external_link' => array(
            'label' => $i18n('URL: '),
            'form' => array(
                'type' => 'text',
            ),
        ),
        'page_external_link_type' => array(
            'label' => $i18n('Target: '),
            'form' => array(
                'type' => 'select',
                'options' => array(
                    Nos\Model_Page::EXTERNAL_TARGET_NEW   => $i18n('New window'),
                    Nos\Model_Page::EXTERNAL_TARGET_POPUP => $i18n('Popup'),
                    Nos\Model_Page::EXTERNAL_TARGET_SAME  => $i18n('Same window'),
                ),
            ),
        ),
        'page_type' => array(
            'label' => $i18n('Type: '),
            'form' => array(
                'type' => 'select',
                'options' => array(
                    Nos\Model_Page::TYPE_CLASSIC => $i18n('Page'),
                    //Nos\Model_Page::TYPE_FOLDER => $i18n('Folder / Chapter'),
                    //Nos\Model_Page::TYPE_INTERNAL_LINK => $i18n('Internal link'),
                    Nos\Model_Page::TYPE_EXTERNAL_LINK => $i18n('External link'),
                ),
            ),
        ),
        'page_lock' => array(
            'label' => $i18n('Lock status: '),
            'form' => array(
                'type' => 'select',
                'options' => array(
                    Nos\Model_Page::LOCK_UNLOCKED => $i18n('Unlocked'),
                    Nos\Model_Page::LOCK_DELETION => $i18n('Deletion'),
                    Nos\Model_Page::LOCK_EDITION  => $i18n('Modification'),
                ),
            ),
        ),
        'page_cache_duration' => array(
            'label' => $i18n('Regenerate every {duration} seconds'),
            'form' => array(
                'type' => 'text',
                'size' => 4,
            ),
        ),
        'save' => array(
            'label' => '',
            'form' => array(
                'type' => 'submit',
                'tag' => 'button',
                'value' => $i18n('Save'),
                'class' => 'primary',
                'data-icon' => 'check',
            ),
        ),
    ),
);
