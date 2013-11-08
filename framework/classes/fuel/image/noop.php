<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Image_Noop extends \Image_Driver
{
    protected $sizes = null;

    protected function _grayscale()
    {
    }

    protected function add_background()
    {
    }

    public function sizes($filename = null)
    {
        if ($this->sizes === null) {
            $return = (object) array(
                'width' => 0,
                'height' => 0
            );
        } else {
            $return = $this->sizes;
        }

        return $return;
    }

    public function setSizes(array $sizes)
    {
        $sizes = array_merge(array(
            'width' => 0,
            'height' => 0
        ), $sizes);
        $this->sizes = (object) $sizes;
    }
}
