<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

?>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<base href="<?= $base_url ?>">
<title>Novius OS welcomes you</title>
<meta name="robots" content="noindex,nofollow">
<link rel="shortcut icon" href="static/novius-os/admin/novius-os/img/noviusos.ico">

<style type="text/css">
html {
    height : 100%;
}
body {
  background: url("static/novius-os/admin/novius-os/img/wallpapers/default.jpg");
  background-size: cover;
  font-family: franklin gothic medium,arial,verdana,helvetica,sans-serif;
}
#blank_slate {
  background: rgba(255, 255, 255, 0.5);
  border: 1px outset rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px 40px;
  position: absolute;
  top: 45px;
  left: 45px;
  right: 45px;
  bottom: 45px;
  overflow: auto;
}
#blank_slate h1, #blank_slate img {
    vertical-align: middle;
    padding: 0 2em 0 1em;
}
#blank_slate h1.error {
    color: red;
}
#blank_slate h1 img {
    float: left;
}
#blank_slate h1:after
{
    clear: both;
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
}
a {
    color: #555;
}
a:hover {
    color: #6EA4D3;
}
</style>

</head>

<body>
    <div id="blank_slate">
        <?php
if (!empty($error)) {
            ?>
            <img src="static/novius-os/admin/novius-os/img/logo.png" />
            <h1 class="error"><?= htmlspecialchars($error) ?></h1>
            <?php
    if (!empty($exception)) {
        echo '<p>Original message: '.$exception->getMessage().'</p>';
    }
} else {
            ?>
            <h1><img src="static/novius-os/admin/novius-os/img/logo.png" />Novius OS is up and running. Now what?</h1>

            <h2>I want a <strong>website</strong></h2>
            <p>Novius OS is a CMS: you can create pages and manage your content. Once set up, your website will show here.</p>
            <p><a href="http://docs.novius-os.org/en/chiba.1/install/whats_next/first_page.html" target="_blank">Check out our guide</a> to get started.</p>

            <h2>I want an <strong>application</strong></h2>
            <p>Novius OS is a web OS and framework: you can create custom applications which fit your business logic.</p>
            <p><a href="http://docs.novius-os.org/en/chiba.1/app_create/index.html" target="_blank">Have a look at the documentation</a>.</p>

            <h2>I don't know</h2>
            <p><a href="admin">Go to the administration panel</a>, it’s a good place to start.</p>
            <?php
}
        ?>
    </div>
</body>
</html>
