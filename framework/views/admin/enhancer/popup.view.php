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

?>
<div id="<?= $id = uniqid('temp_') ?>">
<?php
echo !empty($fieldset) ? $fieldset->open($url) : '<form method="POST" action="'.$url.'">';
?>
        <input type="hidden" name="enhancer" value="<?= $enhancer_args['enhancer'] ?>" />
        <div class="line myBody fieldset">
            <div class="col c1"></div>
            <div class="col c10 ui-widget">
<?php
foreach ($layout as $view) {
    if (is_array($view)) {
        $view['params'] = empty($view['params']) ? array() : $view['params'];
        echo View::forge($view['view'], array('params' => $params, 'enhancer_args' => $enhancer_args) + $view['params'], false);
    } else {
        echo $view;
    }
}
?>
            </div>
            <div class="col c1"></div>
        </div>
        <div class="line">&nbsp;</div>
        <div class="line">
            <div class="col c1"></div>
            <div class="col c10 ui-widget">
<?php
$enhancerAction = \Arr::get($enhancer_args, 'enhancerAction', null);
switch ($enhancerAction) {
    case 'update':
        // Note to translator: action (button)
        $submit_label = __('Update');
        break;

    case 'insert':
        $submit_label = __('Insert');
        break;

    default:
        $submit_label = __('Save');
        break;
}
?>
                <?= strtr(__('{{Save}} or <a>Cancel</a>'), array(
                    '{{Save}}' => '<button type="submit" data-icon="check">'.$submit_label.'</button>',
                    '<a>' => '<a data-id="close" href="#">',
                )) ?>
            </div>
            <div class="col c1"></div>
        </div>
<?php
echo !empty($fieldset) ? $fieldset->close() : '</form>';
?>
</div>

<script type="text/javascript">
    require([
        'jquery-nos'
    ], function($) {
        $(function() {
            var div = $('#<?= $id ?>')
                    .find('a[data-id=close]')
                    .click(function(e) {
                        div.closest('.ui-dialog-content').wijdialog('close');
                        e.preventDefault();
                    })
                    .end()
                    .find('form')
                    .on('ajax_success', function(e, json) {
                        div.closest('.ui-dialog-content').trigger('save.enhancer', json);
                    })
                    .nosFormUI();
        });
    });
</script>
