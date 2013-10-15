/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();




var GumbyExtension = Class.extend({
	init: function(name, selector){
		
		var self = this;
		self.$el = $(selector);
		self.name = name;
		self.selector = selector;

		Gumby.addInitalisation(self.name, function(all){
			self.$el.each(function(){
				
				var $this = $(this);

				if($this.data(self.name) && !all){
					
					return true;
				
				}else if($this.data('is' + self.name) && all) {
					
					$this.trigger('gumby.initialize');
				
				}
				
				$this.data('is' + self.name, true);

			});
		});
	},
	setup: function(){
		var self = this;
		this.$el.on('gumby.initialize', function(event) {
			Gumby.debug('Re-initializing ' +self.name, self.$el);
			dispatchSetup();
		});
		dispatchSetup();
	},
	start: function(){
		var self = this;
		Gumby.UIModule({
			module: self.name,
			events: ['initialize', 'trigger', 'onTrigger'],
			init: function() {
				// Run initialize methods
				Gumby.initialize(self.name);
			}
		});
	}
});

!function($) {
	'use strict';

//-------------
	var GumbyExtensionHelper = Class.extend({
		registerOption: function(attr, v){
			var self = this;
			options[v] = Gumby.selectAttr.apply(self.$el, [attr]);
		}	
	});
//---------------




	function Neat(){
		var self = this;
		//instance of the plugin wrapped in its own Gumby Extension
		self.$el.css({
			"color" : self.options.color 
		});
		this._super("neat", ".neat");
	}
	
	//register an option, and its variable name - used above
	Neat.registerOption("color", "color")
	

	//Class, extension name, extension selector
	new GumbyExtension(Neat);
	

	
}(jQuery);