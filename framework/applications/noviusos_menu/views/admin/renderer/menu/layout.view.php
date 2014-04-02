<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

$json = array(
    'maxLevels' => \Arr::get($options, 'max_levels'),
    'texts' => array(
        'editItem' => __('Edit an item')
    ),
);
?>
<div class="renderer-menu" id="<?= $id ?>">
    <div class="add-buttons">
<?php
// Add a button for each available driver
$config = \Config::load('noviusos_menu::config', true);
$available_drivers = \Arr::get($config, 'drivers', array());
foreach ($available_drivers as $driver_class) {
    if (!class_exists($driver_class)) {
        continue;
    }
    $driver_config = $driver_class::getConfig();
    $driver_name = \Arr::get($driver_config, 'name');
    // Dialog options
    $dialog_options = array(
        'width' => \Arr::get($driver_config, 'form.width', array()),
        'height' => \Arr::get($driver_config, 'form.height', array()),
    );
    ?>
            <button data-item-driver="<?= $driver_class ?>"
                    data-item-title="New <?= $driver_name ?>"
                    data-dialog-options="<?= htmlspecialchars(\Format::forge()->to_json($dialog_options)) ?>">
				<span class="icon">
					<?= \Html::img(\Arr::get($driver_config, 'icon')) ?>
				</span>
                Add a <?= $driver_name ?>
            </button>
    <?php
}
?>
    </div>
    <input type="hidden" name="tree" value=""/>

    <div class="renderer">
        <?= $tree ?>
    </div>
</div>
<script type="text/javascript">
    require(
        [
            'static/apps/noviusos_menu/js/layout',
            'link!static/apps/noviusos_menu/css/layout.css'
        ],
        function ($) {
            $(function() {
                $('#<?= $id ?>').nosAppMenuLayout(<?= \Format::forge($json)->to_json() ?>);
            });
        }
    );
</script>
