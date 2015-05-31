var Iterator = function(arr, config) {
	if (arguments.length === 0) throw new Error ("Can't create an empty object");
	if (!(arr instanceof Array)) throw new TypeError('Incorrect value');
	if (typeof config !== 'object') config = undefined;

	this.arr = arr;
	if (config && config.width) {
		// if the width is bigger than lenght set width equal length
		this.width = config.width <= this.arr.length ? config.width : this.arr.length;
	}
	else this.width = 1; // default value
	this.cyclic = config ? (config.cyclic || false) : false;
	this.callback = config ? config.callback : undefined;
	this.currentPosition = 0;
	// check current and width when arr is changed
	// setObserve(this);
}

// what can I do with this shit? :(
/*function setObserve(obj) {
	Array.observe(obj.arr, function() {
		if (this.width > this.arr.length) {
			this.width = (this.arr.length !== 0) ? this.arr.length : 1;
		}
		if (this.currentPosition >= this.arr.length) {
			this.currentPosition %= this.arr.length; 
		}
		console.log(this.currentPosition);
	}.bind(obj));
}*/

// current subArray
Iterator.prototype.current = function() {
	var subarr = this.arr.slice(this.currentPosition, this.currentPosition + this.width);
	// if get out of cyclic array go to the beginning
	if (this.cyclic && this.currentPosition + this.width >= this.arr.length) {
		subarr = subarr.concat(this.arr.slice(0, (this.currentPosition + this.width) % this.arr.length));
	}
	return subarr;
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
				// calculate new position when get out of cyclic array
				this.currentPosition = i - Math.floor(i / this.arr.length) * this.arr.length;
			}
		}
	}
}

Iterator.prototype.forward = function(n) {
	if (!n || typeof n !== 'number') n = 1;
	if (this.cyclic || this.currentPosition + n + this.width >= 0 && this.currentPosition + n + this.width < this.arr.length) {
		this.jumpTo(this.currentPosition + n);
		return this.current();
	}
	else {
		this.currentPosition = this.arr.length - 1;
		return this.current();
	}
}

Iterator.prototype.backward = function(n) {
	if (!n || typeof n !== 'number') n = 1;
	if (this.cyclic || this.currentPosition - n + this.width >= 0 && this.currentPosition - n + this.width < this.arr.length) {
		this.jumpTo(this.currentPosition - n);
		return this.current();
	}
	else {
		this.currentPosition = 0;
		return this.current();
	}
}



