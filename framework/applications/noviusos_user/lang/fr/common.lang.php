<?php

// Generated on 07/07/2014 11:51:57

// 56 out of 56 messages are translated (100%).
// 245 out of 245 words are translated (100%).

return array(
    #: config/controller/admin/inspector/role.config.php:22
    #: config/common/role.config.php:8
    'Role' => 'Rôle',

    #: config/controller/admin/appdesk.config.php:26
    'user' => 'utilisateur',

    #: config/controller/admin/appdesk.config.php:27
    'users' => 'utilisateurs',

    #: config/controller/admin/appdesk.config.php:29
    '1 user' => array(
        0 => '1 utilisateur',
        1 => '{{count}} utilisateurs',
    ),

    #: config/controller/admin/appdesk.config.php:33
    'Showing 1 user out of {{y}}' => array(
        0 => '1 utilisateur sur {{y}} affiché',
        1 => '{{x}} utilisateurs sur {{y}} affichés',
    ),

    #: config/controller/admin/appdesk.config.php:36
    'No users' => 'Pas d’utilisateur',

    #. Note to translator: This is the action that clears the 'Search' field
    #: config/controller/admin/appdesk.config.php:38
    'Show all users' => 'Afficher tous les utilisateurs',

    #: config/controller/admin/role.config.php:19
    #: config/common/role.config.php:37
    'Add a role' => 'Ajouter un rôle',

    #: config/controller/admin/role.config.php:40
    'Title' => 'Titre',

    #: config/controller/admin/user.config.php:19
    #: config/common/user.config.php:50
    'Add a user' => 'Ajouter un utilisateur',

    #: config/controller/admin/user.config.php:35
    'Family name' => 'Nom',

    #: config/controller/admin/user.config.php:42
    'First name' => 'Prénom',

    #: config/controller/admin/user.config.php:49
    'Email address:' => 'Email&nbsp;:',

    #: config/controller/admin/user.config.php:57
    'Last signed in on:' => 'Dernier login&nbsp;:',

    #: config/controller/admin/user.config.php:66
    'Expert view' => 'Mode Expert',

    #: config/controller/admin/user.config.php:74
    'Language:' => 'Langue&nbsp;:',

    #: config/controller/admin/user.config.php:86
    #: config/controller/admin/user.config.php:97
    'Password:' => 'Mot de passe&nbsp;:',

    #: config/controller/admin/user.config.php:114
    'Password (confirmation):' => 'Mot de passe (confirmation)&nbsp;:',

    #. Crud
    #: config/common/role.config.php:19
    'All wrapped up! This new role is ready.' => 'Et voilà, le nouveau rôle est prêt.',

    #: config/common/role.config.php:20
    'The role has been deleted.' => 'Le rôle a été supprimé.',

    #. General errors
    #: config/common/role.config.php:23
    'This role doesn’t exist any more. It has been deleted.' => 'Ce rôle n’existe plus. Il a été supprimé.',

    #: config/common/role.config.php:24
    'We cannot find this role.' => 'Nous n’arrivons pas à trouver ce rôle.',

    #. Deletion popup
    #: config/common/role.config.php:27
    'Deleting the role ‘{{title}}’' => 'Supprimer le rôle «&nbsp;{{title}}&nbsp;»',

    #: config/common/role.config.php:31
    'Yes, delete this role' => array(
        0 => 'Oui, supprimer ce rôle',
        1 => '',
    ),

    #: config/common/user.config.php:8
    'Name' => 'Nom',

    #: config/common/user.config.php:21
    'Email address' => 'Email',

    #. Crud
    #: config/common/user.config.php:32
    'New user added. We look forward to see her/him soon.' => 'Nouvelle utilisatrice ajoutée (ou est-ce un utilisateur&nbsp;?). Souhaitez-lui bienvenue de notre part !',

    #: config/common/user.config.php:33
    'The user has been deleted.' => 'L’utilisateur a été supprimé.',

    #. General errors
    #: config/common/user.config.php:36
    'This user doesn’t exist any more. It has been deleted.' => 'Cet utilisateur n’existe plus. Il a été supprimé.',

    #: config/common/user.config.php:37
    'We cannot find this user.' => 'Nous n’arrivons pas à trouver cet utilisateur.',

    #. Deletion popup
    #: config/common/user.config.php:40
    'Deleting the user ‘{{title}}’' => 'Supprimer l’utilisateur «&nbsp;{{title}}&nbsp;»',

    #: config/common/user.config.php:44
    'Yes, delete this user' => array(
        0 => 'Oui, supprimer cet utilisateur',
        1 => '',
    ),

    #: views/admin/user_edit.view.php:38
    'User details' => 'Propriétés',

    #: views/admin/user_edit.view.php:39
    'Permissions' => 'Droits d’accès',

    #: views/admin/user_roles_edit.view.php:35
    'View and edit permissions' => 'Voir et modifier les permissions',

    #: views/admin/account.view.php:14
    'Save' => 'Enregistrer',

    #: views/admin/account.view.php:32
    'Sign out (see you!)' => 'Se déconnecter (à bientôt&nbsp;!)',

    #: views/admin/account.view.php:44
    'My account' => 'Mon compte',

    #: views/admin/account.view.php:45
    'Theme' => 'Thème',

    #: views/admin/user_details_edit.view.php:27
    'Details' => 'Propriétés',

    #: views/admin/user_details_edit.view.php:36
    #: views/admin/user_add.view.php:45
    'Roles' => 'Rôles',

    #: views/admin/user_details_edit.view.php:44
    'Set a new password' => 'Changer le mot de passe',

    #: views/admin/password_strength.view.php:14
    'Insufficient' => 'Insuffisant',

    #: views/admin/password_strength.view.php:15
    'Weak' => 'Faible',

    #: views/admin/password_strength.view.php:16
    'Average' => 'Dans la moyenne',

    #: views/admin/password_strength.view.php:17
    'Strong' => 'Fort',

    #: views/admin/password_strength.view.php:18
    'Outstanding' => 'Excellent',

    #: classes/controller/admin/role.ctrl.php:29
    'OK, permissions saved.' => 'OK, droits enregistrés.',

    #: classes/controller/admin/account.ctrl.php:84
    'Your Novius OS has switched to {{language}}. Okay, not quite. Actually it needs a <a>quick refresh</a>.' => 'Votre Novius OS est passé à {{language}}. Enfin presque. Il ne vous manque plus qu’<a>actualiser</a>.',

    #: classes/controller/admin/account.ctrl.php:87
    'Sorry but your Novius OS doesn’t speak {{code}}.' => 'Désolés mais votre Novius OS ne parle pas {{code}}.',

    #: classes/controller/admin/account.ctrl.php:97
    'Wallpaper' => 'Fond d’écran',

    #: classes/controller/admin/account.ctrl.php:121
    '‘{{title}}’ is your new gorgeous wallpaper. Go quick to the home tab to see it.' => '«&nbsp;{{title}}&nbsp;» est votre nouveau fond d’écran. Allez vite sur l’onglet d’accueil pour l’admirer.',

    #: classes/controller/admin/account.ctrl.php:129
    'This is unexpected: The selected image doesn’t exist any more. It must have been deleted while you were selecting it.' => 'Voilà qui est inattendu&nbsp; L’image sélectionnée n’existe plus. Elle a dûêtre supprimée alors que vous la sélectionniez.',

    #: classes/controller/admin/account.ctrl.php:134
    'Your wallpaper is now the default one.' => 'Vous êtes revenu au fond d’écran par défaut.',

    #: classes/controller/admin/account.ctrl.php:141
    'Something went wrong. Please refresh your browser window and try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.' => 'Quelque chose n’a pas bien marché. Merci d’actualiser la fenêtre de votrenavigateur et d’essayer à nouveau. Contactez votre développeur ou Novius OSsi le problème persiste. Nos excuses pour le désagrément occasionné.',

    #: classes/controller/admin/user.ctrl.php:70
    'Done, your password has been changed.' => 'Voilà, votre mot de passe a été changé.',

);
