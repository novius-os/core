<html>
    <head>
        <title>Migrations</title>
        <style>
            h3 {
                margin: 0px;
            }

            .already_executed {
                color: darkgreen;
            }

            .successfully_executed {
                color: darkgreen;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <table>
<?php
foreach ($migrations as $type => $instances) {
    foreach ($instances as $instance => $instanceMigrations) {
        echo '<tr><td colspan="2"><h3>'.$type.'/'.$instance.'</h3></td></tr>';
        foreach ($instanceMigrations as $key => $migration) {
            echo '<tr>';
            echo '<td>'.$key.'</td>';
            if ($migration['state'] == 'already_executed') {
                echo '<td class="already_executed">Already executed</td>';
            } else {
                echo '<td class="successfully_executed">Successfully executed</td>';
            }
            echo '</tr>';
        }
    }
}
?>
        </table>
    </body>
</html>