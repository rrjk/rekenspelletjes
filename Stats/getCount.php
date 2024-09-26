<?php
    header("Content-Type: application/json");
    $game = $_GET["game"];

    $errors = [];
    if (array_key_exists('game', $_GET)){
        $game = $_GET["game"];
    }
    else{
        http_response_code(400);  
        array_push($errors, "No game code(s) provided"); 
    }

    $games = explode(',', $game);

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

    if (count($errors) === 0){

        $data = [];
        for ($i=0; $i < count($games); $i++){
            $gameData = [];
            
            $monthlyCounts = [];

            for ($month = 1; $month <= 12; $month++){
                $filename = "./count_".$games[$i]."_".$year.sprintf("%02d",$month).".txt";

                if (file_exists($filename)){
                    $count = intval(file_get_contents($filename));
                }
                else{
                    $count = 0;
                }

                array_push($monthlyCounts, ['month' =>  $month, 'count' => $count]);

            }
            array_push($data, [ 'game' => $games[$i], 'year' => $year, 'counts' => $monthlyCounts]);
        }
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