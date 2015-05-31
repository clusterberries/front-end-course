var touchmoveHandler2,  //these handlers must be grobal because they will be added and removed
    touchstartHandler,  //in different methods. Unfortunately properties such as ontouchstart dont work
    touchendHandler;  

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
	var keywordLink = '&q=' + encodeURIComponent(this.keyword);
    var link = this.BASIC_LINK + this.resultsCount + keywordLink + this._nextToken; 
    var request = new XMLHttpRequest();

    // var staticticsResponse, dataList;
    request.open("GET", link);
    request.send();
    
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) { 
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
            else {
                this.showMessage('Error! Status: ' + request.status);
            }  
        } 
        else if (request.status !== 200) {
            this.showMessage('Error! Status: ' + request.status);
        }   
    }.bind(this); 

};

// the second request by id to load normal title and count of views
Loader.prototype._loadStatisticsData = function(firstResponse) {
    var videoIds = [];
    var request = new XMLHttpRequest();
    var link;
    var responseData = JSON.parse(firstResponse);
    this.totalResults = responseData.pageInfo.totalResults;
    if (this.totalResults === 0) {
        this.showMessage('No videos!');
        this._repaint = function(){}; // without this errors will occur
    	return;
    }
    // if the videos can be loaded to 
    if (this.totalResults < this.countVideosOnPage) {
    	this.countVideosOnPage = this.totalResults;
    }

    for (var i = 0; i < responseData.items.length; ++i) {
        videoIds.push(responseData.items[i].id.videoId);
    }
    // all ids of videos separated by ','
    videoIds = videoIds.join(','); 

    link = this.VERY_BASIC_LINK + 'videos?' + this.YOUTUBE_KEY + 
            '&id=' + videoIds + '&part=snippet,statistics';

    request.open("GET", link);
    request.send();
     
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) { 
                this._loadVideosToContainer(this._convertResponseToList(firstResponse, request.responseText));
                this._addSwipeListeners();
            }
        }
        else if (request.status !== 200) {
            this.showMessage('Error! Status: ' + request.status);
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
    	this.showMessage('No more videos!');
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

    // create pagination arrows
    element = document.getElementById('rightArrow');
    if (element) {
        element.remove();
        document.getElementById('leftArrow').remove();
    }
    element = document.createElement('div');
    element.classList.add('arrow');
    element.setAttribute('id', 'rightArrow');
    element.innerHTML = '&#9654;';
    document.body.appendChild(element);
    element.onclick = function(event) {
        this.position--;
        this.container.style.left = (this.position * 100) + '%';
        this.lis[-this.position - 1].classList.remove('currentPage');
        this.lis[-this.position].classList.add('currentPage');
        if (-this.position === this.lis.length - 1) {
            event.target.onclick = null;
            this.loadData(); 
        }
        this._checkPagination();
    }.bind(this);
    element = document.createElement('div');
    element.classList.add('arrow');
    element.setAttribute('id', 'leftArrow');
    element.innerHTML = '&#9664;';
    element.onclick = function(event) {
        if (this.position === 0) return;
        this.position++;
        this.container.style.left = (this.position * 100) + '%';
        this.lis[-this.position + 1].classList.remove('currentPage');
        this.lis[-this.position].classList.add('currentPage');
        this._checkPagination();
    }.bind(this);
    document.body.appendChild(element);

    this._repaint();
}

