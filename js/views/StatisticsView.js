define([
	"underscore",
	"backbone",
	],
	
	function(){
		
		var StatisticsView = Backbone.View.extend({
			
			initialize: function() {
				this.render();
					
				this.model.bind( "change:statistics", $.proxy( this._onStatisticsChanged, this ) );
			},
			
			render: function() {	
				var statistics = this.model.get("statistics");
				
				var vars = {
					stats: statistics
				};				
            	var template = _.template( $("#templateStatistics").html(), vars );
 				this.$el.html( template);	
			},
									
			_onStatisticsChanged: function() {
				this.render();
			}			
		});
		
		return StatisticsView;
	}
)
