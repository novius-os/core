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

class Tools_Enhancer
{

    public static function url_item($enhancer, $callback, $item, $first = false)
    {
        \Config::load(APPPATH.'data'.DS.'config'.DS.'page_enhanced.php', 'page_enhanced');
        $page_enhanced = \Config::get('page_enhanced', array());
        $item_lang = $item->get_lang();
        $urls = array();
        if (!isset($page_enhanced[$enhancer]))
        {
            return $first ? false : array();
        }
        foreach ($page_enhanced[$enhancer] as $page_id => $params)
        {
            if ($page = Model_Page::find($page_id))
            {
                $urlPath = mb_substr($page->get_href(), 0, -5).'/';
                if ($page->page_lang === $item_lang)
                {
                    $urls[] = $callback($item, array('urlPath' => $urlPath));
                }
            }
            if ($first && count($urls))
            {
                return $urls[0];
            }
        }
        return $urls;
    }

}