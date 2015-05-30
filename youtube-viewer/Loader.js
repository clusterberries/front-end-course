var Loader = function(container, pagination, resultsCount) {
	this.container = container;
	this.pagination = pagination;
	this.countVideosOnPage = window.innerWidth > 800 ? 3 : (window.innerWidth > 540 ? 2 : 1);
	this.position = 0;
	this._nextToken = '';
	this.resultsCount = resultsCount;
}

// constants
Loader.prototype.VERY_BASIC_LINK = 'https://www.googleapis.com/youtube/v3/';
Loader.prototype.YOUTUBE_KEY = 'key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y'
Loader.prototype.BASIC_LINK = Loader.prototype.VERY_BASIC_LINK + 'search?' + Loader.prototype.YOUTUBE_KEY + '&type=video' + '&part=snippet&maxResults=';

Loader.prototype.setKeyword = function(keyword) {
	this.keyword = keyword;
}

// the first request
Loader.prototype.loadData = function(){
    console.log('loadData');
	var keywordLink = '&q=' + encodeURIComponent(this.keyword);
    var link = this.BASIC_LINK + this.resultsCount + keywordLink + this._nextToken; 
    var request = new XMLHttpRequest();

    // var staticticsResponse, dataList;
    request.open("GET", link);
    request.send();
    
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { 
                console.log('onreadystatechange loadData');
                    this._loadStatisticsData(request.responseText);

                    // repaint page when change width of window
                    window.onresize = function() {
                        var currentVideo = -this.position * this.countVideosOnPage; // remembet the current video
		                this.countVideosOnPage = window.innerWidth > 800 ? 3 : (window.innerWidth > 540 ? 2 : 1);
                        // if there 1 or 2 videos at all change count of videos
		                if (this.totalResults < this.countVideosOnPage ) {
					    	this.countVideosOnPage = this.totalResults;
					    }
                        // new position depends on current video
                        this.position = -Math.floor(currentVideo / this.countVideosOnPage); 
		                this._repaint();
		            }.bind(this);
            }
        }    
    }.bind(this); 
};

// the second request by id to load normal title and count of views
Loader.prototype._loadStatisticsData = function(firstResponse) {
    console.log('loadStatisticsData');
    var videoIds = [];
    var request = new XMLHttpRequest();
    var link;
    var responseData = JSON.parse(firstResponse);
    this.totalResults = responseData.pageInfo.totalResults;
    if (this.totalResults === 0) {
    	console.log('no items!'); // TODO show some message!
    	return;
    }
    // if the videos can be loaded to 
    if (this.totalResults < this.countVideosOnPage) {
    	this.countVideosOnPage = this.totalResults;
    }

    for (var i = 0; i < responseData.items.length; ++i) {
        videoIds.push(responseData.items[i].id.videoId);
    }

    videoIds = videoIds.join(','); // all ids of videos separated by ','

    link = this.VERY_BASIC_LINK + 'videos?' + this.YOUTUBE_KEY + 
            '&id=' + videoIds + '&part=snippet,statistics';

    request.open("GET", link);
    request.send();
     
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200) { 
                console.log('onreadystatechange loadStatisticsData');
                this._loadVideosToContainer(this._convertResponseToList(firstResponse, request.responseText)); // TODO add listeners to view videos

                // swipe: drag the container and switch the pages
                this.container.addEventListener('mousedown', function (event) {
				    var leftDirection; // the first direction of cursor move
				    var startPosition = this.container.getBoundingClientRect().left;
				    var xPos = event.clientX;
				    var delX = xPos - startPosition; // position of the cursor in the container
				    document.body.style.cursor = 'move';

				    document.onmousemove = function(event) {        
				        // this.container.classList.remove('smooth'); // without this transition is buggy

				        if (Math.abs(xPos - event.clientX) < 7) return; //TODO smth wrong
				        if (xPos > event.clientX) leftDirection = true;
				        else leftDirection = false;
				        // after definition of cursor direction create new handler
				        document.onmousemove = function(event) {
				            // remove animation
				            this.container.classList.remove('smooth');
				            // if the direction of the cursor is the same
				            if (xPos > event.clientX === leftDirection) {
				                this.container.style.left = (event.clientX - delX) + 'px';
				                xPos = event.clientX;
				            } // if user change direction of the cursor switch the page
				            else {
				                this._switchPage(startPosition);
				                startPosition = this.container.getBoundingClientRect().left;
				                xPos = event.clientX;
				                delX = xPos - startPosition;
				            }   
				        }.bind(this);
				    }.bind(this);

				    document.onmouseup = function() {
				        document.onmousemove = null;
				        this._switchPage(startPosition);  
				        document.body.style.cursor = 'default';
				    }.bind(this);	    
				}.bind(this));
            }
        }
    }.bind(this);
}

