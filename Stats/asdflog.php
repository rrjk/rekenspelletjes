<?php

$game = $_GET["game"];
$subgame = $_GET["subgame"];
$ref=@$_SERVER[HTTP_REFERER];

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

if (!file_exists('./log_'.date("Ym").'.log')){
    file_put_contents('./log_'.date("Ym").'.log', 'datetime,referrer,mainGameCode,subGameCode'.PHP_EOL, FILE_APPEND);
}

//Save string to log, use FILE_APPEND to append.
file_put_contents('./log_'.date("Ym").'.log', $log, FILE_APPEND);


if ($refCode == "J"){
$count_file_name = "./count_".$game."_".date("Ym").".txt";

if (file_exists($count_file_name)){
    $count = file_get_contents($count_file_name);
    $count = trim($count);
    $count = $count + 1;
}
else {
    $count = 1;
}

file_put_contents($count_file_name, $count);
}
?>