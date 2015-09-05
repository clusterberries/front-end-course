window.onload = function() {
    var searchInput, 
        main,
        loader, // the main obj than load data
        resultsCount = 15; // default count of loading videos
    // create basic html code
    main = document.createElement('main');
    main.innerHTML = '<header><input type="search" placeholder="Search..." autofocus></header>\
        <ul id="ulContainer" class="container"></ul>\
        <footer><ul id="switchPages" class="pagination"></ul></footer>';
    document.body.appendChild(main);

    searchInput = document.querySelector('input[type="search"]');

    // start search and load after press enter
    searchInput.onkeydown =  function(event) {      
        if (event.keyCode === 13) { // press enter
            loader = new Loader(document.getElementById('ulContainer'), document.getElementById('switchPages'), resultsCount);
            // clean old data if it exists
            loader.cleanPage();                      
            loader.setKeyword(this.value);               
            loader.loadData();
        }
    }
}
