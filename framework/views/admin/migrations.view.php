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

            .complete_sql {
                margin-top: 50px;
            }

            .complete_sql pre {
                border: 1px solid black;
                padding: 5px;
            }
        </style>
    </head>
    <body>
        <table>
<?php
$show_complete_sql = false;
foreach ($migrations as $type => $instances) {
    foreach ($instances as $instance => $instanceMigrations) {
        echo '<tr><td colspan="2"><h3>'.$type.'/'.$instance.'</h3></td></tr>';
        foreach ($instanceMigrations as $key => $migration) {
            echo '<tr>';
            echo '<td>'.$key.'</td>';
            if ($migration['state'] == 'already_executed') {
                echo '<td class="already_executed">Already executed</td>';
            } else {
                $show_complete_sql = true;
                echo '<td class="successfully_executed">Successfully executed</td>';
            }
            echo '</tr>';
        }
    }
}
?>
        </table>
<?php
if ($show_complete_sql) {
    ?>
        <div class="complete_sql">
            <h3>
                Executed SQL
            </h3>
    <?php
        echo '<pre>';
        echo \Nos\Migration::getCompleteSql();
        echo '</pre>';
    ?>
        </div>
    <?php
}
?>
    </body>
</html>