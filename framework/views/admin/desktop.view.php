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

$id = uniqid('temp_');

$config = array(
    'launchers' => $apps,
    'reloadUrl' => 'admin/nos/noviusos/desktop',
);

?>
<div id="<?= $id ?>" class="nos-desktop-apps"></div>
<script type="text/javascript">
require(
    ['jquery-nos-nosdesktop', 'jquery-nos-toolbar-crud'],
    function($) {
        $(function() {
            var $container = $('#<?= $id ?>');

            // Initialize the desktop apps
            $container.nosdesktop(<?= \Format::forge($config)->to_json() ?>);

            // Initialize the desktop toolbar
            $container.nosToolbar(
                // Reset the position of app launchers
                $('<a href="#" data-icon="wrench"><?= htmlspecialchars(__('Reset launchers position')); ?></a>')
                    .on('click', function(e) {
                        e.preventDefault();
                        if (confirm($.nosCleanupTranslation(<?= \Format::forge(__('Are you sure you want to reset the position of application launchers?'))->to_json() ?>))) {
                            $container.nosdesktop('reset');
                            $container.nosdesktop('save');
                        }
                    })
            );
        });
    });
</script>
