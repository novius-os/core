<?php

// Generated on 11/12/2013 17:57:29

// 120 out of 120 messages are translated (100%).
// 657 out of 657 words are translated (100%).

return array(
    #: classes/controller/admin/attachment.ctrl.php:38
    #: classes/controller/admin/media.ctrl.php:95
    'A file with the same name already exists.' => '同じ名前のファイルが既に存在します。',

    #: classes/controller/admin/attachment.ctrl.php:49
    #: classes/controller/admin/attachment.ctrl.php:55
    #: classes/controller/admin/media.ctrl.php:107
    #: classes/controller/admin/media.ctrl.php:128
    #: classes/controller/admin/upload.ctrl.php:66
    #: classes/controller/admin/upload.ctrl.php:70
    #: classes/controller/admin/upload.ctrl.php:163
    #: classes/controller/admin/upload.ctrl.php:170
    'You have a problem here: Your Novius OS isn’t authorised to save files on this server. This is something your developer or system administrator can fix for you.' => '問題が発生しました。このサーバではファイルを保存する権限がありません。開発者またはシステム管理者に相談してください。',

    #: classes/controller/admin/attachment.ctrl.php:66
    'Here you go, this attachment is now available in the Media Center.' => 'さあ、どうぞ。このファイルはメディアセンターで利用可能になりました。',

    #: classes/controller/admin/attachment.ctrl.php:116
    'This is unexpected: We cannot find the file. Please try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.' => '予期せぬ事態です。ファイルが見つかりません。もう一度お試しください。問題が解決しない場合は、開発者または Novius OS にご相談ください。ご迷惑を掛けたことをお詫びします。',

    #: classes/controller/admin/media.ctrl.php:42
    'Change the file:' => 'ファイルを変更する:',

    #: classes/controller/admin/media.ctrl.php:54
    #: classes/controller/admin/upload.ctrl.php:44
    'Please pick a file from your hard drive.' => '手元の端末からファイルを選択してください。',

    #: classes/controller/admin/media.ctrl.php:61
    'We’re afraid you’re not allowed to upload files this big. Don’t blame Novius OS though, your developer or system administrator are the ones who make the rules.' => 'この大きさのファイルをアップロードする事は許可されていません。(Novius OSではなく)システム管理者にお問い合わせください。',

    #: classes/controller/admin/media.ctrl.php:67
    #: classes/controller/admin/upload.ctrl.php:80
    'This extension is not allowed due to security reasons.' => 'セキュリティ上の理由で、この拡張子のファイルは許可されていません。',

    #: classes/controller/admin/upload.ctrl.php:30
    'Mass upload' => '複数アップロード',

    #: classes/controller/admin/upload.ctrl.php:99
    'Done! All files have been uploaded.' => '全てのファイルがアップロードされました。',

    #: classes/controller/admin/appdesk.ctrl.php:76
    'The cache has been renewed. All ready for you to enjoy!' => 'キャッシュが更新され、利用する準備が完了しました。',

    #: classes/model/folder.model.php:246
    'This is strange: This folder should be empty but isn’t. Please contact your developer or Novius OS to fix this. We apologise for the inconvenience caused.' => 'おかしなことが起きました。このフォルダは空のはずですが、空ではありません。開発者または Novius OS に相談して、修復してください。ご迷惑をかけたことをお詫びします。',

    #: classes/renderer/media.php:34
    'Image from the Media Centre' => 'メディアセンターの画像',

    #: classes/renderer/media.php:36
    'Pick an image' => '画像を選択',

    #: classes/renderer/media.php:37
    #: views/admin/wysiwyg_image.view.php:29
    'Pick another image' => '他の画像を選択',

    #: classes/renderer/media.php:38
    'No image' => '画像無し',

    #: classes/renderer/media.php:39
    'This extension is not allowed.' => 'この拡張子の画像は許可されていません。',

    #: views/admin/permissions/folders.view.php:14
    'Note: when no folders are selected, no restriction applies, all folders are accessible. The root folder is always accessible.' => '注意: フォルダが選択されていない場合、全てのフォルダにアクセス可能です。ルートフォルダは常にアクセス可能です。',

    #: views/admin/permissions/general.view.php:16
    'Can add, edit and delete media files' => 'メディアファイルを追加／編集／削除できます。',

    #: views/admin/permissions/general.view.php:23
    'Can visualise and use media files only' => 'メディアファイルを閲覧できます。',

    #: views/admin/permissions/general.view.php:30
    'Can add, edit and delete folders' => 'フォルダを追加／編集／削除できます。',

    #: views/admin/media_delete.view.php:21
    'The media is not used anywhere and can be safely deleted.' => 'このメディアは使用されていません。削除しても構いません。',

    #: views/admin/media_delete.view.php:28
    'The media is used <strong>once</strong> by an application.' => array(
        0 => 'このメディアはアプリケーションで<strong>1回</strong>使用しています。',
    ),

    #: views/admin/media_delete.view.php:37
    'Yes, I want to delete this media file even though it is used {{count}} times.' => 'はい、このメディアファイルは{{count}}回使用していますが、それでも削除します。',

    #: views/admin/wysiwyg_image.view.php:29
    '1. Pick an image' => '1. 画像を選択する',

    #: views/admin/wysiwyg_image.view.php:30
    'Edit properties' => 'プロパティを編集する',

    #: views/admin/wysiwyg_image.view.php:30
    '2. Set the properties' => '2. プロパティをセットする',

    #: views/admin/wysiwyg_image.view.php:39
    #: config/controller/admin/attachment.config.php:31
    #: config/controller/admin/media.config.php:59
    'Title:' => 'タイトル:',

    #: views/admin/wysiwyg_image.view.php:43
    'Alternative text (for accessibility):' => '代替テキスト (アクセシビリティ用):',

    #: views/admin/wysiwyg_image.view.php:44
    #: views/admin/media_edit.view.php:55
    #: views/admin/media_add.view.php:39
    #: views/admin/attachment.view.php:49
    #: views/admin/folder.view.php:47
    'Use title' => 'タイトルを使用する',

    #: views/admin/wysiwyg_image.view.php:47
    'Width:' => '幅:',

    #: views/admin/wysiwyg_image.view.php:48
    'Keep proportions' => '縦横比を維持する',

    #: views/admin/wysiwyg_image.view.php:51
    'Height:' => '高さ:',

    #: views/admin/wysiwyg_image.view.php:55
    'Alignment:' => '配置:',

    #: views/admin/wysiwyg_image.view.php:58
    'Baseline' => 'ベースライン揃え',

    #: views/admin/wysiwyg_image.view.php:59
    'Top' => '上揃え',

    #: views/admin/wysiwyg_image.view.php:60
    'Middle' => '中央揃え',

    #: views/admin/wysiwyg_image.view.php:61
    'Bottom' => '下揃え',

    #: views/admin/wysiwyg_image.view.php:62
    'Text Top' => 'テキストの上端揃え',

    #: views/admin/wysiwyg_image.view.php:63
    'Text Bottom' => 'テキストの下端揃え',

    #: views/admin/wysiwyg_image.view.php:64
    'Left' => '左揃え',

    #: views/admin/wysiwyg_image.view.php:65
    'Right' => '右揃え',

    #: views/admin/wysiwyg_image.view.php:69
    'Border:' => '枠線:',

    #: views/admin/wysiwyg_image.view.php:73
    'Vertical space:' => '上下の余白:',

    #: views/admin/wysiwyg_image.view.php:77
    'Horizontal space:' => '左右の余白:',

    #: views/admin/wysiwyg_image.view.php:81
    'Style:' => 'スタイル:',

    #: views/admin/wysiwyg_image.view.php:86
    'Update this image' => 'この画像を更新する',

    #: views/admin/wysiwyg_image.view.php:86
    'Insert this image' => 'この画像を挿入',

    #: views/admin/wysiwyg_image.view.php:86
    'or' => 'または',

    #: views/admin/wysiwyg_image.view.php:86
    'Cancel' => 'キャンセル',

    #: views/admin/wysiwyg_image.view.php:102
    'This is unusual: It seems that no image has been selected. Please try again. Contact your developer or Novius OS if the problem persists. We apologise for the inconvenience caused.' => 'おかしなことが起きました。画像が選択されていません。もう一度お試しください。問題が解決しない場合は、開発者または Novius OS にご相談ください。ご迷惑をかけたことをお詫びします。',

    #: views/admin/upload.view.php:24
    'Files from your hard drive:' => '手元のドライブからのファイル: ',

    #: views/admin/upload.view.php:30
    'Unzip (both files and folders)' => '解凍する (ファイルとフォルダの両方)',

    #: views/admin/upload.view.php:31
    'Leave unzipped' => '解凍しない',

    #: views/admin/upload.view.php:34
    'What to do with ZIP files:' => '圧縮ファイルへの操作: ',

    #: views/admin/upload.view.php:41
    'Select a folder where to put your media files:' => 'メディアファイルを置くフォルダを選択: ',

    #. Note to translator: This is a submit button
    #: views/admin/upload.view.php:48
    #: views/admin/attachment.view.php:19
    'Add' => '追加',

    #: views/admin/upload.view.php:73
    'Hold the Ctrl/Cmd key to select multiple files.' => '複数のファイルを選択するには、Ctrl/Cmdキーを押した状態にしてください。',

    #: views/admin/upload.view.php:83
    'Total files size must not exceed {{size}}.' => 'ファイルサイズの合計は、{{size}}以内にしてください。',

    #: views/admin/upload.view.php:83
    #: views/admin/media_edit.view.php:50
    #: views/admin/media_add.view.php:30
    'What’s more these file types are not allowed: {{extensions}}.' => 'また、ファイル形式{{extensions}}は、許可されていません。',

    #: views/admin/upload.view.php:108
    'Total files size exceeds the upload limit {{size}}.' => 'ファイルサイズの合計が{{size}}を超えています。',

    #: views/admin/media_edit.view.php:50
    #: views/admin/media_add.view.php:30
    'The file size must not exceed {{size}}.' => 'ファイルサイズは{{size}}以内にしてください。',

    #: views/admin/media_edit.view.php:62
    #: config/controller/admin/appdesk.config.php:51
    'File size:' => 'ファイルサイズ: ',

    #: views/admin/media_edit.view.php:69
    #: config/controller/admin/appdesk.config.php:54
    'Dimensions:' => '大きさ: ',

    #: views/admin/folder_delete.view.php:21
    'The folder is empty and can be safely deleted.' => 'このフォルダは空です。削除しても構いません。',

    #: views/admin/folder_delete.view.php:28
    'There is <strong>one media file</strong> in this folder.' => array(
        0 => 'このフォルダには<strong>メディアファイルが1個</strong>あります。',
    ),

    #: views/admin/folder_delete.view.php:37
    'Yes, I want to delete this folder and the {{count}} media files it contains.' => 'はい、このフォルダには{{count}}個のメディアファイルがありますが、このフォルダを削除します。',

    #: views/admin/folder.view.php:51
    'Change the folder\'s location:' => 'フォルダの位置を変更する:',

    #: views/admin/folder.view.php:57
    'Warning: moving a folder changes the URL of all the files it contains.' => '警告: フォルダを移動すると、そのフォルダ内の全てのファイルの URL が変わります。',

    #: config/permissions.config.php:19
    'Permissions for this application' => 'このアプリケーションの権限',

    #: config/permissions.config.php:23
    'Restrict access to specific folders' => '特定のフォルダにアクセス制限する',

    #: config/controller/admin/inspector/folder.config.php:40
    #: config/common/folder.config.php:17
    'Folder' => 'フォルダ',

    #: config/controller/admin/inspector/extension.config.php:17
    'Images' => '画像',

    #: config/controller/admin/inspector/extension.config.php:22
    'Documents' => 'ドキュメント',

    #: config/controller/admin/inspector/extension.config.php:27
    'Music' => '音楽',

    #: config/controller/admin/inspector/extension.config.php:32
    'Videos' => 'ビデオ',

    #: config/controller/admin/inspector/extension.config.php:37
    'Archives (e.g. ZIP)' => '圧縮ファイル (ZIP 等)',

    #: config/controller/admin/inspector/extension.config.php:42
    'Text files' => 'テキストファイル',

    #: config/controller/admin/inspector/extension.config.php:47
    'Others' => 'その他',

    #: config/controller/admin/inspector/extension.config.php:86
    #: config/controller/admin/inspector/extension.config.php:91
    'Types' => '種類',

    #: config/controller/admin/attachment.config.php:25
    #: config/controller/admin/media.config.php:46
    'Select a folder where to put your media file:' => 'メディアファイルを置くフォルダを選択: ',

    #: config/controller/admin/attachment.config.php:37
    #: config/controller/admin/media.config.php:65
    'SEO, Media URL:' => 'SEO, メディア URL:',

    #: config/controller/admin/folder.config.php:20
    #: config/common/folder.config.php:45
    'Add a folder' => 'フォルダを追加',

    #: config/controller/admin/folder.config.php:42
    'Select a folder where to put your sub-folder:' => 'サブフォルダを置くフォルダを選択:',

    #. Note to translator: This is a placeholder, i.e. a field’s label shown within the field
    #: config/controller/admin/folder.config.php:48
    #: config/common/media.config.php:50
    'Title' => 'タイトル',

    #: config/controller/admin/folder.config.php:60
    'SEO, folder URL:' => 'SEO、フォルダURL:',

    #: config/controller/admin/media.config.php:20
    #: config/common/media.config.php:121
    'Add a media file' => 'メディアファイルを追加',

    #: config/controller/admin/media.config.php:53
    'File from your hard drive:' => '手元の端末のファイル:',

    #: config/controller/admin/appdesk.config.php:48
    'File name:' => 'ファイル名:',

    #. Note to translator: 'Preview' here is a label, not an action
    #: config/controller/admin/appdesk.config.php:61
    'Preview' => 'プレビュー',

    #: config/controller/admin/appdesk.config.php:62
    'Click on a media file to preview it.' => 'メディアファイルをクリックすると、プレビューします。',

    #: config/controller/admin/appdesk.config.php:70
    'Default view' => 'デフォルト表示',

    #: config/controller/admin/appdesk.config.php:76
    'Flick through view' => 'サイドバー無し',

    #: config/controller/admin/appdesk.config.php:98
    'media file' => 'メディアファイル',

    #: config/controller/admin/appdesk.config.php:99
    'media files' => 'メディアファイル',

    #: config/controller/admin/appdesk.config.php:101
    '1 media file' => array(
        0 => '1個のメディアファイル{{count}}個のメディアファイル',
    ),

    #: config/controller/admin/appdesk.config.php:105
    'Showing 1 media file out of {{y}}' => array(
        0 => '{{y}} 個のメディアファイルのうち {{x}} 個を表示しています',
    ),

    #: config/controller/admin/appdesk.config.php:108
    'No media files' => 'メディアファイルがありません',

    #. Note to translator: This is the action that clears the 'Search' field
    #: config/controller/admin/appdesk.config.php:110
    'Show all media files' => '全てのメディアファイルを表示する',

    #: config/controller/admin/appdesk.config.php:112
    'Pick' => '選択する',

    #: config/controller/admin/appdesk.config.php:130
    'Add many files at once' => '複数のメディアファイルを追加する',

    #: config/controller/admin/appdesk.config.php:143
    'Renew media cache' => 'メディアキャッシュを更新する',

    #. Crud
    #: config/common/folder.config.php:27
    'Right, your new folder is ready.' => '新しいフォルダが作成されました。',

    #: config/common/folder.config.php:28
    'The folder has been deleted.' => 'フォルダが削除されました。',

    #. General errors
    #: config/common/folder.config.php:31
    'This folder doesn’t exist any more. It has been deleted.' => 'このフォルダは存在しません。削除されました。',

    #: config/common/folder.config.php:32
    'We cannot find this folder.' => 'このフォルダは見つかりませんでした。',

    #. Deletion popup
    #: config/common/folder.config.php:35
    'Deleting the folder ‘{{title}}’' => 'フォルダ ‘{{title}}’ を削除します',

    #: config/common/folder.config.php:39
    'Yes, delete this folder' => array(
        0 => 'はい、このフォルダを削除します',
    ),

    #: config/common/folder.config.php:56
    'You can’t edit the root folder.' => 'ルートフォルダは編集できません。',

    #: config/common/folder.config.php:65
    'You can’t delete the root folder.' => 'ルートフォルダは削除できません。',

    #: config/common/folder.config.php:72
    'Add a media file in this folder' => 'このフォルダにメディアファイルを追加',

    #: config/common/folder.config.php:91
    'Add a sub-folder to this folder' => 'このフォルダにサブフォルダを追加',

    #. Crud
    #: config/common/media.config.php:31
    'Spot on! One more media file in your Centre.' => 'メディアセンターにファイルが追加されました。',

    #: config/common/media.config.php:32
    'The media file has been deleted.' => 'メディアファイルが削除されました。',

    #. General errors
    #: config/common/media.config.php:35
    'This media file doesn’t exist any more. It has been deleted.' => 'メディアファイルが存在しません。削除されました。',

    #: config/common/media.config.php:36
    'We cannot find this media file.' => 'このメディアファイルが見つかりません。',

    #. Deletion popup
    #: config/common/media.config.php:39
    'Deleting the media ‘{{title}}’' => 'メディア ‘{{title}}’ を削除します',

    #: config/common/media.config.php:43
    'Yes, delete this media file' => array(
        0 => 'はい、このメディアファイルを削除します',
    ),

    #: config/common/media.config.php:62
    'Extension' => '拡張子',

    #: config/common/media.config.php:137
    'Visualise' => '閲覧',

);
