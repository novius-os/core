<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

?>
<div id="<?= $id = uniqid('temp_') ?>">
    <form method="POST" action="<?= $url ?>">
        <div class="line myBody">
            <div class="unit col c1"></div>
            <div class="unit col c10 ui-widget">
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
            <div class="line">&nbsp;</div>
            <div class="line">
                <div class="unit col c1"></div>
                <div class="unit col c10 ui-widget">
                    <?= Str::tr(':save or :cancel', array(
                        'save'   => '<button type="submit" data-icon="check">'.__('Save').'</button>',
                        'cancel' => '<a data-id="close" href="#">'.__('Cancel').'</a>',
                    )) ?>
                </div>
                <div class="unit lastUnit"></div>
            </div>
    </form>
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
                    .submit(function() {
                        var self = this;
                        $(self).ajaxSubmit({
                            dataType: 'json',
                            success: function(json) {
                                div.closest('.ui-dialog-content').trigger('save.enhancer', json);
                            },
                            error: function(error) {
                                $.nosNotify('An error occured', 'error');
                            }
                        });

                        return false;
                    })
                    .nosFormUI();
        });
    });
</script>
