<label class="tooltip" data-app="<?= htmlspecialchars(\Format::forge(array('name' => $app_folder, 'required' => true))->to_json()) ?>">
    $1
    <div class="content">
        <ul>
            <li>
                <?= implode('</li><li>', $applications) ?>
            </li>
        </ul>
    </div>
</label>