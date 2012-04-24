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
<div class="permissions" id="<?= $uniqid = uniqid('id_') ?>">

<form action="admin/nos/user/form/save_permissions" method="POST">
  <input type="hidden" name="role_id" value="<?= $role->role_id ?>" />

    <div class="actions_zone">
        <?= render('form/action_or_cancel') ?>
    </div>

	<div class="applications">
	    <div class="application all">
			<div class="maincheck">
				<input type="checkbox" name="access_to_everything" value="1" class="access_to_everything" />
			</div>
			<div class="infos">
				<?= __('Full access for everything') ?>
			</div>
	    </div>


<?php
foreach ($apps as $app => $perms) {

	\Config::load("$app::permissions", true);
    ?>

<input type="hidden" name="applications[]" value="<?= $app ?>" />
    <div class="application item">
		<div class="maincheck">
			<input type="checkbox" name="access[<?= $app ?>]" value="1" <?= $role->check_permission($app, 'access') ? 'checked' : '' ?> />
		</div>
		<div class="icon">
			<?php
            if (!empty($apps[$app]['icon64'])) {
                echo '<img src="'.$apps[$app]['icon64'].'" />';
            }
            ?>
		</div>
		<div class="infos" title="<?= strtr(__('Application provided by {provider_name}'), array(
                '{provider_name}' => $apps[$app]['provider']['name'],
            )) ?>">
			<?= $apps[$app]['name'] ?>
		</div>
    </div>

    <div style="margin-left: 30px;">

	<?php
	/*
	$keys = \Config::get("$app::permissions", array());
	if (!empty($keys)) {
        foreach ($keys as $key => $value) {
            $driver = $role->get_permission_driver($app, $key);
            ?>
            <h2><?= $value['label']; ?></h2>
            <?php
            //\Debug::dump($driver);
            echo $driver->display($role);
        }
    }
    */
	?>

	</div>
<?php
}
?>
	</div>

</form>
</div>



<script type="text/javascript">
    require(["jquery-nos"], function($nos) {
	    $nos(function() {
		    var $form = $nos('#<?= $uniqid ?>').form(),
			    $applications = $form.find('.applications'),
			    $items = $applications.find("div.item"),
			    $checkboxes = $items.find(":checkbox"),
			    $access_to_everything = $applications.find(":checkbox.access_to_everything");

		    $items.click(function() {
	            var $checkbox = $nos(this).find('div.maincheck :checkbox');
	            $checkbox.attr('checked', !$checkbox.is(':checked'));
	            $checkbox.change();
	            $checkbox.wijcheckbox('refresh');
	        });

		    $checkboxes.change(function() {
				var all_checked = true;
			    $checkboxes.each(function() {
					if (!$nos(this).is(':checked')) {
						all_checked = false;
					}
				});
				$access_to_everything.attr('checked', all_checked);
			    $access_to_everything.wijcheckbox('refresh');
	        });
		    $checkboxes.eq(0).change();

		    $access_to_everything.change(function() {
				var all_checked = true;
			    $checkboxes.each(function() {
					if (!$nos(this).is(':checked')) {
						all_checked = false;
					}
				});

				if (all_checked) {
					$checkboxes.attr('checked', false);
				} else {
					$checkboxes.attr('checked', true);
				}
			    $checkboxes.wijcheckbox('refresh');
	        });

	        $form.find('form').submit(function(e) {
	            e.preventDefault();
	            $nos(this).ajaxSubmit({
	                dataType: 'json',
	                success: function(json) {
	                    $nos.nos.ajax.success(json);
	                },
	                error: function() {
	                    $nos.notify('An error occured', 'error');
	                }
	            });
	        });
	    });
    });
</script>

