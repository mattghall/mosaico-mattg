<?php

$http_response_code = 200;
  try{
  $dir    = '../templates';
  $files = scandir($dir);
  foreach ($files as $file) {
    if (strpos($file, 'spu-') !== false ) {
      //push filename on the array stack
      $myArray[] = $file;
      }
    }

  if($myArray === null) {
   throw new Exception('No Tempaltes Found');
  }

  foreach ($myArray as $template) {
    print '<div class="template template-xx hovertemplate" style="" >';
      print '<caption><a onclick=\'createNewTemplate("' . $template . '")\' class="resumeButton" style="height:20px;"><i class="fa fa-plus-square"></i> ' . substr($template,4) . ' </a></caption>';
      print '<a onclick=\'createNewTemplate("' . $template . '")\'>';
        print '<img src="templates/' . $template . '/edres/_full.png" width="100%" alt="Create New ' . $template . ' Email">';
      print '</a>';
    print '</div>';
  }
}
 catch (Exception $e) {
  $http_response_code = 500;
  echo "Error: " . $e;
}
?>
