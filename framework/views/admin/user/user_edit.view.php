<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$uniqid = uniqid('id_');

echo View::forge('nos::crud/tab', array(
    'model' => $view_params['model'],
    'pk' => $view_params['pk'],
    'item' => $view_params['item'],
    'config' => $view_params['config'],
    'fieldset' => $view_params['fieldset'],
    'tab_params' => $view_params['tab_params'],
), false);

echo View::forge('nos::crud/toolbar', array(
    'container_id' => $uniqid,
    'config' => $view_params['config'],
    'actions' => $view_params['actions'],
    'fieldset' => $view_params['fieldset'],
    'object' => $view_params['item'],
), false);
?>
<style type="text/css">
/* ? */
/* @todo check this */
.ui-accordion-content-active {
	overflow: visible !important;
}
</style>

<?php
$view_params['fieldset']->form()->set_config('field_template',  "\t\t<tr><th class=\"{error_class}\">{label}{required}</th><td class=\"{error_class}\">{field} {error_msg}</td></tr>\n");

foreach ($view_params['fieldset']->field() as $field) {
	if ($field->type == 'checkbox') {
		$field->set_template('{field} {label}');
	}
}
?>
<div>
<div id="<?= $uniqid ?>" class="fill-parent" style="width: 92.4%; clear:both; margin:30px auto 1em;padding:0;">
    <ul style="width: 15%;">
        <li><a href="#<?= $uniqid ?>_details"><?= __('User details') ?></a></li>
        <li><a href="#<?= $uniqid ?>_permissions"><?= __('Permissions') ?></a></li>
    </ul>
    <div id="<?= $uniqid ?>_details" class="fill-parent" style="padding:0;">
        <?= render('admin/user/user_details_edit', array('fieldset' => $view_params['fieldset'], 'user' => $view_params['item']), false) ?>
    </div>
    <div id="<?= $uniqid ?>_permissions" class="fill-parent" style="overflow: auto;">
<?php
        $role = reset($view_params['item']->roles);

        \Config::load('nos::admin/native_apps', 'natives_apps');
        $natives_apps = \Config::get('natives_apps', array());

        \Config::load(APPPATH.'data'.DS.'config'.DS.'app_installed.php', 'data::app_installed');
        $apps = \Config::get('data::app_installed', array());
        unset($apps['local']);

        $apps = array_merge($natives_apps, $apps);

        echo \View::forge('nos::admin/user/permission', array(
            'user' => $view_params['item'],
            'role' => $role,
            'apps' => $apps,
        ), false);
?>
    </div>
</div>
</div>

<script type="text/javascript">
    require([
	    'jquery-nos',
        'jquery.passwordstrength',
        'wijmo.wijtabs'
    ], function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>');
            $container.css('display', 'block')
                .nosOnShow()
                .wijtabs({
                    alignment: 'left'
                });

            $container.find('> div').addClass('fill-parent').css({
                left: '15%',
                width : '85%'
            });

            var $password = $container.find('input[name=password_reset]');

            // Password strength
            var strength_id = '<?= $uniqid ?>_strength';
            var $strength = $('<span id="' + strength_id + '"></span>');
            $password.after($strength);
            <?php $formatter = \Format::forge(); ?>
            $password.password_strength({
                container : '#' + strength_id,
                texts : {
                    1 : ' <span class="color"></span><span class="box"></span><span class="box"></span><span class="box"></span> <span class="optional">' + <?= $formatter->to_json(__('Insufficient')) ?> + '</span>',
                    2 : ' <span class="color"></span><span class="color"></span><span class="box"></span><span class="box"></span> <span class="optional">' + <?= $formatter->to_json(__('Weak')) ?> + '</span>',
                    3 : ' <span class="color"></span><span class="color"></span><span class="color"></span><span class="box"></span> <span class="optional">' + <?= $formatter->to_json(__('Average')) ?> + '</span>',
                    4 : ' <span class="color"></span><span class="color"></span><span class="color"></span><span class="color"></span> <span class="optional">' + <?= $formatter->to_json(__('Strong')) ?> + '</span>',
                    5 : ' <span class="color"></span><span class="color"></span><span class="color"></span><span class="color"></span> <span class="optional">' + <?= $formatter->to_json(__('Outstanding')) ?> + '</span>'
                }
            });
        });
    });
</script>