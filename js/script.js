var colorElements = document.getElementsByClassName('color');
var attemptRows = [].slice.call(document.getElementsByClassName('row')).reverse();
var currentInput = [null, null, null, null];
var attempt = 0;

window.onload = function() {
	setupAttemptRow();

	// Make the colors draggable
	var colorElementsSize = colorElements.length;
	for (var i = 0; i < colorElementsSize; i++) {
		var element = colorElements[i];

		element.setAttribute('draggable', 'true');

		element.addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('id', this.id);
			e.dataTransfer.setData('color', parseInt(this.id.replace('color_', '')));
			e.dataTransfer.setData('fromHole', false);
		});
	}
};

function setupAttemptRow() {
	setDropTargets();
	// Display check button
	var checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.display = 'block';
	checkButton.style.opacity = '1';
}

function setDropTargets() {
	var holes = attemptRows[attempt].getElementsByClassName('hole');

	var length = holes.length;
	for (var i = 0; i < length; i++) {
		setDropZone(holes[i]);
	}
}

function checkColors() {
	if (currentInput.indexOf(null) > -1) {
		// Not all holes are filled
		return;
	}

	var request = new XMLHttpRequest();
	var params = 'colors=' + currentInput;

	request.open('POST', 'php/validateColors.php', true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", params.length);
	request.setRequestHeader("Connection", "close");

	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				// Handle output
				handleColorValidation(JSON.parse(request.responseText));
			}
		}
	};
	request.send(params);
}

function handleColorValidation(validation) {
	var won = validation.black == 4;
	var little_holes = attemptRows[attempt].getElementsByClassName('little hole');
	// Fill the little holes
	var length = little_holes.length;
	for (var i = 0; i < length; i++) {
		if (validation.black > 0) {
			little_holes[i].className += " filled black";
			validation.black--;
			continue;
		} else if (validation.white > 0) {
			little_holes[i].className += " filled white";
			validation.white--;
			continue;
		} else break;
	}
	// Next step
	if (!won && attempt + 1 < 12) {
		nextAttempt();
	} else if (won) {
		// TODO show solution
	} else if (attempt + 1 == 12) {
		// TODO show lose
	}
}

function nextAttempt() {
	// reset used colors
	currentInput = [null, null, null, null];
	// Make the colors draggable
	var colorElementsSize = colorElements.length;
	for (var i = 0; i < colorElementsSize; i++) {
		var element = colorElements[i];

		if (element.getAttribute('draggable') == "true") {
			continue;
		}

		element.setAttribute('draggable', 'true');
		element.style.opacity = '1';

		element.addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('id', this.id);
			e.dataTransfer.setData('color', parseInt(this.id.replace('color_', '')));
		});
	}
	// Remove event listeners
	var holes = attemptRows[attempt].getElementsByClassName('hole');
	var length = holes.length;
	for (var j = 0; j < length; j++) {
		var old_element = holes[j];
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
	}
	// Hide check button
	var checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.display = 'none';
	checkButton.style.opacity = '0';

	// Setup next row
	attempt++;
	setupAttemptRow();
}

function setDropZone(element) {
	element.addEventListener('dragover', function (e) {
		if (e.preventDefault()) e.preventDefault();
		// if (this.className.indexOf(' over') > -1) this.className += ' over';
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

	// to get IE to work
	element.addEventListener('dragenter', function (e) {
		// if (this.className.indexOf(' over') > -1) this.className += ' over';
		return false;
	});

	element.addEventListener('dragleave', function () {
		// this.className.replace(' over', '');
	});

	element.addEventListener('drop', function (e) {
		if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
		
		var el;
		var id = e.dataTransfer.getData('id');
		if (e.dataTransfer.getData('fromHole') === "false") {
			// Make the color not draggable anymore
			el = document.getElementById(e.dataTransfer.getData('id'));
			el.setAttribute('draggable', 'false');
			el.style.opacity = '.5';

			// Check if hole was filled before
			if (this.className.indexOf('color') > -1) {
				var classNameArray = this.className.split(' ');

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
		} else {
			var otherHole = attemptRows[attempt].getElementsByClassName(e.dataTransfer.getData('class'))[0];
			console.log(e.dataTransfer.getData('class'));
			console.log(otherHole);
			// Check if hole was filled before
			if (this.className.indexOf('color') > -1) {
				var classNameArray = this.className.split(' ');

				var oldColorId = null;
				var classNameArrayLength = classNameArray.length;
				for (var i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					this.className.replace(' ' + oldColorId, '');
					otherHole.className = otherHole.className.replace(
						' color_' + e.dataTransfer.getData('color'), ' ' + oldColorId
					);

					var otherHoleClone = otherHole.cloneNode(true);
					// Set event listeners
					setDropZone(otherHoleClone);
					otherHoleClone.addEventListener('dragstart', function (e) {
						e.dataTransfer.effectAllowed = 'copy';
						e.dataTransfer.setData('id', otherHoleClone.id);
						e.dataTransfer.setData('class', otherHoleClone.className);
						e.dataTransfer.setData('color', parseInt(oldColorId.replace('color_', '')));
						e.dataTransfer.setData('fromHole', true);
					});
					// Replace
					otherHole.parentNode.replaceChild(otherHoleClone, otherHole);
				}
			} else {
				otherHole.className = 'hole';
				otherHole.setAttribute('draggable', 'false');
			}

			id = 'color_' + e.dataTransfer.getData('color');
			el = document.getElementById(id);
		}

		// Handle the drop
		this.className = 'hole filled ' + id;

		// Save color
		var index = parseInt(this.id.replace('hole_', ''));
		var color = parseInt(el.id.replace('color_', ''));
		currentInput[index] = color;

		// TODO: Make hole draggable
		this.setAttribute('draggable', 'true');

		this.addEventListener('dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('id', this.id);
			e.dataTransfer.setData('class', this.className);
			e.dataTransfer.setData('color', parseInt(el.id.replace('color_', '')));
			e.dataTransfer.setData('fromHole', true);
		});
	});
}
