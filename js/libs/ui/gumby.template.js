/*
	This is a work in progress
	The objective is to wrap a function with the necessary requirements of a Gumby Module
	Thus making it simple for our users to fire out compelling plugins
*/
function GumbyExtension(ExtensionClass, Selector){
	
	var self = this;
	self.$el = $(Selector);
	self.name = /\W*function\s+([\w\$]+)\(/.exec( ExtensionClass.toString() )[1];
	
	//add Initalisaion for the selector
	Gumby.addInitalisation(self.name, function(all){


		console.log("running Initalisaion")

		self.$el.each(function(){
		
			var $this = $(this);

			if($this.data(self.name) && !all){
				return true;
			}else if($this.data('is' + self.name) && all) {
				$this.trigger('gumby.initialize');
			}else{
				$this.data('is' + self.name, true);
				new ExtensionClass($this);
			}
			
			
		});
	});

	Gumby.UIModule({
		module: self.name,
		events: ['initialize'],
		init: function() {
			// Run initialize methods
			Gumby.initialize(self.name);
		}
	});
}
$.fn.GumbyAttr = function(attributes){
	return Gumby.selectAttr.apply($(this), [attributes]);
}






/*
	What could a plugin structure look like?
*/
!function($) {
	'use strict';

	function Neat($el){
		
		$el.css({
			"color" : $el.GumbyAttr("color")
		}).click(function(e){
			e.preventDefault();
			console.log(group);
		});

		$el.on('gumby.initialize', function(e){
			console.log("My element has been reinitialized");
		});

	}
	
	//Make new instances of Neat for each .neat element
	new GumbyExtension(Neat, ".neat");

	
}(jQuery);