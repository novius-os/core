<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('nos::common'));

if (empty($publishable) && !empty($item)) {
    $publishable = $item->behaviours('Nos\Orm_Behaviour_Publishable');
}

if (empty($publishable)) {
    return;
}

$state_property     = !empty($publishable['publication_state_property']) ? $publishable['publication_state_property'] : (!empty($publishable['publication_bool_property']) ? $publishable['publication_bool_property'] : '');
$yes_no_mode        = ($state_property !== '');
$planification_mode = !empty($publishable['publication_start_property']) && !empty($publishable['publication_end_property']);

$planification_status = $item->planification_status();
$published = !empty($item) ? $item->published() : false;
?>
<td class="c3">
    <table style="margin:0 2em 0 1em;" id="<?= $publishable_id = uniqid('publishable_') ?>">
        <tr>
            <td class="publishable" style="width:<?= ($yes_no_mode ? 50 : 0) + ($planification_mode ? 25 : 0) ?>px;">
                <?php
                if ($yes_no_mode) {
                    ?>
                    <input type="radio" name="<?= $state_property ?>" class="notransform" value="0" id="<?= $uniqid_no = uniqid('no_') ?>" <?= $planification_status == 0 ? 'checked' : ''; ?> /><label for="<?= $uniqid_no ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-red.png" /></label>
                    <?php
                }
                if ($planification_mode) {
                    ?>
                    <input type="radio" name="<?= $state_property ?>" class="notransform" value="2" id="<?= $uniqid_planned = uniqid('planned_') ?>" <?= $planification_status == 2 ? 'checked' : ''; ?> /><label for="<?= $uniqid_planned ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-clock.png" /></label>
                    <?php
                }
                if ($yes_no_mode) {
                    ?>
                    <input type="radio" name="<?= $state_property ?>" class="notransform" value="1" id="<?= $uniqid_yes = uniqid('yes_') ?>" <?= $planification_status == 1 ? 'checked' : ''; ?> /><label for="<?= $uniqid_yes ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-green.png" /></label>
                    <?php
                }

                if ($planification_mode) {
                    echo html_tag('input', array(
                        'id' => ($uniqid_start = uniqid('start_')),
                        'type' => 'hidden',
                        'name' => $publishable['publication_start_property'],
                        'value' => $item->publication_start(),
                    ));
                    // Fixing strange bug of datepicker
                    echo '<span></span>';

                    echo html_tag('input', array(
                        'id' => ($uniqid_end = uniqid('end_')),
                        'type' => 'hidden',
                        'name' => $publishable['publication_end_property'],
                        'value' => $item->publication_end(),
                    ));
                    // Fixing strange bug of datepicker
                    echo '<span></span>';
                }
                ?>
            </td>
            <td style="padding-left:10px;"></td>
            <?php
            if ($planification_mode) {
                ?>
                <td style="padding-left:10px;display:none;">
                    <p class="date_start">
                        <span class="date_empty">
                            <?= strtr(__('From: <a>Pick a date</a>'), array(
                            '<a>' => '<a class="date_pick" href="#">',
                        )) ?>
                        </span>
                        <span class="date_filled">
                            <?= strtr(__('From: <a1>{{date}}</a> &nbsp; <a2>Clear</a>'), array(
                                '<a1>' => '<a class="date_pick" href="#">',
                                '<a2>' => '<a class="date_clear" href="#">',
                            )) ?>
                        </span>
                    </p>
                    <p class="date_end">
                        <span class="date_empty">
                            <?= strtr(__('To: <a>Pick a date</a>'), array(
                                '<a>' => '<a class="date_pick" href="#">',
                            )) ?>
                        </span>
                        <span class="date_filled">
                            <?= strtr(__('To: <a1>{{date}}</a> &nbsp; <a2>Clear</a>'), array(
                                '<a1>' => '<a class="date_pick" href="#">',
                                '<a2>' => '<a class="date_clear" href="#">',
                            )) ?>
                        </span>
                    </p>
                </td>
                <?php
            }
            ?>
        </tr>
    </table>
</td>

<?php

$nosPublishable = array(
    'initialStatus' => empty($item) || $item->is_new() ? 'undefined' : $item->planification_status(),
    'date_range' => !$planification_mode ? false : array(
        'container' => $publishable_id,
        'inputStart' => $uniqid_start,
        'inputEnd' => $uniqid_end,
    ),
    'texts' => array(
        'undefined' => array(
            0 => __('Will not be published'),
            1 => __('Will be published'),
        ),
        0 => array(
            0  => __('Not published'),
            1  => __('Will be published'),
        ),
        1 => array(
            0  => __('Will be unpublished'),
            1  => __('Published'),
        ),
        2 => array(
            0  => __('Will be unpublished'),
            1  => __('Will be published'),
        ),
    ),
);
?>
<script type="text/javascript">
require(
    ['jquery-nos-publishable'],
    function($) {
        $(function() {
            $('#<?= $publishable_id ?>').nosPublishable(<?= \Format::forge()->to_json($nosPublishable); ?>);
        });
    });
</script>
