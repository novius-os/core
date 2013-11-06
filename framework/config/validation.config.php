<?php

/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('nos::common'));

return array(
    'required' => __('We need you to fill in this field.'),
    'min_length' => __('This field’s value must be at least {{param:1}} characters long.'),
    'max_length' => __('This field’s value musn’t be longer than {{param:1}} characters.'),
    'valid_date' => __('This isn’t a valid date.'),
    'valid_email' => __('This isn’t a valid email address.'),
    'check_old_password' => __('The old password is incorrect.'),
    'match_field' =>  __('They don’t match. Are you sure you’ve typed the same thing?'),
);
