function List() {
	this.length = 0;
	this.headItem = null; //the first item
	this.tailItem = null; //the last item

	this.head = function head() {
		if (this.headItem == null) return null;
		return this.headItem.value;
	}

	this.tail = function tail() {
		if (this.tailItem == null) return null;
		return this.tailItem.value;
	}

	this.getLength = function getLength() {
		return this.length;
	}

	/* add new item to the end of the list*/
	this.append = function append(val) {
		var item = {
			value: val,
			next: null,
			previous: null,
		}

		if (this.length > 0) {
			this.tailItem.next = item;
			item.previous = this.tailItem;
		}

		this.tailItem = item;

		if (this.length == 0) {
			this.headItem = item;
		}

		++this.length;
		return this;		
	}

	/*deletes item by index; error handling*/
	this.deleteAt = function deleteAt(index) {
		if(index >= this.length || index < 0) {
			throw new Error("Index is out of the range");
		}

		if (this.length == 1) {
			this.headItem = null;
			this.tailItem = null;
		}
		else {
			var item = this.headItem;
			for (var i = 0; i < index; i++) {
				item = item.next;
			};
			if (item.previous) item.previous.next = item.next;
			if (item.next) item.next.previous = item.previous;
			if (index == 0) this.headItem = item.next;
			if (index == (this.length - 1)) this.tailItem = item.previous;

		}

		--this.length;
		return this;
	}

	/*returns item by index; error handling*/
	this.at = function at(index) {
		if(index >= this.length || index < 0) {
			throw new Error("Index is out of the range");
		}

		var item = this.headItem;
		for (var i = 0; i < index; i++) {
			item = item.next;
		};
		return item.value;
	}

	/*inserts item by index; new item should be placed at the specified index*/
	this.insertAt = function insertAt(index, val) {
		if(index > this.length || index < 0) {
			throw new Error("Index is out of the range");
		}

		if (index == this.length) {
			this.append(val);
			return this;
		}

		if (index == 0) {
			var item = {
				value: val, 
				next: this.headItem,
				previous: null,
			}
			this.headItem.previous = item;
			this.headItem = item;
			this.length++;
			return this;
		}

		var current = this.headItem;
		for (var i = 1; i < index; i++) {
			current = current.next;
		};

		var item = {
			value: val,
			next: current.next,
			previous: current,
		}

		current.next.previous = item;
		current.next = item;
		this.length++;
		
		return this;
	}

	/*rearranges the list's items back-to-front*/
	this.reverse = function reverse() {
		var item = this.tailItem;
		for (var i = 0; i < this.length; i++) {
			var buf = item.next;
			item.next = item.previous;
			item.previous = buf;
			item = item.next;
		}
		var buf = this.tailItem;
		this.tailItem = this.headItem;
		this.headItem = buf;

		return this;
	}

	/*applies specified function to each item of the list*/
	this.each = function each(funct) {
		var item = this.headItem;
		for (var i = 0; i < this.length; i++) {
			var val = funct(item.value);
			//if funct() returns new value write it into the list
			if (val) item.value = val;
			item = item.next;
		};

		return this;
	}

	/*return index of the specified item (first entry)*/
	this.indexOF = function indexOF(val) {
		var item = this.headItem;
		for (var i = 0; i < this.length; i++) {
			if (item.value == val) return i;
			item = item.next;
		};
		return null;
	}


	/*Print the list. Just for testing.*/
	this.printList = function printList() {
		if (this.length == 0) console.log("No items");
		else {
			var item = this.headItem;
			for (var i = 0; i < this.length; i++) {
				console.log(i + ": " + item.value);
				item = item.next;
			}
		}
	}

	/*Reverse print. Just for testing too.*/
	this.printRev = function printRev() {
		if (this.length == 0) console.log("No items");
		else {
			var item = this.tailItem;
			for (var i = this.length - 1; i >= 0; i--) {
				console.log(i + ": " + item.value);
				item = item.previous;
			}
		}
	}

}