// TODO: try to refactor and unite handlers if possible
// swipe: drag the container and switch the pages with mouse and with finger
Loader.prototype._addSwipeListeners = function() {
    var leftDirection, // the first direction of cursor/finger move
        startPosition,
        xPos,
        delX,
        touchmoveHandler1;

    // for touchscreen // dont know why, but properties such ontouchmove dont work
    touchendHandler = function() {
        document.removeEventListener('touchmove', touchmoveHandler2);
        this._switchPage(startPosition);  
        document.body.style.cursor = 'default';
    }.bind(this);

    touchstartHandler = function (event) {
        if (event.touches.length != 1) { // need just one finger
            return;
        }
        startPosition = this.container.getBoundingClientRect().left;
        xPos = event.targetTouches[0].clientX;
        delX = xPos - startPosition; // position of the touch in the container

        document.body.style.cursor = 'move';

        document.addEventListener('touchmove', touchmoveHandler1);    
        document.addEventListener('touchend', touchendHandler); 

    }.bind(this);

    touchmoveHandler2 = function(event) {
        // remove animation
        this.container.classList.remove('smooth');
        // if the direction of the touch is the same
        if (xPos > event.targetTouches[0].clientX === leftDirection) {
            this.container.style.left = (event.targetTouches[0].clientX - delX) + 'px';
            xPos = event.targetTouches[0].clientX;
        } // if user change direction of the touch switch the page
        else {
            this._switchPage(startPosition);
            startPosition = this.container.getBoundingClientRect().left;
            xPos = event.targetTouches[0].clientX;
            delX = xPos - startPosition;
        } 
    }.bind(this);

    touchmoveHandler1 = function(event) {
        if (Math.abs(xPos - event.targetTouches[0].clientX) < 7) return; 
        if (xPos > event.targetTouches[0].clientX) leftDirection = true;
        else leftDirection = false;
        // after definition of touch direction create new handler
        document.removeEventListener('touchmove', touchmoveHandler1);
        document.addEventListener('touchmove', touchmoveHandler2);
    }.bind(this);

    this.container.addEventListener('touchstart', touchstartHandler);

    // for mouse move
    this.container.onmousedown = function (event) {
        startPosition = this.container.getBoundingClientRect().left;
        xPos = event.clientX;
        delX = xPos - startPosition; // position of the cursor in the container
        document.body.style.cursor = 'move';

        document.onmousemove = function(event) {        
            if (Math.abs(xPos - event.clientX) < 7) return; 
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
    }.bind(this);

}

// scroll current page to the beginning of window when swipe or mouseup
Loader.prototype._switchPage = function(startPosition) {
    var endPosition = this.container.getBoundingClientRect().left;
    var diff = startPosition - endPosition;
    
    this.container.classList.add('smooth'); // smooth animation

    // if drag to the left
    if (diff > 70) {
        this.position = Math.floor(endPosition / window.innerWidth);
    }
    // if to the right
    if (diff < -70 && this.position !== 0) {
        this.position = Math.ceil(endPosition / window.innerWidth);
    }
    // load more video if the current page is the last 
    if (-this.position + 1 >= this.lis.length) {
        document.body.style.cursor = 'default';
        if (this._nextToken === '&pageToken=undefined' && -this.position >= this.lis.length - 1) {
            this.position = -(this.lis.length - 1);
        }
        this.loadData(); 
        // dont switch pages before data loads
        document.onmousemove = null;
        document.onmouseup = null;
        this.container.onmousedown = null;
        document.removeEventListener('touchmove', touchmoveHandler2);
        document.removeEventListener('touchend', touchendHandler);
        this.container.removeEventListener('touchstart', touchstartHandler); 
    }
    else {
        // change color of current page in pagination
        [].forEach.call(this.lis, function(item) {
            item.classList.remove('currentPage');
        });
        this.lis[-this.position].classList.add('currentPage');
    }
    // set new position
    this.container.style.left = (this.position * 100) + '%';
    this._checkPagination();
}

// set new width, position and pagination
Loader.prototype._repaint = function(){ 
    var countOfPages = document.getElementsByClassName('item').length / this.countVideosOnPage;
    this.pagination.innerHTML = '';
    // create new pagination
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
    this.pagination.onclick = function(event) {
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
            this.loadData(); 
        }
    }.bind(this);

    this.pagination.onmouseover = function(event) {
        if (event.target.tagName !== 'LI') return;
        var el = document.createElement('div');
        el.classList.add('tooltip');
        el.innerHTML = [].indexOf.call(this.pagination.children, event.target) + 1;
        el.style.left = event.pageX - 11 + 'px';
        el.style.top = event.pageY - 40 + 'px';
        document.body.appendChild(el);

        // listen when animation ends and then delete tooltip
        el.addEventListener('webkitAnimationEnd', function(event) {
            if (event.animationName === 'show')
            event.target.remove();
        });
        el.addEventListener('animationend', function(event) {
            if (event.animationName === 'show')
            event.target.remove();
        });
    }.bind(this);

    this.lis[-this.position].classList.add('currentPage');
    this._checkPagination();
}

// delete all content on page
Loader.prototype.cleanPage = function(){
    // clean page
    this.container.innerHTML = '';
    this.pagination.innerHTML = '';
    this.container.style.left = '0px';
    // dont't need old token
	this._nextToken = '';
    this.position = 0;
};

// check position of pogination and current page
Loader.prototype._checkPagination = function() {
    // I dont really understand how it should work and why now it works every other time
    if (this.lis[-this.position].getBoundingClientRect().right > window.innerWidth - 40) {
        console.log(-this.position);
        this.pagination.style.right = this.lis[this.lis.length - 1].getBoundingClientRect().right - window.innerWidth + 'px';
        this.pagination.style.left = '';
    }
    else if (this.lis[-this.position].getBoundingClientRect().left < 60) {
        if (this.position === 0) this.pagination.style.left = '40px';
        this.pagination.style.left = this.pagination.getBoundingClientRect().left - this.lis[0].getBoundingClientRect().left + 'px';
        this.pagination.style.right = '';
    }
}

// show message in the top right corner
Loader.prototype.showMessage = function(message){
    var el = document.createElement('div');
    el.classList.add('message');
    el.innerHTML = message;
    document.body.appendChild(el);
    // listen when animation ends and then delete message
    el.addEventListener('webkitAnimationEnd', function(event) {
        if (event.animationName === 'show')
        event.target.remove();
    });
    el.addEventListener('animationend', function(event) {
        if (event.animationName === 'show')
        event.target.remove();
    });
};

