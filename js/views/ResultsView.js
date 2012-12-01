define([
	"underscore",
	"backbone",
	"bootstrap"
	],
	
	function(){
		
		var ResultsView = Backbone.View.extend({
			
			initialize: function() {
				this.render();
					
				this.model.bind( "change:results", $.proxy( this._onResultsChanged, this ) );
			},
			
			render: function() {
								
				var results = this.model.get("results");		
				var vars = {
					results: results
				};				
            	var template = _.template( $("#templateResults").html(), vars );
 				this.$el.html( template);	
				this.$el.find("div.item:first").addClass("active");
				
				$('.carousel').carousel('pause');		
			},
			
						
			_onResultsChanged: function() {
				this.render();
			}			
		});
		
		return ResultsView;
	}
)
