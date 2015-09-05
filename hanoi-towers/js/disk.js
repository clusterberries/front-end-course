function Disk(num, width, height, dragHandler) {
	this.num = num;
	this.width = width;
	this.height = height;
	this.dragHandler = dragHandler;
	this.tower = null;
}

Disk.prototype.getNum = function() {
	return this.num;
};

Disk.prototype.getTower = function() {
	return this.tower;
};

Disk.prototype.setTower = function(tower) {
	this.tower = tower;
};

// returns jQuery obj containig image element for specific disk, selected by id
Disk.prototype.getImageElement = function() {
	return $('#diskig' + this.num);
};

// creates and returns jQuery obj, containing img element
// <img id="diskig1" src="img/disk1.gif" width="100" height="18" />
Disk.prototype.createImageElement = function() {
	var imgString = '<img id="diskig' + this.num + '" src="img/disk' + this.num 
		+ '.gif" width="' + this.width + 'px" height="' + this.height + 'px" />';
	return $(imgString);
};

Disk.prototype.init = function() {
	this.setDraggable(true);
};

Disk.prototype.setDraggable = function(enabled) {
	var elem = this.getImageElement();

	// if enabled make elem daraggable and attach drag handler
	// else remove the draggable functionality completely if elem is draggable.
	if (enabled) {
		elem.draggable({drag: this.dragHandler});
	}
	else {
		if (elem.data('draggable')) elem.draggable('destroy'); 
	}

};

Disk.prototype.setDraggableRevert = function(enabled) {
	var img = this.getImageElement();

	// enable revert option for img to return it on prev position, if img don't hover a tower
	img.draggable('option', 'revert', enabled); // check?
};

Disk.prototype.position = function() {
	var elem = this.getImageElement();
	var top = this.tower.calcDiskTop(this.num, this.height);
	var left = this.tower.calcDiskLeft(this.width);


	// set here absolute position for the elem
	elem.css({'position': 'absolute', 'top': top, 'left': left}); 
};