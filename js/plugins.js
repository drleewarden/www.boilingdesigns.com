
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*  Table of Contents 
	01. Superfish v1.4.8 - jQuery menu widget
	02. Supersubs v0.2b - jQuery plugin
	03. prettyPhoto
	04. jtwt - a simple jQuery Twitter plugin
	05.  HOMEPAGE UNOSLIDER
	06. FitVids 1.0
	07. jQuery Validation Plugin 1.8.1
*/




/*
=============================================== 01. Superfish v1.4.8 - jQuery menu widget  ===============================================
* Copyright (c) 2008 Joel Birch
*
* Dual licensed under the MIT and GPL licenses:
* 	http://www.opensource.org/licenses/mit-license.php
* 	http://www.gnu.org/licenses/gpl.html
*
* CHANGELOG: http://users.tpg.com.au/j_birch/plugins/superfish/changelog.txt
 */

;(function($){
	$.fn.superfish = function(op){

		var sf = $.fn.superfish,
			c = sf.c,
			$arrow = $(['<span class="',c.arrowClass,'"> &#187;</span>'].join('')),
			over = function(){
				var $$ = $(this), menu = getMenu($$);
				clearTimeout(menu.sfTimer);
				$$.showSuperfishUl().siblings().hideSuperfishUl();
			},
			out = function(){
				var $$ = $(this), menu = getMenu($$), o = sf.op;
				clearTimeout(menu.sfTimer);
				menu.sfTimer=setTimeout(function(){
					o.retainPath=($.inArray($$[0],o.$path)>-1);
					$$.hideSuperfishUl();
					if (o.$path.length && $$.parents(['li.',o.hoverClass].join('')).length<1){over.call(o.$path);}
				},o.delay);	
			},
			getMenu = function($menu){
				var menu = $menu.parents(['ul.',c.menuClass,':first'].join(''))[0];
				sf.op = sf.o[menu.serial];
				return menu;
			},
			addArrow = function($a){ $a.addClass(c.anchorClass).append($arrow.clone()); };
			
		return this.each(function() {
			var s = this.serial = sf.o.length;
			var o = $.extend({},sf.defaults,op);
			o.$path = $('li.'+o.pathClass,this).slice(0,o.pathLevels).each(function(){
				$(this).addClass([o.hoverClass,c.bcClass].join(' '))
					.filter('li:has(ul)').removeClass(o.pathClass);
			});
			sf.o[s] = sf.op = o;
			
			$('li:has(ul)',this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over,out).each(function() {
				if (o.autoArrows) addArrow( $('>a:first-child',this) );
			})
			.not('.'+c.bcClass)
				.hideSuperfishUl();
			
			var $a = $('a',this);
			$a.each(function(i){
				var $li = $a.eq(i).parents('li');
				$a.eq(i).focus(function(){over.call($li);}).blur(function(){out.call($li);});
			});
			o.onInit.call(this);
			
		}).each(function() {
			var menuClasses = [c.menuClass];
			if (sf.op.dropShadows  && !($.browser.msie && $.browser.version < 7)) menuClasses.push(c.shadowClass);
			$(this).addClass(menuClasses.join(' '));
		});
	};

	var sf = $.fn.superfish;
	sf.o = [];
	sf.op = {};
	sf.IE7fix = function(){
		var o = sf.op;
		if ($.browser.msie && $.browser.version > 6 && o.dropShadows && o.animation.opacity!=undefined)
			this.toggleClass(sf.c.shadowClass+'-off');
		};
	sf.c = {
		bcClass     : 'sf-breadcrumb',
		menuClass   : 'sf-js-enabled',
		anchorClass : 'sf-with-ul',
		arrowClass  : 'sf-sub-indicator',
		shadowClass : 'sf-shadow'
	};
	sf.defaults = {
		hoverClass	: 'sfHover',
		pathClass	: 'overideThisToUse',
		pathLevels	: 1,
		delay		: 800,
		animation	: {opacity:'show'},
		speed		: 'normal',
		autoArrows	: true,
		dropShadows : true,
		disableHI	: false,		// true disables hoverIntent detection
		onInit		: function(){}, // callback functions
		onBeforeShow: function(){},
		onShow		: function(){},
		onHide		: function(){}
	};
	$.fn.extend({
		hideSuperfishUl : function(){
			var o = sf.op,
				not = (o.retainPath===true) ? o.$path : '';
			o.retainPath = false;
			var $ul = $(['li.',o.hoverClass].join(''),this).add(this).not(not).removeClass(o.hoverClass)
					.find('>ul').hide().css('visibility','hidden');
			o.onHide.call($ul);
			return this;
		},
		showSuperfishUl : function(){
			var o = sf.op,
				sh = sf.c.shadowClass+'-off',
				$ul = this.addClass(o.hoverClass)
					.find('>ul:hidden').css('visibility','visible');
			sf.IE7fix.call($ul);
			o.onBeforeShow.call($ul);
			$ul.animate(o.animation,o.speed,function(){ sf.IE7fix.call($ul); o.onShow.call($ul); });
			return this;
		}
	});

})(jQuery);







/*
=============================================== 02. Supersubs v0.2b - jQuery plugin  ===============================================
 * Copyright (c) 2008 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 *
 * This plugin automatically adjusts submenu widths of suckerfish-style menus to that of
 * their longest list item children. If you use this, please expect bugs and report them
 * to the jQuery Google Group with the word 'Superfish' in the subject line.
 *
 */

;(function($){ // $ will refer to jQuery within this closure

	$.fn.supersubs = function(options){
		var opts = $.extend({}, $.fn.supersubs.defaults, options);
		// return original object to support chaining
		return this.each(function() {
			// cache selections
			var $$ = $(this);
			// support metadata
			var o = $.meta ? $.extend({}, opts, $$.data()) : opts;
			// get the font size of menu.
			// .css('fontSize') returns various results cross-browser, so measure an em dash instead
			var fontsize = $('<li id="menu-fontsize">&#8212;</li>').css({
				'padding' : 0,
				'position' : 'absolute',
				'top' : '-999em',
				'width' : 'auto'
			}).appendTo($$).width(); //clientWidth is faster, but was incorrect here
			// remove em dash
			$('#menu-fontsize').remove();
			// cache all ul elements
			$ULs = $$.find('ul');
			// loop through each ul in menu
			$ULs.each(function(i) {	
				// cache this ul
				var $ul = $ULs.eq(i);
				// get all (li) children of this ul
				var $LIs = $ul.children();
				// get all anchor grand-children
				var $As = $LIs.children('a');
				// force content to one line and save current float property
				var liFloat = $LIs.css('white-space','nowrap').css('float');
				// remove width restrictions and floats so elements remain vertically stacked
				var emWidth = $ul.add($LIs).add($As).css({
					'float' : 'none',
					'width'	: 'auto'
				})
				// this ul will now be shrink-wrapped to longest li due to position:absolute
				// so save its width as ems. Clientwidth is 2 times faster than .width() - thanks Dan Switzer
				.end().end()[0].clientWidth / fontsize;
				// add more width to ensure lines don't turn over at certain sizes in various browsers
				emWidth += o.extraWidth;
				// restrict to at least minWidth and at most maxWidth
				if (emWidth > o.maxWidth)		{ emWidth = o.maxWidth; }
				else if (emWidth < o.minWidth)	{ emWidth = o.minWidth; }
				emWidth += 'em';
				// set ul to width in ems
				$ul.css('width',emWidth);
				// restore li floats to avoid IE bugs
				// set li width to full width of this ul
				// revert white-space to normal
				$LIs.css({
					'float' : liFloat,
					'width' : '100%',
					'white-space' : 'normal'
				})
				// update offset position of descendant ul to reflect new width of parent
				.each(function(){
					var $childUl = $('>ul',this);
					var offsetDirection = $childUl.css('left')!==undefined ? 'left' : 'right';
					$childUl.css(offsetDirection,emWidth);
				});
			});
			
		});
	};
	// expose defaults
	$.fn.supersubs.defaults = {
		minWidth		: 9,		// requires em unit.
		maxWidth		: 25,		// requires em unit.
		extraWidth		: 0			// extra width can ensure lines don't sometimes turn over due to slight browser differences in how they round-off values
	};
	
})(jQuery); // plugin code ends



