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

$menus = array(
    array(
        'action' => array(
            'action' => 'nosTabs',
            'method' => 'open',
            'tab' => array(
                'url' => 'admin/noviusos_user/account',
                'app' => true,
                'iconSize' => 32,
                'labelDisplay' => false,
                'iconUrl' => 'static/apps/noviusos_user/img/32/myaccount.png',
                'label' => __('My account'),
            ),
        ),
        'label' => __('My account'),
    ),
    array(
        'label' => __('Switch language'),
        'menus' => array(),
    ),
    array(
        'action' => array(
            'action' => 'nosDialog',
            'dialog' => array(
                'contentUrl' => 'admin/nos/about',
                'ajax' => true,
                'width' => 620,
                'height' => 370,
                'title' => __('About Novius OS'),
            ),
        ),
        'label' => __('About Novius OS'),
    ),
);
foreach (\Config::get('novius-os.locales', array()) as $code => $locale) {
    $menus[1]['menus'][] = array(
        'action' => array(
            'action' => 'nosAjax',
            'params' => array(
                'url' => 'admin/noviusos_user/account/lang/'.$code
            ),
        ),
        'iconClasses' => 'nos-flag nos-flag-'.$locale['flag'],
        'label' => $locale['title'],
    );
}

$buttons = array(
    'user' => array(
        'type' => 'button',
        'label' => \Session::user()->user_firstname,
        'icons' => array(
            'secondary' => 'triangle-1-s',
        ),
        'menu' => array(
            'menus' => $menus,
            'options' => array(
                'triggerEvent'=> 'click',
                'orientation' => 'vertical',
                'position' => array(
                    'offset' =>  '-5 -10',
                    'my' => 'right top',
                    'at' => 'right bottom',
                ),
                'animation' => array(
                    'animated' => 'slide',
                    'option' => array(
                        'direction' => 'up',
                    ),
                    'duration' =>  200,
                    'easing' => null,
                ),
                'hideAnimation' => array(
                    'animated' => 'slide',
                    'option' => array(
                        'direction' => 'up',
                    ),
                    'duration' =>  200,
                    'easing' => null,
                ),
            ),
        ),
    ),
    'disconnect' => array(
        'type' => 'button',
        'label' => __('Sign out (see you!)'),
        'icons' => array(
            'primary' => 'power',
        ),
        'text' => false,
        'action' => array(
            'action' => 'document.location',
            'url' => 'admin/noviusos_user/account/disconnect',
        ),
    ),
    'fullscreen' => array(
        'type' => 'button',
        'label' => __('Toggle full screen'),
        'icons' => array(
            'primary' => 'arrowthick-2-ne-sw',
        ),
        'text' => false,
    ),
);
?>
<script type="text/javascript">
require(
    ['jquery-nos-tray'],
    function($) {
        $(function() {
            $('.nos-ostabs-tray').nosTray({
                buttons: <?= \Format::forge($buttons)->to_json() ?>
            });
        });
    });
</script>
