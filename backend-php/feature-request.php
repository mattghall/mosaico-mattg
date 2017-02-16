<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$http_response_code = 200;
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try{
    $dir    = 'feature-requests';
    $files = scandir($dir);
    $neat = "[";
    foreach ($files as $file) {
      if (strpos($file, '.feature') !== false && $file != ".feature") {
        $sweet = file_get_contents("feature-requests/" . $file);
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

print '<form id="newFeatureForm" style="display: none" action="backend-php/feature-request.php" method="POST">
        <input type="hidden" name="filename" id="newFeatureFilename"/>
        <input type="hidden" name="json" id="newFeatureJSON" />
      </form>
<table id="featureTable" align="center" cellspacing="0" cellpadding="8">
      <caption id="preFeature"><a class="resumeButton" onclick="OpenFeatureMenu()"><i class="fa fa-plus-square"></i> New Feature/Bug Request</a></caption>
      <caption id="featureMenu" style="display:none;">
        <select id="featureSelect">
          <option value="Feature Request">Feature Request</option>
          <option value="Bug Fix Request">Bug Fix Request</option>
        </select>
        <strong>Title: </strong> <input id="featureTitleInput"></input>
        <strong>Description: </strong> <input id="featureDescInput"></input>
        &nbsp;
        <a class="resumeButton" onclick="AddFeature()"><i class="fa fa-plus-square"></i> Go</a>
      </caption>
        <thead><tr style="background-color: #05203e; color:#fff; text-align:left;">
          <th class ="nohover">Type</th>
          <th class = "nohover">Title</th>
          <th class = "nohover">Description</th>
          <th class = "nohover">Requester</th>
          <th class = "nohover">Status</th>
        </tr></thead>
      <tbody style="background-color: #C9E2FF;">';
      foreach ($ob as $feature) {
        print '<tr>';
        foreach($feature as $param => $pval)
        {
          print "<td align='left'><span>$pval</span></td>";
        }
        print '</tr>';
      }
      print '</tbody></table>';
    } catch (Exception $e) {
      $http_response_code = 500;
      echo "Error: " . $e;
    }

  }
  else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $vegan_html = $_POST[ "json" ];
    $filename = "feature-requests/" . $_POST[ "filename" ] . ".feature";
    try{
        $myfile = fopen($filename, "w");
        fwrite($myfile, $vegan_html);
        fclose($myfile);
    }
    catch(Exception $e)
    {
      $http_return_code = 500;
    }
    header('Location: ../index.html');
    break;
  }


?>
