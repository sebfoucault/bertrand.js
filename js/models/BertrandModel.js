define([
	"underscore",
	"backbone"
	],
	
	function() {
								
		var BertrandModel = Backbone.Model.extend({
			
			generateNewProblem: function() {
				
				var allowedValues = this.get("rulesAllowedValues");
				var currentValues = this.get("problemValues");
					
				var newValues = [];
				var newTarget = 0;	
				
				//
				// Triggers the generation of a new problem
				
				var maxRandomValue = allowedValues.length - 1;
				
				for ( var i = 0 ; i < currentValues.length ; i++ ) {
					
					var randomIndex = Math.floor(Math.random()* maxRandomValue + 1 );
					var newValue 	=allowedValues[randomIndex];
					
					newValues.push( newValue );
				}
				
				newTarget = Math.floor( Math.random() * 1001 );

				this.set( "problemTarget", newTarget );
				this.set( "problemValues", newValues );
				this.set( "problemSatus", "unresolved" );
				
				this.set( "results", []);
				this.set( "statistics", []);
			},
			
			solveProblem: function() {
				
				var target = this.get("problemTarget");
				var values = this.get("problemValues");
				
				//
				// Triggers the solving
				
				var worker = new Worker("js/bertrand-worker.js");
				
				var that = this;
				worker.onmessage = function( message ) {
					
					if ( message.data.messageType == "started") {
						that.set("problemStatus","started");
					}
					else {
						var results 	= JSON.parse( message.data.results );
						var statistics 	= JSON.parse( message.data.statistics );
						
						that.set("results", results);
						that.set("statistics", statistics);
						that.set("problemStatus","completed");
					}
				};
				
				this.set("problemStatus","completed");
				
				worker.postMessage({ 
					problem: {
						target: target,
						values: values
					} 
				});
				
				return false;					
			}			

			
		});
		
		return BertrandModel;
	}
	
);
