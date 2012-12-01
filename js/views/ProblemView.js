define([
	"underscore",
	"backbone",
	"Helper"
	],
	
	function(){
		
		var ProblemView = Backbone.View.extend({
			
			initialize: function() {
				this._helper = new brtr.Helper();
				this._bindUIEvents();
				this.render();
					
				this.model.bind( "change:problemTarget", $.proxy( this._onProblemTargetChanged, this ) );
				this.model.bind( "change:problemValues", $.proxy( this._onProblemValuesChanged, this ) );				
			},
			
			render: function() {
				
				this._renderTarget();
				this._renderValues();
			},
			
			_renderTarget: function() {
				
				var target = this.model.get("problemTarget");
				var minDigits = this.model.get("rulesDigits");
				
				var decomposition = this._helper.decompose( target, minDigits );
				
				var d = []; 
				for ( var i = decomposition.length - 1 ; i >= 0 ; i-- ) {
					var digit = decomposition[i];
					d.push( { digit: digit, pow: i });
				}				
				
				var vars = {
					digits: d
				};				
            	var template = _.template( $("#templateTargetResult").html(), vars );
 				this.$el.find("#containerTarget").html( template);
				
			},
			
			_renderValues: function() {

				var values = this.model.get("problemValues");
				
				var vars = {
					values: values
				};				
            	var template = _.template( $("#templateValues").html(), vars );
 				this.$el.find("#containerValues").html( template);				
			},

			_bindUIEvents: function() {
				this._bindTargetEvents();
				this._bindValuesEvents();	
			},

			_bindTargetEvents: function() {
				this.$el.find("#containerTarget").on("touchstart click", "button", $.proxy( this._onTargetClick, this ) );
			},

			_bindValuesEvents: function() {
				this.$el.find("#containerValues").on("touchstart click","button", $.proxy( this._onValueClick, this ) );
			},

			_onTargetClick: function( event ) {
				
				var digitAsString 	= $(event.target).attr("digit")
				var digit 			= parseInt( digitAsString , 10 );
				
				this._incrementTarget( digit );
				return false;				
			},
			
			_onValueClick: function( event ) {
				
				var valueIndexAsString 	= $(event.target).attr("valueIndex");
				var valueIndex 			= parseInt( valueIndexAsString, 10 );
				
				this._incrementValue( valueIndex );
			},
			
			_incrementTarget: function( digit ) {
				
				var target = this.model.get("problemTarget");
				var digits = this.model.get("rulesDigits");
								
				var decomposition = this._helper.decompose( target, digits );
				decomposition[digit] += 1;
				decomposition[digit] = decomposition[digit] % 10;
				target = this._helper.recompose( decomposition, digits );
				
				this.model.set( { problemTarget : target } );
			},
			
			_incrementValue: function( valueIndex ) {
				
				var allowedValues	= this.model.get("rulesAllowedValues");		
				var problemValues 	= [].concat( this.model.get("problemValues") );
				var currentValue 	= problemValues[valueIndex];
				
				var i = allowedValues.indexOf( currentValue );
				if ( i != -1 ) {
					i = ( i+1) % allowedValues.length;
					var nextValue = allowedValues[i];
					problemValues[valueIndex] = nextValue;
				}
				
				this.model.set( { problemValues: problemValues } );
				
				return false;
			},
			
			_onProblemTargetChanged: function() {
				this._renderTarget();
			},
			
			_onProblemValuesChanged: function() {
				this._renderValues();
			}
		});
		
		return ProblemView;
	}
)
