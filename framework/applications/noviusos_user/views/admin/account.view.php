<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary(array('noviusos_user::common', 'nos::common'));

$uniqid = uniqid('id_');
$saveField = __('Save');
$fieldset_infos->add('my_account', '', array('type' => 'hidden', 'value' => '1'));
?>
<script type="text/javascript">
    require([
        'jquery-nos'
    ], function($) {
        $(function() {
            var $container = $('#<?= $uniqid ?>');
            $container.nosToolbar('create');
            $container.nosToolbar('add', <?= \Format::forge((string) \View::forge('form/layout_save', array(
                'save_field' => $saveField
            ), false))->to_json() ?>)
                .filter(':submit')
                .click(function() {
                    $container.find('form:visible').submit();
                });

            $container.nosToolbar('add', '<a style="overflow:auto;" href="admin/noviusos_user/account/disconnect"><button data-icon="power">' + <?= \Format::forge(__('Sign out (see you!)'))->to_json() ?> + '</button></a>', true);
        });
    });
</script>

<div class="page line ui-widget fill-parent" id="<?= $uniqid ?>">
    <div style="margin-left: 4%; margin-right: 4%; height: 28px;">
        <h1 class="title" style="float:left;"><?= $logged_user->fullname(); ?></h1>
    </div>

    <div class="tabs fill-parent" style="width: 92.4%; clear:both; margin:30px auto 1em;display:none;padding:0;">
        <ul style="width: 15%;">
            <li><a href="#infos"><?= __('My account') ?></a></li>
            <li><a href="#display"><?= __('Theme') ?></a></li>
        </ul>
        <div id="infos">
            <?= render('noviusos_user::admin/user_details_edit', array(
                'fieldset' => $fieldset_infos,
                'user' => $logged_user,
                'no_role' => true,
            ), false) ?>
        </div>
        <div id="display">
            <?= $fieldset_display ?>
        </div>
    </div>
</div>

<script type="text/javascript">
    require(
        [
            'jquery-nos',
            'wijmo.wijtabs'
        ],
        function($) {
            $(function() {
                var $container = $('#<?= $uniqid ?>');
                $('#<?= $fieldset_display->form()->get_attribute('id') ?>').bind('ajax_success', function(e, json) {
                    if (json.wallpaper_url) {
                        $('#noviusospanel').css('background-image', 'url("' + json.wallpaper_url + '")');
                    } else {
                        $('#noviusospanel').css('background-image', '');
                    }
                });
                var $tabs = $('#<?= $uniqid ?> .tabs');
                $tabs.css('display', 'block').nosOnShow();
                $tabs.wijtabs({
                    alignment: 'left'
                });
                $tabs.find('> div').addClass('fill-parent').css({
                    left: '15%',
                    width : '85%'
                });
            });
        });
</script>

<?php
echo \View::forge('noviusos_user::admin/password_strength', array(
    'uniqid' => $uniqid,
    'input_name' => 'password_reset',
), false);

