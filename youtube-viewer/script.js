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

    loader = new Loader(document.getElementById('ulContainer'), document.getElementById('switchPages'), resultsCount);

    // start search and load after press enter
    searchInput.addEventListener('keydown', function(event) {      
        if (event.keyCode === 13) { // press enter
            loader.cleanPage();
            // for testing: 
            // javascript00 - load 24 items
            // javascript88 - load 1 items
            // javascript88f - load 0 items
            loader.setKeyword('javascript00');// TODO delete this                
            // loader.setKeyword(this.value );               
            loader.loadData();
        }
    });
}
