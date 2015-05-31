var Iterator = function(arr, config) {
	if (arguments.length === 0) throw new Error ("Can't create an empty object");
	if (!(arr instanceof Array)) throw new TypeError('Incorrect value');
	if (typeof config !== 'object') config = undefined;
	this.arr = arr;
	if (config && config.width) {
		this.width = config.width <= this.arr.length ? config.width : this.arr.length;
	}
	else this.width = 1;
	this.cyclic = config ? (config.cyclic || false) : false;
	this.callback = config ? config.callback : undefined;
	this.currentPosition = 0;
}

Iterator.prototype.forward = function(n) {
	
}

Iterator.prototype.backward = function(n) {

}

Iterator.prototype.current = function() {
	// return arr.slice
}

Iterator.prototype.jumpTo = function(i) {
	if (i >= 0 && i < this.arr.length) {
		this.currentPosition = i;
	}
	else {
		if (!this.cyclic) throw new RangeError('Index is out of the range');
		else {
			if (i > 0) this.currentPosition = i % this.arr.length;
			else {
				this.currentPosition = i - Math.floor(i / this.arr.length) * this.arr.length;
			}
		}
	}
}
