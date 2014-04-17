<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

use Nos\Renderer;

class Renderer_Menu_Items extends Renderer
{
    public function build()
    {
        $menu = $this->fieldset()->getInstance();
        return $this->template(static::renderer(array(
            'menu' => $menu,
        )));
    }

    /**
     * Returns a menu builder renderer
     *
     * @param array $options
     * @return string
     */
    public static function renderer($options = array())
    {
        // Builds and return the renderer
        return \View::forge('noviusos_menu::admin/renderer/menu/items', array(
            'options' => $options,
        ), false);
    }
}
