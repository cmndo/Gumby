
!function($) {

	'use strict';

	function InViewWatcher($elem){
		var ACTIVE_TRIGGER = $elem.attr('gumby-inview-class');
		var ACTIVE_OFFSET_BOTTOM = $elem.attr('gumby-inview-offset-bottom') || $elem.attr('gumby-inview-offset') || 0;
		var ACTIVE_OFFSET_TOP = $elem.attr('gumby-inview-offset-top') || $elem.attr('gumby-inview-offset') || 0;

		return {
			elem: $elem,
			classname: ACTIVE_TRIGGER,
			offsetBottom: ACTIVE_OFFSET_BOTTOM,
			offsetTop: ACTIVE_OFFSET_TOP
		}
	}


	// add toggle Initialization
	Gumby.addInitalisation('inview', function(all) {
		//Variables for Initialization
		var t, k, tmp, ot, oh, offt, offb, wh = $(window).height(), watchers = [];

		/*
			I want to initialize elements which have a gumby-scroll-trigger attribute
		*/
		$('[gumby-inview-class]').each(function() {
			var $this = $(this);

			// this element has already been initialized
			// and we're only initialization new modules
			if($this.data('isInView') && !all) {
				return true;

			// this element has already been initialized
			// and we need to reinitialize it
			} else if($this.data('isInView') && all) {
				$this.trigger('gumby.initialize');
			}

			// mark element as initialized
			$this.data('isInView', true);
			watchers.push(new InViewWatcher($this));

		});


		//on scroll - loop through elements
		// if the element is on the screen, give it the class
		// if its off, take it's class away
		
		$(document).on('scroll', function(e){

			t = $(this).scrollTop();
			for(k = 0; k < watchers.length; k++){
				tmp = watchers[k];

				//keep 'hidden' elements from breaking the plugin
				if(tmp.elem.css('display') == 'none'){
					break;
				}

				//element's offset top and height
				ot = tmp.elem.offset().top;
				oh = tmp.elem.height();

				//how much on the screen before we apply the class
				offt = tmp.offsetTop;
				offb = tmp.offsetBottom;

				//if above bottom and below top, you're on the screen
				if(ot < (t - offb) + wh && ot + oh - offt > t){
					if(!tmp.elem.hasClass(tmp.classname)){
						tmp.elem.addClass(tmp.classname);
					}
				}else{
					if(tmp.elem.hasClass(tmp.classname)){
						tmp.elem.removeClass(tmp.classname);
					}
				}
			}
		});

		//on resize - update window height reference
		//and trigger scroll
		$(window).on('resize', function(){
			wh = $(this).height();
			$(document).trigger('scroll');
		});


	});


	// register UI module
	Gumby.UIModule({
		module: 'inview',
		events: ['initialize', 'trigger', 'onTrigger'],
		init: function() {
			// Run initialize methods
			Gumby.initialize('inview');
		}
	});
}(jQuery);