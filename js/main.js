require.config({
	paths:{
		jQuery		: 'libs/jquery/jquery',
		underscore	: 'libs/underscore/underscore',
		backbone	: 'libs/backbone/backbone',
		bootstrap	: 'libs/bootstrap/js/bootstrap'
	}
});

require(['Bertrand'
], 
function( Bertrand ){
	(new Bertrand() ).initialize();
});