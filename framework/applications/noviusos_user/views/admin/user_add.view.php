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
?>

<style type="text/css">
/* ? */
/* @todo check this */
.ui-accordion-content-active {
    overflow: visible !important;
}
</style>

<div class="page line ui-widget" id="<?= $uniqid ?>">
    <?= View::forge('form/layout_standard', array(
        'fieldset' => $fieldset,
        'medias' => null,
        'title' => array('user_firstname', 'user_name'),
        'id' => 'user_id',

        'published' => null,
        'save' => 'save',

        'subtitle' => array(),

        'content' => array(
            \View::forge('form/expander', array(
                'title'   => 'Details',
                'nomargin' => false,
                'content' => \View::forge('form/fields', array(
                    'fieldset' => $fieldset,
                    'fields' => array('user_email', 'user_password', 'password_confirmation', 'user_lang', 'user_expert'),
                ), false)
            ), false),
        ),
    ), false); ?>
</div>

<script type="text/javascript">
    require([
        'jquery-nos',
        'jquery.passwordstrength'
    ], function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>');
            var $password = $container.find('input[name=user_password]');

            <?php $formatter = \Format::forge(); ?>
            // Password strength
            var strength_id = '<?= $uniqid ?>_strength';
            var $strength = $('<span id="' + strength_id + '"></span>');
            $password.after($strength);
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
