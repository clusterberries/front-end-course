var autocomplete = new Autocomplete();
var button = document.getElementById('addButton');
var input = document.getElementById('searchInput')

button.addEventListener('click', function() {
	autocomplete.addString(document.getElementById('addInput').value);
	document.getElementById('addInput').value = '';
});

input.addEventListener('keyup', function() {
	var s = document.getElementById('searchInput').value;
	var res = autocomplete.getSuggestions(s);
});


document.getElementById('searchInput');