function make(value) {
	var val = []; // array for the arguments

	if (typeof arguments[arguments.length - 1] == 'function') {
		if (arguments.length == 1) return undefined;
		// write arguments into array exept the last
		for (var i = 0; i < arguments.length - 1; ++i) {
			val = val.concat(arguments[i]);
		};
		// the last argument is a function
		return val.reduce(arguments[arguments.length - 1]);
	}
	if (arguments.length == 0) return undefined;
	for (var i in arguments) {val = val.concat(arguments[i])};
	// create new function with array of arguments
	return make.bind(undefined, val);
}

//example
function sum(a, b) {
	return a + b; 
}