<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

if (is_callable($params['icon'])) {
    $params['icon'] = $params['icon']($enhancer_args);
}
if (is_callable($params['title'])) {
    $params['title'] = $params['title']($enhancer_args);
}

?>
<div style="overflow: hidden">
    <img style="display: block; float: left; width: 64px; height: 64px;" src="<?= $params['icon'] ?>" />
    <h1 style="margin-left: 80px;"><?= e($params['title']) ?></h1>
<?php
foreach ($layout as $view) {
    if (is_array($view)) {
        $view['params'] = empty($view['params']) ? array() : $view['params'];
        echo View::forge($view['view'], array('params' => $params, 'enhancer_args' => $enhancer_args) + $view['params'], false);
    } else {
        echo $view;
    }
}
?>
</div>
