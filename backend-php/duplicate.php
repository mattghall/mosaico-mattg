<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

function getParam($text, $param) {
    echo $param . " text: " . $text . "<br />";
    $searchingFor = '"' . $param . '":"';
    echo $param . " searching for: " . $searchingFor . "<br />";
    $start = strpos($text, $searchingFor) + strlen($searchingFor);
    echo $param . " start: " . $start . "<br />";
    $end = strpos($text,'"',$start);
    echo $param . " end: " . $end . "<br />";

    $result = substr($text, $start, $end - $start);
    echo $param . " result: " . $result . "<br /><br />";
    return $result;
}
    $http_response_code = 200;
    try{
    $old = $_GET["old"];
    $new = $_GET["new"];
    if($old === "" || $old === null || $new === "" || $new === null) {
      echo "Error:";
      return;
    }
    $dir    = 'saved-templates';
    $oldfilename = $dir . "/" . $old . ".content";
    $newfilename = $dir . "/" . $new . ".content";
    copy($oldfilename, $newfilename);

      $oldfilename = $dir . "/" . $old . ".meta";
      $text = file_get_contents($oldfilename);

      // Add the new meta FilterAuthor  else if(strpos($file, ".meta") !== false){
      $newname = getParam($text, "name") . " copy";
      $template = getParam($text, "template");
      $author = getParam($text, "author");
      $lastEdit = getParam($text, "lastEdit") + 1;
      $dateCreated= getParam($text, "dateCreated") + 1;

      $text = '{"hash":"' . $new . '","template":"' . $template . '","name":"' . $newname . '","author":"' . $author . '","dateCreated":"' . $dateCreated . '","lastEdit":"' . $lastEdit . '","templateversion":"1.0.5","editorversion":"0.14.0"}';

      $meta_filename = "saved-templates/" . $new . ".meta";
      $yourfile = fopen($meta_filename, "w");
			fwrite($yourfile, $text);
			fclose($yourfile);

      header('Location: ../index.html');

    } catch (Exception $e) {
      $http_response_code = 500;
      echo $e;
    }
 ?>
