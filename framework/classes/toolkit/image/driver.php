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

abstract class Toolkit_Image_Driver
{
    public function __construct($image)
    {
        $this->image = $image;
    }

    /**
     * @var  mixed  The object image
     */
    protected $image;

    /**
     * Return the url of the current image
     *
     * @return string
     */
    abstract public function url();

    /**
     * Return the title of the current image
     *
     * @return string
     */
    abstract public function title();

    /**
     * Return the file path of the current image
     *
     * @return string
     */
    abstract public function file();
}


