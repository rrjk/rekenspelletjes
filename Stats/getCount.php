<?php
    header("Content-Type: application/json");

    $errors = [];
    if (array_key_exists('game', $_GET)){
        $game = $_GET["game"];
    }
    else{
        http_response_code(400);  
        array_push($errors, "No game code(s) provided"); 
    }

    if (array_key_exists('type', $_GET)){
        if ($_GET["type"] == "weekly"){
            $type = "weekly";
        }
        else{
            $type = "monthly";
        }
    }
    else{
            $type = "monthly";
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
        if ($type == "weekly"){
            $year = intval(date("o"));
        }
        else{
            $year = intval(date("Y"));
        }
    }

    if (array_key_exists('start', $_GET)){
        $start = intval($_GET["start"]);
        if ($type == "weekly" && ($start < 0 || $start > 53)){
            http_response_code(400);  
            array_push($errors, "Wrong starting week number provided (1-53 is allowed)"); 
        }
        else if ($type == "monthly" && ($start < 0 || $start > 12)){
            http_response_code(400);  
            array_push($errors, "Wrong starting month number provided (1-12 is allowed)"); 
        }
    }
    else {
        if ($type == "monthly"){
            $start = 1;
        }
        else {
            $currentWeek = intval(date("W"));
            if ($currentWeek <= 13){
                $start=1;
            }
            else{   
                $start=$currentWeek-12;
            }
        }
    }

    if (count($errors) === 0){

        $data = [];
        for ($i=0; $i < count($games); $i++){
            $gameData = [];
            
            $counts = [];

            if ($type == "monthly"){
                for ($month = $start; $month <= 12; $month++){
                    $filename = "./count_".$games[$i]."_".$year.sprintf("%02d",$month).".txt";

                    if (file_exists($filename)){
                        $count = intval(file_get_contents($filename));
                    }
                    else{
                        $count = 0;
                    }

                    array_push($counts, ['month' =>  $month, 'count' => $count]);

                }
            }
            else{
                for ($week = $start; $week <= min(53, $start + 12); $week++){
                    $filename = "./weekcount_".$games[$i]."_".$year."_".sprintf("%02d",$week).".txt";

                    if (file_exists($filename)){
                        $count = intval(file_get_contents($filename));
                    }
                    else{
                        $count = 0;
                    }

                    array_push($counts, ['week' =>  $week, 'count' => $count]);
                }
            }

            array_push($data, [ 'game' => $games[$i], 'year' => $year, 'counts' => $counts]);
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