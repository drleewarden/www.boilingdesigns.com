
/*  Table of Contents 
	01. MENU ACTIVATION
	02. TWITTER FEED
	03. FLICKR PHOTOS
	04. LIGHTBOX ACTIVATION
	05. HOVER FOR ICONS
	06. NAVIGATION SELET MENU FOR SMALLER BROWSERS
	07. TABS ACTIVATION
	08. FLUID EMBEDDED VIDEOS
*/


/*
=============================================== 01. MENU ACTIVATION  ===============================================
*/
jQuery(document).ready(function($) { 
	$("ul.sf-menu").supersubs({ 
	        minWidth:    5,   // minimum width of sub-menus in em units 
	        maxWidth:    14,   // maximum width of sub-menus in em units 
	        extraWidth:  1     // extra width can ensure lines don't sometimes turn over 
	                           // due to slight rounding differences and font-family 
	    }).superfish({ 
			animation: {height:'show'},   // slide-down effect without fade-in 
			speed:         'normal',           // speed of the animation. Equivalent to second parameter of jQuery’s .animate() method 
			autoArrows:    true,               // if true, arrow mark-up generated automatically = cleaner source code at expense of initialisation performance 
			dropShadows:   true,               // completely disable drop shadows by setting this to false 
			delay:     400               // 400 ms delay on timeout
		});
});


/*
=============================================== 02. TWITTER FEED ===============================================
*/

jQuery(document).ready(function($) { 
		$('#tweets').jtwt({
			image_size : 0,  		// The size of your avatar. 0 means "no avatar". Recommend of 0 or 20, default is 48.
			count : 2,  			// # of tweets displaying
			username: 'envato', 	// enter your username here
			convert_links : 1, 		// Choose if the links and replies in your tweets to be converted in clickable links. 0 means no, 1 means yes
			loader_text : 'Loading new tweets...'		// The text which be displayed by loading the tweets.
	});   
});

/*
=============================================== 03. FLICKR PHOTOS ===============================================
*/
jQuery(document).ready(function($) { 			   
	// Our very special jQuery JSON fucntion call to Flickr, gets details of the most recent images			   
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=52617155@N08&lang=en-us&format=json&jsoncallback=?", displayImages);  //YOUR IDGETTR GOES HERE
	function displayImages(data) {																																   
		// Randomly choose where to start. A random number between 0 and the number of photos we grabbed (20) minus  7 (we are displaying 7 photos).
		var iStart = Math.floor(Math.random()*(0));	
		
		// Reset our counter to 0
		var iCount = 1;								
		
		// Start putting together the HTML string
		var htmlString = "<ul>";					
		
		// Now start cycling through our array of Flickr photo details
		$.each(data.items, function(i,item){
									
			// Let's only display 6 photos (a 2x3 grid), starting from a the first point in the feed				
			if (iCount > iStart && iCount < (iStart + 10)) {
				
				// I only want the ickle square thumbnails
				var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");		
				
				// Here's where we piece together the HTML
				htmlString += '<li><a href="' + item.link + '" target="_blank">';
				htmlString += '<img src="' + sourceSquare + '" alt="' + item.title + '" title="' + item.title + '"/>';
				htmlString += '</a></li>';
			}
			// Increase our counter by 1
			iCount++;
		});		
		
	// Pop our HTML in the #images DIV	
	$('#flickr').html(htmlString + "</ul>");
	
	// Close down the JSON function call
	}
	
// The end of our jQuery function	
});


/*
=============================================== 04. LIGHTBOX ACTIVATION  ===============================================
*/
jQuery(document).ready(function($) { 
		$("a[rel^='prettyPhoto']").prettyPhoto({
			animation_speed: 'fast', /* fast/slow/normal */
			slideshow: 5000, /* false OR interval time in ms */
			autoplay_slideshow: false, /* true/false */
			opacity: 0.80, /* Value between 0 and 1 */
			show_title: false, /* true/false */
			allow_resize: true, /* Resize the photos bigger than viewport. true/false */
			default_width: 500,
			default_height: 344,
			counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
			theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
			horizontal_padding: 20, /* The padding on each side of the picture */
			hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			wmode: 'opaque', /* Set the flash wmode attribute */
			autoplay: false, /* Automatically start videos: True/False */
			modal: false, /* If set to true, only the close button will close the window */
			deeplinking: false, /* Allow prettyPhoto to update the url to enable deeplinking. */
			overlay_gallery: false, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
			keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
			ie6_fallback: true,
			projLink:true,/* add link to pop up*/
			social_tools: '' /* html or false to disable  <div class="pp_social"><div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="http://www.facebook.com/plugins/like.php?locale=en_US&href='+location.href+'&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div></div> */
		});
});


/*
=============================================== 05. HOVER FOR ICONS  ===============================================
*/
//Transparency Adjustments
jQuery(document).ready(function($) {  
            $('.transparency').each(function() {
                $(this).hover(
                    function() {
                        $(this).stop().animate({ opacity: 0.3 }, 200);
                    },
                   function() {
                       $(this).stop().animate({ opacity: 1.0 }, 300);
                   })
                });
});




/*
=============================================== 06. NAVIGATION SELET MENU FOR SMALLER BROWSERS  ===============================================
*/
jQuery(document).ready(function($) {

// Create the dropdown base
$("<select />").appendTo("nav");


});


jQuery(document).ready(function($) {
	
// Create default option "Go to..."
$("<option />", {
   "selected": "selected",
   "value"   : "",
   "text"    : "Go to..."
}).appendTo("nav select");


});


jQuery(document).ready(function($) {
// Populate dropdown with menu items
$("nav a").each(function() {
 var el = $(this);
 $("<option />", {
     "value"   : el.attr("href"),
     "text"    : el.text()
 }).appendTo("nav select");
});


});

jQuery(document).ready(function($) {

$("nav select").change(function() {
  window.location = $(this).find("option:selected").val();
});


});



/*
=============================================== 07. TABS ACTIVATION  ===============================================
*/
jQuery(document).ready(function($) {  

	var tabs = $('ul.tabs');

	tabs.each(function(i) {

		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {

			//Get Location of tab's content
			var contentLocation = $(this).attr('href');

			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {

				e.preventDefault();

				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');

				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');

			}
		});
	});
});


/*
=============================================== 08. FLUID EMBEDDED VIDEOS  ===============================================
*/
jQuery(document).ready(function($) { 
var id = $('input#id').val(); 
var name = $('input#name').val(); 
var address = $('input#address').val(); 
var data ={
		type:'person',
		id: id,
		address: address 
 }
 
if (data.type == 'person'){
	//alert('hello')
}
function popUp(x, y){
	
	
	
}

$(".container").fitVids();
$(".seeMore").css({ cursor:"pointer"})
.toggle(function(){
	$(".seeMore").text(">> less <<");
	$(".col-shorten").animate({height:"290px"});
}, function(){
	$(".seeMore").text(">> more <<");
	$(".col-shorten").animate({height:"180px"});
	}

)
//$(".seeMore").click(function(){
//	$(".col-shorten").animate({height:"290px"});
//	$(this).text(">> less <<")
//	})
$(".grid4column").hover(function(){
	var linkP = $(this).find(".projLink").text();
	
	})
	
	$("body").hide().fadeIn(990);

});

/*
=============================================== 09. pop  ===============================================
*/
jQuery(document).ready(function($) { 
	//alert("bom")
})