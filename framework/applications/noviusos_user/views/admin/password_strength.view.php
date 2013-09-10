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

$texts = array(
    1 => __('Insufficient'),
    2 => __('Weak'),
    3 => __('Average'),
    4 => __('Strong'),
    5 => __('Outstanding'),
);
foreach ($texts as $i => $text) {
    $texts[$i] = ' '.str_repeat('<span class="color"></span>', $i > 4 ? 4 : $i).
        str_repeat('<span class="box"></span>', $i > 3 ? 0 : 4 - $i).
        ' <span class="optional">'.$text.'</span>';
}

?>
<script type="text/javascript">
    require([
        'jquery-nos',
        'jquery.passwordstrength'
    ], function($) {
        $(function() {
            var $password = $('#<?= $uniqid ?>').find('input[name=<?= $input_name ?>]');

            // Password strength
            var strength_id = '<?= $uniqid ?>_strength';
            var $strength = $('<span id="' + strength_id + '"></span>');
            $password.after($strength);
            $password.password_strength({
                container : '#' + strength_id,
                texts : <?= \Format::forge($texts)->to_json() ?>
            });
        });
    });
</script>
