<?php

// Generated on 07/07/2014 14:44:21

// 159 out of 167 messages are translated (95%).
// 804 out of 888 words are translated (95%).

return array(
    #: config/permissions.config.php:21
    'Is granted access to the following contexts:' => 'Ma dostęp do następujących właściwości&nbsp;:',

    #: config/permissions.config.php:26
    'Is granted access to the following applications:' => 'Ma dostęp do następujących aplikacji&nbsp;:',

    #. Note to translator: action (button)
    #: config/orm/behaviour/twinnable.config.php:25
    'Translate' => 'Przetłumacz',

    #: config/orm/behaviour/twinnable.config.php:27
    'Add to another site' => 'Dodaj do innej strony',

    #: config/orm/behaviour/twinnable.config.php:29
    'Translate / Add to another site' => 'Przetłumacz / Dodaj do innej strony',

    #: config/orm/behaviour/twinnable.config.php:66
    #: config/orm/behaviour/twinnable.config.php:73
    'Translate into {{context}}' => 'Przetłumacz na {{context}}',

    #: config/orm/behaviour/twinnable.config.php:68
    #: config/orm/behaviour/twinnable.config.php:71
    #: views/form/layout_standard.view.php:82
    'Add to {{context}}' => 'Dodać do {{context}}',

    #: config/orm/behaviour/twinnable.config.php:77
    'Edit {{context}}' => 'Edytuj {{context}}',

    #: config/orm/behaviour/publishable.config.php:16
    #: classes/controller/inspector.ctrl.php:77
    'Status' => 'Status',

    #: config/orm/behaviour/sharable.config.php:16
    'Share' => 'Podziel się',

    #: config/orm/behaviour/urlenhancer.config.php:16
    'Visualise' => 'Wizualizacja',

    #. Note to translator: Default copy meant to be overwritten by applications (e.g. Add Page > Add a page)
    #: config/common.config.php:17
    'Add {{model_label}}' => 'Dodaj {{model_label}}',

    #. Standard, most frequent actions (Edit, Visualise, Share, etc.)
    #: config/common.config.php:38
    'Edit' => 'Edytuj',

    #. Deletion popup
    #: config/common.config.php:62
    #: config/i18n_common.config.php:20
    'Deleting the item ‘{{title}}’' => 'Usuń element « {{title}} »',

    #: config/common.config.php:65
    'Delete' => 'Usuń',

    #. Crud
    #. Note to translator: Default copy meant to be overwritten by applications (e.g. The item has been deleted > The page has been deleted). The word 'item' is not to feature in Novius OS.
    #: config/i18n_common.config.php:8
    'Done! The item has been added.' => 'Zrobione! Twój element został dodany.',

    #: config/i18n_common.config.php:9
    #: classes/controller/admin/datacatcher.ctrl.php:49
    'OK, all changes are saved.' => 'OK, wszystkie zmiany zostały zapisane.',

    #: config/i18n_common.config.php:10
    'The item has been deleted.' => 'Ten element został usunięty.',

    #. General errors
    #: config/i18n_common.config.php:13
    'This item doesn’t exist any more. It has been deleted.' => 'Ten element już nie istnieje. Został usunięty.',

    #: config/i18n_common.config.php:14
    'We cannot find this item.' => 'Nie możemy znaleźć tego elementu.',

    #: config/i18n_common.config.php:15
    'Bye bye' => 'Żegnaj !',

    #: config/i18n_common.config.php:16
    #: classes/controller/admin/noviusos.ctrl.php:116
    'Close tab' => 'Zamknij zakładkę',

    #: config/i18n_common.config.php:17
    'You’re not allowed to carry out this action. Ask your colleagues to find out why.' => 'Nie jesteś upoważniony do tej czynnośći. Zapytaj kolegów, dlaczego.',

    #: config/i18n_common.config.php:21
    'Last chance, there’s no undo. Are you sure you want to do this?' => 'Ostatnia szansa, nie będzie można cofnąć. Czy jesteś pewien, że chcesz to zrobić?',

    #. Delete action's labels
    #: config/i18n_common.config.php:24
    '{{Button}} or <a>No, cancel</a>' => '{{Button}} lub <a>Nie, anuluj</a>',

    #: config/i18n_common.config.php:25
    'Yes, delete' => 'Tak, usuń',

    #: config/i18n_common.config.php:26
    'Nothing to delete' => 'Nie ma nic do usunięcia',

    #: config/i18n_common.config.php:28
    'Yes, delete this item' => array(
        0 => 'Tak, usuń ten element',
        1 => 'Tak, usuń te {{count}} elementy',
    ),

    #: config/i18n_common.config.php:32
    'To confirm the deletion, you need to enter this number in the field below:' => 'Aby potwierdzić usunięcie, należy wpisać tę liczbę w polu poniżej&nbsp;:',

    #: config/i18n_common.config.php:33
    'We cannot delete this item as the number of sub-items you’ve entered is wrong. Please amend it.' => 'Nie możemy usunąć tego elementu, ponieważ liczba pod-obiektów wyszczególnionych jest zła. Proszę to poprawić.',

    #: config/i18n_common.config.php:36
    '1 item' => array(
        0 => '1 element',
        1 => '{{count}} element',
    ),

    #: config/i18n_common.config.php:42
    'This item exists in <strong>one context</strong>.' => array(
        0 => '',
        1 => 'Ten element istnieje w <strong>{{context_count}} sytuacjach</strong>.',
    ),

    #: config/i18n_common.config.php:46
    'This item exists in <strong>one language</strong>.' => array(
        0 => '',
        1 => 'Ten element istnieje w <strong>{{language_count}} językach</strong>.',
    ),

    #. Keep only if the model has the behaviour Twinnable
    #: config/i18n_common.config.php:51
    'We’re afraid this item cannot be added to {{context}} because its <a>parent</a> is not available in this context yet.' => 'Niestety, ten element nie może być dodany do {{context}} ponieważ jego <a>macierzysty</a> nie jest dostępny w tym kontekście jeszcze.',

    #: config/i18n_common.config.php:52
    'We’re afraid this item cannot be translated into {{language}} because its <a>parent</a> is not available in this language yet.' => 'Niestety ten element nie może być przetłumaczony na {{language}} ponieważ jego <a>macierzysty<§a> jest zależny od elementu, który nie jest jeszcze dostępny w tym języku.',

    #: config/i18n_common.config.php:53
    'This item cannot be added in {{context}}. (How come you get this error message? You’ve hacked your way into here, haven’t you?)' => 'Ten element nie może zostać dodany do {{kontekst}}. (Jjak uzyskałeś ten komunikat ? Majsterkujesz przy systemie, co ?)',

    #: config/i18n_common.config.php:57
    'This item has <strong>one sub-item</strong>.' => array(
        0 => '',
        1 => 'Ten element ma <strong>{{children_count}} podelement</strong>.',
    ),

    #. Visualise action's labels
    #: config/i18n_common.config.php:62
    'This application hasn’t yet been added to a page. Visualising is therefore impossible.' => 'Ta aplikacja nie została jeszcze dodana do strony. Wizualizacja jest więc niemożliwa.',

    #. Appdesk: allLanguages
    #: config/i18n_common.config.php:65
    'All languages' => 'Wszystkie języki',

    #: config/i18n_common.config.php:66
    'All sites' => 'Wszystkie strony',

    #: config/i18n_common.config.php:67
    'All contexts' => 'Wszystkie sytuacje',

    #: config/i18n_common.config.php:68
    'List' => 'Lista',

    #: config/i18n_common.config.php:69
    'Tree' => 'Drzewko',

    #: config/i18n_common.config.php:70
    'Thumbnails' => 'Miniatury',

    #: config/i18n_common.config.php:71
    'Preview' => 'Podgląd',

    #: config/i18n_common.config.php:72
    #: views/inspector/modeltree_checkbox.view.php:15
    #: views/inspector/modeltree_radio.view.php:15
    #: classes/controller/admin/noviusos.ctrl.php:123
    'Loading...' => 'Ładowanie...',

    #: config/i18n_common.config.php:73
    #: config/i18n_common.config.php:84
    'Languages' => 'Języki',

    #: config/i18n_common.config.php:74
    'Search' => 'Szukaj',

    #: config/i18n_common.config.php:75
    'Select the site(s) to show' => 'Wybrać stronę(y) do wyświetlenia',

    #: config/i18n_common.config.php:76
    'Select the language(s) to show' => 'Wybrać język(i) do wyświetlenia',

    #: config/i18n_common.config.php:77
    'Select the context(s) to show' => 'Wybrać kontekst(y) do wyświetlenia',

    #: config/i18n_common.config.php:78
    'Show {{context}}' => 'Pokarz {{context}}',

    #: config/i18n_common.config.php:79
    'Other sites' => 'Inne strony',

    #: config/i18n_common.config.php:80
    'Other languages' => 'Inne języki',

    #: config/i18n_common.config.php:81
    'Other contexts' => 'Inne konteksty',

    #: config/i18n_common.config.php:82
    'Contexts' => 'Konteksty',

    #: config/i18n_common.config.php:83
    'Sites' => 'Strony',

    #: config/validation.config.php:15
    'We need you to fill in this field.' => 'Musisz wypełnić to pole.',

    #: config/validation.config.php:16
    'This field’s value must be at least {{param:1}} characters long.' => 'Wartość tego pola musi zawierać co najmniej {{param: 1}} znaków.',

    #: config/validation.config.php:17
    'This field’s value musn’t be longer than {{param:1}} characters.' => 'Wartość tego pola nie może być dłuższa niż {{param: 1}} znaków.',

    #: config/validation.config.php:18
    'This isn’t a valid date.' => 'To nie są prawidłowe dane.',

    #: config/validation.config.php:19
    'This isn’t a valid email address.' => 'To nie jest prawidłowy adres e-mail.',

    #: config/validation.config.php:20
    'The old password is incorrect.' => 'Stare hasło jest nieprawidłowe.',

    #: config/validation.config.php:21
    'They don’t match. Are you sure you’ve typed the same thing?' => 'One nie pasują. Czy jesteś pewien, że wpisałeś to samo?',

    #: views/form/layout_save.view.php:22
    #: views/form/action_or_cancel.view.php:17
    'or' => 'albo',

    #: views/form/layout_save.view.php:22
    #: views/form/action_or_cancel.view.php:19
    'Cancel' => 'Anuluj',

    #: views/form/action_or_cancel.view.php:15
    #: views/admin/data_catcher/form.view.php:168
    #: views/admin/enhancer/popup.view.php:52
    'Save' => 'Zapisz',

    #: views/errors/php_fatal_error.view.php:82
    #: views/errors/php_fatal_error.view.php:187
    'Something went wrong' => 'Coś poszło źle',

    #: views/errors/php_fatal_error.view.php:94
    'You won’t like this: Something went wrong' => 'To się Tobie nie spodoba. Coś poszło źle.',

    #: views/errors/php_fatal_error.view.php:95
    'What went wrong? <a>If you’re a developer, just click to find out</a>. If you’re not, go ask a developer to help you.' => 'Co poszło źle ? Jeśli jesteś dostawcą, kliknij żeby się dowiedzieć. Jeśli nie, zapytaj dostawcy.',

    #: views/admin/login.view.php:37
    #: views/admin/login_popup.view.php:30
    'Email address' => 'Adres e-mail',

    #: views/admin/login.view.php:38
    #: views/admin/login_popup.view.php:31
    'Password' => 'Hasło',

    #: views/admin/login.view.php:42
    #: views/admin/login_popup.view.php:35
    'Remember me' => 'Pamiętaj mnie',

    #: views/admin/login.view.php:45
    'Let’s get started' => 'Zaczynajmy',

    #: views/admin/html.view.php:113
    'Select a media file' => 'Wybierz nośnik',

    #: views/admin/html.view.php:114
    'Pick an image' => 'Wybierz plik',

    #: views/admin/html.view.php:115
    'We’re afraid we cannot find this image.' => 'Obawiamy się, że nie możemy znaleźć tego pliku.',

    #: views/admin/data_catcher/applications.view.php:59
    '‘{{item}}’ can be shared with the following applications.' => '« {{item}} » mogą współpracować z następującymi aplikacjami.',

    #: views/admin/data_catcher/applications.view.php:60
    'Click to share:' => 'Kliknij żeby współpracować :',

    #: views/admin/data_catcher/applications.view.php:61
    '(Don’t worry, you’ll get a preview first)' => '(Nie martw się, będziesz mógł najpierw przeglądać)',

    #: views/admin/data_catcher/applications.view.php:63
    '‘{{item}}’ is automatically shared with the following applications.' => '« {{item}} » automatycznie współpracuje z następującymi aplikacjami.',

    #: views/admin/data_catcher/applications.view.php:64
    'No action required, click to customise:' => 'Akcja niepotrzebna, kliknij żeby dostosować:',

    #: views/admin/data_catcher/applications.view.php:80
    'How sad! ‘{{item}}’ cannot be shared with any application yet. Ask your developer to set up content sharing for you.' => 'Szkoda,« {{item}} » nie może współpracować jeszcze z żadną aplikacją. Zwrócić się do dostawcy skonfigurował udostępnianie treści dla Ciebie.',

    #: views/admin/data_catcher/form.view.php:39
    'Title:' => 'Tytuł&nbsp;:',

    #: views/admin/data_catcher/form.view.php:44
    'URL:' => 'URL&nbsp;:',

    #: views/admin/data_catcher/form.view.php:56
    'Image:' => 'Plik&nbsp;:',

    #: views/admin/data_catcher/form.view.php:64
    'Description:' => 'Opis&nbsp;:',

    #: views/admin/data_catcher/form.view.php:112
    'Use default' => 'Użyj domyślnej',

    #: views/admin/data_catcher/form.view.php:144
    'Pick a custom image' => 'Wybierz własny plik',

    #: views/admin/data_catcher/panel.view.php:29
    'What is shared - Default properties' => 'Co jest wspólne - Domyślne właściwości',

    #: views/admin/data_catcher/panel.view.php:47
    'Applications' => 'Aplikacje',

    #: views/admin/permissions/list_app.view.php:4
    'Check all' => 'Sprawdź wszystko',

    #: views/admin/login_popup.view.php:21
    'You’ve been inactive for too long. We need to make sure this is really you.' => 'Byłeś nieaktywny od dłuższego czasu. Musimy upewnić się, że to Ty.',

    #: views/admin/login_popup.view.php:38
    'Resume my work' => 'Wróć do pracy',

    #: views/admin/about.view.php:19
    'Create Once Publish Everywhere with Novius OS, a Cross-Channel Open Source CMS.' => 'Z Novius OS, CMS Open Source, stwórz Twoją treść tylko raz i możesz opublikować to wszędzie.',

    #: views/admin/about.view.php:21
    'Version:' => 'Wersja&nbsp;:',

    #: views/admin/about.view.php:23
    'License:' => 'Licencja&nbsp;:',

    #: views/admin/about.view.php:23
    'GNU AGPL v3' => 'GNU AGPL v3',

    #: views/admin/orm/publishable_label.view.php:7
    #: views/admin/orm/publishable_label.view.php:25
    #: views/renderer/publishable.view.php:136
    'Not published' => 'Nie opublikowane',

    #: views/admin/orm/publishable_label.view.php:9
    #: views/admin/orm/publishable_label.view.php:31
    #: views/renderer/publishable.view.php:141
    'Published' => 'Opublikowane',

    #: views/admin/orm/publishable_label.view.php:21
    'Scheduled for {{date}}' => 'Zaplanowane na {{date}}',

    #: views/admin/orm/publishable_label.view.php:27
    'Published until {{date}}' => 'Opublikowane aż do {{date}}',

    #. Note to translator: action (button)
    #: views/admin/enhancer/popup.view.php:44
    'Update' => 'Aktualizacja',

    #: views/admin/enhancer/popup.view.php:48
    'Insert' => 'Wstaw',

    #: views/admin/enhancer/popup.view.php:56
    '{{Save}} or <a>Cancel</a>' => '{{Save}} lub Anuluj',

    #: views/admin/tray.view.php:23
    #: views/admin/tray.view.php:26
    'My account' => 'Moje konto',

    #: views/admin/tray.view.php:29
    'Switch language' => 'Zmień język',

    #: views/admin/tray.view.php:40
    #: views/admin/tray.view.php:43
    'About Novius OS' => 'O Novius OS',

    #: views/admin/tray.view.php:97
    'Sign out (see you!)' => 'Wyloguj się (do zobaczenia !)',

    #: views/admin/tray.view.php:109
    'Toggle full screen' => '',

    #: views/renderer/virtualname/use_title_checkbox.view.php:15
    'Use title' => 'Użyj tytuł',

    #: views/renderer/publishable.view.php:117
    '<row><cell>Scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Planowany od&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>do&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:118
    '<row><cell>Published since:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Publikowany od:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>do:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:119
    '<row><cell>Was published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Opublikowano od&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>do&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:122
    '<row><cell>Will be scheduled from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Będzie planowany od&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>do&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:123
    '<row><cell>Will be published from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>until:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Zostanie opublikowany od&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>aż do&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:124
    '<row><cell>Will be backdated from:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>to:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>' => '<row><cell>Będzie wstecznie datowany od&nbsp;:</cell><cell>{{start}}</cell><cell>{{clear}}</cell></row><row><cell>do&nbsp;:</cell><cell>{{end}}</cell><cell>{{clear}}</cell></row>',

    #: views/renderer/publishable.view.php:126
    'Pick a date' => 'Wybierz datę',

    #: views/renderer/publishable.view.php:127
    'Clear' => 'Skasuj',

    #: views/renderer/publishable.view.php:132
    'Will not be published' => 'Nie będzie publikowane',

    #: views/renderer/publishable.view.php:133
    #: views/renderer/publishable.view.php:137
    #: views/renderer/publishable.view.php:145
    'Will be published' => 'Będzie publikowane',

    #: views/renderer/publishable.view.php:140
    #: views/renderer/publishable.view.php:144
    'Will be unpublished' => 'Nie będzie popublikowane',

    #: classes/controller/inspector/date.ctrl.php:152
    'Custom dates' => 'Dane użytkownika',

    #: classes/controller/inspector/date.ctrl.php:153
    'from {{begin}} to {{end}}' => 'od {{begin}} do {{end}}',

    #: classes/controller/inspector/date.ctrl.php:154
    'until {{end}}' => 'aż do {{end}}',

    #: classes/controller/inspector/date.ctrl.php:155
    'since {{begin}}' => 'od {{begin}}',

    #: classes/controller/inspector/date.ctrl.php:159
    'Since' => 'od',

    #: classes/controller/inspector/date.ctrl.php:161
    '3 last days' => '3 ostatnie dni',

    #: classes/controller/inspector/date.ctrl.php:162
    'Week beginning' => 'Początek tygodnia',

    #: classes/controller/inspector/date.ctrl.php:163
    'Less than a week' => 'Mniej niż tydzień',

    #: classes/controller/inspector/date.ctrl.php:164
    'Month beginning' => 'Początek miesiąca',

    #: classes/controller/inspector/date.ctrl.php:165
    'Less than one month' => 'Mniej niż miesiąc',

    #: classes/controller/inspector/date.ctrl.php:166
    'Less than two months' => 'Mniej niż dwa miesiące',

    #: classes/controller/inspector/date.ctrl.php:167
    'Less than three months' => 'Mniej niż trzy miesiące',

    #: classes/controller/inspector/date.ctrl.php:168
    'Less than six months' => 'Mniej niż sześć miesięcy',

    #: classes/controller/inspector/date.ctrl.php:169
    'Less than one year' => 'Mniej niż rok',

    #: classes/controller/inspector/date.ctrl.php:173
    'Previous months' => 'Poprzedni miesiąc',

    #: classes/controller/inspector/date.ctrl.php:179
    'Years' => 'Lata',

    #: classes/controller/admin/enhancer.ctrl.php:123
    'I’m an application. Give me a name!' => 'Jestem aplikacją. Nazwij mnie !',

    #: classes/controller/admin/noviusos.ctrl.php:115
    'New tab' => 'Nowa zakładka',

    #: classes/controller/admin/noviusos.ctrl.php:117
    'Close all tabs' => 'Zamknij wszystkie zakładki',

    #: classes/controller/admin/noviusos.ctrl.php:118
    'Close all other tabs' => 'Zamknąć wszystkie inne zakładki',

    #: classes/controller/admin/noviusos.ctrl.php:119
    'Are you sure to want to close all tabs?' => 'Czy jesteś pewien, że chcesz zamknąć wszystkie zakładki ?',

    #: classes/controller/admin/noviusos.ctrl.php:120
    'Are you sure to want to close all other tabs?' => 'Czy jesteś pewien, że chcesz zamknąć wszystkie inne zakładki ?',

    #: classes/controller/admin/noviusos.ctrl.php:121
    'Reload tab' => 'Przeładuj zakładkę',

    #: classes/controller/admin/noviusos.ctrl.php:122
    'Move tab' => '',

    #: classes/controller/admin/datacatcher.ctrl.php:73
    'We know it sounds stupid, but this isn’t supposed to happen. Please contact your developer or Novius OS to fix this. We apologise for the inconvenience caused.' => 'Wiemy, że to może wydać się głupie, ale ten błąd nie powinien się zdarzyć. Prosimy skontaktować się z dostawcą lub z Novius OS, aby rozwiązać ten problem. Przepraszamy za niedogodności.',

    #: classes/controller/admin/datacatcher.ctrl.php:80
    'We cannot find ‘{{item}}’. It must have been deleted while you tried to share it. Bad luck.' => 'Nie możemy znaleźć « {{item}} ». Musiał zostać usunięty kiedy chciałeś się nim podzielić. Pech.',

    #: classes/controller/admin/datacatcher.ctrl.php:85
    'Surprisingly it appears ‘{{item}}’ cannot be shared with ‘{{catcher}}’. Contact your developer for further details.' => 'Niespodziewanie, ale okazuje się, że « {{item}} » nie może być współdzielony z « {{catcher}} ». Skontaktuj się z dostawcą aby uzyskać więcej szczegółów.',

    #: classes/controller/admin/datacatcher.ctrl.php:92
    'Something went wrong. Please ask your developer or Novius OS to have a look into this. You could call your mother too but we doubt she would be much help. Unless your mum is a software engineer, which would be awesome. We forgot to say: We apologise for the inconvenience caused.' => 'Coś poszło nie tak. Proszę zwrócić się się do dostawcy albo Novius OS żeby się temu przyjrzał. Można też skontaktować się z matką, ale wątpię, że będzie to pomocne. Chyba, że ​​twoja mama jest inżynierem oprogramowania, co byłoby super. Zapomnieliśmy powiedzieć: Przepraszamy za niedogodności.',

    #: classes/controller/admin/login.ctrl.php:45
    'Welcome back, {{user}}.' => 'Witaj ponownie, {{{user}}',

    #: classes/controller/admin/login.ctrl.php:121
    'These details won’t get you in. Are you sure you’ve typed the correct email address and password? Please try again.' => 'Dane nieprawidłowe, nie możesz wejść.Czy jesteś pewien, że wpisałeś poprawny adres e-mail i hasło? Proszę spróbować ponownie.',

    #: classes/fuel/fieldset_field.php:59
    'Mandatory' => 'Obowiązkowe',

    #: classes/fuel/validation_error.php:47
    'The field ‘{{field}}’ doesn’t respect the rule ‘{{rule}}’' => 'Pole « {{field}} » nie przestrzega zasady « {{rule}} »',

    #. Date syntax is the one from PHP strftime() function: http://php.net/strftime
    #. Example value: '%d %b %Y %H:%M' (day of month, month name, year, hour, minutes).
    #: classes/fuel/date.php:79
    'DATE_FORMAT_DEFAULT' => '%d %b %Y %H:%M',

    #: classes/fuel/fieldset.php:426
    'Invalid request, you may have been victim of hacking. Did you click any suspicious link?' => '',

    #: classes/fuel/fieldset.php:619
    'OK, it’s done.' => 'OK, wykonano.',

    #: classes/application.php:504
    'A template from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => '',
    ),

    #: classes/application.php:532
    'A template from this application is used in templates variations' => array(
        0 => '',
        1 => '',
    ),

    #: classes/application.php:537
    'Templates variations are:' => '',

    #: classes/application.php:549
    'A launcher from this application have the same name that in your local configuration:' => array(
        0 => '',
        1 => '',
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
    'No item selected' => '',

    #: classes/renderer/item/picker.php:39
    'Pick an item' => '',

    #: classes/renderer/item/picker.php:40
    'Pick another item' => '',

    #: classes/renderer/item/picker.php:41
    'Un-select this item' => '',

);
