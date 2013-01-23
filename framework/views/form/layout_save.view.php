<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');

if ($save_field) {
    echo $save_field->set_template('{field}')->build();
} else {
    throw new \Exception('The save field is not present or incorrectly configured.');
}
$unique_id = uniqid('cancel_');
?>
&nbsp; <?= __('or') ?> &nbsp; <a id="<?= $unique_id ?>" href="#"><?= __('Cancel') ?></a>
<script type="text/javascript">
    require(['jquery-nos'], function ($) {
        $(function () {
            $('#<?= $unique_id ?>').click(function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                $(this).nosTabs('close');
            });
        });
    });
</script>
