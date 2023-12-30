<?php

$game = $_GET["game"];
$subgame = $_GET["subgame"];
$ref=@$_SERVER[HTTP_REFERER];

echo "Test";

function file_exists_safe($file) {
    if (!$fd = fopen($file, 'xb')) {
        return true;  // the file already exists
    }
    fclose($fd);  // the file is now created, we don't need the file handler
    return false;
}

if ($ref == "http://localhost:8000/"){
    $refCode = "L";
}
elseif ($ref == "https://www.jufankie.nl/"){
    $refCode = "J";
}
elseif ($ref == "https://jufankie.github.io/") {
    $refCode = "G";
}
else{
    $refCode = "O";   
}

$log  = date("c").",".$refCode.",".$game.",".$subgame.PHP_EOL;

echo $log;

if (!file_exists_safe('./log_'.date("Ym").'.log')){
    file_put_contents('./log_'.date("Ym").'.log', 'datetime,referrer,mainGameCode,subGameCode'.PHP_EOL, FILE_APPEND);
}

//Save string to log, use FILE_APPEND to append.
file_put_contents('./log_'.date("Ym").'.log', $log, FILE_APPEND);
?>