/*
=============================================== 03. prettyPhoto  ===============================================
* Class: prettyPhoto
* Use: Lightbox clone for jQuery
* Author: Stephane Caron (http://www.no-margin-for-errors.com)
* Version: 3.0.1
*/(function ($) {
    $.prettyPhoto = {
        version: '3.0'
    };
    $.fn.prettyPhoto = function (pp_settings) {
        pp_settings = jQuery.extend({
            animation_speed: 'fast',
            slideshow: false,
            autoplay_slideshow: false,
            opacity: 0.80,
            show_title: true,
            allow_resize: true,
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/',
            theme: 'facebook',
            hideflash: false,
            wmode: 'opaque',
            autoplay: true,
            modal: false,
            overlay_gallery: true,
            keyboard_shortcuts: true,
            changepicturecallback: function () {},
            callback: function () {},
            markup: '<div class="pp_pic_holder"> \
      <div class="ppt">&nbsp;</div> \
      <div class="pp_top"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
      <div class="pp_content_container"> \
       <div class="pp_left"> \
       <div class="pp_right"> \
        <div class="pp_content"> \
         <div class="pp_loaderIcon"></div> \
         <div class="pp_fade"> \
          <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
          <div class="pp_hoverContainer"> \
           <a class="pp_next" href="#">next</a> \
           <a class="pp_previous" href="#">previous</a> \
          </div> \
          <div id="pp_full_res"></div> \
          <div class="pp_details clearfix"> \
           <p class="pp_description"></p> \
           <a class="pp_close" href="#">Close</a> \
           <a class="address" href="http://www.google.com" target="_blank">Live Site</a> \
           <div class="pp_nav"> \
            <a href="#" class="pp_arrow_previous">Previous</a> \
            <p class="currentTextHolder">0/0</p> \
            <a href="#" class="pp_arrow_next">Next</a> \
           </div> \
          </div> \
         </div> \
        </div> \
       </div> \
       </div> \
      </div> \
      <div class="pp_bottom"> \
       <div class="pp_left"></div> \
       <div class="pp_middle"></div> \
       <div class="pp_right"></div> \
      </div> \
     </div> \
     <div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \
        <a href="#" class="pp_arrow_previous">Previous</a> \
        <ul> \
         {gallery} \
        </ul> \
        <a href="#" class="pp_arrow_next">Next</a> \
       </div>',
            image_markup: '<img id="fullResImage" src="" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline clearfix">{content}</div>',
            custom_markup: ''
        }, pp_settings);
        var matchedObjects = this,
        
            percentBased = false,
            correctSizes, pp_open, pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth, windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            pp_slideshow;
        doresize = true, scroll_pos = _get_scroll();
        $(window).unbind('resize').resize(function () {
            _center_overlay();
            _resize_overlay();
        });
        if (pp_settings.keyboard_shortcuts) {
            $(document).unbind('keydown').keydown(function (e) {
                if (typeof $pp_pic_holder != 'undefined') {
                    if ($pp_pic_holder.is(':visible')) {
                        switch (e.keyCode) {
                            case 37:
                                $.prettyPhoto.changePage('previous');
                                break;
                            case 39:
                                $.prettyPhoto.changePage('next');
                                break;
                            case 27:
                                if (!settings.modal) $.prettyPhoto.close();
                                break;
                        };
                        return false;
                    };
                };
            });
        }
        $.prettyPhoto.initialize = function () {
            settings = pp_settings;
            if ($.browser.msie && parseInt($.browser.version) == 6) settings.theme = "light_square";
            _buildOverlay(this);
            if (settings.allow_resize) $(window).scroll(function () {
                _center_overlay();
            });
            _center_overlay();
            set_position = jQuery.inArray($(this).attr('href'), pp_images);
            $.prettyPhoto.open();
            return false;
        }
        $.prettyPhoto.open = function (event) {
            if (typeof settings == "undefined") {
                settings = pp_settings;
                if ($.browser.msie && $.browser.version == 6) settings.theme = "light_square";
                _buildOverlay(event.target);
                pp_images = $.makeArray(arguments[0]);
                pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $.makeArray("");
                pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2]) : $.makeArray("");
                isSet = (pp_images.length > 1) ? true : false;
                set_position = 0;
            }
            if ($.browser.msie && $.browser.version == 6) $('select').css('visibility', 'hidden');
            if (settings.hideflash) $('object,embed').css('visibility', 'hidden');
            _checkPosition($(pp_images).size());
            $('.pp_loaderIcon').show();
            if ($ppt.is(':hidden')) $ppt.css('opacity', 0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);
            $pp_pic_holder.find('.currentTextHolder').text((set_position + 1) + settings.counter_separator_label + $(pp_images).size());
            $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));
            (settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html('&nbsp;');
            movie_width = (parseFloat(grab_param('width', pp_images[set_position]))) ? grab_param('width', pp_images[set_position]) : settings.default_width.toString();
            movie_height = (parseFloat(grab_param('height', pp_images[set_position]))) ? grab_param('height', pp_images[set_position]) : settings.default_height.toString();
            if (movie_width.indexOf('%') != -1 || movie_height.indexOf('%') != -1) {
                movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 150);
                movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 150);
                percentBased = true;
            } else {
                percentBased = false;
            }
            $pp_pic_holder.fadeIn(function () {
                imgPreloader = "";
                switch (_getFileType(pp_images[set_position])) {
                    case 'image':
                        imgPreloader = new Image();
                        nextImage = new Image();
                        if (isSet && set_position > $(pp_images).size()) nextImage.src = pp_images[set_position + 1];
                        prevImage = new Image();
                        if (isSet && pp_images[set_position - 1]) prevImage.src = pp_images[set_position - 1];
                        $pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup;
                        $pp_pic_holder.find('#fullResImage').attr('src', pp_images[set_position]);
                        imgPreloader.onload = function () {
                            correctSizes = _fitToViewport(imgPreloader.width, imgPreloader.height);
                            _showContent();
                        };
                        imgPreloader.onerror = function () {
                            alert('Image cannot be loaded. Make sure the path is correct and image exist.');
                            $.prettyPhoto.close();
                        };
                        imgPreloader.src = pp_images[set_position];
                        break;
                    case 'youtube':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        movie = 'http://www.youtube.com/v/' + grab_param('v', pp_images[set_position]);
                        if (settings.autoplay) movie += "&autoplay=1";
                        toInject = settings.flash_markup.replace(/{width}/g, correctSizes['width']).replace(/{height}/g, correctSizes['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;
                    case 'vimeo':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        movie_id = pp_images[set_position];
                        var regExp = /http:\/\/(www\.)?vimeo.com\/(\d+)/;
                        var match = movie_id.match(regExp);
                        movie = 'http://player.vimeo.com/video/' + match[2] + '?title=0&amp;byline=0&amp;portrait=0';
                        if (settings.autoplay) movie += "&autoplay=1;";
                        vimeo_width = correctSizes['width'] + '/embed/?moog_width=' + correctSizes['width'];
                        toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, correctSizes['height']).replace(/{path}/g, movie);
                        break;
                    case 'quicktime':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        correctSizes['height'] += 15;
                        correctSizes['contentHeight'] += 15;
                        correctSizes['containerHeight'] += 15;
                        toInject = settings.quicktime_markup.replace(/{width}/g, correctSizes['width']).replace(/{height}/g, correctSizes['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;
                    case 'flash':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        flash_vars = pp_images[set_position];
                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf('flashvars') + 10, pp_images[set_position].length);
                        filename = pp_images[set_position];
                        filename = filename.substring(0, filename.indexOf('?'));
                        toInject = settings.flash_markup.replace(/{width}/g, correctSizes['width']).replace(/{height}/g, correctSizes['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + '?' + flash_vars);
                        break;
                    case 'iframe':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        frame_url = pp_images[set_position];
                        frame_url = frame_url.substr(0, frame_url.indexOf('iframe') - 1);
                        toInject = settings.iframe_markup.replace(/{width}/g, correctSizes['width']).replace(/{height}/g, correctSizes['height']).replace(/{path}/g, frame_url);
                        break;
                    case 'custom':
                        correctSizes = _fitToViewport(movie_width, movie_height);
                        toInject = settings.custom_markup;
                        break;
                    case 'inline':
                        myClone = $(pp_images[set_position]).clone().css({
                            'width': settings.default_width
                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline clearfix"></div></div>').appendTo($('body'));
                        correctSizes = _fitToViewport($(myClone).width(), $(myClone).height());
                        $(myClone).remove();
                        toInject = settings.inline_markup.replace(/{content}/g, $(pp_images[set_position]).html());
                        break;
                };
                if (!imgPreloader) {
                    $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                    _showContent();
                };
            });
            return false;
        };
        $.prettyPhoto.changePage = function (direction) {
            currentGalleryPage = 0;
            if (direction == 'previous') {
                set_position--;
                if (set_position < 0) {
                    set_position = 0;
                    return;
                };
            } else if (direction == 'next') {
                set_position++;
                if (set_position > $(pp_images).size() - 1) {
                    set_position = 0;
                }
            } else {
                set_position = direction;
            };
            if (!doresize) doresize = true;
            $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            _hideContent(function () {
                $.prettyPhoto.open();
            });
        };
        $.prettyPhoto.changeGalleryPage = function (direction) {
            if (direction == 'next') { 
                currentGalleryPage++;
                if (currentGalleryPage > totalPage) {
                    currentGalleryPage = 0;
                };
            } else if (direction == 'previous') {
                currentGalleryPage--;
                if (currentGalleryPage < 0) {
                    currentGalleryPage = totalPage;
                };
            } else {
                currentGalleryPage = direction;
            };
            itemsToSlide = (currentGalleryPage == totalPage) ? pp_images.length - ((totalPage) * itemsPerPage) : itemsPerPage;
            $pp_pic_holder.find('.pp_gallery li').each(function (i) {
                $(this).animate({
                    'left': (i * itemWidth) - ((itemsToSlide * itemWidth) * currentGalleryPage)
                });
            });
        };
        $.prettyPhoto.startSlideshow = function () {
            if (typeof pp_slideshow == 'undefined') {
                $pp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function () {
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                pp_slideshow = setInterval($.prettyPhoto.startSlideshow, settings.slideshow);
            } else {
                $.prettyPhoto.changePage('next');
            };
        }
        $.prettyPhoto.stopSlideshow = function () {
            $pp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function () {
                $.prettyPhoto.startSlideshow();
                return false;
            });
            clearInterval(pp_slideshow);
            pp_slideshow = undefined;
        }
        $.prettyPhoto.close = function () {
            clearInterval(pp_slideshow);
            $pp_pic_holder.stop().find('object,embed').css('visibility', 'hidden');
            $('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed, function () {
                $(this).remove();
            });
            $pp_overlay.fadeOut(settings.animation_speed, function () {
                if ($.browser.msie && $.browser.version == 6) $('select').css('visibility', 'visible');
                if (settings.hideflash) $('object,embed').css('visibility', 'visible');
                $(this).remove();
                $(window).unbind('scroll');
                settings.callback();
                doresize = true;
                pp_open = false;
                delete settings;
            });
        };
        _showContent = function () {
            $('.pp_loaderIcon').hide();
            $ppt.fadeTo(settings.animation_speed, 1);
            projectedTop = scroll_pos['scrollTop'] + ((windowHeight / 2) - (correctSizes['containerHeight'] / 2));
            if (projectedTop < 0) projectedTop = 0;
            $pp_pic_holder.find('.pp_content').animate({
                'height': correctSizes['contentHeight']
            }, settings.animation_speed);
            $pp_pic_holder.animate({
                'top': projectedTop,
                    'left': (windowWidth / 2) - (correctSizes['containerWidth'] / 2),
                    'width': correctSizes['containerWidth']
            }, settings.animation_speed, function () {
                $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(correctSizes['height']).width(correctSizes['width']);
                $pp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed);
                if (isSet && _getFileType(pp_images[set_position]) == "image") {
                    $pp_pic_holder.find('.pp_hoverContainer').show();
                } else {
                    $pp_pic_holder.find('.pp_hoverContainer').hide();
                }
                if (correctSizes['resized']) $('a.pp_expand,a.pp_contract').fadeIn(settings.animation_speed);
                if (settings.autoplay_slideshow && !pp_slideshow && !pp_open) $.prettyPhoto.startSlideshow();
                settings.changepicturecallback();
                pp_open = true;
            });
            _insert_gallery();
        };

        function _hideContent(callback) {
            $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility', 'hidden');
            $pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed, function () {
                $('.pp_loaderIcon').show();
                callback();
            });
        };

        function _checkPosition(setCount) {
            if (set_position == setCount - 1) {
                $pp_pic_holder.find('a.pp_next').css('visibility', 'hidden');
                $pp_pic_holder.find('a.pp_next').addClass('disabled').unbind('click');
            } else {
                $pp_pic_holder.find('a.pp_next').css('visibility', 'visible');
                $pp_pic_holder.find('a.pp_next.disabled').removeClass('disabled').bind('click', function () {
                    $.prettyPhoto.changePage('next');
                    return false;
                });
            };
            if (set_position == 0) {
                $pp_pic_holder.find('a.pp_previous').css('visibility', 'hidden').addClass('disabled').unbind('click');
            } else {
                $pp_pic_holder.find('a.pp_previous.disabled').css('visibility', 'visible').removeClass('disabled').bind('click', function () {
                    $.prettyPhoto.changePage('previous');
                    return false;
                });
            };
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide();
        };

        function _fitToViewport(width, height) {
            resized = false;
            _getDimensions(width, height);
            imageWidth = width, imageHeight = height;
            if (((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allow_resize && !percentBased) {
                resized = true, fitting = false;
                while (!fitting) {
                    if ((pp_containerWidth > windowWidth)) {
                        imageWidth = (windowWidth - 200);
                        imageHeight = (height / width) * imageWidth;
                    } else if ((pp_containerHeight > windowHeight)) {
                        imageHeight = (windowHeight - 200);
                        imageWidth = (width / height) * imageHeight;
                    } else {
                        fitting = true;
                    };
                    pp_containerHeight = imageHeight, pp_containerWidth = imageWidth;
                };
                _getDimensions(imageWidth, imageHeight);
            };
            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(pp_containerHeight),
                containerWidth: Math.floor(pp_containerWidth) + 40,
                contentHeight: Math.floor(pp_contentHeight),
                contentWidth: Math.floor(pp_contentWidth),
                resized: resized
            };
        };

        function _getDimensions(width, height) {
            width = parseFloat(width);
            height = parseFloat(height);
            $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);
            detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));
            $pp_details = $pp_details.clone().appendTo($('body')).css({
                'position': 'absolute',
                    'top': -10000
            });
            detailsHeight += $pp_details.height();
            detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight;
            if ($.browser.msie && $.browser.version == 7) detailsHeight += 8;
            $pp_details.remove();
            pp_contentHeight = height + detailsHeight;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight + $ppt.height() + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
            pp_containerWidth = width;
        }

        function _getFileType(itemSrc) {
            if (itemSrc.match(/youtube\.com\/watch/i)) {
                return 'youtube';
            } else if (itemSrc.match(/vimeo\.com/i)) {
                return 'vimeo';
            } else if (itemSrc.indexOf('.mov') != -1) {
                return 'quicktime';
            } else if (itemSrc.indexOf('.swf') != -1) {
                return 'flash';
            } else if (itemSrc.indexOf('iframe') != -1) {
                return 'iframe';
            } else if (itemSrc.indexOf('custom') != -1) {
                return 'custom';
            } else if (itemSrc.substr(0, 1) == '#') {
                return 'inline';
            } else {
                return 'image';
            };
        };

        function _center_overlay() {
            if (doresize && typeof $pp_pic_holder != 'undefined') {
                scroll_pos = _get_scroll();
                titleHeight = $ppt.height(), contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();
                projectedTop = (windowHeight / 2) + scroll_pos['scrollTop'] - (contentHeight / 2);
                $pp_pic_holder.css({
                    'top': projectedTop,
                        'left': (windowWidth / 2) + scroll_pos['scrollLeft'] - (contentwidth / 2)
                });
            };
        };

        function _get_scroll() {
            if (self.pageYOffset) {
                return {
                    scrollTop: self.pageYOffset,
                    scrollLeft: self.pageXOffset
                };
            } else if (document.documentElement && document.documentElement.scrollTop) {
                return {
                    scrollTop: document.documentElement.scrollTop,
                    scrollLeft: document.documentElement.scrollLeft
                };
            } else if (document.body) {
                return {
                    scrollTop: document.body.scrollTop,
                    scrollLeft: document.body.scrollLeft
                };
            };
        };

        function _resize_overlay() {
            windowHeight = $(window).height(), windowWidth = $(window).width();
            if (typeof $pp_overlay != "undefined") $pp_overlay.height($(document).height());
        };

        function _insert_gallery() {
            if (isSet && settings.overlay_gallery && _getFileType(pp_images[set_position]) == "image") {
                itemWidth = 52 + 5;
                navWidth = (settings.theme == "facebook") ? 58 : 38;
                itemsPerPage = Math.floor((correctSizes['containerWidth'] - 100 - navWidth) / itemWidth);
                itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage : pp_images.length;
                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;
                if (totalPage == 0) {
                    navWidth = 0;
                    $pp_pic_holder.find('.pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous').hide();
                } else {
                    $pp_pic_holder.find('.pp_gallery .pp_arrow_next,.pp_gallery .pp_arrow_previous').show();
                };
                galleryWidth = itemsPerPage * itemWidth + navWidth;
                $pp_pic_holder.find('.pp_gallery').width(galleryWidth).css('margin-left', -(galleryWidth / 2));
                $pp_pic_holder.find('.pp_gallery ul').width(itemsPerPage * itemWidth).find('li.selected').removeClass('selected');
                goToPage = (Math.floor(set_position / itemsPerPage) <= totalPage) ? Math.floor(set_position / itemsPerPage) : totalPage;
                if (itemsPerPage) {
                    $pp_pic_holder.find('.pp_gallery').hide().show().removeClass('disabled');
                } else {
                    $pp_pic_holder.find('.pp_gallery').hide().addClass('disabled');
                }
                $.prettyPhoto.changeGalleryPage(goToPage);
                $pp_pic_holder.find('.pp_gallery ul li:eq(' + set_position + ')').addClass('selected');
            } else {
                $pp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');
                $pp_pic_holder.find('.pp_gallery').hide();
            }
        }

        function _buildOverlay(caller) {
            theRel = $(caller).attr('rel');
            galleryRegExp = /\[(?:.*)\]/;
            isSet = (galleryRegExp.exec(theRel)) ? true : false;
            pp_images = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr('rel').indexOf(theRel) != -1) return $(n).attr('href');
            }) : $.makeArray($(caller).attr('href'));
            pp_titles = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr('rel').indexOf(theRel) != -1) return ($(n).find('img').attr('alt')) ? $(n).find('img').attr('alt') : "";
            }) : $.makeArray($(caller).find('img').attr('alt'));
            pp_descriptions = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr('rel').indexOf(theRel) != -1) return ($(n).attr('title')) ? $(n).attr('title') : "";
            }) : $.makeArray($(caller).attr('title'));
            $('body').append(settings.markup);
            $pp_pic_holder = $('.pp_pic_holder'), $ppt = $('.ppt'), $pp_overlay = $('div.pp_overlay');
            if (isSet && settings.overlay_gallery) {
                currentGalleryPage = 0;
                toInject = "";
                for (var i = 0; i < pp_images.length; i++) {
                    var regex = new RegExp("(.*?)\.(jpg|jpeg|png|gif)$");
                    var results = regex.exec(pp_images[i]);
                    if (!results) {
                        classname = 'default';
                    } else {
                        classname = '';
                    }
                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + pp_images[i] + "' width='50' alt='' /></a></li>";
                };
                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);
                $pp_pic_holder.find('#pp_full_res').after(toInject);
                $pp_pic_holder.find('.pp_gallery .pp_arrow_next').click(function () {
                    $.prettyPhoto.changeGalleryPage('next');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                $pp_pic_holder.find('.pp_gallery .pp_arrow_previous').click(function () {
                    $.prettyPhoto.changeGalleryPage('previous');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                $pp_pic_holder.find('.pp_content').hover(function () {
                    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
                }, function () {
                    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
                });
                itemWidth = 52 + 5;
                $pp_pic_holder.find('.pp_gallery ul li').each(function (i) {
                    $(this).css({
                        'position': 'absolute',
                            'left': i * itemWidth
                    });
                    $(this).find('a').unbind('click').click(function () {
                        $.prettyPhoto.changePage(i);
                        $.prettyPhoto.stopSlideshow();
                        return false;
                    });
                });
            };
            if (settings.slideshow) {
                $pp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
                $pp_pic_holder.find('.pp_nav .pp_play').click(function () {
                    $.prettyPhoto.startSlideshow();
                    return false;
                });
            }
            $pp_pic_holder.attr('class', 'pp_pic_holder ' + settings.theme);
            $pp_overlay.css({
                'opacity': 0,
                    'height': $(document).height(),
                    'width': $(document).width()
            }).bind('click', function () {
                if (!settings.modal) $.prettyPhoto.close();
            });
            $('a.pp_close').bind('click', function () {
                $.prettyPhoto.close();
                return false;
            });
            $('a.pp_expand').bind('click', function (e) {
                if ($(this).hasClass('pp_expand')) {
                    $(this).removeClass('pp_expand').addClass('pp_contract');
                    doresize = false;
                } else {
                    $(this).removeClass('pp_contract').addClass('pp_expand');
                    doresize = true;
                };
                _hideContent(function () {
                    $.prettyPhoto.open();
                });
                return false;
            });
            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click', function () {
                $.prettyPhoto.changePage('previous');
                $.prettyPhoto.stopSlideshow();
                return false;
            });
            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click', function () {
                $.prettyPhoto.changePage('next');
                $.prettyPhoto.stopSlideshow();
                return false;
            });
            _center_overlay();
        };
        return this.unbind('click').click($.prettyPhoto.initialize);
    };

    function grab_param(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return (results == null) ? "" : results[1];
    }
})(jQuery);/*
=============================================== 04. jtwt - a simple jQuery Twitter plugin  ===============================================
* hello@buzzrocket.de.
* http://buzzrocket.de/labs/jtwt/
*/


