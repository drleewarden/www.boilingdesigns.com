<?php  
$var = "hell";
$var2 = "come to ";
 echo"<h1>$var</h1>";
 
            
?>
<form method="post" action="index.php">
<input name="msg" type="text" />
<input type="submit" value="submit" />
<?php
  $input = $_POST[msg];
  print "$input";
  //echo gettype ($var);
  
  echo $var2 . ' ' . $var;
?>
<br /><br /><br />
<?php
$a = 1;
$b = -11;
$c = 5;


if ($b === $a){
	print"ello";
	} elseif ( $a > $b){//else if it is equal to a different value
		echo" a is bigger";
		}
		
	else{
		echo "nothing";
		}
?> <br /><br />
<?php 
// in the case where something is is equil to a set value
$x = array(1,2,3,4);
switch ($x[0]) {
	case 0: echo" x = 0";
	break;
	case 1: echo"x = 1";
	break;
	case 2: echo"x = 2";
	break;
	default: echo" x = 3 or 4";
	break;
	
	}

?>

<h2>While loops</h2>
<?php // while an expression is true exacute command
while ($b < 20) {
	echo $b . ", ";
	$b++;
	
	}
echo "<br> b is equil to : {$b}";
?>