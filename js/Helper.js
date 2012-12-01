var brtr = brtr || {};

brtr.Helper = function() {	
};

brtr.Helper.prototype.decompose = function( value, minDigits ) {
	
	var result = [];
	
	var pow = 1;
	while ( value > 0 ) {
		
		var digit = value % 10;
		result.push( digit );
		value = Math.floor( value / 10 );
	}	
	
	while ( result.length < minDigits ) { 
		result.push( 0 );
	}
		return result;
	
}; 

brtr.Helper.prototype.recompose = function( digitsArray, minDigits ) {
	
	var result = 0;
	for ( var i = 0 ; i < digitsArray.length ; i++ ) {
		result += Math.pow( 10, i ) * digitsArray[i];
	}	
	return result;
	
};
