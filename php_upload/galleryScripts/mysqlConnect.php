<?php  
 
$db_host = "localhost";  //put your hostname in the quotes
 
$db_username = "admin";  //put your username in the quotes
 
$db_pass = "pGallery";  //put your password in the quotes
 
$db_name = "boilingd_PhotoGallery"; //change dbGallery to whatever your db is called
 
mysql_connect("$db_host","$db_username","$db_pass") or die ("could not connect to mysql");
mysql_select_db("$db_name") or die ("no database"); 
echo("well done")             
?>