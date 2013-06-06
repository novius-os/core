<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Config::load('wysiwyg', true);
empty($options) and $options = \Config::get('wysiwyg.default_setup', 'default');
is_string($options) and $options = \Config::get('wysiwyg.setups.'.$options, array());
$wysiwyg_options = array_merge(\Config::get('wysiwyg.default', array()), $options);

$item->event('wysiwygOptions', array(&$wysiwyg_options));
?>
<script type="text/javascript">
    require(['jquery-nos', 'static/apps/noviusos_page/config/form.js'], function ($, callback_fn) {
        $(function () {
            callback_fn.call($('#<?= $fieldset->form()->get_attribute('id') ?>'), <?= \Format::forge($wysiwyg_options)->to_json() ?>);
        });
    });
</script>
