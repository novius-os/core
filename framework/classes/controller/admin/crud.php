<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

abstract class Controller_Admin_Crud extends Controller_Admin_Application
{

    abstract protected function crud_item($id);
    abstract public    function action_form($id);

    public function action_crud($id = null)
    {
        // crud               : add a new item
        // crud/ID            : edit an existing item
        // crud/ID?lang=fr_FR : translate an  existing item (can be forbidden if the parent doesn't exists in that language)

        $item = $this->crud_item($id);
        $selected_lang = \Input::get('lang', $item->is_new() ? null : $item->get_lang());

        if ($item->is_new())
        {
            return $this->action_form($id);
        }
        else
        {
            $all_langs = $item->get_all_lang();

            if (in_array($selected_lang, $all_langs))
            {
                return $this->action_form($id);
            }
            else
            {
                $_GET['common_id'] = $id;
                return $this->action_blank_slate($id, $selected_lang);
            }
        }
    }

    public function action_blank_slate($id, $selected_lang)
    {
        $item = $this->crud_item($id);
        if (empty($lang))
        {
            $lang = \Input::get('lang', key(\Config::get('locales')));
        }

        $tabInfos = $this->get_tabInfos($item, true);
        $tabInfos['url'] .= '?lang='.$lang;
        $tabInfos = \Arr::merge($tabInfos, $this->config['tabInfosBlankSlate']);

        $viewData = array(
            'item'      => $item,
            'lang'      => $lang,
            'common_id' => \Input::get('common_id', ''),
            'item_text' => __('page'),
            'url_form'  => $this->config['base_url'].'/form',
            'url_crud'  => $this->config['base_url'].'/crud',
            'tabInfos'  => $tabInfos,
        );
        return \View::forge('nos::form/layout_blank_slate', $viewData, false);
    }

    protected function get_tabInfos($item, $faded = false)
    {
        $tabInfos = array_merge(
            $this->config['tabInfos'],
            array(
                'url' => $this->config['base_url'].'/crud'.($item->is_new() ? '?lang='.$item->get_lang() : '/'.$item->id),
                'actions' => array_values($this->get_actions_lang($item)),
            )
        );
        if (is_callable($tabInfos['label']))
        {
            $tabInfos['label'] = $tabInfos['label']($item);
        }
        if (!$item->is_new())
        {
            foreach ($this->config['actions'] as $actionClosure)
            {
                $action = $actionClosure($item);
                if ($faded)
                {
                    unset($action['action']);
                    $action['faded'] = true;
                }
                $tabInfos['actions'][] = $action;
            }
        }

        return $tabInfos;
    }


    protected function get_actions_lang($item)
    {
        $actions = array();

        $locales = array_keys(\Config::get('locales'));

        if ($item->is_new())
        {
            foreach ($locales as $locale)
            {
                $actions[$locale] = array(
                    'label' => strtr(__('Add in {lang}'), array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))),
                    'action' => array(
                        'openTab' => $this->config['base_url'].'/crud?lang='.$locale,
                    ),
                    'iconUrl' => \Nos\Helper::flag_url($locale),
                );
            }
        }
        else
        {
            $main_lang = $item->find_main_lang();
            $existing = $item->get_all_lang();
            foreach ($locales as $locale)
            {
                $item_lang = $item->find_lang($locale);
                $actions[$locale] = array(
                    'label' => strtr(
                            empty($item_lang) ? __('Translate in {lang}') : __('Edit in {lang}'), array('{lang}' => \Arr::get(\Config::get('locales'), $locale, $locale))
                    ),
                    'action' => array(
                        'openTab' => $this->config['base_url'].'/crud/'.(empty($item_lang) ? $main_lang->id.'?lang='.$locale : $item_lang->id), // .'?lang='.$locale, // .'&common_id='.$main_lang->id
                    ),
                    'iconUrl' => \Nos\Helper::flag_url($locale),
                );
            }
        }
        return $actions;
    }

}