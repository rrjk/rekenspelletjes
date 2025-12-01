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
$month_count_file_name = "./count_".$game."_".date("Ym").".txt";
$week_count_file_name = "./weekcount_".$game."_".date("o")."_".date("W").".txt";

if (file_exists($month_count_file_name)){
    $month_count = file_get_contents($month_count_file_name);
    $month_count = trim($month_count);
    $month_count = $month_count + 1;
}
else {
    $month_count = 1;
}

if (file_exists($week_count_file_name)){
    $week_count = file_get_contents($week_count_file_name);
    $week_count = trim($week_count);
    $week_count = $week_count + 1;
}
else {
    $week_count = 1;
}


file_put_contents($month_count_file_name, $month_count);
file_put_contents($week_count_file_name, $week_count);
}
?>