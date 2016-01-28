var colorElements = document.getElementsByClassName('color');
var attemptRows = [].slice.call(document.getElementsByClassName('row')).reverse();
var attempt = 0;

window.onload = function() {
	setDropTargets();

	// Make the colors draggable
	var colorElementsSize = colorElements.length;
	for (var i = 0; i < colorElementsSize; i++) {
		var element = colorElements[i];

		element.setAttribute('draggable', 'true');

		element.addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('id', this.id);
		});
	}
};

function setDropTargets() {
	var holes = attemptRows[attempt].getElementsByClassName('hole');

	var length = holes.length;
	for (var i = 0; i < length; i++) {
		var hole = holes[i];

		hole.addEventListener('dragover', function (e) {
			if (e.preventDefault()) e.preventDefault();
			this.className += ' over';
			e.dataTransfer.dropEffect = 'copy';
			return false;
		});

		// to get IE to work
		hole.addEventListener('dragenter', function (e) {
			this.className += ' over';
			return false;
		});

		hole.addEventListener('dragleave', function () {
			this.className.replace(' over', '');
		});

		hole.addEventListener('drop', function (e) {
			if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???

			var el = document.getElementById(e.dataTransfer.getData('id'));
			el.setAttribute('draggable', 'false');
			el.style.opacity = '.5';
			// Check if hole was filled before
			if (this.className.indexOf('color') > -1) {
				var classNameArray = this.className.split(' ');
				console.log(classNameArray);

				var oldColorId = null;
				var classNameArrayLength = classNameArray.length;
				for (var i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					var oldColorElement = document.getElementById(oldColorId);
					oldColorElement.setAttribute('draggable', 'true');
					oldColorElement.style.opacity = '1';
				}
			}

			// Handle the drop
			this.className = 'hole filled ' + e.dataTransfer.getData('id');

			// TODO: Make hole draggble
			// TODO: Save color so we can check if it is right
		});
	}
}