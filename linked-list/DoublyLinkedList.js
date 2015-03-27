function List() {
	this.length = 0;
	this.headItem = null; //the first item
	this.tailItem = null; //the last item

	this.head = function head() {
		if (headItem == null) return null;
		return headItem.value;
	}

	this.tail = function tail() {
		if (tailItem == null) return null;
		return tailItem.value;
	}

	this.getLenght = function getLenght() {
		return length;
	}

	/* add new item to the end of the list*/
	this.append = function append(val) {
		var item = {
			value: val,
			next: null,
			previous: null,
		}

		if (length > 0) {
			tailItem.next = item;
			item.previous = tailItem;
		}

		tailItem = item;

		if (length == 0) {
			headItem = item;
		}

		++length;
		return this;		
	}

	/*deletes item by index; error handling*/
	this.deleteAt = function deleteAt(index) {
		if(index >= length || index < 0) {
			throw new Error("Index is out of the range");
		}

		if (length == 1) {
			headItem = null;
			tailItem = null;
		}
		else {
			var item = headItem;
			for (var i = 0; i < index; i++) {
				item = item.next;
			};
			if (item.previous) item.previous.next = item.next;
			if (item.next) item.next.previous = item.previous;
			if (index == 0) headItem = item.next;
			if (index == (length - 1)) tailItem = item.previous;

		}

		--length;
		return this;
	}

	/*returns item by index; error handling*/
	this.at = function at(index) {
		if(index >= length || index < 0) {
			throw new Error("Index is out of the range");
		}

		var item = headItem;
		for (var i = 0; i < index; i++) {
			item = item.next;
		};
		return item.value;
	}

	/*inserts item by index; new item should be placed at the specified index*/
	this.insertAt = function insertAt(index, val) {
		if(index > length || index < 0) {
			throw new Error("Index is out of the range");
		}

		if (index == length) {
			this.append(val);
			return this;
		}

		if (index == 0) {
			var item = {
				value: val, 
				next: headItem,
				previous: null,
			}
			headItem.previous = item;
			headItem = item;
			length++;
			return this;
		}

		var current = headItem;
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
		length++;
		
		return this;
	}

	/*rearranges the list's items back-to-front*/
	this.reverse = function reverse() {
		var item = tailItem;
		for (var i = 0; i < length; i++) {
			var buf = item.next;
			item.next = item.previous;
			item.previous = buf;
			item = item.next;
		}
		var buf = tailItem;
		tailItem = headItem;
		headItem = buf;

		return this;
	}

	/*applies specified function to each item of the list*/
	this.each = function each(funct) {
		var item = headItem;
		for (var i = 0; i < length; i++) {
			var val = funct(item.value);
			//if funct() returns new value write it into the list
			if (val) item.value = val;
			item = item.next;
		};

		return this;
	}

	/*return index of the specified item (first entry)*/
	this.indexOF = function indexOF(val) {
		var item = headItem;
		for (var i = 0; i < length; i++) {
			if (item.value == val) return i;
			item = item.next;
		};
		return null;
	}


	/*Print the list. Just for testing.*/
	this.printList = function printList() {
		if (length == 0) console.log("No items");
		else {
			var item = headItem;
			for (var i = 0; i < length; i++) {
				console.log(i + ": " + item.value);
				item = item.next;
			}
		}
	}

	/*Reverse print. Just for testing too.*/
	this.printRev = function printRev() {
		if (length == 0) console.log("No items");
		else {
			var item = tailItem;
			for (var i = length - 1; i >= 0; i--) {
				console.log(i + ": " + item.value);
				item = item.previous;
			}
		}
	}

}

