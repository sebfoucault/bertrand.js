importScripts("libs/require/require.js");

require(['bertrand-solver'], function() {

	self.onmessage = function(message) {
		
		var problem = message.data.problem;
		
		self.postMessage( { messageType: "started" });
		
		var slv 		= new brtr.Solver();
		var results 	= slv.solve( problem );
		var statistics 	= slv.statistics;
		
		var resultsAsString 	= JSON.stringify( results );
		var statisticsAsString 	= JSON.stringify( statistics );
		self.postMessage( { 
					messageType	: "completed", 
					results 	: resultsAsString,
					statistics	: statisticsAsString 
		});
	};	
	
} );

