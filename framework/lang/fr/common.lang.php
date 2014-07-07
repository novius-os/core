<?php

// Generated on 07/07/2014 11:51:57

// 162 out of 167 messages are translated (97%).
// 821 out of 888 words are translated (97%).

return array(
    #: config/permissions.config.php:21
    'Is granted access to the following contexts:' => 'A accès aux contextes suivants&nbsp;:',

    #: config/permissions.config.php:26
    'Is granted access to the following applications:' => 'A accès aux applications suivantes&nbsp;:',

    #. Note to translator: action (button)
    #: config/orm/behaviour/twinnable.config.php:25
    'Translate' => 'Traduire',

    #: config/orm/behaviour/twinnable.config.php:27
    'Add to another site' => 'Ajouter à un autre site',

    #: config/orm/behaviour/twinnable.config.php:29
    'Translate / Add to another site' => 'Traduire / Ajouter à un autre site',

    #: config/orm/behaviour/twinnable.config.php:66
    #: config/orm/behaviour/twinnable.config.php:73
    'Translate into {{context}}' => 'Traduire en {{context}}',

    #: config/orm/behaviour/twinnable.config.php:68
    #: config/orm/behaviour/twinnable.config.php:71
    #: views/form/layout_standard.view.php:82
    'Add to {{context}}' => 'Ajouter à {{context}}',

    #: config/orm/behaviour/twinnable.config.php:77
    'Edit {{context}}' => 'Modifier {{context}}',

    #: config/orm/behaviour/publishable.config.php:16
    #: classes/controller/inspector.ctrl.php:77
    'Status' => 'Statut',

    #: config/orm/behaviour/sharable.config.php:16
    'Share' => 'Partager',

    #: config/orm/behaviour/urlenhancer.config.php:16
    'Visualise' => 'Visualiser',

    #. Note to translator: Default copy meant to be overwritten by applications (e.g. Add Page > Add a page)
    #: config/common.config.php:17
    'Add {{model_label}}' => 'Ajouter {{model_label}}',

    #. Standard, most frequent actions (Edit, Visualise, Share, etc.)
    #: config/common.config.php:38
    'Edit' => 'Modifier',

    #. Deletion popup
    #: config/common.config.php:62
    #: config/i18n_common.config.php:20
    'Deleting the item ‘{{title}}’' => 'Supprimer l’item «&nbsp;{{title}}&nbsp;»',

    #: config/common.config.php:65
    'Delete' => 'Supprimer',

    #. Crud
    #. Note to translator: Default copy meant to be overwritten by applications (e.g. The item has been deleted > The page has been deleted). The word 'item' is not to feature in Novius OS.
    #: config/i18n_common.config.php:8
    'Done! The item has been added.' => 'C’est bon&nbsp;! Votre item a été ajouté.',

    #: config/i18n_common.config.php:9
    #: classes/controller/admin/datacatcher.ctrl.php:49
    'OK, all changes are saved.' => 'OK, les modifications ont été enregistrées.',

    #: config/i18n_common.config.php:10
    'The item has been deleted.' => 'L’item a été supprimé.',

    #. General errors
    #: config/i18n_common.config.php:13
    'This item doesn’t exist any more. It has been deleted.' => 'Cet item n’existe plus. Il a été supprimé.',

    #: config/i18n_common.config.php:14
    'We cannot find this item.' => 'Nous n’arrivons pas à trouver cet item.',

    #: config/i18n_common.config.php:15
    'Bye bye' => 'Adieu',

    #: config/i18n_common.config.php:16
    #: classes/controller/admin/noviusos.ctrl.php:116
    'Close tab' => 'Fermer l’onglet',

    #: config/i18n_common.config.php:17
    'You’re not allowed to carry out this action. Ask your colleagues to find out why.' => 'Vous n‘êtes pas autorisé(e) à réaliser cette action. Demandez à vos collègues pourquoi.',

    #: config/i18n_common.config.php:21
    'Last chance, there’s no undo. Are you sure you want to do this?' => 'Attention, vous ne pouvez revenir en arrière. Êtes-vous bien sûr(e) de vouloir faire ça ?',

    #. Delete action's labels
    #: config/i18n_common.config.php:24
    '{{Button}} or <a>No, cancel</a>' => '{{Button}} ou <a>Non, annuler</a>',

    #: config/i18n_common.config.php:25
    'Yes, delete' => 'Oui, supprimer',

    #: config/i18n_common.config.php:26
    'Nothing to delete' => 'Rien à supprimer',

    #: config/i18n_common.config.php:28
    'Yes, delete this item' => array(
        0 => 'Oui, supprimer cet item',
        1 => 'Oui, supprimer ces {{count}} items',
    ),

    #: config/i18n_common.config.php:32
    'To confirm the deletion, you need to enter this number in the field below:' => 'Pour confirmer la suppression, vous devez entrer ce nombre dans le champ ci-dessous&nbsp;:',

    #: config/i18n_common.config.php:33
    'We cannot delete this item as the number of sub-items you’ve entered is wrong. Please amend it.' => 'Nous ne pouvons supprimer cet item car le nombre de sous-items indiqué est faux. Merci de le corriger.',

    #: config/i18n_common.config.php:36
    '1 item' => array(
        0 => '1 item',
        1 => '{{count}} items',
    ),

    #: config/i18n_common.config.php:42
    'This item exists in <strong>one context</strong>.' => array(
        0 => 'Cet item existe dans <strong>un contexte</strong>.',
        1 => 'Cet item existe dans <strong>{{context_count}} contextes</strong>.',
    ),

    #: config/i18n_common.config.php:46
    'This item exists in <strong>one language</strong>.' => array(
        0 => 'Cet item existe dans <strong>une langue</strong>.',
        1 => 'Cet item existe dans <strong>{{language_count}} langues</strong>.',
    ),

    #. Keep only if the model has the behaviour Twinnable
    #: config/i18n_common.config.php:51
    'We’re afraid this item cannot be added to {{context}} because its <a>parent</a> is not available in this context yet.' => 'Malheureusement cet item ne peut être ajouté à {{context}} car il dépend d’<a>un item</a> qui n’est pas encore disponible dans ce contexte.',

    #: config/i18n_common.config.php:52
    'We’re afraid this item cannot be translated into {{language}} because its <a>parent</a> is not available in this language yet.' => 'Malheureusement cet item ne peut être traduit en {{language}} car il dépendd’<a>un item</a> qui n’est pas encore disponible dans cette langue.',

    #: config/i18n_common.config.php:53
    'This item cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)' => 'Cet item ne peut être ajouté à {{context}}. (Mais comment avez-vous obtenu ce message&nbsp;? Vous bidouillez le système, non&nbsp;?)',

    #: config/i18n_common.config.php:57
    'This item has <strong>one sub-item</strong>.' => array(
        0 => 'Cet item a <strong>un sous-item</strong>.',
        1 => 'Cet item a <strong>{{children_count}} sous-items</strong>.',
    ),

    #. Visualise action's labels
    #: config/i18n_common.config.php:62
    'This application hasn’t yet been added to a page. Visualising is therefore impossible.' => 'Cette application n’a pas encore été ajoutée à une page. La visualisation est donc impossible.',

    #. Appdesk: allLanguages
    #: config/i18n_common.config.php:65
    'All languages' => 'Toutes les langues',

    #: config/i18n_common.config.php:66
    'All sites' => 'Tous les sites',

    #: config/i18n_common.config.php:67
    'All contexts' => 'Tous les contextes',

    #: config/i18n_common.config.php:68
    'List' => 'Liste',

    #: config/i18n_common.config.php:69
    'Tree' => 'Arborescence',

    #: config/i18n_common.config.php:70
    'Thumbnails' => 'Vignettes',

    #: config/i18n_common.config.php:71
    'Preview' => 'Prévisualisation',

    #: config/i18n_common.config.php:72
    #: views/inspector/modeltree_checkbox.view.php:15
    #: views/inspector/modeltree_radio.view.php:15
    #: classes/controller/admin/noviusos.ctrl.php:123
    'Loading...' => 'Chargement...',

    #: config/i18n_common.config.php:73
    #: config/i18n_common.config.php:84
    'Languages' => 'Langues',

    #: config/i18n_common.config.php:74
    'Search' => 'Recherche',

    #: config/i18n_common.config.php:75
    'Select the site(s) to show' => 'Sélectionner quel(s) site(s) afficher',

    #: config/i18n_common.config.php:76
    'Select the language(s) to show' => 'Sélectionner quelle(s) langue(s) afficher',

    #: config/i18n_common.config.php:77
    'Select the context(s) to show' => 'Sélectionner quel(s) contexte(s) afficher',

    #: config/i18n_common.config.php:78
    'Show {{context}}' => 'Afficher {{context}}',

    #: config/i18n_common.config.php:79
    'Other sites' => 'Autres sites',

    #: config/i18n_common.config.php:80
    'Other languages' => 'Autres langues',

    #: config/i18n_common.config.php:81
    'Other contexts' => 'Autres contextes',

    #: config/i18n_common.config.php:82
    'Contexts' => 'Contextes',

    #: config/i18n_common.config.php:83
    'Sites' => 'Sites',

    #: config/validation.config.php:15
    'We need you to fill in this field.' => 'Il faut que vous remplissiez ce champ.',

    #: config/validation.config.php:16
    'This field’s value must be at least {{param:1}} characters long.' => 'La valeur de ce champ doit comprendre au moins {{param:1}} caractères.',

    #: config/validation.config.php:17
    'This field’s value musn’t be longer than {{param:1}} characters.' => 'La valeur de ce champ doit comprendre au maximum {{param:1}} caractères.',

    #: config/validation.config.php:18
    'This isn’t a valid date.' => 'Ce n’est pas une date valide.',

    #: config/validation.config.php:19
    'This isn’t a valid email address.' => 'Ce n’est pas une adresse email valide.',

    #: config/validation.config.php:20
    'The old password is incorrect.' => 'L’ancien mot de passe est incorrect.',

    #: config/validation.config.php:21
    'They don’t match. Are you sure you’ve typed the same thing?' => 'La valeur n’est pas la même. Êtes-vous sûr(e) d’avoir tapé la même chose&nbsp;?',

    #: views/form/layout_save.view.php:22
    #: views/form/action_or_cancel.view.php:17
    'or' => 'ou',

    #: views/form/layout_save.view.php:22
    #: views/form/action_or_cancel.view.php:19
    'Cancel' => 'Annuler',

    #: views/form/action_or_cancel.view.php:15
    #: views/admin/data_catcher/form.view.php:168
    #: views/admin/enhancer/popup.view.php:52
    'Save' => 'Enregistrer',

    #: views/errors/php_fatal_error.view.php:82
    #: views/errors/php_fatal_error.view.php:187
    'Something went wrong' => 'Quelque chose n’a pas bien marché',

    #: views/errors/php_fatal_error.view.php:94
    'You won’t like this: Something went wrong' => 'Ça ne va pas vous plaire&nbsp; Quelque chose n’a pas bien marché.',

    #: views/errors/php_fatal_error.view.php:95
    'What went wrong? <a>If you’re a developer, just click to find out</a>. If you’re not, go ask a developer to help you.' => 'Qu’est-ce qui n’a pas bien marché&nbsp;? <a>Si vous êtes développeur(se), il vous suffit de cliquer pour le savoir</a>. Si vous ne l’êtes pas, appelez votre développeur(se) à l’aide.',

    #: views/admin/login.view.php:37
    #: views/admin/login_popup.view.php:30
    'Email address' => 'Email',

    #: views/admin/login.view.php:38
    #: views/admin/login_popup.view.php:31
    'Password' => 'Mot de passe',

    #: views/admin/login.view.php:42
    #: views/admin/login_popup.view.php:35
    'Remember me' => 'Souvenez-vous de moi',

    #: views/admin/login.view.php:45
    'Let’s get started' => 'Allez, au travail',

    #: views/admin/html.view.php:113
    'Select a media file' => 'Sélectionner un média',

    #: views/admin/html.view.php:114
    'Pick an image' => 'Sélectionner une image',

    #: views/admin/html.view.php:115
    'We’re afraid we cannot find this image.' => 'Malheureusement nous n’arrivons pas à trouver cette image.',

    #: views/admin/data_catcher/applications.view.php:59
    '‘{{item}}’ can be shared with the following applications.' => '«&nbsp;{{item}}&nbsp;» peut être partagé avec les applications suivantes.',

    #: views/admin/data_catcher/applications.view.php:60
    'Click to share:' => 'Cliquez pour partager&nbsp;:',

    #: views/admin/data_catcher/applications.view.php:61
    '(Don’t worry, you’ll get a preview first)' => '(Cliquez sans crainte, il y a une étape de validation)',

    #: views/admin/data_catcher/applications.view.php:63
    '‘{{item}}’ is automatically shared with the following applications.' => '«&nbsp;{{item}}&nbsp;» est automatiquement partagé avec les applications suivantes.',

    #: views/admin/data_catcher/applications.view.php:64
    'No action required, click to customise:' => 'Vous n’avez rien à faire. Cliquez pour personnaliser&nbsp;:',

    #: views/admin/data_catcher/applications.view.php:80
    'How sad! ‘{{item}}’ cannot be shared with any application yet. Ask your developer to set up content sharing for you.' => 'C’est dommage, «&nbsp;{{item}}&nbsp;» ne peut être partagé avec aucune application pour le moment. Demandez à votre développeur de mettre en place le partage de contenu.',

    #: views/admin/data_catcher/form.view.php:39
    'Title:' => 'Titre&nbsp;:',

    #: views/admin/data_catcher/form.view.php:44
    'URL:' => 'URL&nbsp;:',

    #: views/admin/data_catcher/form.view.php:56
    'Image:' => 'Image&nbsp;:',

    #: views/admin/data_catcher/form.view.php:64
    'Description:' => 'Description&nbsp;:',

    #: views/admin/data_catcher/form.view.php:112
    'Use default' => 'Reprendre les propriétés par défaut',

    #: views/admin/data_catcher/form.view.php:144
    'Pick a custom image' => 'Sélectionner une image personnalisée',

    #: views/admin/data_catcher/panel.view.php:29
    'What is shared - Default properties' => 'Ce qui est partagé - Propriétés par défaut',

    #: views/admin/data_catcher/panel.view.php:47
    'Applications' => 'Applications',

    #: views/admin/permissions/list_app.view.php:4
    'Check all' => 'Tout cocher',

    #: views/admin/login_popup.view.php:21
    'You’ve been inactive for too long. We need to make sure this is really you.' => 'Vous êtes inactif(ve) depuis un bon moment. Nous devons nous assurer que c’est bien vous.',

    #: views/admin/login_popup.view.php:38
    'Resume my work' => 'Reprendre mon travail',

    #: views/admin/about.view.php:19
    'Create Once Publish Everywhere with Novius OS, a Cross-Channel Open Source CMS.' => 'Avec Novius OS, CMS Open Source, créez votre contenu une fois, publiez-le partout.',

    #: views/admin/about.view.php:21
    'Version:' => 'Version&nbsp;:',

    #: views/admin/about.view.php:23
    'License:' => 'Licence&nbsp;:',

    #: views/admin/about.view.php:23
    'GNU AGPL v3' => 'GNU AGPL v3',

    #: views/admin/orm/publishable_label.view.php:7
    #: views/admin/orm/publishable_label.view.php:25
    #: views/renderer/publishable.view.php:136
    'Not published' => 'Non publié',

    #: views/admin/orm/publishable_label.view.php:9
    #: views/admin/orm/publishable_label.view.php:31
    #: views/renderer/publishable.view.php:141
    'Published' => 'Publié',

    #: views/admin/orm/publishable_label.view.php:21
    'Scheduled for {{date}}' => 'Planifié pour le {{date}}',

    #: views/admin/orm/publishable_label.view.php:27
    'Published until {{date}}' => 'Publié jusqu’au {{date}}',

    #. Note to translator: action (button)
    #: views/admin/enhancer/popup.view.php:44
    'Update' => 'Mettre à jour',

    #: views/admin/enhancer/popup.view.php:48
    'Insert' => 'Insérer',

    #: views/admin/enhancer/popup.view.php:56
    '{{Save}} or <a>Cancel</a>' => '{{Save}} ou <a>Annuler</a>',

    #: views/admin/tray.view.php:23
    #: views/admin/tray.view.php:26
    'My account' => 'Mon compte',

    #: views/admin/tray.view.php:29
    'Switch language' => 'Changer de langue',

    #: views/admin/tray.view.php:40
    #: views/admin/tray.view.php:43
    'About Novius OS' => 'À propos de Novius OS',

    #: views/admin/tray.view.php:97
    'Sign out (see you!)' => 'Se déconnecter (à bientôt&nbsp;!)',

    #: views/admin/tray.view.php:109
    'Toggle full screen' => 'Basculer le mode plein écran',

    #: views/renderer/virtualname/use_title_checkbox.view.php:15
    'Use title' => 'Reprendre le titre',

    #: views/renderer/publishable.view.php:117
    '<row><cell>Scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Planifié du&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:118
    '<row><cell>Published since:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Publié depuis&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>jusqu’au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:119
    '<row><cell>Was published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>A été publié du&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:122
    '<row><cell>Will be scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Sera planifié du&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:123
    '<row><cell>Will be published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Sera publié du&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>jusqu’au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:124
    '<row><cell>Will be backdated from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Sera anti-daté du&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>au&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:126
    'Pick a date' => 'Choisir une date',

    #: views/renderer/publishable.view.php:127
    'Clear' => 'Annuler',

    #: views/renderer/publishable.view.php:132
    'Will not be published' => 'Ne sera pas publié',

    #: views/renderer/publishable.view.php:133
    #: views/renderer/publishable.view.php:137
    #: views/renderer/publishable.view.php:145
    'Will be published' => 'Sera publié',

    #: views/renderer/publishable.view.php:140
    #: views/renderer/publishable.view.php:144
    'Will be unpublished' => 'Sera dé-publié',

    #: classes/controller/inspector/date.ctrl.php:152
    'Custom dates' => 'Choisir des dates',

    #: classes/controller/inspector/date.ctrl.php:153
    'from {{begin}} to {{end}}' => 'de {{begin}} à {{end}}',

    #: classes/controller/inspector/date.ctrl.php:154
    'until {{end}}' => 'jusqu’au {{end}}',

    #: classes/controller/inspector/date.ctrl.php:155
    'since {{begin}}' => 'depuis {{begin}}',

    #: classes/controller/inspector/date.ctrl.php:159
    'Since' => 'Depuis',

    #: classes/controller/inspector/date.ctrl.php:161
    '3 last days' => '3 derniers jours',

    #: classes/controller/inspector/date.ctrl.php:162
    'Week beginning' => 'Début de la semaine',

    #: classes/controller/inspector/date.ctrl.php:163
    'Less than a week' => 'Moins d’une semaine',

    #: classes/controller/inspector/date.ctrl.php:164
    'Month beginning' => 'Début du mois',

    #: classes/controller/inspector/date.ctrl.php:165
    'Less than one month' => 'Moins d’un mois',

    #: classes/controller/inspector/date.ctrl.php:166
    'Less than two months' => 'Moins de deux mois',

    #: classes/controller/inspector/date.ctrl.php:167
    'Less than three months' => 'Moins de trois mois',

    #: classes/controller/inspector/date.ctrl.php:168
    'Less than six months' => 'Moins de six mois',

    #: classes/controller/inspector/date.ctrl.php:169
    'Less than one year' => 'Moins d’un an',

    #: classes/controller/inspector/date.ctrl.php:173
    'Previous months' => 'Mois précédents',

    #: classes/controller/inspector/date.ctrl.php:179
    'Years' => 'Années',

    #: classes/controller/admin/enhancer.ctrl.php:123
    'I’m an application. Give me a name!' => 'Je suis une application. Donnez-moi un nom&nbsp;!',

    #: classes/controller/admin/noviusos.ctrl.php:115
    'New tab' => 'Nouvel onglet',

    #: classes/controller/admin/noviusos.ctrl.php:117
    'Close all tabs' => 'Fermer tous les onglets',

    #: classes/controller/admin/noviusos.ctrl.php:118
    'Close all other tabs' => 'Fermer tous les autres onglets',

    #: classes/controller/admin/noviusos.ctrl.php:119
    'Are you sure to want to close all tabs?' => 'Êtes-vous sûr(e) de vouloir fermer tous les onglets&nbsp;?',

    #: classes/controller/admin/noviusos.ctrl.php:120
    'Are you sure to want to close all other tabs?' => 'Êtes-vous sûr(e) de vouloir fermer tous ces onglets&nbsp;?',

    #: classes/controller/admin/noviusos.ctrl.php:121
    'Reload tab' => 'Recharger l’onglet',

    #: classes/controller/admin/noviusos.ctrl.php:122
    'Move tab' => 'Déplacer l’onglet',

    #: classes/controller/admin/datacatcher.ctrl.php:73
    'We know it sounds stupid, but this isn’t supposed to happen. Please contact your developer or Novius OS to fix this. We apologise for the inconvenience caused.' => 'Ça va vous paraitre idiot, mais cette erreur ne devrait pas arriver. Mercide contacter votre développeur ou Novius OS pour régler ce problème. Nosexcuses pour le désagrément occasionné.',

    #: classes/controller/admin/datacatcher.ctrl.php:80
    'We cannot find ‘{{item}}’. It must have been deleted while you tried to share it. Bad luck.' => 'Nous n’arrivons pas à trouver «&nbsp;{{item}}&nbsp;». Il a dû être supprimé alors que vous alliez le partager.',

    #: classes/controller/admin/datacatcher.ctrl.php:85
    'Surprisingly it appears ‘{{item}}’ cannot be shared with ‘{{catcher}}’. Contact your developer for further details.' => 'Étonnamment, il semble que «&nbsp;{{item}}&nbsp;» ne puisse être partagéavec «&nbsp;{{catcher}}&nbsp;». Contactez votre développeur pour plus deprécisions.',

    #: classes/controller/admin/datacatcher.ctrl.php:92
    'Something went wrong. Please ask your developer or Novius OS to have a look into this. You could call your mother too but we doubt she would be much help. Unless your mum is a software engineer, which would be awesome. We forgot to say: We apologise for the inconvenience caused.' => 'Quelque chose n’a pas bien marché. Merci de demander à votre développeur ouNovius OS de se pencher sur le problème. Vous pourriez aussi demander àvotre mère, mais il y a peu de chances qu’elle vous aide. À moins que votremaman soit développeuse, ça serait excellent&nbsp;! Nous allionsoublier&nbsp;: Nos excuses pour le désagrément occasionné.',

    #: classes/controller/admin/login.ctrl.php:45
    'Welcome back, {{user}}.' => 'Re-bonjour {{user}}',

    #: classes/controller/admin/login.ctrl.php:121
    'These details won’t get you in. Are you sure you’ve typed the correct email address and password? Please try again.' => 'Il doit y avoir une erreur, vous ne pouvez entrer. Êtes-vous sûr(e) que cesont les bons email et mot de passe&nbsp;? Merci de ré-essayer.',

    #: classes/fuel/fieldset_field.php:59
    'Mandatory' => 'Obligatoire',

    #: classes/fuel/validation_error.php:47
    'The field ‘{{field}}’ doesn’t respect the rule ‘{{rule}}’' => 'Le champ «&nbsp;{{field}}&nbsp;» ne respecte pas la règle«&nbsp;{{rule}}&nbsp;»',

    #. Date syntax is the one from PHP strftime() function: http://php.net/strftime
    #. Example value: '%d %b %Y %H:%M' (day of month, month name, year, hour, minutes).
    #: classes/fuel/date.php:79
    'DATE_FORMAT_DEFAULT' => '%d %b %Y %H:%M',

    #: classes/fuel/fieldset.php:426
    'Invalid request, you may have been victim of hacking. Did you click any suspicious link?' => 'Requête invalide, vous avez été victime de piratage. Avez-vous cliqué sur un lien suspect ?',

    #: classes/fuel/fieldset.php:619
    'OK, it’s done.' => 'C’est fait.',

    #: classes/application.php:504
    'A template from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => 'Un gabarit de cette application a le même nom que dans votre configuration ',
    ),

    #: classes/application.php:532
    'A template from this application is used in templates variations' => array(
        0 => '',
        1 => 'Un gabarit de cette application est utilisé dans les déclinaisons de ',
    ),

    #: classes/application.php:537
    'Templates variations are:' => 'Les déclinaisons de gabarit sont :',

    #: classes/application.php:549
    'A launcher from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => 'Un lanceur d’application de cette application est utilisé dans votre ',
    ),

    #: classes/application.php:566
    'A enhancer from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => '',
    ),

    #: classes/application.php:583
    'A data catcher from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => '',
    ),

    #: classes/renderer/item/picker.php:38
    'No item selected' => 'Aucun item selectionné',

    #: classes/renderer/item/picker.php:39
    'Pick an item' => 'Choisir un item',

    #: classes/renderer/item/picker.php:40
    'Pick another item' => 'Choisir un autre item',

    #: classes/renderer/item/picker.php:41
    'Un-select this item' => 'Dé-sélectionner cet item',

);
