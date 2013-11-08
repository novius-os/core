<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::application');

$uniqid = uniqid(str_replace(':', '_', $context).'_');

$labels = array();
$possible = $item->get_possible_context();
$main_context = $item->find_main_context();
if (!empty($main_context)) {
    $common_id = $main_context->{$crud['behaviours']['twinnable']['common_id_property']};
} else {
    $common_id = false;
}

$view_params['container_id'] = $uniqid;

echo View::forge('nos::crud/tab', $view_params, false);

$context_or_language = count(Nos\Tools_Context::sites()) == 1 ? 'language' : 'context';

?>
<div id="<?= $uniqid ?>" class="" style="padding:0;">
    <div class="blank_slate">
<?php
if (!in_array($context, $possible)) {
    echo '<p>&nbsp;</p>';
    $parent = $crud['behaviours']['tree'] ? $item->get_parent() : null;
    if (!empty($parent)) {
        $uniqid_parent = uniqid('parent_');
        echo strtr($crud['config']['i18n']['translate error parent not available in '.$context_or_language], array(
            '{{'.$context_or_language.'}}' => \Nos\Tools_Context::contextLabel($context),
            '<a>' => '<a href="javascript:void;" id="'.$uniqid_parent.'">',
        ));
        ?>
        <script type="text/javascript">
            require(['jquery-nos'], function($) {
               $('#<?= $uniqid_parent ?>').click(function() {
                   $(this).nosTabs('open', <?= \Format::forge()->to_json(array('url' => $crud['url_insert_update'].'/'.$parent->id.'?context='.$context)) ?>);
               });
            });
        </script>
        <?php
    } else {
        echo strtr($crud['config']['i18n']['translate error impossible context'], array('{{context}}' => \Nos\Tools_Context::contextLabel($context)));
    }
} else {
    foreach ($possible as $possible_context) {
        $item_context = $item->find_context($possible_context);
        if (!empty($item_context)) {
            $context_label = \Nos\Tools_Context::contextLabel($possible_context);
            // Note to translator: this is an action (button)
            $labels[$item_context->id] = strtr(__('Translate from {{context}}'), array(
                '{{context}}' => $context_label,
            ));
        }
    }
    $locale_item = \Nos\Tools_Context::localeCode($item->get_context());
    $locale_new = \Nos\Tools_Context::localeCode($context);

    if ($locale_item === $locale_new) {
        $label = __('Add ‘{{item}}’ to {{context}}');
    } else {
        $label = __('Translate ‘{{item}}’ into {{context}}');
    }
    echo '<h1>', strtr($label, array('{{item}}' => $item->title_item(), '{{context}}' => \Nos\Tools_Context::contextLabel($context))), '</h1>';
    ?>
            <p>&nbsp;</p>

            <p><?= __('You have two options:') ?></p>

            <p>&nbsp;</p>

            <ul style="margin-left:1em;">
                <li>
                    <span style="display:inline-block; width:2em;"></span>
                    <form action="<?= $crud['url_form'] ?>" style="display:inline-block;">
                        <?= Form::hidden('context', $context) ?>
                        <?= Form::hidden('common_id', $common_id) ?>
                        <button type="submit" class="ui-priority-primary" data-icon="plus"><?= __('Start from scratch') ?></button>
                    </form>
                    <p style="font-style: italic; padding: 5px 0 2em 4em;"><?= __('(Blank form)') ?></p>
                </li>
                <li>
                    <span class="faded" style="display:inline-block; width:2em;"><?= __('OR') ?></span>
                    <form action="<?= $crud['url_form'] ?>" style="display:inline-block;">
                        <?= Form::hidden('context', $context) ?>
                        <?= Form::hidden('common_id', $common_id) ?>
    <?php
    $uniqid_create_from_id = 'create_from_id_'.$uniqid;
    $uniqid_wijmenu = 'wijmenu_'.$uniqid;
    echo '<input id="'.$uniqid_create_from_id.'" type="hidden" name="create_from_id" value="'.htmlspecialchars(key($labels)).'" />';
    if (count($labels) == 1) {
        echo '<button type="submit" class="ui-priority-primary" data-icon="plus">'.current($labels).'</button>';
    } else {
        echo '<div class="buttonset">
            <button type="submit" class="ui-priority-primary" data-icon="plus">'.current($labels).'</button>
            <button id="'.$uniqid_wijmenu.'" type="button" class="ui-priority-primary without-text" data-icon="carat-1-s primary">&nbsp;</button>
        </div>';

        echo '<ul class="wijmenu">';
        foreach ($labels as $context => $label) {
            echo '<li data-create_from_id="'.htmlspecialchars($context).'"><a>'.$label.'</a></li>';
        }
        echo '</ul>';
    }

    ?>
                    </form>
                    <p style="font-style: italic; padding: 5px 0 2em 4em;"><?= __('(Form filled with the contents from the original version)') ?></p>
                </li>
            </ul>
    <?php
}
?>
    </div>
</div>
<script type="text/javascript">
require(['jquery-nos'], function ($) {
    $(function () {
        var $container = $('#<?= $uniqid ?>').nosFormUI();
        var $wijmenu = $container.find('ul.wijmenu');
        $container.find('.buttonset').buttonset();
        $container.find('ul.wijmenu')
            .wijmenu({
                orientation: 'vertical',
                animation: {
                    animated:"slide",
                    option: {
                        direction: "up"
                    },
                    duration: 50,
                    easing: null
                },
                hideAnimation: {
                    animated:"slide",
                    option: {
                        direction: "up"
                    },
                    duration: 0,
                    easing: null
                },
                direction: 'rtl',
                trigger: '#<?= $uniqid_wijmenu ?>',
                shown: function (event, item) {
                    var $contextMenu = $(item.element);
                    $contextMenu.parent()
                        .css({
                            maxHeight: '200px',
                            width: $contextMenu.outerWidth(true) + 20,
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        })
                },
                select: function(e, data) {
                    $('#<?= $uniqid_create_from_id ?>').val($(data.item.element).data('create_from_id'));
                    $container.find('form').submit();
                }
            });
        $container.find('form').submit(function(e) {
            e.preventDefault();
            var $form = $(this);
            $container.load($form.get(0).action, $form.serialize());
        });
    });
});
</script>
