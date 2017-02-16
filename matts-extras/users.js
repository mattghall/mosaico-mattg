function gimmeuser() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttpu = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttpu = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttpu.onreadystatechange = function() {
        if (xmlhttpu.readyState == 4 && xmlhttpu.status == 200) {
            LoadUsername(xmlhttpu.responseText);
        }
    };
    xmlhttpu.open("GET","backend-php/get-username.php",true);
    xmlhttpu.send();
}

function LoadUsername(username)
{
  if(username === null)      {
    console.log("Could not get username from server");
  }
  else {
    console.log("User: " + username);
    localStorage.setItem("username", username);
  }
}

function GetUser(){
  if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem("username") === null)
        gimmeuser();
      else {
        console.log("User: " + localStorage.getItem("username"));
      }
  }
}
