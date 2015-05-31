chai.should();

describe('Iterator', function() {
	describe('constructor', function() {
		it('should have an array with length 3, width = 1, cyclic = false, undefined callback when initialize without config', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.should.have.property('arr').with.length(3);
		    it.should.have.property('width').equal(1);
		    it.should.have.property('cyclic').equal(false);
		    it.should.have.property('callback').equal(undefined);
		    it.should.have.property('currentPosition').equal(0);
		});
		it('should have an array with length 3, width = 2, cyclic = true, callback = some function when initialize with config', function() {
		    var arr = [1, 2, 3];
		    var config = {
		    	width: 2,
		    	cyclic: true,
		    	callback: function(wndw) {
		    		return wndw;
		    	}
		    };
		    var it = new Iterator(arr, config);
		    it.should.have.property('arr').with.length(3);
		    it.width.should.equal(2);
		    it.cyclic.should.equal(true);
		    it.callback.should.be.a('function');
		});
		it('should throw error when initialize with incorrect value', function() {
		    Iterator.should.throw(Error);
		    Iterator.bind(null, 1).should.throw(TypeError);
		    Iterator.bind(null, 't').should.throw(TypeError);
		    Iterator.bind(null, [1, 2], 't').should.not.throw(TypeError);
		});
		it('should initialize with default config when it is incorrect', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, 't');
		    it.width.should.equal(1);
		    it.cyclic.should.equal(false);
		    it.should.have.property('callback').equal(undefined);
		});
		it('should set width = arr.lenth when initialize with widht bigger than arr.length', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 5});
		    it.width.should.equal(3);
		});

	});

	describe('#jumpTo', function() {
		it('should have currentPosition at position 2 when jump to it', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.jumpTo(2);
		    it.currentPosition.should.equal(2);
	  	});
	  	it('should throw an error when jump out the range and iterator is not cyclic', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.jumpTo.bind(null, 5).should.throw(RangeError);
		    it.jumpTo.bind(null, -1).should.throw(RangeError);
 		});
 		it('should calculate correct current item when jump out the range and iterator is cyclic', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {cyclic: true});
		    it.jumpTo(5);
		    it.currentPosition.should.equal(2);
		    it.jumpTo(10);
		    it.currentPosition.should.equal(1);
		    it.jumpTo(-2);
		    it.currentPosition.should.equal(1);
 		});
	});

});
