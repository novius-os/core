<div id="apps">
    <?php
    foreach ($apps as $app) {
        ?>
        <a class="app" href="<?= $app['url'] ?>" data-launcher="<?= htmlspecialchars(\Format::forge($app)->to_json()) ?>">
		<span class="icon">
			<img class="gloss" src="static/novius-os/admin/novius-os/img/64/gloss.png" />
			<img width="64" src="<?= $app['icon64'] ?>" />
		</span>
            <span class="text"><?= $app['name'] ?></span>
        </a>
        <?php
    }
    ?>
</div>