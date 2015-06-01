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
		it('should throw error when initialize with incorrect array', function() {
		    Iterator.should.throw(Error);
		    Iterator.bind(null, 1).should.throw(TypeError);
		    Iterator.bind(null, 't').should.throw(TypeError);
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
		    it.jumpTo.bind(it, 5).should.throw(RangeError);
		    it.jumpTo.bind(it, -1).should.throw(RangeError);
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

	describe('#current', function() {
		it('should return first one item when just initialize with arr', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.current().should.have.length(1);
		    it.current()[0].should.equal(arr[0]);
	  	});
	  	it('should return first two items when just initialize with width 2', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 2});
		    it.current().should.have.length(2);
		    it.current()[0].should.equal(arr[0]);
		    it.current()[1].should.equal(arr[1]);
	  	});
	  	it('should return the last one item when window is not fit in and iterator isnt cyclic', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 2});
		    it.jumpTo(2);
		    it.current().should.have.length(1);
		    it.current()[0].should.equal(arr[2]);
	  	});
	  	it('should return the last one and the first one items when window is not fit in and iterator is cyclic', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 2, cyclic: true});
		    it.jumpTo(2);
		    it.current().should.have.length(2);
		    it.current()[0].should.equal(arr[2]);
		    it.current()[1].should.equal(arr[0]);
	  	});
	});

/*	describe('observe', function() {
		it('should change current position when slice arr and position is not fit any more', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.jumpTo(2);
		    // console.log('in test 1: ' + it.currentPosition);
		    // it.arr.pop();
		    it.arr.pop();
		    console.log('in test 2: ' + it.currentPosition);
		    it.currentPosition.should.equal(1);
	  	});
  	it('should change width when slice arr and width isnt fit any more', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 2});
		    it.arr.pop();
		    it.arr.pop();
		    it.width.should.equal(1);
	  	});
	});*/

	describe('#forward', function() {
		it('should return correct value when move forward 1 step', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.forward(1)[0].should.equal(arr[1]);
	  	});
	  	it('should not move forward if iterator in the end of no cyclic array', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.forward(4)[0].should.equal(arr[2]); 
 		});
 		it('should move to the beginning of cyclic array when it ends', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {cyclic: true});
		    it.forward(4)[0].should.equal(arr[1]);	    
 		});
 		it('should move backward if the value is negative', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.jumpTo(2);
		    it.forward(-1)[0].should.equal(arr[1]);
	  	});
	  	it('should move forward 1 step when value is uncorrect or is ubsent', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.forward()[0].should.equal(arr[1]);
		    var it = new Iterator(arr);
		    it.forward('t')[0].should.equal(arr[1]);
	  	});
	});

	describe('#backward', function() {
		it('should return correct value when move backward 1 step', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.forward(1);
		    it.backward(1)[0].should.equal(arr[0]);
	  	});
	  	it('should not move backward if iterator in the beggining of no cyclic array', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.backward(4)[0].should.equal(arr[0]); 
 		});
 		it('should move to the end of cyclic', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {cyclic: true});
		    it.backward(4)[0].should.equal(arr[2]);	    
 		});
 		it('should move forward if the value is negative', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.backward(-1)[0].should.equal(arr[1]);
	  	});
	  	it('should move backward 1 step when value is uncorrect or is ubsent', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.forward();
		    it.backward()[0].should.equal(arr[0]);
		    var it = new Iterator(arr);
		    it.forward();
		    it.backward()[0].should.equal(arr[0]);
	  	});
	});

	
	describe('observe', function() {
		it('should set current position to the last item when shorten arr and position is not fit any more in no cyclic arr', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr);
		    it.jumpTo(2);
		    arr.pop();
		    it.current()[0].should.equal(arr[1]);
	  	});
	  	it('should cyclically change current position when shorten arr and position is not fit any more in cyclic arr', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {cyclic: true});
		    it.jumpTo(2);
		    arr.pop();
		    it.current()[0].should.equal(arr[0]);
	  	});
  		it('should change width when slice arr and width isnt fit any more', function() {
		    var arr = [1, 2, 3];
		    var it = new Iterator(arr, {width: 3});
		    arr.pop();
		    arr.pop();
		    it.current().should.have.length(1);;
		    it.width.should.equal(1);
	  	});
	});

	describe('customWindowFunction', function() {
		it('should set new window width every step forward or backward', function() {
		    var arr = [1, 2, 3, 4, 5];
		    var it = new Iterator(arr, {callback: function(old_width) {
		    	return ++old_width;
		    }});
		    it.current()[0].should.equal(arr[0]);
		    it.forward().should.have.length(2);
		    it.current()[0].should.equal(arr[1]);
		    it.current()[1].should.equal(arr[2]);

		    it.forward().should.have.length(3);
		    it.current()[0].should.equal(arr[2]);
		    it.current()[1].should.equal(arr[3]);
		    it.current()[2].should.equal(arr[4]);

		    it.forward().should.have.length(2);
		    it.current()[0].should.equal(arr[3]);
		    it.current()[1].should.equal(arr[4]);

		    it.backward().should.have.length(3);
		    it.current()[0].should.equal(arr[2]);
		    it.current()[1].should.equal(arr[3]);
		    it.current()[2].should.equal(arr[4]);
	  	});
	});

});
