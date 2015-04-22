var $ = function(selector) {
	return new $.element(selector);
}

// this is the main object with nodes
// the prototype contains methods
$.element = function JQueryElement(el) { //el is an element, a jquery element, a collection or a selector 
	if (el instanceof JQueryElement) {
		this.selector = el.selector;
		this.nodes = el.nodes.slice();
	}
	else if (el instanceof Element) {
		this.nodes = [el];
	}
	else if (el instanceof Object) {
		this.nodes = [];
		this.nodes = this.nodes.concat(Array.prototype.slice.call(el));
	}
	else {
		this.nodes = Array.prototype.slice.call(document.querySelectorAll(el)); 
		this.selector = el;
	}

	if (!this.inf.search(this.nodes)) this.inf.set(this.nodes.slice(), {}); // data associated with selector
}

// without params or parameter is a string or a function
$.element.prototype.html = function() { 
	var arg;

	// if no arguments return the html of the first node
	if (arguments.length == 0) return this.nodes[0].innerHTML.trim();
	else {
		arg = arguments[0];

		// set new html for all nodes
		if (typeof arg === "string") {
			Array.prototype.forEach.call(this.nodes, function(child) {
				child.innerHTML = arg;
			});
		}

		// call the function and set new html for all nodes
		else if (typeof arg === "function") {
			for (var i = 0; i < this.nodes.length; ++i) {
				this.nodes[i].innerHTML = arg(i, this.nodes[i].innerHTML);
			}
		}
	}
	return this;
}

// parameter is a function
$.element.prototype.each = function(funct) {
	for (var i = 0; i < this.nodes.length; ++i) {
		funct.call(this.nodes[i], i, this.nodes[i]);
	}
	return this;
}

// (function) or few params: string or element or array of elements or jquery element
// element will be moved into the target (not cloned)
$.element.prototype.append = function() {
	var arg, el;
	if (typeof arguments[0] === "function") {
		for (var i = 0; i < this.nodes.length; ++i) {
			$(this.nodes[i]).append(arguments[0](i, this.nodes[i].innerHTML));
		}
	}
	else for (var i = 0; i < arguments.length; ++i) {
		arg = arguments[i];
		if (typeof arg === "string") {		
			Array.prototype.forEach.call(this.nodes, function(child) {
				child.innerHTML += arg;
			});
		}
		else if (arg instanceof Element) {
			Array.prototype.forEach.call(this.nodes, function(child) {
				child.appendChild(arg.cloneNode(true));
			});
			arg.remove();
		}
		else if (arg instanceof Array) {
			for (var j = 0; j < arg.length; ++j) {
				Array.prototype.forEach.call(this.nodes, function(child) {
					child.appendChild(arg[j].cloneNode(true));
				});
				arg[j].remove();
			}
		}
		else if (arg instanceof $.element) {
			debugger;
			for (var j = 0; j < arg.nodes.length; ++j) {
				el = arg.nodes[j];
				Array.prototype.forEach.call(this.nodes, function(child) {
					child.appendChild(el.cloneNode(true));
				}); 
				el.remove();
			}
		}
	}
	return this;
}

//parameters: strign (space-separated classes) or function
$.element.prototype.addClass = function() {
	var clss, classes;
	if (typeof arguments[0] === "function") {
		for (var i = 0; i < this.nodes.length; ++i) {
			$(this.nodes[i]).addClass(arguments[0](i, this.nodes[i].className));
		}
	}
	else if (typeof arguments[0] === "string"){
		classes = arguments[0].split(' ');
		for (var i = 0; i < classes.length; ++i) {
			clss = classes[i];
			Array.prototype.forEach.call(this.nodes, function(child) {
				// add spaces and check if this class already exists
				child.className = " " + child.className + " "; 
				if (child.className.indexOf(" " + clss + " ") == -1) child.className += clss;
				child.className = child.className.trim();
			});
		}
	}
	return this;
}

// params are (attributeName) or (attributeName, value), (attributeName, function), (attributes)
$.element.prototype.attr = function() {
	if (typeof arguments[0] === "string") {
		if (arguments.length == 1) {
			return this.nodes[0].getAttribute(arguments[0]);
		}
		else if (typeof arguments[1] === "function") {
			for (var i = 0; i < this.nodes.length; ++i) {
				this.nodes[i].setAttribute(arguments[0], arguments[1](i, this.nodes[i].getAttribute(arguments[0])));
			}
		}
		else {
			for (var i = 0; i < this.nodes.length; ++i) {
				this.nodes[i].setAttribute(arguments[0], arguments[1]);
			}
		}
	}
	else if (typeof arguments === "object"){
		var obj = Object.getOwnPropertyNames(arguments[0]); 
		for (var i = 0; i < this.nodes.length; ++i) {
			for (var j = 0; j < obj.length; ++j) {				
				this.nodes[i].setAttribute(obj[j], arguments[0][obj[j]]);
			}
		}
	}
	return this;
}

