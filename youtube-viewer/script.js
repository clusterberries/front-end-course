var container, pages, lis, startPosition, searchInput;
var position = 0; // position of the container with videos
var resultsCount = 15;
var veryBasicLink = 'https://www.googleapis.com/youtube/v3/';
var youTubeKey = 'key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y'
var basicLink = veryBasicLink + 'search?' + youTubeKey + '&type=video' + '&part=snippet&maxResults=';
var nextToken = '';

window.onload = function() {
    // create basic html code
    var main = document.createElement('main');
    main.innerHTML = '<header><input type="search" placeholder="Search..."></header>\
        <ul id="ulContainer" class="container"></ul>\
        <footer><ul id="switchPages" class="pagination"></ul></footer>';
    document.body.appendChild(main);

    container = document.getElementById('ulContainer');
    pages = document.getElementById('switchPages');
    searchInput = document.querySelector('input[type="search"]');

    container.addEventListener('mousedown', mouseDownHandler);

    searchInput.addEventListener('keydown', function(event) {
        // press enter
        if (event.keyCode === 13) {
            // new token
            nextToken = '';
            // clean container
            container.innerHTML = '';
            // loadData(this.value);      
            loadData('javascript');      
        }
    });

}


// keyword, count
function loadData (keyword){
    keyword = '&q=' + encodeURIComponent(keyword);
    var link = basicLink + resultsCount + keyword + nextToken; 
    var request = new XMLHttpRequest();

    var snippetResponse, staticticsResponse, dataList;
    request.open("GET", link);
    request.send();
     
            // TODO do we need this property?
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { 
                    snippetResponse = request.responseText;
                    loadStatisticsData(snippetResponse);
            }
        }    
    } 

};

// the second request by id to load normal title and count of views
function loadStatisticsData(firstResponse) {
    var videoIds = [];
    var request = new XMLHttpRequest();
    var link;
    var items = JSON.parse(firstResponse).items; 

    for (var i = 0; i < items.length; ++i) {
        videoIds.push(items[i].id.videoId);
    }

    videoIds = videoIds.join(','); // all ids of videos separated by ','

    link = veryBasicLink + 'videos?' + youTubeKey + 
            '&id=' + videoIds + '&part=snippet,statistics';

    request.open("GET", link);
    request.send();
     
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { 
                loadVideosToContainer(convertResponseToList(firstResponse, request.responseText));
            }
        }
    }
}

// function gets two respons and return list with necessary information
function convertResponseToList(searchResponse, videosResponse) {
    var videosList = [];
    searchResponse = JSON.parse(searchResponse);
    videosResponse = JSON.parse(videosResponse).items;

    // next page for search
    nextToken = '&pageToken=' + searchResponse.nextPageToken;
    searchResponse = searchResponse.items;

    for (var i = 0; i < searchResponse.length; ++i) {
        videosList[i] = {
            // id: searchResponse[i].id.videoId,
            youtubeLink: 'http://www.youtube.com/watch?v=' + searchResponse[i].id.videoId,
            title: searchResponse[i].snippet.title,
            description: searchResponse[i].snippet.description,
            thumbnailUrl: searchResponse[i].snippet.thumbnails.medium.url,
            date: new Date(searchResponse[i].snippet.publishedAt).toDateString(), 
            author: videosResponse[i].snippet.channelTitle,
            views: videosResponse[i].statistics.viewCount
        };
    }

    return videosList;
 }

function loadVideosToContainer(videosList) {
    console.log('fff');
    var element, countOfPages;
    for (var i = 0; i < videosList.length; ++i) {
        element = document.createElement('li');
        element.classList.add('item');
        element.innerHTML = videosList[i].title;
        container.appendChild(element);
    }

    countOfPages = document.getElementsByClassName('item').length / 3; // TODO count of videos?
    for (var i = 0; i < countOfPages; ++i) {
        pages.appendChild(document.createElement('li'));
    }
    lis = pages.getElementsByTagName('li');  

    // handler for clicks on paginations
    pages.addEventListener('click', function(event) {
        var position = -[].indexOf.call(this.children, event.target);
        // smooth animation
        container.classList.add('smooth');
         // set new position
        container.style.left = (position * 100) + '%';

        // change color of current page in pagination
        [].forEach.call(lis, function(item) {
            item.style.backgroundColor = '#fff';
        });
        event.target.style.backgroundColor = '#ccc';

    });
}


// DO THIS AFTER SEARCH AND DATA LOADING



// drag the container and switch the pages
// container.addEventListener('mousedown', 
function mouseDownHandler(event) {
    startPosition = container.getBoundingClientRect().left;
    var diff, leftDirection;
    var xPos = event.clientX;
    var delX = xPos - startPosition; // position of the cursor in the container

    document.body.style.cursor = 'move';
    document.onmousemove = function(event) {
        // without this transition is buggy
        container.style.transition = '';

        if (xPos > event.clientX) leftDirection = true;
        else leftDirection = false;
        document.onmousemove = function(event) {
            // remove animation
            container.classList.remove('smooth');
            // if the direction of the cursor is the same
            if (xPos > event.clientX === leftDirection) {
                container.style.left = (event.clientX - delX) + 'px';
                xPos = event.clientX;
            } // if user change direction of the cursor switch the page
            else {
                switchPage();
                startPosition = container.getBoundingClientRect().left;
                xPos = event.clientX;
                delX = xPos - startPosition;
            }
            
        }
    }

    document.onmouseup = function() {
        document.onmousemove = null;
        switchPage();  
        document.body.style.cursor = 'default';
    }

}


function switchPage() {
    var endPosition = container.getBoundingClientRect().left;
    // smooth animation
    container.classList.add('smooth');

    diff = startPosition - endPosition;
    // drag to the left
    if (diff > 0) { // TODO try to set value 20, for example. Mb it will work?
        position = Math.floor(endPosition / window.innerWidth);
        // TODO load new videos!
    }
    // to the right
    if (diff < 0 && position !== 0) {
        position = Math.ceil(endPosition / window.innerWidth);
    }
    // set new position
    container.style.left = (position * 100) + '%';

    // change color of current page in pagination
    [].forEach.call(lis, function(item) {
        item.style.backgroundColor = '#fff';
    });
    lis[-position].style.backgroundColor = '#ccc';
}





