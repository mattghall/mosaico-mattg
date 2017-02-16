<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

    $http_response_code = 200;
    try{
    $hash = $_GET["hash"];
    if($hash === "" || $hash === null) {
      echo "Error:";
      return;
    }
    $dir    = 'saved-templates';
    $files = scandir($dir);
    foreach ($files as $file) {
      if (strpos($file, $hash) !== false) {
        unlink($dir . "/" . $file);
        }
      }
    } catch (Exception $e) {
      $http_response_code = 500;
      echo $e;
    }
    header('Location: ../index.html');
 ?>
