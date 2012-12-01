
require(["libs/Queue"], function() {
	
this.brtr = this.brtr || {};

brtr.operations = 
		[
			{
				name: 			"Addition",
				sym:			"+",
				commutative: 	true,
				compute: 		function ( a, b ) { return a+b; },
				check: 			function (a,b) { return true; }
			},
			{
				name: 			"Multiplication",
				sym:			"*",
				commutative: 	true,
				compute: 		function ( a, b ) { return a*b; },
				check:			function ( a, b ) { return  a != 1 && b != 1; }
			},
			{
				name: 			"Subtraction",
				sym:			"-",
				commutative: 	false,
				compute: 		function ( a, b ) { return a-b; },
				check:			function ( a, b ) { return a > b; }
			},
			{
				name: 			"Division",
				sym:			"/",
				commutative: 	false,
				compute: 		function ( a, b ) { return a/b; },
				check:			function ( a, b ) { return b != 0 && a > b && a % b == 0 && b != 1; }
			}									
		];


brtr.SmartQueue = function( delegate ) {
	
	this._delegate 	= delegate;
	this._map 		= {};
};

brtr.SmartQueue.prototype = {
		
	enqueue: function( problemAndState ) {
		
		var problem = problemAndState.problem;
		
		var problemKey = this._getProblemKey(problem);
		if ( this._map[problemKey] == null ) {
			
			this._map[problemKey] = problem;
			this._delegate.enqueue( problemAndState );
		}
	},
	
	dequeue: function() {
		
		var problemAndState = this._delegate.dequeue();
		
		var problem = problemAndState.problem;
		var problemKey = this._getProblemKey( problem );
		
		delete this._map[problemKey];
		
		return problemAndState;
	},
	
	getLength: function() {
		
		return this._delegate.getLength();
	},
	
	_getProblemKey: function( problem ) {
		
		var values = problem.values;
		var target = problem.target;
		
		var sortedValues = [].concat( values  );
		sortedValues.sort();
		
		var key = "";
		for ( var i = 0 ; i < sortedValues.length ; i++ ) {
			key=key+sortedValues[i] + ".";
		}
		key = key + "=" + target;
		return key;
	}
};

  
brtr.Timer = function() {	
}  

brtr.Timer.prototype ={
	
	start: function() {
		this._startTime = new Date().getTime();
	},
	
	stop: function() {
		this._endTime = new Date().getTime();
		this.elapsedTime = this._endTime - this._startTime;
	}
};


brtr.StatisticsHandler = function() {
	this._timer = new brtr.Timer();
};

brtr.StatisticsHandler.prototype = {
	
	start: function() {
		this._timer.start();
	},
	
	stop: function() {
		this._timer.stop();
	}
};
  
brtr.Solver = function() {
	
	this.queue = new brtr.SmartQueue( new Queue() );
	
	this.statistics = {
			iterationCount	: 0,
			branchCount		: 0
	};
};


brtr.Solver.prototype = {

	solve: function( problem, statsHandler ) {
		
		// statsHandler.start();
		
		var timer = new brtr.Timer();
		
		timer.start();	
						
		var currentState = {
			operations: []
		};
		
		this.queue.enqueue( { problem : problem, state: currentState } );
		
		var results = this._internalSolve();
		
		timer.stop();
		
		this.statistics.time = timer.elapsedTime;
		
		return results;
	},

	_internalSolve: function() {
		
		var i = 0;
		
		var results = [];
		
		while ( this.queue.getLength() > 0 ) {
			
			//
			// There is at least one element in the queue
			
			this.statistics.iterationCount++;
			
			var problemAndState = this.queue.dequeue();
			
			var problem 		= problemAndState.problem;
			var currentState 	= problemAndState.state; 
			
			if ( this.isProblemSolved( problem ) ) {
			
				results.push( 
					{
						operations: currentState.operations,
						value:		problem.target,
						perfect: 	true
					} 
				);
				
				this.statistics.branchCount++;
			}
			else {
			
				var pbsAndStates = this._generateProblemsAndStates( problem, currentState );
				
				if ( pbsAndStates.length == 0 ) {
					
					this.statistics.branchCount++;
				}
				else {
					
					for ( i = 0 ; i < pbsAndStates.length ; i++ ) {
						
						var pbAndState 	= pbsAndStates[i];
						var pb 			= pbAndState.problem;
						var state 		= pbAndState.state;
						
						/*
						var pbAndStateResult = this._internalSolve( pb, state );				
						results = results.concat( pbAndStateResult );
						*/
						
						this.queue.enqueue( pbAndState );
					} 
				}
			}
		}
		
		return results;
	},

	isProblemSolved: function( problem ) {
		
		var result = false;
		if ( problem.values.indexOf( problem.target ) != -1 ) {
			result = true;
		}
		return result;
	},

	_generateProblemsAndStates: function( problem, currentState ) {

		var i = 0;
		var j = 0;
		var o = 0;
		
		var op = null;
		
		var problemsAndStates = [];
		var problemAndState = null;
		
		for ( i = 0 ; i < problem.values.length ; i++ ) {
			for ( j = 0 ; j < problem.values.length ; j++ ) {
			
				if ( i == j ) {
					continue;
				}
				for ( o = 0 ; o < brtr.operations.length ; o++ ) {
					op = brtr.operations[o]; 			
					problemAndState = this._generateProblemAndState( problem, currentState, i, j, op );
					if ( null != problemAndState ) {
						problemsAndStates.push( problemAndState );
					}
				}
			}
		}
		
		return problemsAndStates;
	},

	_generateProblemAndState: function( problem, currentState, i, j, op ) {
		
		var v1 = problem.values[i];
		var v2 = problem.values[j];
		
		var result = null;
		
		var k = 0;
		
		if ( op.commutative && i > j ) {
			result = null;
		}
		else if ( op.check( v1, v2 ) == false ) {
			result = null;
		}
		else {
			var newProblem = {
				target: problem.target,
				values: new Array()
			};
			for ( k = 0 ; k < problem.values.length ; k++ ) {
				if ( k != i && k != j ) {
					newProblem.values.push( problem.values[k] );
				}
			}
			var opResult = op.compute( v1, v2 );
			newProblem.values.push( opResult );
			
			var newState = {
				operations: new Array().concat(currentState.operations)
			};
			newState.operations.push( {
				operator1: 	v1,
				operator2: 	v2,
				operand: 	op,
				result:		opResult
			} );
			
			result = {
				problem: 	newProblem,
				state: 		newState
			};
			
			return result;
		}
	}	
};


} );