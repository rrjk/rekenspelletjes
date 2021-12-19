<?php

$game = $_GET["game"];
$log  = date("c").",".$game.PHP_EOL;
//Save string to log, use FILE_APPEND to append.
file_put_contents('./log_'.date("Ym").'.log', $log, FILE_APPEND);

?>