<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

    $http_response_code = 200;
    try{
      echo $_SERVER['PHP_AUTH_USER'];

    } catch (Exception $e) {
      $http_response_code = 500;
      echo "";
    }
?>
