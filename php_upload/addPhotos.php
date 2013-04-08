<?php
include "galleryScripts/mysqlConnect.php";
 
//Parser for Add Photo Form
if (isset($_POST["photoName"])){
    $photoName = mysql_real_escape_string($_POST["photoName"]);
    $category = mysql_real_escape_string($_POST["category"]);
 
    //add photo to db
    $sql = mysql_query("
               INSERT INTO
                tblPhotos (
                photoName,
                category,
                active
               )VALUES(
                '$photoName',
                '$category',
                '1'
               )") or die(mysql_error());
    $pid = mysql_insert_id();
    $newname = "$pid.jpg";
    move_uploaded_file($_FILES['fileField']['tmp_name'],"galleryPhotos/$newname");
    header("location: addPhotos.php");
	
    exit();
}
 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Upload images</title>
 
</head>
<body>
 
<h3>Add New Photo</h3>
<form action="addPhotos.php" enctype="multipart/form-data" name="myForm" id="myForm" method="post">
    Photo Name: <input name="photoName" type="text" id="photoName" size="64" /><br />
    Category: <input name="category" type="text" id="category" size="64" /><br />
    Upload Image (jpg only):
    <label>
        <input type="file" name="fileField" id="fileField" />
    </label>
    <label>
        <input type="submit" name="button" id="button" value="Add Photo" />
    </label>
</form>
 
</body>
</html>