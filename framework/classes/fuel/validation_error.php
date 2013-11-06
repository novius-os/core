<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

class Validation_Error extends Fuel\Core\Validation_Error
{
    /**
     * Load validation Language file when errors are thrown
     */
    public static function _init()
    {
        // Prevents from  loading validation translations
        // parent::_init();
        \Config::load('nos::validation', true);
    }

    /**
     * Get Message
     *
     * Shows the error message which can be taken from loaded language file.
     *
     * @param   string  HTML to prefix error message
     * @param   string  HTML to postfix error message
     * @param   string  Message to use, or false to try and load it from Lang class
     * @return  string
     */
    public function get_message($msg = false, $open = '', $close = '')
    {
        $open   = empty($open)  ? \Config::get('validation.open_single_error', '')  : $open;
        $close  = empty($close) ? \Config::get('validation.close_single_error', '') : $close;

        if ($msg === false and ! ($msg = $this->field->get_error_message($this->rule))) {
            if (is_null($msg)) {
                $msg = $this->field->fieldset()->validation()->get_message($this->rule);
            }
            if ($msg === false) {
                $msg = \Config::get('nos::validation.'.$this->rule, false) ?: __(\Arr::get(explode(':', $this->rule), 0));
            }
        }
        if ($msg == false) {
            return $open.strtr(__('The field ‘{{field}}’ doesn’t respect the rule ‘{{rule}}’'), array(
                '{{rule}}' => $this->rule,
                '{{field}}' => $this->field->label,
            )).$close;
        }

        // Translator placeholder is '{{param:1}}', internal Fuel placeholder is ':param:1'
        $msg = preg_replace('`{{param:(\d+)}}`', ':param:$1', $msg);

        // only parse when there's tags in the message
        return $open.(strpos($msg, ':') === false ? $msg : $this->_replace_tags($msg)).$close;
    }
}
