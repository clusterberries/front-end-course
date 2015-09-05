chai.should();

describe('Autocomplete', function() {
	describe('constructor', function() {
		it('should have an array with length 3 when initialize with ["word", "apple", "ice"]', function() {
		    var auto = new Autocomplete(["word", "apple", "ice"]);
		    auto.should.have.property('strings').with.length(3);
		});
		it('should have an array with length 1 when initialize with ["word", 7, "", {}]', function() {
		    var auto = new Autocomplete(["word", 7, ""]);
		    auto.should.have.property('strings').with.length(1);
		});
		it('should have an empty array when initialize with no array', function() {
		    var auto = new Autocomplete();
		    auto.should.have.property('strings').with.length(0);
		    auto = new Autocomplete(7);
		    auto.should.have.property('strings').with.length(0);
		    auto = new Autocomplete('abc');
		    auto.should.have.property('strings').with.length(0);
		    auto = new Autocomplete({a: 4});
		    auto.should.have.property('strings').with.length(0);
		});
	});

	describe('#addString', function() {
		it('should have an array with length 1 when add "word" to empty object', function() {
		    var auto = new Autocomplete();
		    auto.addString('word');
		    auto.should.have.property('strings').with.length(1);
	  	});
	  	it('should have an array with length 2 when add array ["word", "apple"] to empty object', function() {
		    var auto = new Autocomplete();
		    auto.addString(["word", "apple"]);
		    auto.should.have.property('strings').with.length(2);
	  	});
	  	it('should have an array with length 2 when add array ["word", 7, "", {}] to object with one word (ignore incorrect values)', function() {
		    var auto = new Autocomplete(['pen']);
		    auto.addString(["word", 7, ""]);
		    auto.should.have.property('strings').with.length(2);
	  	});
	  	it('should not add string when input is incorrect', function() {
		    var auto = new Autocomplete();
		    auto.addString(7);
		    auto.should.have.property('strings').with.length(0);
		    auto.addString();
		    auto.should.have.property('strings').with.length(0);
		    auto.addString({a: 6});
		    auto.should.have.property('strings').with.length(0);
	  	});
	});

	describe('#getSuggestions', function() {
		it('should return an empty array when search "a" in object ["word", "grapes", "ice"]', function() {
		    var auto = new Autocomplete(["word", "grapes", "ice"]);
		    var result = auto.getSuggestions('a'); 
		    result.should.be.a('array').with.length(0);
	  	});
	  	it('should return an array with ["apple"] when search "a" in object ["word", "apple", "ice"]', function() {
		    var auto = new Autocomplete(["word", "apple", "ice"]);
		    var result = auto.getSuggestions('a'); 
		    result[0].should.equal('apple');
	  	});
	  	it('should return an array with ["apple", "apocalipsis"] when search "ap" in object ["word", "apple", "apocalipsis"]', function() {
		    var auto = new Autocomplete(["word", "apple", "apocalipsis"]);
		    var result = auto.getSuggestions('ap'); 
		    result.should.have.length(2);
		    result.indexOf('apple').should.not.equal(-1);
		    result.indexOf('apocalipsis').should.not.equal(-1);
	  	});
	  	it('should return an empty array when search incorrect value', function() {
		    var auto = new Autocomplete(["word", "grapes", "ice"]);
		    var result = auto.getSuggestions(9); 
		    result.should.be.a('array').with.length(0);
		    result = auto.getSuggestions(['a']); 
		    result.should.be.a('array').with.length(0);
		    result = auto.getSuggestions({a: 7}); 
		    result.should.be.a('array').with.length(0);
		    result = auto.getSuggestions(); 
		    result.should.be.a('array').with.length(0);
	  	});
	});
});
