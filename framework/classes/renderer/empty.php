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

/**
 * @todo rename to Renderer_Validation
 */
class Renderer_Empty extends \Fieldset_Field
{
    public function build()
    {
        return '';
    }

}