// children can be filtered by selector
$.element.prototype.children = function() {
	var children = [], currChildren;
	for (var i = 0; i < this.nodes.length; ++i) {
		// search children and convert to array
		currChildren = Array.prototype.slice.call(this.nodes[i].children);		
		if (arguments.length !== 0) {
			for (var j = 0; j < currChildren.length; ++j) {
				if (currChildren[j].matches(arguments[0])) children.push(currChildren[j]);
			}
		}
		else children = children.concat(currChildren); 
	}
	return new $.element(children);
}

// params: (propertyName), (propertyNames), 
// (propertyName, value), (propertyName, function), (properties)
$.element.prototype.css = function() {
	var properties = {};
	if (arguments.length === 1) {
		if (typeof arguments[0] === 'string') {
			return getComputedStyle(this.nodes[0])[arguments[0]];
		}
		else if (arguments[0] instanceof Array) {
			for (var i = 0; i < arguments[0].length; ++i) {
				properties[arguments[0][i]] = getComputedStyle(this.nodes[0])[arguments[0][i]];				
			}
			return properties;
		}
		else if (arguments[0] instanceof Object) {
			var obj = arguments[0];
			for (var i = 0; i < this.nodes.length; ++i) 
				for (var j in obj) {
					if (obj.hasOwnProperty(j)) this.nodes[i].style[j] = obj[j]; 
				}
		}
	}
	else {
		if (typeof arguments[1] === "function") {
			for (var i = 0; i < this.nodes.length; ++i) {
				this.nodes[i].style[arguments[0]] = arguments[1](i, getComputedStyle(this.nodes[i])[arguments[0]]);
			}
		}
		else {
			for (var i = 0; i < this.nodes.length; ++i) 
				this.nodes[i].style[arguments[0]] = arguments[1];
		}
	}
	return this;
}

//TODO: not enurable?? private!
$.element.prototype.inf = new Map(); // store arbitrary data, keys are arrays

// search array in keys of the map
$.element.prototype.inf.search = function (arr) {
	console.log(this);
	for (var el of this) {
		if (compareArrays(el, arr)) return this.get(el);
	}
}

// compare two arrays, the order of elements is ignored
function compareArrays(arr, arr2) {
    if(arr.length != arr2.length) return false;
    var on = 0;
    for(var i = 0; i < arr.length; ++i){
        for( var j = 0; j < arr2.length; ++j){
            if(arr[i] === arr2[j]){
                on++; 
                break;
            }
        }
    }
    return on === arr.length ? true : false;
}

// (key, value), (obj), (key), ()
$.element.prototype.data = function() {
	var inf = this.inf.search(this.nodes);
	if (arguments.length === 0) return inf;
	else if (arguments.length === 1) {
		if (typeof arguments[0] === "string") {
			return inf[arguments[0]];
		}
		else if (typeof arguments[0] === "object"){
			for (var i in arguments[0]) {
				if (arguments[0].hasOwnProperty(i)) inf[i] = arguments[0][i]; 
			}
		}
	}
	else {
		inf[arguments[0]] = arguments[1];
	}
}

// params (events[, selector][, data], handler)
// data is event.data in handler
$.element.prototype.on = function(events) {
	var handler = arguments[arguments.length - 1]; 
	var new_handler; 
	// if one of parameters is data
	if (arguments.length === 4 || (arguments.length === 3 && typeof arguments[1] !== "string")) {
		var a = arguments.length === 4 ? arguments[2] : arguments[1];
		// handler with data
		new_handler = function(event) {
			event.data = a;
			handler.apply(this, arguments);
		}
	}
	if (typeof arguments[1] === "string") { 
		if (arguments.length === 3) // no data
			this.children(arguments[1]).on(arguments[0], arguments[2]);
		else this.children().on(arguments[0], arguments[2], arguments[3]);
	}
	else {
		// event types are space-separated
		events = events.split(' ');
		for (var i = 0; i < this.nodes.length; ++i) {
			for (var j = 0; j < events.length; ++j) {
				if (arguments.length <= 2) 
					this.nodes[i].addEventListener(events[j], handler);
				else {
					this.nodes[i].addEventListener(events[j], new_handler);
				}
				//	if (typeof arguments[1] === "string") { 
					//	if(this.nodes[i].matches(arguments[1])) {
							/*if (arguments.length === 3) // no data
								this.nodes[i].addEventListener(events[j], handler);
							else 
								this.nodes[i].addEventListener(events[j], new_handler);
					//	}
					}
					else {
						this.nodes[i].addEventListener(events[j], new_handler);
					}
				}*/
			}
		}
	}
	return this;
}

// almost as method on, but handler is executed at most once per element per event type
$.element.prototype.one = function() {
	var old_handler = arguments[arguments.length - 1];
	var handler = function() {
		old_handler.apply(this, arguments); //debugger;
		this.removeEventListener(event.type, handler);
	}
	arguments[arguments.length - 1] = handler;
	// call this.on with chenged handler
	this.on.apply(this, arguments);
	return this;
}
