var addButton = document.getElementById('addButton');
var showButton = document.getElementById('showButton');
var icons = document.getElementById('iconsContainer');

/* Toasts animation */
var toasts = document.getElementById('toastsContainer');
var messages = ['Error! Something is broken!', 
    'Success! Everything is under control.', 
    'Warning: something goes wrong!', 
    'Message: lorem ipsum.'];
var classes = ['err', 'success', 'warn', 'mess'];

var createToast = function() {
    var newToast = document.createElement('div'); 
    var i = Math.floor(Math.random() * 4);
    newToast.className = 'toast ' + classes[i];
    newToast.innerHTML = messages[i];
    toasts.appendChild(newToast);
}

addButton.addEventListener('click', createToast);

// create a new toast after 2.5s
setInterval(createToast, 2500); 

toasts.addEventListener('webkitAnimationEnd', function(event) {
    // remove the toast if it has disappeared
    if (event.animationName === 'disappear')
        event.target.remove();
});

toasts.addEventListener('animationend', function(event) {
    // remove the toast if it has disappeared
    if (event.animationName === 'disappear')
        event.target.remove();
});


/* Icons animation */
showButton.addEventListener('click', function() {
    if (showButton.classList.contains('show')) {
        showButton.classList.remove('show');
        showButton.classList.add('hide');
        icons.classList.add('hidden');
        icons.classList.remove('showed');
    }
    else {
        showButton.classList.remove('hide');
        showButton.classList.add('show');
        icons.classList.add('showed');
        icons.classList.remove('hidden');
    }  
});

