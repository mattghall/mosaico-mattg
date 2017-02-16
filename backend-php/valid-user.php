<?php
    // $host = "LDAP://spu.local:389";
    // TODO Replace with your host, user, and password
    $host = "[spu.local:389]";
    $user = "[YOUR USERNAME HERE]";
    $pswd = "[YOUR PASSWORD HERE]";

    $username = $_GET["username"];

    $ad = ldap_connect($host)
      or die( "Could not connect!" );

    ldap_set_option($ad, LDAP_OPT_PROTOCOL_VERSION, 3)
     or die ("Could not set ldap protocol");

    $bd = ldap_bind($ad, $user, $pswd)
      or die ("Could not bind");

    // TODO replace with your DC
    $dn = "CN=Users,DC=spu,DC=local";

    $filter = "(&(objectClass=*)(sAMAccountName=" . $username . "))";

    $search = ldap_search($ad, $dn, $filter)
        or die ("Search failed");

    $entries = ldap_get_entries($ad, $search);

    $count = $entries["count"];
    if($count == 1)
    {
      echo "true";
    }
    else {
      echo "false";
    }

?>
