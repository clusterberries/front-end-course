var button = document.getElementById('addButton');
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

button.addEventListener('click', createToast);

// create a new toast after 2.5s
setInterval(createToast, 2500); 

toasts.addEventListener('webkitAnimationEnd', function(event) {
    // remove the toast if it has disappeared
    if (event.animationName === 'disappear')
        event.target.remove();
});