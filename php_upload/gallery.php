<?php
//connect to db
include "galleryScripts/mysqlConnect.php";
 
//check for a page number. If not, set it to page 1 
if (!(isset($_GET['pagenum']))){ 
    $pagenum = 1; 
}else{
    $pagenum = $_GET['pagenum'];
}
 
//query for record count to setup pagination
$data = mysql_query("SELECT * FROM tblPhotos WHERE active = 1"); 
$rows = mysql_num_rows($data); 
 
//number of photos per page 
$page_rows = 16; 
 
//get the last page number 
$last = ceil($rows/$page_rows); 
 
//make sure the page number isn't below one, or more than last page num 
if ($pagenum < 1){ 
    $pagenum = 1; 
}elseif ($pagenum > $last){ 
    $pagenum = $last; 
}
 
//Set the range to display in query 
$max = 'limit ' .($pagenum - 1) * $page_rows .',' .$page_rows;
 
//get all of the photos
$dynamicList = "";
$sql = mysql_query("SELECT * FROM tblPhotos WHERE active = 1 $max");
//check for photos
$photoCount = mysql_num_rows($sql);
 
if ($photoCount > 0){
    while($row = mysql_fetch_array($sql)){
            $photoID = $row["photoID"];
            $photoName = $row["photoName"];
            $category = $row["category"];
 
            $dynamicList .= '
                            <div class="thumb">
                                <a href="photo.php?id=' . $photoID . '"><img class="clip" src="galleryPhotos/' . $photoID . '.jpg" alt="' . $photoName . '" width="175" border="0" /></a>
                            </div>
                            ';
    }
}else{
    $dynamicList = "There are no photos at this time!";
}
 
mysql_close();
?>
 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Tech Remedy Grid Gallery Demo</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
    <?php
        echo '<p style="text-align:center; font-weight:bold;">Page ' . $pagenum . ' of ' . $last . '</p>';
 
        if ($pagenum == 1){
            echo '<div class="pagination" align="center"><ul>';
        }else{
            echo '<div class="pagination" align="center"><ul><li><a href="' . $_SERVER['PHP_SELF'] . '?pagenum=1">« first</a></li>';  
            $previous = $pagenum-1;
        }       
 
        //check if number of pages is higher than 1
        if($last != 1){
            //Loop from 1 to last page to create page number links
            for($i = 1; $i <= $last; $i++){
                echo '<li><a href="' . $_SERVER['PHP_SELF'] . '?pagenum=' . $i . '">' . $i . '</a></li>';
            }
        }
 
        if ($pagenum == $last){
            echo '</div>';
        }else{
            $next = $pagenum+1;
            echo '<li><a href="' . $_SERVER['PHP_SELF'] . '?pagenum=' . $last . '">last »</a></li></ul></div>';
        }
    ?>
 
    <div id="dataGrid">
        <?php echo $dynamicList; ?>
    </div>
 
</body>
</html>