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

if (!isset($allow_publish) || $allow_publish === null) {
    if (isset($publishable['options']) && isset($publishable['options']['allow_publish'])) {
        $allow_publish = \Config::processCallbackValue($publishable['options']['allow_publish'], true, $item['item']);
    } else {
        // No configuration = it's allowed
        $allow_publish = true;
    }
}

$state_property     = !empty($publishable['publication_state_property']) ? $publishable['publication_state_property'] : (!empty($publishable['publication_bool_property']) ? $publishable['publication_bool_property'] : '');
$yes_no_mode        = ($state_property !== '');
$planification_mode = !empty($publishable['publication_start_property']) && !empty($publishable['publication_end_property']);

$planification_status = $item->planificationStatus();
$published = !empty($item) ? $item->published() : false;
?>
<td class="c3">
    <table class="publishable" id="<?= $publishable_id = uniqid('publishable_') ?>">
        <tr>
            <td class="publishable_radio">
<?php
if ($planification_mode) {
    echo html_tag('input', array(
        'id' => ($uniqid_start = uniqid('start_')),
        'type' => 'hidden',
        'name' => $publishable['publication_start_property'],
        'value' => $item->publicationStart(),
    ));
    // Fixing strange bug of datepicker
    echo '<span></span>';

    echo html_tag('input', array(
        'id' => ($uniqid_end = uniqid('end_')),
        'type' => 'hidden',
        'name' => $publishable['publication_end_property'],
        'value' => $item->publicationEnd(),
    ));
    // Fixing strange bug of datepicker
    echo '<span></span>';
}
?>
                <div style="width:<?= ($yes_no_mode ? 50 : 0) + ($planification_mode ? 25 : 0) ?>px;">
<?php
if ($yes_no_mode) {
    ?>
    <input type="radio" name="<?= $state_property ?>" class="notransform" value="0" id="<?= $uniqid_no = uniqid('no_') ?>" <?= $planification_status == 0 ? 'checked' : ''; ?> <?= (!$allow_publish && $planification_status != 0) ? 'disabled' : '' ?> /><label for="<?= $uniqid_no ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-red.png" /></label>
    <?php
}
if ($planification_mode) {
    ?>
    <input type="radio" name="<?= $state_property ?>" class="notransform" value="2" id="<?= $uniqid_planned = uniqid('planned_') ?>" <?= $planification_status == 2 ? 'checked' : ''; ?> <?= !$allow_publish ? 'disabled' : '' ?> /><label for="<?= $uniqid_planned ?>"><span class="ui-icon ui-icon-clock" /></label>
    <?php
}
if ($yes_no_mode) {
    ?>
    <input type="radio" name="<?= $state_property ?>" class="notransform" value="1" id="<?= $uniqid_yes = uniqid('yes_') ?>" <?= $planification_status == 1 ? 'checked' : ''; ?> <?= !$allow_publish ? 'disabled' : '' ?> /><label for="<?= $uniqid_yes ?>"><img src="static/novius-os/admin/novius-os/img/icons/status-green.png" /></label>
    <?php
}
?>
                </div>
            </td>
            <td class="publishable_label"></td>
<?php
if ($planification_mode) {
    ?>
    <td class="publishable_schedule" style="display:none;"></td>
    <?php
}
?>
        </tr>
    </table>
</td>

<?php

$replacePlaceholders = function($txt) {
    return strtr($txt, array(
        '<row>' => '<tr>',
        '</row>' => '</tr>',
        '<cell>' => '<td>',
        '</cell>' => '</td>',
        '{{start}}' => '<a class="date_start" style="display:none;"></a><a class="date_pick" style="display:none;"></a>',
        '{{end}}' => '<a class="date_end" style="display:none;"></a><a class="date_pick" style="display:none;"></a>',
        '{{clear}}' => '<a class="date_clear" style="display:none;"></a>',
    ));
};

$nosPublishable = array(
    'initialStatus' => empty($item) || $item->is_new() ? 'undefined' : $item->planificationStatus(),
    'date_range' => !$planification_mode ? false : array(
        'container' => $publishable_id,
        'inputStart' => $uniqid_start,
        'inputEnd' => $uniqid_end,
        'now' => explode(' ', date('Y m d H i s')),
        'texts' => array(
            'initial' => array(
                'scheduled' => $replacePlaceholders(__('<row><cell>Scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
                'published' => $replacePlaceholders(__('<row><cell>Published since:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
                'backdated' => $replacePlaceholders(__('<row><cell>Was published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
            ),
            'modified' => array(
                'scheduled' => $replacePlaceholders(__('<row><cell>Will be scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
                'published' => $replacePlaceholders(__('<row><cell>Will be published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
                'backdated' => $replacePlaceholders(__('<row><cell>Will be backdated from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>')),
            ),
            'pick' => __('Pick a date'),
            'clear' => __('Clear'),
        ),
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