(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		jtwt: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				username : 'google',
                count : 1,
                image_size: 48,
                convert_links: 1,
                loader_text: 'loading new tweets'
			}
				
			var options =  $.extend(defaults, options);

    		return this.each(function() {
				var o = options;
                var obj = $(this);  
                
$(obj).append('<p id="jtwt_loader" style="display:none;">' + o.loader_text + '</p>');	
$("#jtwt_loader").fadeIn('slow');

			
						$.getJSON('http://twitter.com/status/user_timeline/' + o.username + '.json?count=' + o.count + '&callback=?', function(data){ 


               


			$.each(data, function(i, item) {       
            
                jtweet = '<div id="jtwt">';
                
                
                
                if (o.image_size != 0) {
                
                today = new Date();
  
                jtweet += '<div id="jtwt_picture">';
                jtweet += '<a href="http://twitter.com/' + item.user['screen_name'] + '">'
                jtweet += '<img width="' + o.image_size +'" height="' + o.image_size + '" src="' + item.user['profile_image_url'] + '" />';
                jtweet += '</a><br />';
                jtweet += '</div>';
                jtweet += '<div id="jtwt_tweet">';
                } 
                
                
               
                var tweettext = item.text;
                var tweetdate = item.created_at;
                
                if (o.convert_links != 0) {
                

  
                tweettext = tweettext.replace(/(http\:\/\/[A-Za-z0-9\/\.\?\=\-]*)/g,'<a href="$1">$1</a>');
                tweettext = tweettext.replace(/@([A-Za-z0-9\/_]*)/g,'<a href="http://twitter.com/$1">@$1</a>');
                tweettext = tweettext.replace(/#([A-Za-z0-9\/\.]*)/g,'<a href="http://twitter.com/search?q=$1">#$1</a>');
                
                }
                
                jtweet += '<div id="jtwt_text">';
                jtweet += tweettext;
                jtweet += '<br />';
                
                
                tweetdate = tweetdate.replace(/201.{1}/, "");
                tweetdate = tweetdate.replace(/\+00.{2}/, "");
                jtweet += '<a href="http://twitter.com/' + item.user['screen_name'] + '/statuses/' + item.id + '" id="jtwt_date">';
                
                jtweet += tweetdate;
                jtweet += '</a></div>';
                jtweet += '</div>';

   				$(obj).append(jtweet);
        
    


          		 });   
                 

$("#jtwt_loader").fadeOut('fast');   
           
		});
    
    
			
    		});
    	}
	});
	
})(jQuery);

/*
=============================================== 05.  HOMEPAGE UNOSLIDER  ===============================================
*/
/*
 * Programmer: Unodor
 * CodeCanyon: http://codecanyon.net/user/Unodor
 *
 */

