<?= $fieldset->open('admin/cms/user/form/edit/'.$user->user_id); ?>
<?= View::forge('form/layout_standard', array(
    'fieldset' => $fieldset,
    // Used by the behaviours (publishable, etc.)
    'object' => $user,
    'medias' => null,
    'title' => array('user_firstname', 'user_name'),
    'id' => 'user_id',

    'save' => 'save',

    'subtitle' => array(),

    'content' => array(
        \View::forge('form/expander', array(
            'title'   => 'Details',
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('user_email', 'user_last_connection'),
            ), false)
        ), false),
        \View::forge('form/expander', array(
            'title'   => 'Set a new password',
            'nomargin' => false,
            'content' => \View::forge('form/fields', array(
                'fieldset' => $fieldset,
                'fields' => array('password_reset', 'password_confirmation'),
            ), false)
        ), false),
    ),
), false); ?>
<?= $fieldset->close(); ?>