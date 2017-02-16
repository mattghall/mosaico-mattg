<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

    $http_response_code = 200;
    try{
    $dir    = 'saved-templates';
    $files = scandir($dir);
    $neat = "[";
    foreach ($files as $file) {
      if (strpos($file, '.meta') !== false && $file != ".meta") {
        $sweet = file_get_contents("saved-templates/" . $file);
        if($sweet != "undefined"){
          $neat = $neat . $sweet;
          $neat = $neat . ",";
        }
      }
    }
    $neat = rtrim($neat, ',');
    $neat = $neat . "]";

    $ob = json_decode($neat);
    if($ob === null) {
     throw new Exception('Data is invalid JSON');
    }
    else {
      echo $neat;
    }

    } catch (Exception $e) {
      $http_response_code = 500;
      echo "[]";
    }
?>
