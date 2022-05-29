<?php

$game = $_GET["game"];
$ref=@$_SERVER[HTTP_REFERER];

echo "Test";

if ($ref == "http://localhost:8000/"){
    $refCode = "L";
}
elseif ($ref == "https://jufankie.nl/"){
    $refCode = "J";
}
elseif ($ref == "https://jufankie.github.io/") {
    $refCode = "G";
}
else{
    $refCode = "O";   
}

$log  = date("c").",".$refCode.",".$game.PHP_EOL;

echo $log;

//Save string to log, use FILE_APPEND to append.
file_put_contents('./log_'.date("Ym").'.log', $log, FILE_APPEND);

?>