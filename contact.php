<?php
//If the form is submitted
if(isset($_POST['submit'])) {
	
	$comments = $_POST['message'];

	//Check to make sure that the name field is not empty
	if(trim($_POST['contactname']) == '') {
		$hasError = true;
	} else {
		$name = trim($_POST['contactname']);
	}


	//Check to make sure sure that a valid email address is submitted
	if(trim($_POST['email']) == '')  {
		$hasError = true;
	} else if (!eregi("^[A-Z0-9._%-]+@[A-Z0-9._%-]+\.[A-Z]{2,4}$", trim($_POST['email']))) {
		$hasError = true;
	} else {
		$email = trim($_POST['email']);
	}

	//If there is no error, send the email
	if(!isset($hasError)) {
		$emailTo = 'darryn@boilingdesigns.com'; //Put your own email address here
		$body = "Name: $name \n\nEmail: $email \n\nComments:\n $comments";
		$headers = 'From: My Site <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;

		mail($emailTo, 'Enquiry for Darryn Lee-Warden at Boiling Designs', $body, $headers);
		$emailSent = true;
	}
}
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Darryn Lee-Warden (web design and development based in melbourne. )</title>
	<meta name="description" content="Affordable web design and development for all platforms browsers and mobile devices. Based in melbourne australia but with international experience, creating clean, slick, beautiful and interactive websites.  ">
	<meta name="keywords" content="Websites, web design, online solutions, web development, javascript , actionscript , html 5 , css 3 , ecommerce , edms , html email , banners , responsive  websites , application development for moblile devices , affordable , cheap , beautiful , slick , awesome.">
    <meta name="author" content="Darryn leewarden">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><!-- Mobile viewport optimized: j.mp/bplateviewport -->

	<link rel="stylesheet" href="css/style.css?v=2"><!-- CSS Styles -->
	<link rel="stylesheet" href="css/color-scheme.css"><!-- COLOR SCHEME Styles -->
	<link rel="stylesheet" href="css/responsive.css"><!-- RESPONSIVE CSS Styles -->
	<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400|Droid+Serif:400,400italic|Damion' rel='stylesheet' type='text/css'>
	
	
	<script src="js/libs/modernizr-2.0.6.min.js"></script><!-- MODERNIZR JavaScript for IE -->
	
	<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js"></script>
	<script>window.jQuery || document.write("<script src='js/libs/jquery-1.7.1.min.js'>\x3C/script>")</script><!-- local fall-back if google api down -->
	<script src="js/plugins.js"></script>
	<script src="js/script.js"></script>
	<!-- end JavaScript-->
	<!-- google tracking-->
    <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-33744383-1']);
  _gaq.push(['_setDomainName', 'boilingdesigns.com']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
<!-- google tracking-->
</head>

<body class="contact">


<script type="text/javascript">
	jQuery(document).ready(function($) {
		$("#contactform").validate();
	});
</script>

<div id="contact-wrapper">
	<?php if(isset($hasError)) { //If errors are found ?>
		<p class="error">Please check if you've filled all the fields with valid information. Thank you.</p>
	<?php } ?>

	<?php if(isset($emailSent) && $emailSent == true) { //If email is sent ?>
		<p class="success"><strong>Email Successfully Sent!</strong></p>
		<p class="success2">Thank you <strong><?php echo $name;?></strong> for using my contact form! I will be in touch with you soon.</p>
	<?php } ?>

	<form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>" id="contactform">
		<div>
		    <label>Name:</label>
			<input type="text" size="38" name="contactname" id="contactname" value="" class="required" />
		</div>

		<div>
			<label for="email">Email:</label>
			<input type="text" size="38" name="email" id="email" value="" class="required email" />
		</div>

		<div>
			<label for="message">Message:</label>
			<textarea rows="8" cols="25" name="message" id="message"></textarea>
		</div>
	    <input type="submit" class="button" value="Send E-mail &rsaquo;" name="submit" />
	</form>
	</div><!-- close #contact-wrapper -->



</body>
</html>		