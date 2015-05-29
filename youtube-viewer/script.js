var container, 
    pages, 
    // lis, 
    searchInput;
    // position = 0, // position of the container with videos
    // countVideosOnPage;

// var nextToken = '';

window.onload = function() {
    // create basic html code
    var main = document.createElement('main');
    var loader;
    var resultsCount = 15;
    main.innerHTML = '<header><input type="search" placeholder="Search..." autofocus></header>\
        <ul id="ulContainer" class="container"></ul>\
        <footer><ul id="switchPages" class="pagination"></ul></footer>';
    document.body.appendChild(main);

    container = document.getElementById('ulContainer');
    pages = document.getElementById('switchPages');
    searchInput = document.querySelector('input[type="search"]');

    loader = new Loader(container, pages, resultsCount);

    // start search and load after press enter
    searchInput.addEventListener('keydown', function(event) {      
        if (event.keyCode === 13) { // press enter
            loader.cleanPage();
            // javascript00 - 24
            // javascript88 - 1
            // javascript88fhf - 0
            loader.setKeyword('javascript88');// TODO this.value                
            loader.loadData();
        }
    });
}
