<?php
    header("Content-Type: application/json");
    $game = $_GET["game"];

    $errors = [];
    if (array_key_exists('game', $_GET)){
        $game = $_GET["game"];
    }
    else{
        http_response_code(400);  
        array_push($errors, "No game code provided"); 
    }



    if (array_key_exists('year', $_GET)){
        $year = intval($_GET["year"]);
        if ($year < 2023 || $year > 3000){
            http_response_code(400);  
            array_push($errors, "Invalid year provided (2023-3000 is allowed)"); 
        }

    }
    else{
        $year = intval(date("Y"));
    }

    if (array_key_exists('month', $_GET)){
        $month = intval($_GET["month"]);
        if ($month < 1 || $month > 12){
            http_response_code(400);  
            array_push($errors, "Invalid month provided (1-12 is allowed)"); 
        }
    }
    else{
        $month = intval(date("m"));
    }

    if (count($errors) === 0){
        $filename = "./count_".$game."_".$year.sprintf("%02d",$month).".txt";

        if (file_exists($filename)){
            $count = intval(file_get_contents($filename));
        }
        else{
            $count = 0;
        }


        $data = [ 'game' => $game, 'year' => $year, 'month' =>  $month, 'count' => $count];
    }
    else{
        $data = [ 'errors' => $errors];
    }

    $json = json_encode($data);
    if ($json === false) {
        // Avoid echo of empty string (which is invalid JSON), and
        // JSONify the error message instead:
        $json = json_encode(["jsonError" => json_last_error_msg()]);
        if ($json === false) {
            // This should not happen, but we go all the way now:
            $json = '{"jsonError":"unknown"}';
        }
        // Set HTTP response status code to: 500 - Internal Server Error
        http_response_code(500);
    }
    echo $json;
?>