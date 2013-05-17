<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('noviusos_page::common', 'nos::common'));

$uniqid = uniqid('tabs_');
$id_type = $uniqid.'_type';
$id_appdesk = $uniqid.'_appdesk';
$id_properties = $uniqid.'_properties';
$title_appdesk_page = $edit ? __('Select another page') : __('2. Select a page');
$title_appdesk_media = $edit ? __('Select another media file') : __('2. Select a media file');
$title_properties_2 = $edit ? __('Edit the properties') : __('2. Set the properties');
$title_properties_3 = $edit ? __('Edit the properties') : __('3. Set the properties');

?>
<style type="text/css">
    .box-sizing-border {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        height: 100%;
    }
    .target_radio label {
        display: inline-block;
    }
</style>
<div id="<?= $uniqid ?>" class="box-sizing-border">
    <ul>
        <li><a href="#<?= $id_type ?>"><?= $edit ? __('Change the link type') : __('1. Select the link type') ?></a></li>
        <li><a href="#<?= $id_properties ?>"><?= $title_properties_2 ?></a></li>
    </ul>
    <div id="<?= $id_type ?>">
        <form action="#" >
            <table class="fieldset">
                <tr><td><label><input type="radio" value="internal" name="link_type" /> <?= __('Internal link') ?></label></td></tr>
                <tr><td><label><input type="radio" value="external" name="link_type" /> <?= __('External link') ?></label></td></tr>
                <tr><td><label><input type="radio" value="media" name="link_type" /> <?= __('Link to a media file') ?></label></td></tr>
                <tr><td><label><input type="radio" value="anchor" name="link_type" /> <?= __('Link to an anchor') ?></label></td></tr>
                <tr><td><label><input type="radio" value="email" name="link_type" /> <?= __('Link to an email address') ?></label></td></tr>
                <tr><td><label><input type="radio" value="phone" name="link_type" /> <?= __('Link to a phone number') ?></label></td></tr>
            </table>
        </form>
    </div>

    <div id="<?= $id_properties ?>">
        <form action="#">
            <table class="fieldset" >
                <tr id="tr_<?= $uniqid ?>_title">
                    <th><?= __('Title:') ?></th>
                    <td colspan="6"><span id="<?= $uniqid ?>_title"></span></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_url">
                    <th><label for="<?= $uniqid ?>_url"><?= __('URL:') ?> </label></th>
                    <td colspan="6"><span id="<?= $uniqid ?>_url_real"></span><input name="url" type="text" value="" size="60" id="<?= $uniqid ?>_url" class="required" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_anchor">
                    <th><label for="<?= $uniqid ?>_anchor"><?= __('Anchor name:') ?> </label></th>
                    <td colspan="6"><select name="anchorlist" id="<?= $uniqid ?>_anchor"><option value="">---</option></select></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_email">
                    <th><label for="<?= $uniqid ?>_email"><?= __('Email address:') ?> </label></th>
                    <td colspan="6"><input type="text" name="email" size="60" id="<?= $uniqid ?>_email" class="email" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_phone">
                    <th><label for="<?= $uniqid ?>_phone"><?= __('Phone number:') ?> </label></th>
                    <td colspan="6"><input type="text" name="phone" size="60" id="<?= $uniqid ?>_phone" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_url_params">
                    <th><label for="<?= $uniqid ?>_url_params"><?= __('URL parameters:') ?> </label></th>
                    <td colspan="6"><input type="text" name="url_params" size="60" id="<?= $uniqid ?>_url_params" /></td>
                </tr>
                <tr id="tr_<?= $uniqid ?>_tooltip">
                    <th><label for="<?= $uniqid ?>_tooltip"><?= __('Hint (tooltip):') ?> </label></th>
                    <td colspan="6"><input type="text" name="title" size="60" id="<?= $uniqid ?>_tooltip" /></td>
                </tr>

                <tr id="tr_<?= $uniqid ?>_target">
                    <th><label><?= __('Opens in:') ?> </label></th>
                    <td colspan="2"><label><input type="radio" name="target" value="_blank" /> <?= __('A new window or tab') ?></label></td>
                    <td colspan="2"><label><input type="radio" name="target" value="" /> <?= __('The same window or tab') ?></label></td>
                </tr>
                <tr>
                    <th></th>
                    <td colspan="6"><button type="submit" class="ui-priority-primary" data-icon="check" data-id="save"><?= $edit ? __('Update this link') : __('Insert this link') ?></button> &nbsp; <?= __('or') ?> &nbsp; <a data-id="close" href="#"><?= __('Cancel') ?></a></td>
                </tr>
            </table>
        </form>
    </div>
</div>
<script type="text/javascript">
require(
    ['jquery-nos-link-wysiwyg'],
    function($) {
        $(function() {
            $('#<?= $uniqid ?>').nosLinkWysiwyg({
                expert: <?= \Format::forge((bool) \Session::user()->user_expert)->to_json() ?>,
                newlink: !'<?= $edit ?>',
                base_url: '<?= \Uri::base(true) ?>',
                texts: {
                    titleAppdeskPage: <?= \Format::forge($title_appdesk_page)->to_json() ?>,
                    titleAppdeskMedia: <?= \Format::forge($title_appdesk_media)->to_json() ?>,
                    titleProperties2: <?= \Format::forge($title_properties_2)->to_json() ?>,
                    titleProperties3: <?= \Format::forge($title_properties_3)->to_json() ?>
                }
            });
        });
    });
</script>
