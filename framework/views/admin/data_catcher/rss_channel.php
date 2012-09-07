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
<div id="<?= $uniqid = uniqid('temp_') ?>">
<?php

$nugget_channel = $item->get_catcher_nuggets($catcher_name)->content_data;
$nugget_default = $item->get_default_nuggets();

echo \View::forge('nos::admin/data_catcher/rss_form', array(
    'action' => 'admin/nos/datacatcher/rss_channel_save',
    'item' => $item,
    'catcher_name' => $catcher_name,
    // The plus operator allow a merge without reindexing
    'nugget_default' => $nugget_default,
    'nugget' => $nugget_channel + $nugget_default,
    'nugget_db' => $nugget_channel,
), false);

?>
</div>
