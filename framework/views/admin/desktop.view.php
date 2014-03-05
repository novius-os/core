<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');

$id = uniqid('temp_');

$config = array(
    'launchers' => $apps,
    'reloadUrl' => 'admin/nos/noviusos/desktop',
);
?>
<div id="<?= $id ?>" class="nos-desktop-apps"></div>
<script type="text/javascript">
require(
    ['jquery-nos-nosdesktop'],
    function($) {
        $(function() {
            $('#<?= $id ?>').nosdesktop(<?= \Format::forge($config)->to_json() ?>);
        });
    });
</script>
