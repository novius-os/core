<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

function mb_substr($str, $start, $length = null, $encoding = null)
{
        return substr($str, $start, $length);
}
function mb_strlen($str, $encoding = null)
{
    return strlen($str);
}
function mb_strtolower($str, $encoding = null)
{
    return strtolower($str);
}
function mb_strtoupper($str, $encoding = null)
{
    return strtoupper($str);
}
function mb_convert_case($str, $mode = MB_CASE_UPPER, $encoding = null)
{
    return $mode === MB_CASE_TITLE ? ucwords(strtolower($str)) : ($mode === MB_CASE_UPPER ? strtoupper($str) : strtolower($str));
}
