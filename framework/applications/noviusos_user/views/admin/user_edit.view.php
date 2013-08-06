<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('noviusos_user::common');

$uniqid = uniqid('id_');
$enable_roles = \Config::get('novius-os.users.enable_roles', false);

echo View::forge('nos::crud/tab', $view_params, false);

if (!$enable_roles) {
    $view_params['container_id'] = $uniqid;
}

echo View::forge('nos::crud/toolbar', $view_params, false);
?>
<style type="text/css">
/* ? */
/* @todo check this */
.wijmo-wijaccordion-content-active {
    overflow: visible !important;
}
</style>
<?php

// If roles are not enabled, we create two "Details" and "Permissions" tabs
if (!$enable_roles) {
    ?>
    <div id="<?= $uniqid ?>" class="fill-parent" style="width: 92.4%; clear:both; margin:30px auto 1em;padding:0;">
        <ul style="width: 15%;">
            <li><a href="#<?= $uniqid ?>_details"><?= __('User details') ?></a></li>
            <li><a href="#<?= $uniqid ?>_permissions"><?= __('Permissions') ?></a></li>
        </ul>
        <div id="<?= $uniqid ?>_details" class="fill-parent" style="padding:0;">
            <?= \View::forge('noviusos_user::admin/user_details_edit', array('fieldset' => $fieldset, 'user' => $item), false) ?>
        </div>
        <div id="<?= $uniqid ?>_permissions" class="fill-parent" style="overflow: auto;">
            <?= \View::forge('noviusos_user::admin/permission_user', array(
                'user' => $item,
            ), false);
            ?>
        </div>
    </div>
    <?php
} else {
    echo '<div id="'.$uniqid.'">';
    echo \View::forge('noviusos_user::admin/user_details_edit', array('fieldset' => $fieldset, 'user' => $item), false);
    echo '</div>';
}
?>

<script type="text/javascript">
    require([
        'jquery-nos',
        'jquery.passwordstrength',
        'wijmo.wijtabs'
    ], function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>');
            if ($container.hasClass('fill-parent')) {
                $container.css('display', 'block')
                    .nosOnShow()
                    .wijtabs({
                        alignment: 'left'
                    });

                $container.find('> div').addClass('fill-parent').css({
                    left: '15%',
                    width : 'auto'
                });
            }

            var $password = $container.find('input[name=password_reset]');

            // Password strength
            var strength_id = '<?= $uniqid ?>_strength';
            var $strength = $('<span id="' + strength_id + '"></span>');
            $password.after($strength);
            <?php $formatter = \Format::forge(); ?>
            $password.password_strength({
                container : '#' + strength_id,
                texts : {
                    <?php // Password strength ?>
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
