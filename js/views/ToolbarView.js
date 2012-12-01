define([
	"underscore",
	"backbone",
	],
	
	function(){
		
		var ToolbarView = Backbone.View.extend({
			
			initialize: function() {
				this._bindEvents();
				this.render();
				
				this.model.bind( "change:problemStatus", $.proxy( this._onProblemStatusChanged, this ) );
			},
			
			render: function() {
				this._renderState();
			},
			
			_bindEvents: function() {
				
				this.$el.find("#btnNewProblem").on("click touchstart", $.proxy( this._onNewProblem, this ) );
				this.$el.find("#btnComputeAsync").on("click touchstart", $.proxy( this._onSolveProblem, this ) );
				
			},
			
			_onNewProblem: function() {
				this.model.generateNewProblem();
			},
			
			_onSolveProblem: function() {
				this.model.solveProblem();
			},
						
			_renderState: function() {
				
				var problemState = this.model.get("problemStatus");
				
				var labelClass = "";
				
				this.$el.find("#state").text( problemState );
				this.$el.find("#state").attr("class","label");
				
				if ( problemState == "started" ) {
					labelClass = "label-info";
				}
				else if ( problemState == "completed" ) {
					labelClass = "label-success";
				}
				
				this.$el.find("#state").addClass( labelClass );
			},
			
			
			_onProblemStatusChanged: function() {
				this._renderState();
			}
									
		});
		
		return ToolbarView;
	}
)
