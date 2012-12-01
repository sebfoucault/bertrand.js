define([
  'jQuery',
  "models/BertrandModel",
  "views/ProblemView",
  "views/ResultsView",
  "views/StatisticsView",
  "views/ToolbarView"
], 
function(xxx,BertrandModel,ProblemView, ResultsView, StatisticsView, ToolbarView){
	
	var Bertrand = function() {
		
		this.initialize = function() {
			
			var model = new BertrandModel(
				{
					rulesDigits			: 	3,
					rulesAllowedValues	: 	[1,2,3,4,5,6,7,8,9,10,25,50,75,100],
					problemValues		: 	[10, 1, 5, 10, 5, 7],
					problemTarget		: 	865,
					problemState		: 	"none",
					results				: 	[]
				}
			);
			
			var problemView = new ProblemView(
				{
					model	: model,
					el		: $("body")
				}
			);
			
			var resultsView = new ResultsView(
				{
					model	: model,
					el		: $("#containerResults")
				}
			);
			
			var toolbarView = new ToolbarView(
				{
					model	: model,
					el		: $("#containerToolbar")
				}
			);
			
			var statisticsView = new StatisticsView(
				{
					model	: model,
					el		: $("#containerStatistics")
				}
			);
		}
		
	};	

	return Bertrand;	
 
	 
	
});