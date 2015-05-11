function Autocomplete(arr) {
	this.strings = [];
	if (arguments.length === 1 && arr instanceof Array) {
		for (var i = 0, j = 0; i < arr.length; ++i, ++j) {
			if (typeof arr[i] === 'string' && arr[i] !== '')
				this.strings[j] = arr[i];
			else --j;
		}
	}
}

Autocomplete.prototype.addString = function(val) {
	if (typeof val === 'string' && val !== '') {
		this.strings.push(val);
	}
	else if (val instanceof Array) {
		for (var i = 0; i < val.length; ++i) {
			if (typeof val[i] === 'string' && val[i] !== '')
				this.strings.push(val[i]);
		}
	}
}

Autocomplete.prototype.getSuggestions = function(val) {
	var results = [];
	if (typeof val === 'string' && val !== '') {
		for (var i = 0; i < this.strings.length; ++i) {
			if (this.strings[i].indexOf(val) === 0) 
				results.push(this.strings[i]);
		}
	}
	return results;
}


/*
конструктор
 - содержит массив значений strings
 - инициализируем массивом
 - пустой конструктор - пустой массив
 - если строка пустая или вообще не строка - не добавляем

метод addString добавления значения в массив
	- можно передать массив, можно - строку

метод getSuggestions - передаём строку, получаем значения
	- 

*/