// function gets two respons and return list with necessary information
Loader.prototype._convertResponseToList = function(searchResponse, videosResponse) {
    var videosList = [];
    searchResponse = JSON.parse(searchResponse);
    videosResponse = JSON.parse(videosResponse).items;

    // next page for search
    if (searchResponse.nextPageToken == undefined) this.loadData = function(){
    	console.log('no more data!'); // TODO show message instead of console
    	// this.position++;
    	this.container.style.left = (this.position * 100) + '%';
    	[].forEach.call(this.lis, function(item) {
	        item.classList.remove('currentPage');
	    });
    	this.lis[-this.position].classList.add('currentPage');
    };

    this._nextToken = '&pageToken=' + searchResponse.nextPageToken;
    searchResponse = searchResponse.items;

    for (var i = 0; i < searchResponse.length; ++i) {
        videosList[i] = {
            // id: searchResponse[i].id.videoId,
            youtubeLink: 'http://www.youtube.com/watch?v=' + searchResponse[i].id.videoId,
            title: searchResponse[i].snippet.title,
            description: searchResponse[i].snippet.description,
            thumbnailUrl: searchResponse[i].snippet.thumbnails.high.url,
            date: new Date(searchResponse[i].snippet.publishedAt).toDateString().slice(4), 
            author: videosResponse[i].snippet.channelTitle,
            views: videosResponse[i].statistics.viewCount
        };
    }

    return videosList;
 }

// create elements and add to the container
Loader.prototype._loadVideosToContainer = function(videosList) {
    var element, htmlText, currNumber = this.container.getElementsByClassName('item').length;
    for (var i = 0; i < videosList.length; ++i) {
        element = document.createElement('li');
        element.classList.add('item');
        htmlText = '<img src="' + videosList[i].thumbnailUrl + '" draggable="false">\
            <h3><a href="' + videosList[i].youtubeLink + '" draggable="false">' + videosList[i].title + '</a></h3>\
            <p class="author">by ' + videosList[i].author + '</p>\
            <p class="date">' + videosList[i].date + '</p>\
            <p class="views">views: ' + videosList[i].views + '</p>\
            <p class="description">' + videosList[i].description + '</p>';
        element.innerHTML = htmlText;
        this.container.appendChild(element); 
    }

    console.log('loadvideostoContainer');
    this._repaint();
}

Loader.prototype._switchPage = function(startPosition) {
    var endPosition = this.container.getBoundingClientRect().left;
    var diff = startPosition - endPosition;
    
    this.container.classList.add('smooth'); // smooth animation

    // drag to the left
    if (diff > 70) {
        this.position = Math.floor(endPosition / window.innerWidth);
    }
    // to the right
    if (diff < -70 && this.position !== 0) {
        this.position = Math.ceil(endPosition / window.innerWidth);
    }
    // if the current page is the last load more video
    if (-this.position + 1 >= this.lis.length) {
        document.body.style.cursor = 'default';
        if (this._nextToken === '&pageToken=undefined' && -this.position >= this.lis.length - 1) {
            this.position = -(this.lis.length - 1);
        }
        // this.container.style.left = (this.position * 100) + '%';
        this.loadData(); 
        console.log('pos ' + (-this.position) + '\tlis ' + (this.lis.length - 1));
        document.onmousemove = null;
        document.onmouseup = null;
    }
    else {
	    // set new position
        // this.container.style.left = (this.position * 100) + '%';

        // change color of current page in pagination
        [].forEach.call(this.lis, function(item) {
            item.classList.remove('currentPage');
        });
        this.lis[-this.position].classList.add('currentPage');
    }
    this.container.style.left = (this.position * 100) + '%';
}

// set new width and pagination
Loader.prototype._repaint = function(){ //TODO when add new videos dont delete all pagination
    console.log('repaint');
    var countOfPages = document.getElementsByClassName('item').length / this.countVideosOnPage;
    this.pagination.innerHTML = '';
    for (var i = 0; i < countOfPages; ++i) {
        this.pagination.appendChild(document.createElement('li'));
    }
    this.lis = this.pagination.getElementsByTagName('li');

    [].forEach.call(this.lis, function(item) {
        item.classList.remove('currentPage');
    });

    // calculate new width and position
    this.container.style.width = countOfPages * 100 + '%';
    this.container.style.left = (this.position * 100) + '%';

    // handler for clicks on pagination
    this.pagination.onclick = function(event) { // TODO: if the page is the last, load new!!!
        console.log('pagination click');
        if (event.target.tagName !== 'LI') return;
        this.position = -[].indexOf.call(this.pagination.children, event.target); 
        // smooth animation
        this.container.classList.add('smooth');
         // set new position
        this.container.style.left = (this.position * 100) + '%';

        // change color of current page in pagination
        [].forEach.call(this.lis, function(item) {
            item.classList.remove('currentPage');
        });
        event.target.classList.add('currentPage');

        if (-this.position === this.lis.length - 1) {
            this.pagination.onclick = null;
            this.loadData(); 
        }
    }.bind(this);

    this.lis[-this.position].classList.add('currentPage'); // TODO warning! there may be en error! 
}


Loader.prototype.cleanPage = function(){
    // clean page
    this.container.innerHTML = '';
    this.pagination.innerHTML = '';
    this.container.style.left = '0px';
    // dont't need old token
	this._nextToken = '';
    this.position = 0;
};





/*
TODO list

add animation
 - smooth load data (smth as in the task animation)
 - show number of page when hover
 - add support press arrows to switch page
 - add messages when videos are over
*/