<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Pagination extends Fuel\Core\Pagination
{
    public function __construct($config = array())
    {
        // Making sure our custom config key exists
        $this->config['pagination_url_first_page'] = null;
        parent::__construct($config);
    }

    protected function _make_link($page)
    {
        // Making sure we have a valid page number
        empty($page) and $page = 1;

        // The first page url may be specific to avoid SEO duplicates (`foo.html` vs `foo.html?page=1`)
        if ($page == 1 && !empty($this->config['pagination_url_first_page'])) {
            return str_replace('{page}', $page, $this->config['pagination_url_first_page']);
        }

        return parent::_make_link($page);
    }
}