;(function($){function log(data){console.log(data)}var uniqueID=(function(){var id=0;return function(){return id++}})();$.UnoSlider=function(options,base){var $=jQuery;var $this=base;var defaults={slidesTag:'li',scale:true,preloader:'progress',tooltip:true,preset:false,width:false,height:false,order:'inorder',touch:true,mobile:true,responsive:true,indicator:{autohide:false,position:''},navigation:{autohide:['play','pause'],next:'Next',prev:'Previous',play:'Play',stop:'Pause'},slideshow:{speed:1,timer:true,hoverPause:true,infinite:true,autostart:true,continuous:true},block:{vertical:9,horizontal:3},animation:{speed:500,delay:50,color:'#fff',transition:'grow',variation:'topleft',pattern:'diagonal',direction:'topleft'}};var preset={animation:{speed:500,delay:50,color:'#fff',transition:'grow',variation:'topleft',pattern:'diagonal',direction:'topleft'},block:{vertical:9,horizontal:3}};var defaults_cfg=$.extend(true,defaults,$.UnoSlider.defaults);var preset_base_cfg=$.extend({},defaults,$.UnoSlider.defaults);var cfg=$.extend(true,defaults_cfg,options);var slides=$this.find(cfg.slidesTag);var activeSlideNum=0;var interval=new Array;var controls='';var running=false;var stoped=false;var force=false;var intervalStartTime;var intervalStopTime;var timebarStartTime;var timebarStopTime;var block={};var columns;var rows;var uid=uniqueID();var lists=$this.find(cfg.slidesTag).css({opacity:0,display:"none"});var loaded=0;if(typeof cfg.width!=='undefined'&&cfg.width!==null&&cfg.width){$this.css({width:cfg.width})}if(typeof cfg.height!=='undefined'&&cfg.height!==null&&cfg.height){$this.css({height:cfg.height})}$this.main={init:function(){slides.filter(":first").css({'z-index':1,display:"block"}).addClass('unoslider_active');$this.preloader.init($this.main.start)},start:function(){var layerDelay=0;if(slides.length>1){stoped=!cfg.slideshow.autostart?true:false;if(cfg.indicator)$this.navigation.indicator();$this.navigation.generate();if(cfg.slideshow.timer)$this.timebar.set();if(cfg.slideshow.hoverPause)$this.slideshow.pauseOnHover()}if(cfg.touch&&$this.main.is_mobile())$this.touch.init();$this.layer.generate();$this.main.scaleSlides();$this.tooltip.generate();var firstSlide=$this.children(':nth-child(2)');setTimeout(function(){layerDelay=$this.layer.show(firstSlide);if(cfg.tooltip)$this.tooltip.show(firstSlide);if(slides.length>1){if(cfg.slideshow.autostart){setTimeout(function(){$this.slideshow.start()},layerDelay)}}},500)},scaleSlides:function(){var img=slides.find('img').filter(':not(.unoslider_layers img, .unoslider_caption img)');var div=$('<div class="unoslider_slider_area"></div>').css({overflow:'hidden',width:$this.width(),height:$this.height(),position:'absolute'});img.each(function(){$(this).wrap(div)});var scale=cfg.scale;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].scale!='undefined')){scale=cfg[activeSlideNum+1].scale}if(cfg.scale){img.css({width:'100%',height:'100%'})}},generateCurtain:function(content){var generateBlocks=true;var X=0;var Y=0;var i=1;var content_cube;var vertical=cfg.block.vertical;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].block!='undefined')&&(typeof cfg[activeSlideNum+1].block.vertical!='undefined')){vertical=cfg[activeSlideNum+1].block.vertical}var horizontal=cfg.block.horizontal;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].block!='undefined')&&(typeof cfg[activeSlideNum+1].block.horizontal!='undefined')){horizontal=cfg[activeSlideNum+1].block.horizontal}columns=vertical;rows=horizontal;block={width:Math.ceil($this.width()/vertical),height:Math.ceil($this.height()/horizontal)};var blocks_area=$('<div class="unoslider_blocks_area"></div>').css({overflow:'hidden',width:$this.width(),height:$this.height(),position:'absolute',top:'0px',left:'0px','z-index':3}).appendTo($this[0]);var blocks=$('<div class="unoslider_blocks"></div>').css({width:$this.width(),height:$this.height(),position:'relative'}).appendTo(blocks_area);while(generateBlocks){content_cube=$('<div class="unoslider_cube_content"></div>').css({position:'absolute',left:-X,top:-Y,width:$this.width(),height:$this.height()});$('<div id="block_'+i+'" class="unoslider_cube"></div>').appendTo(blocks).css({'z-index':2,position:'absolute',display:'none',top:Y,left:X,width:block.width,height:block.height,overflow:'hidden'}).append(content_cube);i++;X+=block.width;if(X>=$this.width()){X=0;Y+=block.height}if(Y>=$this.height())generateBlocks=false}$this.find('.unoslider_cube_content').html(content);$('.unoslider_cube').click(function(){return false})},prepare:function(slideData){running=true;$this.main.generateCurtain(slideData.html());return $this.main.setDirection()},execute:function(direction,duration,currentSlide,nextSlide,handChange,delayedChange){if(cfg.tooltip)$this.tooltip.hide();if(delayedChange===false)$this.slideshow.switchSlides(currentSlide,nextSlide);var delay=direction['celkem']+duration;currentSlide.delay(delay).animate({opacity:0},1,function(){if(delayedChange===true)$this.slideshow.switchSlides(currentSlide,nextSlide);nextSlide.animate({},1,function(){$this.children(".unoslider_blocks_area").remove();$this.children(".unoslider_cube").remove();var layerDelay=$this.layer.show(nextSlide);if((handChange===true&&(cfg.slideshow.continuous===true||!cfg.slideshow))||handChange===false){setTimeout(function(){running=false;if(stoped===false)$this.slideshow.restart()},layerDelay)}if(cfg.tooltip)$this.tooltip.show(nextSlide)})})},counter:0,presets:function(){if(typeof cfg==='object'&&typeof cfg.preset==='object'){var index=cfg.order==='random'?Math.floor(Math.random()*cfg.preset.length):this.counter;if(typeof cfg.preset[index]=='string'){if(cfg.preset[index]in $this.preset){$this.preset[cfg.preset[index]]()}else{alert('There is no preset named "'+cfg.preset[index]+'"')}}else{cfg.animation=$.extend({},preset.animation,cfg.preset[index].animation);cfg.block=$.extend({},preset.block,cfg.preset[index].block)}if((this.counter+1)<cfg.preset.length){this.counter++}else{this.counter=0}}else{if(cfg.preset)$this.preset.init()}},is_mobile:function(){var mobile=navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/);return mobile},mobilePresets:function(){cfg.block={vertical:1,horizontal:1};if($this.touch.reverse){cfg.animation={speed:300,delay:0,transition:'slide_in',variation:'left',pattern:'horizontal'}}else{cfg.animation={speed:300,delay:0,transition:'slide_in',variation:'right',pattern:'horizontal'}}$this.touch.reverse=false},responsive:function(){var base_width=$this.width();var base_height=$this.height();var ratio=(base_width/base_height);function fit(){if($this.parent().width()<(base_width)){$this.width('100%');$this.find('.unoslider_slider_area').width('100%')}else{$this.css({width:base_width,height:base_height});$this.find('.unoslider_slider_area').css({width:base_width,height:base_height})}var cropHeight=Math.floor((($this.width()/ratio)/1))*1;$this.height(cropHeight);$this.find('.unoslider_slider_area').height(cropHeight)}$(window).resize(function(){fit()});fit()},setTransition:function(currentSlide,nextSlide,handChange){if(cfg.mobile&&$this.main.is_mobile()){this.mobilePresets()}else{this.presets()}var transition=cfg.animation.transition;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.transition!='undefined')){transition=cfg[activeSlideNum+1].animation.transition}var variation=cfg.animation.variation;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.variation!='undefined')){variation=cfg[activeSlideNum+1].animation.variation}var transitions={swap:['top','right','bottom','left'],stretch:['center','vertical','horizontal','alternate'],squeeze:['center','vertical','horizontal','alternate'],shrink:['topleft','topright','bottomleft','bottomright'],grow:['topleft','topright','bottomleft','bottomright'],slide_in:['top','right','bottom','left','alternate_vertical','alternate_horizontal'],slide_out:['top','right','bottom','left','alternate_vertical','alternate_horizontal'],drop:['topleft','topright','bottomleft','bottomright','top','right','bottom','left','alternate_vertical','alternate_horizontal'],appear:['topleft','topright','bottomleft','bottomright','top','right','bottom','left','alternate_vertical','alternate_horizontal'],flash:[],fade:[]};function in_array(a){var o={};for(var i=0;i<a.length;i++){o[a[i]]=''}return o}var final_transition=transition;if(transitions[transition].length>0){if(variation in in_array(transitions[transition])){final_transition=transition+'_'+variation}else{final_transition=transition+'_'+transitions[transition][0]}}$this.transition[final_transition](currentSlide,nextSlide,handChange)},setDirection:function(){var direction=cfg.animation.direction;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.direction!='undefined')){direction=cfg[activeSlideNum+1].animation.direction}var type=cfg.animation.pattern;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.pattern!='undefined')){type=cfg[activeSlideNum+1].animation.pattern}var directions={horizontal:['top','bottom','topleft','topright','bottomleft','bottomright'],vertical:['left','right','topleft','topright','bottomleft','bottomright'],diagonal:['topleft','topright','bottomleft','bottomright'],random:[],spiral:['topleft','topright','bottomleft','bottomright'],horizontal_zigzag:['topleft','topright','bottomleft','bottomright'],vertical_zigzag:['topleft','topright','bottomleft','bottomright'],chess:[],explode:['center','top','right','bottom','left'],implode:['center','top','right','bottom','left'],example:[]};function in_array(a){var o={};for(var i=0;i<a.length;i++){o[a[i]]=''}return o}var final_direction=type;if(directions[type].length>0){if(direction in in_array(directions[type])){final_direction=type+'_'+direction}else{final_direction=type+'_'+directions[type][0]}}return $this.direction[final_direction]()}};$this.touch={moving:false,startX:null,reverse:false,init:function(){if('ontouchstart'in document.documentElement){$this.find('.unoslider_left').remove();$this.find('.unoslider_right').remove();$this[0].addEventListener('touchstart',$this.touch.start,false)}},start:function(event){if(event.touches.length==1){this.startX=event.touches[0].pageX;this.moving=true;$this[0].addEventListener('touchmove',$this.touch.move,false)}},move:function(event){if(this.moving){var x=event.touches[0].pageX;var dx=this.startX-x;if(Math.abs(dx)>=50){$this.touch.end();if(dx>0){$this.touch.left()}else{$this.touch.right()}}}},end:function(){$this[0].removeEventListener('touchmove',$this.touch.move);this.startX=null;this.moving=false},left:function(){if(running===false){$this.touch.reverse=false;$this.slideshow.next()}},right:function(){if(running===false){$this.touch.reverse=true;$this.slideshow.prev()}}};$this.layer={generate:function(){$this.find('.unoslider_layers').css({width:'100%',height:'100%',position:'absolute','z-index':4}).children().hide()},show:function(slide){$this.find('.unoslider_layers').children().hide();var layers=$(slide).find('.unoslider_layers').children().length;var delays=[];var delay=250;var duration=300;var i;var animation;i=1;$(slide).find('.unoslider_layers').children().each(function(){delays.push(delay*i);i++});i=0;$(slide).find('.unoslider_layers').children().each(function(){var $self=$(this);var tridy=['slide_top','slide_right','slide_bottom','slide_left','fade'];for(x in tridy){if($self.hasClass(tridy[x])){animation=$this.layer[tridy[x]]();break}}$self.css(animation['css']);$self.delay(delays[i]).animate(animation['animate'],{duration:duration});i++});return layers===0?0:delays[layers-1]+(duration*layers)},slide_top:function(){var animate={top:"-=20px",opacity:1};var css={top:"+=20px",display:'block',opacity:0};return{css:css,animate:animate}},slide_right:function(){var animate={left:"+=20px",opacity:1};var css={left:"-=20px",display:'block',opacity:0};return{css:css,animate:animate}},slide_bottom:function(){var animate={top:"+=20px",opacity:1};var css={top:"-=20px",display:'block',opacity:0};return{css:css,animate:animate}},slide_left:function(){var animate={left:"-=20px",opacity:1};var css={left:"+=20px",display:'block',opacity:0};return{css:css,animate:animate}},fade:function(){var animate={opacity:1};var css={display:'block',opacity:0};return{css:css,animate:animate}}};$this.timebar={pause:function(){var timebar=$this.find('.unoslider_timer');$(timebar).stop();timebarStopTime=new Date},resume:function(){var timer=$this.find('.unoslider_timer');var now;if(typeof timebarStopTime!=='undefined')now=timebarStopTime.getTime();var before;if(typeof timebarStartTime!=='undefined')before=timebarStartTime.getTime();var baseTimeout=($this.timer.speed()*1000);var remaining=baseTimeout-(now-before);if(remaining<=baseTimeout)this.start(remaining)},set:function(){return $('<div class="unoslider_timer"></div>').css({'z-index':1}).width('0%').appendTo($this[0])},start:function(delay){var remaining=delay||$this.timer.speed()*1000;var timer=$this.find('.unoslider_timer');timebarStartTime=new Date();if(typeof delay==='undefined')timer.show();timer.animate({width:'100%'},remaining,null,function(){$this.timebar.hide()})},stop:function(){var timebar=$this.find('.unoslider_timer');$(timebar).stop().width('0%').hide()},hide:function(){$this.find('.unoslider_timer').width('0%').hide()}};$this.timer={speed:function(){var time=cfg.slideshow.speed;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].slideshow!='undefined')&&(typeof cfg[activeSlideNum+1].slideshow.speed!='undefined')){time=cfg[activeSlideNum+1].slideshow.speed}return time},start:function(delay){var remaining=delay||this.speed()*1000;intervalStartTime=new Date();interval[uid]=setTimeout(function(){activeSlideNum++;if(activeSlideNum==slides.length)activeSlideNum=0;$this.slideshow.changeTo(activeSlideNum,false)},remaining)},pause:function(){clearInterval(interval[uid]);intervalStopTime=new Date},resume:function(){var now;if(typeof intervalStopTime!=='undefined')now=intervalStopTime.getTime();var before;if(typeof intervalStartTime!=='undefined')before=intervalStartTime.getTime();var baseTimeout=(this.speed()*1000);var remaining=baseTimeout-(now-before);if(remaining<=baseTimeout)this.start(remaining)}};$this.navigation={generate:function(){var self=this;if(cfg.navigation){var container=$('<div class="unoslider_navigation_container"></div>').css({'z-index':4}).appendTo($this[0]);if(cfg.slideshow){var play=$('<a title="'+cfg.navigation.play+'" class="unoslider_play unoslider_navigation">'+cfg.navigation.play+'</a>').appendTo(container);var stop=$('<a title="'+cfg.navigation.stop+'" class="unoslider_pause unoslider_navigation">'+cfg.navigation.stop+'</a>').appendTo(container);if(stoped){stop.addClass("unoslider_hide").hide()}else{play.addClass("unoslider_hide").hide()}}$('<a title="'+cfg.navigation.prev+'" class="unoslider_left unoslider_navigation">'+cfg.navigation.prev+'</a>').appendTo(container);$('<a title="'+cfg.navigation.next+'" class="unoslider_right unoslider_navigation">'+cfg.navigation.next+'</a>').appendTo(container);$this.find('.unoslider_right').click(function(){if(running===false){$this.slideshow.next()}});$this.find('.unoslider_left').click(function(){if(running===false){$this.slideshow.prev()}});$this.find('.unoslider_pause').click(function(){if(!stoped){stoped=true;self.changeState('stop');$this.slideshow.stop()}});$this.find('.unoslider_play').click(function(){if(stoped){self.changeState('play');stoped=false;force=true;$this.slideshow.start()}});$(".unoslider_navigation").css({'z-index':5,position:'absolute'})}self.autohide()},autohide:function(){var selector='';if(cfg.indicator.autohide){selector+='.unoslider_indicator,'}if(cfg.navigation.autohide){var timer;if(cfg.navigation.autohide!==true){var items=cfg.navigation.autohide;for(var i=0;i<items.length;i++){selector+=('.unoslider_'+items[i]+',')}}else{selector+='.unoslider_navigation'}}var container=$this.find(selector);container.each(function(){$(this).hide()});$this.hover(function(){if(timer){clearTimeout(timer);timer=null}timer=setTimeout(function(){container.not('.unoslider_hide').fadeIn()},200)},function(){if(timer){clearTimeout(timer);timer=null}timer=setTimeout(function(){container.not('.unoslider_hide').fadeOut()},200)})},changeState:function(state){if(state=='stop'){$this.find('.unoslider_play').removeClass('unoslider_hide').show();$this.find('.unoslider_pause').addClass("unoslider_hide").hide()}else if(state=='play'){$this.find('.unoslider_play').addClass("unoslider_hide").hide();$this.find('.unoslider_pause').removeClass('unoslider_hide').show()}},indicator:function(){var appendTo=cfg.indicator.position||$this[0];var activeClass='unoslider_indicator_active';controls=$('<div class="unoslider_indicator"></div>').css({'z-index':6});!cfg.indicator.position?controls.appendTo(appendTo):controls.insertAfter(appendTo);slides.each(function(slide){$('<a title="'+(slide+1)+'" class="'+activeClass+'">'+(slide+1)+'</a>').appendTo(controls).bind("click",function(){if(running===false)$this.slideshow.changeTo(slide,true)});activeClass=""})}};$this.slideshow={pauseOnHover:function(){var timebar=$this.find('.unoslider_timer');$this.hover(function(){if(running===false&&!stoped){$this.timebar.pause();$this.timer.pause()}},function(){if(running===false&&!stoped){$this.timebar.resume();$this.timer.resume()}})},start:function(){$('.unoslider_preloader').remove();stoped=false;if(cfg.slideshow){if(!cfg.slideshow.infinite&&!force&&activeSlideNum==(slides.length-1)){$this.slideshow.stop();$this.navigation.changeState('stop')}else{$this.timebar.start();$this.timer.start(null);force=false}}},stop:function(){stoped=true;clearTimeout(interval[uid]);$this.timebar.stop()},restart:function(){clearTimeout(interval[uid]);this.start()},changeTo:function(changeTo,handChange){if(changeTo!=activeSlideNum){activeSlideNum=changeTo}if(handChange===true){var tmp=stoped?stoped=true:stoped=false;$this.slideshow.stop();stoped=tmp?true:false;if(!cfg.slideshow.continuous){stoped=true;$this.navigation.changeState('stop')}}var currentSlide=slides.filter(".unoslider_active");var nextSlide=slides.filter(":eq("+activeSlideNum+")");$this.main.setTransition(currentSlide,nextSlide,handChange);if(cfg.indicator!==false){controls.find(".unoslider_indicator_active").removeClass("unoslider_indicator_active");controls.find("a:eq("+activeSlideNum+")").addClass("unoslider_indicator_active")}},next:function(){var next=(activeSlideNum+1==slides.length)?0:activeSlideNum+1;this.changeTo(next,true)},prev:function(){var prev=(activeSlideNum===0)?slides.length-1:activeSlideNum-1;this.changeTo(prev,true)},switchSlides:function(currentSlide,nextSlide){currentSlide.css({display:'none','z-index':0,position:'relative',opacity:0}).removeClass('unoslider_active');nextSlide.css({display:'block',opacity:1,position:'relative','z-index':1}).addClass('unoslider_active')}};$this.tooltip={height:0,generate:function(){if(cfg.tooltip){var caption;var img;$this.find('.unoslider_caption').removeClass('unoslider_caption').addClass('unoslider_caption_data').hide();slides.each(function(){img=$(this).find('img');if(img.length>=1){caption=img.attr('title');if(typeof caption!=='undefined'){img.removeAttr('title');$('<div class="unoslider_caption_data">'+caption+'</div>').appendTo(this).hide()}}});$('<div class="unoslider_caption"></div>').hide().css({'z-index':5}).appendTo($this)}else{$this.find('.unoslider_caption').remove()}this.height=$this.find('.unoslider_caption').height()},show:function(slide){var html=$(slide).find('.unoslider_caption_data').html();if(html)$this.find('.unoslider_caption').html(html).fadeIn()},hide:function(){$this.find('.unoslider_caption').fadeOut()}};$this.preset={init:function(){if(cfg.preset in $this.preset){$this.preset[cfg.preset]()}else{alert('There is no preset named "'+cfg.preset+'"')}},autosize:function(){var ratio=$this.width()/$this.height();var vertical=Math.round(ratio*ratio*(ratio/2));var horizontal=Math.round(ratio*(ratio/2));vertical=(typeof options==='object'&&typeof options.block!=='undefined'&&typeof options.block['vertical']!=='undefined')?options.block['vertical']:preset_base_cfg.block['vertical'];horizontal=(typeof options==='object'&&typeof options.block!=='undefined'&&typeof options.block['horizontal']!=='undefined')?options.block['horizontal']:preset_base_cfg.block['horizontal'];var ret={};ret['vertical']=vertical;ret['horizontal']=horizontal;return ret},chess:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:300,delay:300,transition:'swap',variation:'bottom',pattern:'chess'}},flash:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:30,transition:'flash',pattern:'random'}},spiral_reversed:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:350,delay:30,transition:'shrink',variation:'bottomright',pattern:'spiral',direction:'bottomright'}},spiral:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:350,delay:30,transition:'shrink',variation:'topleft',pattern:'spiral',direction:'topleft'}},sq_appear:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:50,transition:'appear',variation:'topleft',pattern:'diagonal',direction:'topleft'}},sq_flyoff:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:400,delay:100,transition:'drop',variation:'bottomright',pattern:'diagonal',direction:'topleft'}},sq_drop:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:600,delay:150,transition:'drop',variation:'topleft',pattern:'diagonal',direction:'topleft'}},explode:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:50,transition:'stretch',variation:'center',pattern:'explode',direction:'center'}},implode:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:50,transition:'squeeze',variation:'center',pattern:'implode',direction:'center'}},sq_squeeze:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:600,delay:100,transition:'squeeze',variation:'center',pattern:'horizontal',direction:'top'}},sq_random:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:20,transition:'grow',variation:'topleft',pattern:'random'}},sq_diagonal_rev:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:50,transition:'grow',variation:'bottomright',pattern:'diagonal',direction:'bottomright'}},sq_diagonal:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:500,delay:50,transition:'grow',variation:'topleft',pattern:'diagonal',direction:'topleft'}},sq_fade_random:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:600,delay:20,transition:'fade',pattern:'random'}},sq_fade_diagonal_rev:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:600,delay:100,transition:'fade',pattern:'diagonal',direction:'bottomright'}},sq_fade_diagonal:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:block['horizontal']};cfg.animation={speed:600,delay:100,transition:'fade',pattern:'diagonal',direction:'topleft'}},fountain:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:100,transition:'slide_in',variation:'bottom',pattern:'explode',direction:'center'}},blind_bottom:function(){var block=this.autosize();cfg.block={vertical:1,horizontal:block['horizontal']};cfg.animation={speed:800,delay:80,transition:'swap',variation:'top',pattern:'horizontal',direction:'bottom'}},blind_top:function(){var block=this.autosize();cfg.block={vertical:1,horizontal:block['horizontal']};cfg.animation={speed:800,delay:80,transition:'swap',variation:'bottom',pattern:'horizontal',direction:'top'}},blind_right:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:800,delay:80,transition:'swap',variation:'right',pattern:'horizontal',direction:'topright'}},blind_left:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:800,delay:80,transition:'swap',variation:'right',pattern:'horizontal',direction:'topleft'}},shot_right:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:50,transition:'stretch',variation:'horizontal',pattern:'horizontal',direction:'topright'}},shot_left:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:50,transition:'stretch',variation:'horizontal',pattern:'horizontal',direction:'topleft'}},alternate_vertical:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:800,delay:0,transition:'slide_in',variation:'alternate_vertical',pattern:'vertical',direction:'topleft'}},alternate_horizontal:function(){var block=this.autosize();cfg.block={vertical:1,horizontal:block['horizontal']};cfg.animation={speed:800,delay:0,transition:'slide_in',variation:'alternate_horizontal',pattern:'horizontal',direction:'topleft'}},zipper_right:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:80,transition:'slide_in',variation:'alternate_vertical',pattern:'horizontal',direction:'topright'}},zipper_left:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:80,transition:'slide_in',variation:'alternate_vertical',pattern:'horizontal',direction:'topleft'}},bar_slide_random:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:70,transition:'slide_in',pattern:'random'}},bar_slide_bottomright:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:70,transition:'slide_in',variation:'bottom',pattern:'horizontal',direction:'bottomright'}},bar_slide_bottomleft:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:70,transition:'slide_in',variation:'bottom',pattern:'horizontal',direction:'bottomleft'}},bar_slide_topright:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:70,transition:'slide_in',variation:'top',pattern:'horizontal',direction:'topright'}},bar_slide_topleft:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:70,transition:'slide_in',variation:'top',pattern:'horizontal',direction:'topleft'}},bar_fade_bottom:function(){var block=this.autosize();cfg.block={vertical:1,horizontal:block['horizontal']};cfg.animation={speed:500,delay:100,transition:'fade',pattern:'horizontal',direction:'bottom'}},bar_fade_top:function(){var block=this.autosize();cfg.block={vertical:1,horizontal:block['horizontal']};cfg.animation={speed:500,delay:100,transition:'fade',pattern:'horizontal',direction:'top'}},bar_fade_right:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:50,transition:'fade',pattern:'horizontal',direction:'topright'}},bar_fade_left:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:50,transition:'fade',pattern:'horizontal',direction:'topleft'}},bar_fade_random:function(){var block=this.autosize();cfg.block={vertical:block['vertical'],horizontal:1};cfg.animation={speed:500,delay:50,transition:'fade',pattern:'random'}},v_slide_top:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:500,delay:0,transition:'slide_in',variation:'top',pattern:'horizontal',direction:'topleft'}},h_slide_right:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:500,delay:0,transition:'slide_in',variation:'right',pattern:'horizontal',direction:'topleft'}},v_slide_bottom:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:500,delay:0,transition:'slide_in',variation:'bottom',pattern:'horizontal',direction:'topleft'}},h_slide_left:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:500,delay:0,transition:'slide_in',variation:'left',pattern:'horizontal',direction:'topleft'}},stretch:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:800,delay:0,transition:'stretch',variation:'horizontal',pattern:'horizontal',direction:'topleft'}},squeez:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:800,delay:0,transition:'squeeze',variation:'horizontal',pattern:'horizontal',direction:'topleft'}},fade:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:700,delay:0,transition:'fade',pattern:'horizontal',direction:'topleft'}},none:function(){cfg.block={vertical:1,horizontal:1};cfg.animation={speed:0,delay:0,transition:'fade',pattern:'horizontal',direction:'topleft'}}};$this.transition={speed:function(){var speed=cfg.animation.speed;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.speed!='undefined')){speed=cfg[activeSlideNum+1].animation.speed}return speed},animation:function(direction,animate,duration){var row=1;var col=1;var item=0;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));$this.find("#block_"+item).delay(direction['zpozdeni'][item]).animate(animate,{duration:duration});col++}row++;col=1}},base_animation:function(css,animate,delayed,direction,currentSlide,nextSlide,handChange){var duration=this.speed();$this.find('.unoslider_cube').css(css);this.animation(direction,animate,duration);$this.main.execute(direction,duration,currentSlide,nextSlide,handChange,delayed)},move_animation:function(css,animate,direction,opacity,currentSlide,nextSlide,handChange){var duration=this.speed();$this.find('.unoslider_cube').css({display:'block',opacity:opacity});$this.find('.unoslider_blocks').css(css);this.animation(direction,animate,duration);$this.main.execute(direction,duration,currentSlide,nextSlide,handChange,true)},drop_animation:function(animate,direction,currentSlide,nextSlide,handChange){var duration=this.speed();$this.find('.unoslider_cube').css({display:'block',opacity:1});this.animation(direction,animate,duration);$this.main.execute(direction,duration,currentSlide,nextSlide,handChange,false)},alternate_animation:function(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,delayed){var duration=this.speed();var row=1;var col=1;var item=0;$this.find('.unoslider_cube:even').css(css_even);$this.find('.unoslider_cube:odd').css(css_odd);while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));$this.find("#block_"+item).delay(direction['zpozdeni'][item]).animate(item%2==1?animate_even:animate_odd,{duration:duration});col++}row++;col=1}$this.main.execute(direction,duration,currentSlide,nextSlide,handChange,delayed)},fade:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block',width:block.width,height:block.height};var animate={opacity:0};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},flash:function(currentSlide,nextSlide,handChange){var duration=this.speed();var row=1;var col=1;var item=0;var selector;var direction=$this.main.prepare(currentSlide);var color='white';if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.color!='undefined')){color=cfg[activeSlideNum+1].animation.color}else if((typeof cfg!='undefined')&&(typeof cfg.animation!='undefined')&&(typeof cfg.animation.color!='undefined')){color=cfg.animation.color}$this.find('.unoslider_cube').css({display:'block',backgroundColor:color});while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).delay(direction['zpozdeni'][item]).animate({opacity:0},{duration:duration});$this.find(selector).children().delay(direction['zpozdeni'][item]).animate({opacity:0},{duration:0});col++}row++;col=1}$this.main.execute(direction,duration,currentSlide,nextSlide,handChange,false)},appear_topleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:''+(block.height*2)+'px',left:''+(block.height*2)+'px'};var animate={top:'-='+(block.height*2)+'px',left:'-='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_topright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:''+(block.height*2)+'px',left:'-'+(block.height*2)+'px'};var animate={top:'-='+(block.height*2)+'px',left:'+='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_bottomleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:'-'+(block.height*2)+'px',left:''+(block.height*2)+'px'};var animate={top:'+='+(block.height*2)+'px',left:'-='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_bottomright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:'-'+(block.height*2)+'px',left:'-'+(block.height*2)+'px'};var animate={top:'+='+(block.height*2)+'px',left:'+='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_top:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:'-'+(block.height*2)+'px'};var animate={top:'+='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_right:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={left:'+'+(block.width/2)+'px'};var animate={left:'-='+(block.width/2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_bottom:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:'+'+(block.height*2)+'px'};var animate={top:'-='+(block.height*2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_left:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={left:'-'+(block.width/2)+'px'};var animate={left:'+='+(block.width/2)+'px',opacity:1};this.move_animation(css,animate,direction,0,currentSlide,nextSlide,handChange)},appear_alternate_vertical:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var animate_odd={top:'-='+(block.height*2)+'px',opacity:1};var animate_even={top:'+='+(block.height*2)+'px',opacity:1};var css_even={display:'block',top:'-='+(block.height*2)+'px',opacity:0};var css_odd={display:'block',top:'+='+(block.height*2)+'px',opacity:0};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,true)},appear_alternate_horizontal:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var animate_odd={left:'+='+(block.width*2)+'px',opacity:1};var animate_even={left:'-='+(block.width*2)+'px',opacity:1};var css_even={display:'block',left:'+='+(block.width*2)+'px',opacity:0};var css_odd={display:'block',left:'-='+(block.width*2)+'px',opacity:0};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,true)},drop_topleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate={top:'+='+(block.height*2)+'px',left:'+='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_topright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;var t=1;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)-col});col++}t++;row++;col=1}var animate={top:'+='+(block.height*2)+'px',left:'-='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_bottomleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)+col});col++}t--;row++;col=1}var animate={top:'-='+(block.height*2)+'px',left:'+='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_bottomright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t+columns)-col});col++}t--;row++;col=1}var animate={top:'-='+(block.height*2)+'px',left:'-='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_top:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate={top:'+='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_right:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(columns*rows)-col});col++}row++;col=1}var animate={left:'-='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_bottom:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)+col});col++}t--;row++;col=1}var animate={top:'-='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_left:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate={left:'+='+(block.height*2)+'px',opacity:0};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},drop_alternate_vertical:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate_odd={top:'+='+(block.height*2)+'px',opacity:0};var css_even={display:'block'};var css_odd={display:'block'};var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)+col});col++}t--;row++;col=1}var animate_even={top:'-='+(block.height*2)+'px',opacity:0};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,false)},drop_alternate_horizontal:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate_odd={left:'+='+(block.width*2)+'px',opacity:0};var css_even={display:'block',opacity:1};var css_odd={display:'block',opacity:1};var row=1;var col=1;var item=0;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(columns*rows)-col});col++}row++;col=1}var animate_even={left:'-='+(block.width*2)+'px',opacity:0};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,false)},slide_in_bottom:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={top:'+'+(block.height*rows)+'px'};var animate={top:'-='+(block.height*rows)+'px'};this.move_animation(css,animate,direction,1,currentSlide,nextSlide,handChange)},slide_in_right:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={left:'+'+(block.width*columns)+'px'};var animate={left:'-='+(block.width*columns)+'px'};this.move_animation(css,animate,direction,1,currentSlide,nextSlide,handChange)},slide_in_top:function(currentSlide,nextSlide,handChange,type){var direction=$this.main.prepare(nextSlide);var css={top:'-'+(block.height*rows)+'px'};var animate={top:'+='+(block.height*rows)+'px'};this.move_animation(css,animate,direction,1,currentSlide,nextSlide,handChange)},slide_in_left:function(currentSlide,nextSlide,handChange,type){var direction=$this.main.prepare(nextSlide);var css={left:'-'+(block.width*columns)+'px'};var animate={left:'+='+(block.width*columns)+'px'};this.move_animation(css,animate,direction,1,currentSlide,nextSlide,handChange)},slide_in_alternate_vertical:function(currentSlide,nextSlide,handChange,type){var direction=$this.main.prepare(nextSlide);var animate_odd={top:'+='+(block.height*rows)+'px'};var animate_even={top:'-='+(block.height*rows)+'px'};var css_even={display:'block',top:'+='+(block.height*rows)+'px'};var css_odd={display:'block',top:'-='+(block.height*rows)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,true)},slide_in_alternate_horizontal:function(currentSlide,nextSlide,handChange,type){var direction=$this.main.prepare(nextSlide);var animate_odd={left:'+='+(block.width*columns)+'px'};var animate_even={left:'-='+(block.width*columns)+'px'};var css_even={display:'block',left:'+='+(block.width*columns)+'px'};var css_odd={display:'block',left:'-='+(block.width*columns)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,true)},slide_out_top:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate={top:'+='+(block.height*rows)+'px'};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},slide_out_right:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(columns*rows)-col});col++}row++;col=1}var animate={left:'-='+(block.width*columns)+'px'};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},slide_out_bottom:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)+col});col++}t--;row++;col=1}var animate={top:'-='+(block.height*rows)+'px'};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},slide_out_left:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate={left:'+='+(block.width*columns)+'px'};this.drop_animation(animate,direction,currentSlide,nextSlide,handChange)},slide_out_alternate_vertical:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate_odd={top:'+='+(block.height*rows)+'px'};var css_even={display:'block'};var css_odd={display:'block'};var row=1;var col=1;var item=0;var t=columns*rows;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(t*columns*rows)+col});col++}t--;row++;col=1}var animate_even={top:'-='+(block.height*rows)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,false)},slide_out_alternate_horizontal:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var animate_odd={left:'+='+(block.width*columns)+'px'};var css_even={display:'block'};var css_odd={display:'block'};var row=1;var col=1;var item=0;while(row<=rows){while(col<=columns){item=(columns*row-(columns-col));selector="#block_"+item;$this.find(selector).css({'z-index':(columns*rows)-col});col++}row++;col=1}var animate_even={left:'-='+(block.width*columns)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,false)},grow_topleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0,height:0};var animate={width:block.width,height:block.height};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},grow_topright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0,height:0,left:'+='+(block.width)+'px'};var animate={width:block.width,height:block.height,left:'-='+(block.width)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},grow_bottomleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0,height:0,top:'+='+(block.height)+'px'};var animate={width:block.width,height:block.height,top:'-='+(block.height)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},grow_bottomright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0,height:0,top:'+='+(block.height)+'px',left:'+='+(block.width)+'px'};var animate={width:block.width,height:block.height,top:'-='+(block.height)+'px',left:'-='+(block.width)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},shrink_topleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,width:0};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},shrink_topright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,width:0,left:'+='+(block.width)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},shrink_bottomleft:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,width:0,top:'+='+(block.height)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},shrink_bottomright:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,width:0,top:'+='+(block.height)+'px',left:'+='+(block.width)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},squeeze_center:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,width:0,top:'+='+(block.height/2)+'px',left:'+='+(block.width/2)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},squeeze_vertical:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={width:0,left:'+='+(block.width/2)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},squeeze_horizontal:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0,top:'+='+(block.height/2)+'px'};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},squeeze_alternate:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css_odd={display:'block'};var animate_odd={width:0,left:'+='+(block.width/2)+'px'};var css_even={display:'block'};var animate_even={height:0,top:'+='+(block.height/2)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,false)},stretch_vertical:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0,left:'+='+(block.width/2)+'px'};var animate={width:block.width,left:'-='+(block.width/2)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},stretch_horizontal:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',height:0,top:'+='+(block.height/2)+'px'};var animate={height:block.height,top:'-='+(block.height/2)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},stretch_center:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',height:0,width:0,top:'+='+(block.height/2)+'px',left:'+='+(block.width/2)+'px'};var animate={height:block.height,width:block.width,top:'-='+(block.height/2)+'px',left:'-='+(block.width/2)+'px'};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},stretch_alternate:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css_odd={display:'block',height:0,top:'+='+(block.height/2)+'px'};var animate_odd={height:block.height,top:'-='+(block.height/2)+'px'};var css_even={display:'block',width:0,left:'+='+(block.width/2)+'px'};var animate_even={width:block.width,left:'-='+(block.width/2)+'px'};this.alternate_animation(css_even,css_odd,animate_even,animate_odd,direction,currentSlide,nextSlide,handChange,true)},swap_bottom:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',height:0};var animate={height:block.height};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},swap_top:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={height:0};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)},swap_right:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(nextSlide);var css={display:'block',width:0};var animate={width:block.width};this.base_animation(css,animate,true,direction,currentSlide,nextSlide,handChange)},swap_left:function(currentSlide,nextSlide,handChange){var direction=$this.main.prepare(currentSlide);var css={display:'block'};var animate={width:0};this.base_animation(css,animate,false,direction,currentSlide,nextSlide,handChange)}};$this.direction={delay:function(){var delay=cfg.animation.delay;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.delay!='undefined')){delay=cfg[activeSlideNum+1].animation.delay}return delay},direction:function(){var direction=cfg.animation.direction;if((typeof cfg[activeSlideNum+1]!='undefined')&&(typeof cfg[activeSlideNum+1].animation!='undefined')&&(typeof cfg[activeSlideNum+1].animation.direction!='undefined')){direction=cfg[activeSlideNum+1].animation.direction}return direction},horizontal_top:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*row;delays[item]=delay;column++}row++;column=1}result['celkem']=delay;result['zpozdeni']=delays;return result},horizontal_bottom:function(){var top=$this.direction.horizontal_top();top['zpozdeni'][top['zpozdeni'].length]=0;top['zpozdeni'].reverse();return top},horizontal_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*item;delays[item]=delay;column++}row++;column=1}result['celkem']=delay;result['zpozdeni']=delays;return result},horizontal_topright:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var t=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));t=column-1;delay=blockDelay*columns*row-(t*blockDelay);delays[item]=delay;column++}row++;column=1}var max=item*blockDelay;result['celkem']=max;result['zpozdeni']=delays;return result},horizontal_bottomleft:function(){var topRight=$this.direction.horizontal_topright();topRight['zpozdeni'][topRight['zpozdeni'].length]=0;topRight['zpozdeni'].reverse();return topRight},horizontal_bottomright:function(){var topLeft=$this.direction.horizontal_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},vertical_left:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){while(column<=columns){delay=(blockDelay*column);item=(columns*row-(columns-column));delays[item]=delay;column++}row++;column=1}result['celkem']=delay;result['zpozdeni']=delays;return result},vertical_right:function(){var left=$this.direction.vertical_left();left['zpozdeni'][left['zpozdeni'].length]=0;left['zpozdeni'].reverse();return left},vertical_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){delay=(blockDelay*row);while(column<=columns){item=(columns*row-(columns-column));delays[item]=delay;delay+=rows*blockDelay;column++}row++;column=1}var max=item*blockDelay;result['celkem']=max;result['zpozdeni']=delays;return result},vertical_topright:function(){var bottomLeft=$this.direction.vertical_bottomleft();bottomLeft['zpozdeni'][bottomLeft['zpozdeni'].length]=0;bottomLeft['zpozdeni'].reverse();return bottomLeft},vertical_bottomleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var t=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));t=row-1;delay=blockDelay*rows*column-(t*blockDelay);delays[item]=delay;column++}row++;column=1}var max=item*blockDelay;result['celkem']=max;result['zpozdeni']=delays;return result},vertical_bottomright:function(){var topLeft=$this.direction.vertical_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},diagonal_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){var x=row;while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*x;delays[item]=delay;column++;x++}row++;column=1}result['celkem']=delay;result['zpozdeni']=delays;return result},diagonal_topright:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var max=0;while(row<=rows){var x=columns+(row-1);while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*x;delays[item]=delay;if(delay>max){max=delay}column++;x--}row++;column=1}result['celkem']=max;result['zpozdeni']=delays;return result},diagonal_bottomright:function(){var topLeft=$this.direction.diagonal_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},diagonal_bottomleft:function(){var topRight=$this.direction.diagonal_topright();topRight['zpozdeni'][topRight['zpozdeni'].length]=0;topRight['zpozdeni'].reverse();return topRight},random:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var tmp;var random=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*item;delays[item]=delay;column++}row++;column=1}if(item){while(--item){random=Math.floor(Math.random()*(item+1));tmp=delays[random];delays[random]=delays[item];delays[item]=tmp}}result['celkem']=delay;result['zpozdeni']=delays;return result},spiral_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var i,j,c,r;var l=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*item;delays[item]=delay;column++}row++;column=1}var output_array=[rows.length];for(i=0;i<rows;i++){output_array[i]=[columns.length];for(j=0;j<columns;j++){output_array[i][j]=j}}for(i=0,c=columns-1,r=rows-1;c>=0&&r>=0;i++,c--,r--){for(j=i;j<=c;j++){if(l==rows*columns)break;output_array[i][j]=delays[l++]}for(j=i+1;j<=r;j++){if(l==rows*columns)break;output_array[j][c]=delays[l++]}for(j=c-1;j>=i;j--){if(l==rows*columns)break;output_array[r][j]=delays[l++]}for(j=r-1;j>i;j--){if(l==rows*columns)break;output_array[j][i]=delays[l++]}}for(i=0;i<rows;i++){for(j=0;j<columns;j++){item=(columns*(i+1)-(columns-(j+1)));delays[item]=output_array[i][j]}}result['celkem']=delay;result['zpozdeni']=delays;return result},spiral_topright:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var i,j,c,r;var l=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));delay=blockDelay*item;delays[item]=delay;column++}row++;column=1}var output_array=[rows.length];for(i=0;i<rows;i++){output_array[i]=[columns.length];for(j=0;j<columns;j++){output_array[i][j]=j}}for(i=0,c=columns-1,r=rows-1;c>=0&&r>=0;i++,c--,r--){for(j=i;j<=c;j++){if(l==rows*columns)break;output_array[i][j]=delays[l++]}for(j=i+1;j<=r;j++){if(l==rows*columns)break;output_array[j][c]=delays[l++]}for(j=c-1;j>=i;j--){if(l==rows*columns)break;output_array[r][j]=delays[l++]}for(j=r-1;j>i;j--){if(l==rows*columns)break;output_array[j][i]=delays[l++]}}for(i=0;i<output_array.length;i++){output_array[i].reverse()}for(i=0;i<rows;i++){for(j=0;j<columns;j++){item=(columns*(i+1)-(columns-(j+1)));delays[item]=output_array[i][j]}}result['celkem']=delay;result['zpozdeni']=delays;return result},spiral_bottomleft:function(){var topRight=$this.direction.spiral_topright();topRight['zpozdeni'][topRight['zpozdeni'].length]=0;topRight['zpozdeni'].reverse();return topRight},spiral_bottomright:function(){var topLeft=$this.direction.spiral_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},horizontal_zigzag_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var multiplier=0;var max=0;var i=1;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));if(i%2===0){multiplier=(columns*row-column)+1}else{multiplier=item}delay=blockDelay*multiplier;if(delay>max){max=delay}delays[item]=delay;column++}i++;row++;column=1}result['celkem']=max;result['zpozdeni']=delays;return result},horizontal_zigzag_topright:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var multiplier=0;var max=0;var i=1;var tmp=[];while(row<=rows){delays=[];while(column<=columns){item=(columns*row-(columns-column));if(i%2===0){multiplier=(columns*row-column)+1}else{multiplier=item}delay=blockDelay*multiplier;if(delay>max)max=delay;delays[column]=delay;column++}tmp[row]=delays.reverse();i++;row++;column=1}var ret=[];var x=1;for(i=1;i<=rows;i++){for(var j=0;j<columns;j++){ret[x]=tmp[i][j];x++}}result['celkem']=max;result['zpozdeni']=ret;return result},horizontal_zigzag_bottomright:function(){var topLeft=$this.direction.horizontal_zigzag_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},horizontal_zigzag_bottomleft:function(){var topRight=$this.direction.horizontal_zigzag_topright();topRight['zpozdeni'][topRight['zpozdeni'].length]=0;topRight['zpozdeni'].reverse();return topRight},vertical_zigzag_topleft:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){delay=(blockDelay*row);while(column<=columns){item=(columns*row-(columns-column));delays[item]=delay;if(column%2===0){delay+=(row+(row-1))*blockDelay}else{delay+=(rows-(row-1)+rows-(row))*blockDelay}column++}row++;column=1}var max=item*blockDelay;result['celkem']=max;result['zpozdeni']=delays;return result},vertical_zigzag_topright:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];var tmp=[];while(row<=rows){delay=(blockDelay*row);delays=[];while(column<=columns){item=(columns*row-(columns-column));delays[column]=delay;if(column%2===0){delay+=(row+(row-1))*blockDelay}else{delay+=(rows-(row-1)+rows-(row))*blockDelay}column++}tmp[row]=delays.reverse();row++;column=1}var ret=[];var x=1;for(i=1;i<=rows;i++){for(var j=0;j<columns;j++){ret[x]=tmp[i][j];x++}}var max=item*blockDelay;result['celkem']=max;result['zpozdeni']=ret;return result},vertical_zigzag_bottomright:function(){var topLeft=$this.direction.vertical_zigzag_topleft();topLeft['zpozdeni'][topLeft['zpozdeni'].length]=0;topLeft['zpozdeni'].reverse();return topLeft},vertical_zigzag_bottomleft:function(){var topRight=$this.direction.vertical_zigzag_topright();topRight['zpozdeni'][topRight['zpozdeni'].length]=0;topRight['zpozdeni'].reverse();return topRight},chess:function(){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[0];var result=[];var mutator=0;while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));if(columns%2==1){if(item%2==1)delay=blockDelay;else delay=blockDelay*2}else{if(((item+mutator)%2)==1)delay=blockDelay;else delay=blockDelay*2}delays[item]=delay;column++}mutator++;row++;column=1}result['celkem']=blockDelay*2;result['zpozdeni']=delays;return result},explode:function(center_column,center_row,index){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));if(row<=center_row){if(column<=center_column)delay=blockDelay*(((center_column-column)+1)+(center_row-row));else delay=blockDelay*(((column-center_column)+1)+(center_row-row))}else{if(column<=center_column)delay=blockDelay*(((center_column-column)+1)+(row-center_row));else delay=blockDelay*(((column-center_column)+1)+(row-center_row))}delays[item]=delay;column++}row++;column=1}result['celkem']=(typeof index!=='undefined')?delays[index]:delay;result['zpozdeni']=delays;return result},explode_center:function(){var center_column=Math.round(columns/2);var center_row=Math.round(rows/2);return this.explode(center_column,center_row)},explode_left:function(){var center_column=1;var center_row=Math.round(rows/2);return this.explode(center_column,center_row)},explode_right:function(){var center_column=columns;var center_row=Math.round(rows/2);return this.explode(center_column,center_row,1)},explode_top:function(){var center_column=Math.round(columns/2);var center_row=1;return this.explode(center_column,center_row)},explode_bottom:function(){var center_column=Math.round(columns/2);var center_row=rows;return this.explode(center_column,center_row,1)},implode:function(center_column,center_row){var blockDelay=this.delay();var row=1;var column=1;var item=0;var delay=0;var delays=[];var result=[];while(row<=rows){while(column<=columns){item=(columns*row-(columns-column));if(center_row!=1&&row<=center_row){if(center_column!=1&&column<=center_column)delay=blockDelay*((row+column)-1);else delay=blockDelay*((row+(columns-column)))}else{if(center_column!=1&&column<=center_column)delay=blockDelay*((((rows-row)+1)+column)-1);else delay=blockDelay*((((rows-row)+1)+(columns-column)))}delays[item]=delay;column++}row++;column=1}result['zpozdeni']=delays;delays.splice(0,1);result['celkem']=Math.max.apply(Math,delays);delays.unshift(undefined);return result},implode_center:function(){var center_column=Math.round(columns/2);var center_row=Math.round(rows/2);return this.implode(center_column,center_row)},implode_left:function(){var center_column=columns;var center_row=Math.round(rows/2);return this.implode(center_column,center_row)},implode_right:function(){var center_column=1;var center_row=Math.round(rows/2);return this.implode(center_column,center_row)},implode_top:function(){var center_column=Math.round(columns/2);var center_row=rows;return this.implode(center_column,center_row)},implode_bottom:function(){var center_column=Math.round(columns/2);var center_row=1;return this.implode(center_column,center_row)}};$this.preloader={init:function(callback){var images=$this.find('img');var imagesCount=images.length;slides.children().each(function(){var bg=$(this).css("background-image");if(bg!=='none'){var bgImage=new Image;bgImage.src=bg.replace(/"/g,"").replace(/url\(|\)$/ig,"");images.push(bgImage)}});if(images.length>0){$('<div class="unoslider_preloader"></div>').css({position:'absolute',textAlign:'center',width:'100%'}).prependTo($this);if(cfg.responsive)$this.main.responsive();images.each(function(){var img=new Image;var $thisImg=$(this);img.src=this.src;if(!img.complete){$(img).bind("load error",function(){$this.preloader.show($thisImg,callback,imagesCount)})}else{$this.preloader.show($thisImg,callback,imagesCount)}})}else{$(lists[0]).css("display","block").animate({opacity:1},500);if($.isFunction(callback)){callback.call()}}},show:function(img,callback,imagesCount){loaded++;var loader=$this.find('.unoslider_preloader');if(loaded==imagesCount){$(lists[0]).css("display","block").animate({opacity:1},500,function(){loader.remove()});if($.isFunction(callback)){callback.call()}}switch(cfg.preloader){case'spinner':$(loader).empty();$('<div class="unoslider_spinner"></div>').css({width:'100%',height:'100%'}).appendTo(loader);break;default:$(loader).empty();var progress=$('<span></span>').css({width:(loaded/imagesCount*100).toFixed(0)+'%'});$(loader).css({'padding-top':$this.height()/2+'px',height:'50%'});$('<div class="unoslider_progress"></div>').appendTo(loader).append(progress);break}}};$this.main.init();this.stop=function(){stoped=true;$this.navigation.changeState('stop');$this.slideshow.stop()};this.play=function(){if(stoped){$this.navigation.changeState('play');$this.slideshow.start();stoped=false}};this.next=function(){if(running===false)$this.slideshow.next()};this.prev=function(){if(running===false)$this.slideshow.prev()};this.goto=function(num){if(running===false){if(num>slides.size()){alert("You can't go to slide number "+num+", slider contains only "+slides.size()+" slides")}else{$this.slideshow.changeTo(num-1,true)}}};this.cfg=function(config){$.extend(true,cfg,config)}};$.fn.unoslider=function(options){return(new $.UnoSlider(options,$(this)))};$.UnoSlider.defaults={}})(jQuery);




/*
=============================================== 06. FitVids 1.0   ===============================================
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/
/*global jQuery */
/*! 
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    }
    
    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
        
  	div.className = 'fit-vids-style';
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';
                      
    ref.parentNode.insertBefore(div,ref);
    
    if ( options ) { 
      $.extend( settings, options );
    }
    
    return this.each(function(){
      var selectors = [
        "iframe[src^='http://player.vimeo.com']", 
        "iframe[src^='http://www.youtube.com']", 
        "iframe[src^='http://www.kickstarter.com']", 
        "object", 
        "embed"
      ];
      
      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }
      
      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() == 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; } 
        var height = this.tagName.toLowerCase() == 'object' ? $this.attr('height') : $this.height(),
            aspectRatio = height / $this.width();
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  
  }
})( jQuery );



/*
=============================================== 07. jQuery Validation Plugin 1.8.1   ===============================================
* http://bassistance.de/jquery-plugins/jquery-plugin-validation/
* http://docs.jquery.com/Plugins/Validation
*
* Copyright (c) 2006 - 2011 Jörn Zaefferer
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html

*/

(function(c){c.extend(c.fn,{validate:function(a){if(this.length){var b=c.data(this[0],"validator");if(b)return b;b=new c.validator(a,this[0]);c.data(this[0],"validator",b);if(b.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){b.cancelSubmit=true});b.settings.submitHandler&&this.find("input, button").filter(":submit").click(function(){b.submitButton=this});this.submit(function(d){function e(){if(b.settings.submitHandler){if(b.submitButton)var f=c("<input type='hidden'/>").attr("name",
b.submitButton.name).val(b.submitButton.value).appendTo(b.currentForm);b.settings.submitHandler.call(b,b.currentForm);b.submitButton&&f.remove();return false}return true}b.settings.debug&&d.preventDefault();if(b.cancelSubmit){b.cancelSubmit=false;return e()}if(b.form()){if(b.pendingRequest){b.formSubmitted=true;return false}return e()}else{b.focusInvalid();return false}})}return b}else a&&a.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing")},valid:function(){if(c(this[0]).is("form"))return this.validate().form();
else{var a=true,b=c(this[0].form).validate();this.each(function(){a&=b.element(this)});return a}},removeAttrs:function(a){var b={},d=this;c.each(a.split(/\s/),function(e,f){b[f]=d.attr(f);d.removeAttr(f)});return b},rules:function(a,b){var d=this[0];if(a){var e=c.data(d.form,"validator").settings,f=e.rules,g=c.validator.staticRules(d);switch(a){case "add":c.extend(g,c.validator.normalizeRule(b));f[d.name]=g;if(b.messages)e.messages[d.name]=c.extend(e.messages[d.name],b.messages);break;case "remove":if(!b){delete f[d.name];
return g}var h={};c.each(b.split(/\s/),function(j,i){h[i]=g[i];delete g[i]});return h}}d=c.validator.normalizeRules(c.extend({},c.validator.metadataRules(d),c.validator.classRules(d),c.validator.attributeRules(d),c.validator.staticRules(d)),d);if(d.required){e=d.required;delete d.required;d=c.extend({required:e},d)}return d}});c.extend(c.expr[":"],{blank:function(a){return!c.trim(""+a.value)},filled:function(a){return!!c.trim(""+a.value)},unchecked:function(a){return!a.checked}});c.validator=function(a,
b){this.settings=c.extend(true,{},c.validator.defaults,a);this.currentForm=b;this.init()};c.validator.format=function(a,b){if(arguments.length==1)return function(){var d=c.makeArray(arguments);d.unshift(a);return c.validator.format.apply(this,d)};if(arguments.length>2&&b.constructor!=Array)b=c.makeArray(arguments).slice(1);if(b.constructor!=Array)b=[b];c.each(b,function(d,e){a=a.replace(RegExp("\\{"+d+"\\}","g"),e)});return a};c.extend(c.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",
validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:c([]),errorLabelContainer:c([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(a){this.lastActive=a;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass);this.addWrapper(this.errorsFor(a)).hide()}},onfocusout:function(a){if(!this.checkable(a)&&(a.name in this.submitted||!this.optional(a)))this.element(a)},
onkeyup:function(a){if(a.name in this.submitted||a==this.lastElement)this.element(a)},onclick:function(a){if(a.name in this.submitted)this.element(a);else a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).addClass(b).removeClass(d):c(a).addClass(b).removeClass(d)},unhighlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).removeClass(b).addClass(d):c(a).removeClass(b).addClass(d)}},setDefaults:function(a){c.extend(c.validator.defaults,
a)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:c.validator.format("Please enter no more than {0} characters."),
minlength:c.validator.format("Please enter at least {0} characters."),rangelength:c.validator.format("Please enter a value between {0} and {1} characters long."),range:c.validator.format("Please enter a value between {0} and {1}."),max:c.validator.format("Please enter a value less than or equal to {0}."),min:c.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){function a(e){var f=c.data(this[0].form,"validator");e="on"+e.type.replace(/^validate/,
"");f.settings[e]&&f.settings[e].call(f,this[0])}this.labelContainer=c(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||c(this.currentForm);this.containers=c(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=this.groups={};c.each(this.settings.groups,function(e,f){c.each(f.split(/\s/),function(g,h){b[h]=e})});var d=this.settings.rules;
c.each(d,function(e,f){d[e]=c.validator.normalizeRule(f)});c(this.currentForm).validateDelegate(":text, :password, :file, select, textarea","focusin focusout keyup",a).validateDelegate(":radio, :checkbox, select, option","click",a);this.settings.invalidHandler&&c(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){this.checkForm();c.extend(this.submitted,this.errorMap);this.invalid=c.extend({},this.errorMap);this.valid()||c(this.currentForm).triggerHandler("invalid-form",
[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(a){this.lastElement=a=this.clean(a);this.prepareElement(a);this.currentElements=c(a);var b=this.check(a);if(b)delete this.invalid[a.name];else this.invalid[a.name]=true;if(!this.numberOfInvalids())this.toHide=this.toHide.add(this.containers);this.showErrors();return b},showErrors:function(a){if(a){c.extend(this.errorMap,
a);this.errorList=[];for(var b in a)this.errorList.push({message:a[b],element:this.findByName(b)[0]});this.successList=c.grep(this.successList,function(d){return!(d.name in a)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){c.fn.resetForm&&c(this.currentForm).resetForm();this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},
objectLength:function(a){var b=0,d;for(d in a)b++;return b},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{c(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(a){}},findLastActive:function(){var a=this.lastActive;return a&&c.grep(this.errorList,function(b){return b.element.name==
a.name}).length==1&&a},elements:function(){var a=this,b={};return c(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&a.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in b||!a.objectLength(c(this).rules()))return false;return b[this.name]=true})},clean:function(a){return c(a)[0]},errors:function(){return c(this.settings.errorElement+"."+this.settings.errorClass,
this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=c([]);this.toHide=c([]);this.currentElements=c([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset();this.toHide=this.errorsFor(a)},check:function(a){a=this.clean(a);if(this.checkable(a))a=this.findByName(a.name).not(this.settings.ignore)[0];var b=c(a).rules(),d=false,e;for(e in b){var f={method:e,parameters:b[e]};try{var g=
c.validator.methods[e].call(this,a.value.replace(/\r/g,""),a,f.parameters);if(g=="dependency-mismatch")d=true;else{d=false;if(g=="pending"){this.toHide=this.toHide.not(this.errorsFor(a));return}if(!g){this.formatAndAdd(a,f);return false}}}catch(h){this.settings.debug&&window.console&&console.log("exception occured when checking element "+a.id+", check the '"+f.method+"' method",h);throw h;}}if(!d){this.objectLength(b)&&this.successList.push(a);return true}},customMetaMessage:function(a,b){if(c.metadata){var d=
this.settings.meta?c(a).metadata()[this.settings.meta]:c(a).metadata();return d&&d.messages&&d.messages[b]}},customMessage:function(a,b){var d=this.settings.messages[a];return d&&(d.constructor==String?d:d[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(arguments[a]!==undefined)return arguments[a]},defaultMessage:function(a,b){return this.findDefined(this.customMessage(a.name,b),this.customMetaMessage(a,b),!this.settings.ignoreTitle&&a.title||undefined,c.validator.messages[b],"<strong>Warning: No message defined for "+
a.name+"</strong>")},formatAndAdd:function(a,b){var d=this.defaultMessage(a,b.method),e=/\$?\{(\d+)\}/g;if(typeof d=="function")d=d.call(this,b.parameters,a);else if(e.test(d))d=jQuery.format(d.replace(e,"{$1}"),b.parameters);this.errorList.push({message:d,element:a});this.errorMap[a.name]=d;this.submitted[a.name]=d},addWrapper:function(a){if(this.settings.wrapper)a=a.add(a.parent(this.settings.wrapper));return a},defaultShowErrors:function(){for(var a=0;this.errorList[a];a++){var b=this.errorList[a];
this.settings.highlight&&this.settings.highlight.call(this,b.element,this.settings.errorClass,this.settings.validClass);this.showLabel(b.element,b.message)}if(this.errorList.length)this.toShow=this.toShow.add(this.containers);if(this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight){a=0;for(b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass)}this.toHide=this.toHide.not(this.toShow);
this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return c(this.errorList).map(function(){return this.element})},showLabel:function(a,b){var d=this.errorsFor(a);if(d.length){d.removeClass().addClass(this.settings.errorClass);d.attr("generated")&&d.html(b)}else{d=c("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(a),generated:true}).addClass(this.settings.errorClass).html(b||
"");if(this.settings.wrapper)d=d.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();this.labelContainer.append(d).length||(this.settings.errorPlacement?this.settings.errorPlacement(d,c(a)):d.insertAfter(a))}if(!b&&this.settings.success){d.text("");typeof this.settings.success=="string"?d.addClass(this.settings.success):this.settings.success(d)}this.toShow=this.toShow.add(d)},errorsFor:function(a){var b=this.idOrName(a);return this.errors().filter(function(){return c(this).attr("for")==b})},
idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(a){var b=this.currentForm;return c(document.getElementsByName(a)).map(function(d,e){return e.form==b&&e.name==a&&e||null})},getLength:function(a,b){switch(b.nodeName.toLowerCase()){case "select":return c("option:selected",b).length;case "input":if(this.checkable(b))return this.findByName(b.name).filter(":checked").length}return a.length},
depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):true},dependTypes:{"boolean":function(a){return a},string:function(a,b){return!!c(a,b.form).length},"function":function(a,b){return a(b)}},optional:function(a){return!c.validator.methods.required.call(this,c.trim(a.value),a)&&"dependency-mismatch"},startRequest:function(a){if(!this.pending[a.name]){this.pendingRequest++;this.pending[a.name]=true}},stopRequest:function(a,b){this.pendingRequest--;if(this.pendingRequest<
0)this.pendingRequest=0;delete this.pending[a.name];if(b&&this.pendingRequest==0&&this.formSubmitted&&this.form()){c(this.currentForm).submit();this.formSubmitted=false}else if(!b&&this.pendingRequest==0&&this.formSubmitted){c(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}},previousValue:function(a){return c.data(a,"previousValue")||c.data(a,"previousValue",{old:null,valid:true,message:this.defaultMessage(a,"remote")})}},classRuleSettings:{required:{required:true},
email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(a,b){a.constructor==String?this.classRuleSettings[a]=b:c.extend(this.classRuleSettings,a)},classRules:function(a){var b={};(a=c(a).attr("class"))&&c.each(a.split(" "),function(){this in c.validator.classRuleSettings&&c.extend(b,c.validator.classRuleSettings[this])});return b},attributeRules:function(a){var b=
{};a=c(a);for(var d in c.validator.methods){var e=a.attr(d);if(e)b[d]=e}b.maxlength&&/-1|2147483647|524288/.test(b.maxlength)&&delete b.maxlength;return b},metadataRules:function(a){if(!c.metadata)return{};var b=c.data(a.form,"validator").settings.meta;return b?c(a).metadata()[b]:c(a).metadata()},staticRules:function(a){var b={},d=c.data(a.form,"validator");if(d.settings.rules)b=c.validator.normalizeRule(d.settings.rules[a.name])||{};return b},normalizeRules:function(a,b){c.each(a,function(d,e){if(e===
false)delete a[d];else if(e.param||e.depends){var f=true;switch(typeof e.depends){case "string":f=!!c(e.depends,b.form).length;break;case "function":f=e.depends.call(b,b)}if(f)a[d]=e.param!==undefined?e.param:true;else delete a[d]}});c.each(a,function(d,e){a[d]=c.isFunction(e)?e(b):e});c.each(["minlength","maxlength","min","max"],function(){if(a[this])a[this]=Number(a[this])});c.each(["rangelength","range"],function(){if(a[this])a[this]=[Number(a[this][0]),Number(a[this][1])]});if(c.validator.autoCreateRanges){if(a.min&&
a.max){a.range=[a.min,a.max];delete a.min;delete a.max}if(a.minlength&&a.maxlength){a.rangelength=[a.minlength,a.maxlength];delete a.minlength;delete a.maxlength}}a.messages&&delete a.messages;return a},normalizeRule:function(a){if(typeof a=="string"){var b={};c.each(a.split(/\s/),function(){b[this]=true});a=b}return a},addMethod:function(a,b,d){c.validator.methods[a]=b;c.validator.messages[a]=d!=undefined?d:c.validator.messages[a];b.length<3&&c.validator.addClassRules(a,c.validator.normalizeRule(a))},
methods:{required:function(a,b,d){if(!this.depend(d,b))return"dependency-mismatch";switch(b.nodeName.toLowerCase()){case "select":return(a=c(b).val())&&a.length>0;case "input":if(this.checkable(b))return this.getLength(a,b)>0;default:return c.trim(a).length>0}},remote:function(a,b,d){if(this.optional(b))return"dependency-mismatch";var e=this.previousValue(b);this.settings.messages[b.name]||(this.settings.messages[b.name]={});e.originalMessage=this.settings.messages[b.name].remote;this.settings.messages[b.name].remote=
e.message;d=typeof d=="string"&&{url:d}||d;if(this.pending[b.name])return"pending";if(e.old===a)return e.valid;e.old=a;var f=this;this.startRequest(b);var g={};g[b.name]=a;c.ajax(c.extend(true,{url:d,mode:"abort",port:"validate"+b.name,dataType:"json",data:g,success:function(h){f.settings.messages[b.name].remote=e.originalMessage;var j=h===true;if(j){var i=f.formSubmitted;f.prepareElement(b);f.formSubmitted=i;f.successList.push(b);f.showErrors()}else{i={};h=h||f.defaultMessage(b,"remote");i[b.name]=
e.message=c.isFunction(h)?h(a):h;f.showErrors(i)}e.valid=j;f.stopRequest(b,j)}},d));return"pending"},minlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)>=d},maxlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)<=d},rangelength:function(a,b,d){a=this.getLength(c.trim(a),b);return this.optional(b)||a>=d[0]&&a<=d[1]},min:function(a,b,d){return this.optional(b)||a>=d},max:function(a,b,d){return this.optional(b)||a<=d},range:function(a,b,d){return this.optional(b)||
a>=d[0]&&a<=d[1]},email:function(a,b){return this.optional(b)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(a)},
url:function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},
date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a))},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)},number:function(a,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9-]+/.test(a))return false;var d=0,e=0,f=false;a=a.replace(/\D/g,"");for(var g=a.length-1;g>=
0;g--){e=a.charAt(g);e=parseInt(e,10);if(f)if((e*=2)>9)e-=9;d+=e;f=!f}return d%10==0},accept:function(a,b,d){d=typeof d=="string"?d.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(b)||a.match(RegExp(".("+d+")$","i"))},equalTo:function(a,b,d){d=c(d).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){c(b).valid()});return a==d.val()}}});c.format=c.validator.format})(jQuery);
(function(c){var a={};if(c.ajaxPrefilter)c.ajaxPrefilter(function(d,e,f){e=d.port;if(d.mode=="abort"){a[e]&&a[e].abort();a[e]=f}});else{var b=c.ajax;c.ajax=function(d){var e=("port"in d?d:c.ajaxSettings).port;if(("mode"in d?d:c.ajaxSettings).mode=="abort"){a[e]&&a[e].abort();return a[e]=b.apply(this,arguments)}return b.apply(this,arguments)}}})(jQuery);
(function(c){!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.handle.call(this,e)}c.event.special[b]={setup:function(){this.addEventListener(a,d,true)},teardown:function(){this.removeEventListener(a,d,true)},handler:function(e){arguments[0]=c.event.fix(e);arguments[0].type=b;return c.event.handle.apply(this,arguments)}}});c.extend(c.fn,{validateDelegate:function(a,
b,d){return this.bind(b,function(e){var f=c(e.target);if(f.is(a))return d.apply(f,arguments)})}})})(jQuery);




