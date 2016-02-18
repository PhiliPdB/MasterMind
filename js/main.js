var colorElements = document.getElementsByClassName('color');
var attemptRows = [].slice.call(document.getElementsByClassName('row')).reverse();
var currentInput = [null, null, null, null];
var attempt = 0;

window.onload = function() {
	setupAttemptRow();

	// Make the colors draggable
	var colorElementsSize = colorElements.length;
	for (var i = 0; i < colorElementsSize; i++) {
		setupDraggableColor(colorElements[i]);
	}
};

function setupDraggableColor(color) {
	color.setAttribute('draggable', 'true');

	addEvent(color, 'dragstart', function (e) {
		e.dataTransfer.effectAllowed = 'copy';
		var data = {
			id: this.id,
			color: parseInt(this.id.replace('color_', '')),
			fromHole: false
		};
		e.dataTransfer.setData('Text', JSON.stringify(data));
	});

	setupMobileDragDrop(color);
}

function setupAttemptRow() {
	setDropTargets();
	// Display check button
	var checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.opacity = '1';
	checkButton.style.pointerEvents = 'auto';
}

function setDropTargets() {
	var holes = attemptRows[attempt].getElementsByClassName('hole');

	var length = holes.length;
	for (var i = 0; i < length; i++) {
		if (holes[i].className.indexOf('little') > -1) continue;
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
		document.getElementById('win').style.display = 'block';
		document.getElementById('dimmer').style.display = 'block';

		var request = new XMLHttpRequest();
		request.open('POST', 'php/getScore.php', true);

		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					// Handle output
					var response = JSON.parse(request.responseText);
					document.getElementById('score').innerHTML = response.score;
				}
			}
		};
		request.send();
	} else if (attempt + 1 == 12) {
		// show lose
		document.getElementById('lose').style.display = 'block';
		document.getElementById('dimmer').style.display = 'block';
	}
}

function uploadHighScore() {
	var username = document.getElementById('nickname').value;
	var request = new XMLHttpRequest();
	var params = 'username=' + username;
	request.open('POST', 'php/uploadHighScore.php', true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.send(params);
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

		addEvent(element, 'dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			var data = {
				id: this.id,
				color: parseInt(this.id.replace('color_', '')),
				fromHole: false
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
		setupMobileDragDrop(element);
	}
	// Remove event listeners
	var holes = attemptRows[attempt].getElementsByClassName('hole');
	var length = holes.length;
	for (var j = 0; j < length; j++) {
		var old_element = holes[j];
		var new_element = old_element.cloneNode(true);
		new_element.setAttribute('draggable', 'false');
		old_element.parentNode.replaceChild(new_element, old_element);
	}
	// Hide check button
	var checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.opacity = '0';
	checkButton.style.pointerEvents = 'none';

	// Setup next row
	attempt++;
	setupAttemptRow();
}

function setDropZone(element) {
	addEvent(element, 'dragover', function (e) {
		if (e.preventDefault()) e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

	addEvent(element, 'drop', function (e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
		
		var data = JSON.parse(e.dataTransfer.getData('Text'));
		var el, classNameArray, classNameArrayLength, oldColorId, i;
		var id = data.id;
		if (!data.fromHole) {
			// Make the color not draggable anymore
			el = document.getElementById(id);
			el.setAttribute('draggable', 'false');
			el.style.opacity = '.5';
			removeEventListeners(el);

			// Check if hole was filled before
			if (this.className.indexOf('color') > -1) {
				classNameArray = this.className.split(' ');

				oldColorId = null;
				classNameArrayLength = classNameArray.length;
				for (i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					var oldColorElement = document.getElementById(oldColorId);
					oldColorElement.style.opacity = '1';
					setupDraggableColor(oldColorElement);
				}
			}
		} else {
			var otherHole = attemptRows[attempt].getElementsByClassName(data.class)[0];
			var otherHoleClone;
			// Check if hole was filled before
			if (this.className.indexOf('color') > -1) {
				classNameArray = this.className.split(' ');

				oldColorId = null;
				classNameArrayLength = classNameArray.length;
				for (i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					this.className.replace(' ' + oldColorId, '');
					otherHole.className = otherHole.className.replace(
						' color_' + data.color, ' ' + oldColorId
					);
					// Swap colors
					var index1 = parseInt(this.id.replace('hole_', ''));
					var index2 = parseInt(otherHole.id.replace('hole_', ''));
					currentInput[index2] = currentInput[index1];

					otherHoleClone = otherHole.cloneNode(true);
					// Set event listeners
					setDropZone(otherHoleClone);
					addEvent(otherHoleClone, 'dragstart', function (e) {
						e.dataTransfer.effectAllowed = 'copy';
						var data = {
							id: otherHoleClone.id,
							class: otherHoleClone.className,
							color: parseInt(oldColorId.replace('color_', '')),
							fromHole: true
						};
						e.dataTransfer.setData('Text', JSON.stringify(data));
					});
					// Add mobile touch event
					setupTouchDragHole(otherHoleClone, document.getElementById(oldColorId));
					// Replace
					otherHole.parentNode.replaceChild(otherHoleClone, otherHole);
				}
			} else {
				otherHole.className = 'hole';
				otherHole.setAttribute('draggable', 'false');
				currentInput[parseInt(otherHole.id.replace('hole_', ''))] = null;
				otherHoleClone = otherHole.cloneNode(true);
				// Set event listeners
				setDropZone(otherHoleClone);
				// Replace
				otherHole.parentNode.replaceChild(otherHoleClone, otherHole);
			}

			id = 'color_' + data.color;
			el = document.getElementById(id);
		}

		// Handle the drop
		this.className = 'hole filled ' + id;

		// Save color
		var index = parseInt(this.id.replace('hole_', ''));
		currentInput[index] = data.color;

		// Make hole draggable
		// Remove 'old' event listeners
		var holeClone = this.cloneNode(true);
		// Add 'new' event listeners
		holeClone.setAttribute('draggable', 'true');
		setDropZone(holeClone);
		addEvent(holeClone, 'dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			var data = {
				id: holeClone.id,
				class: holeClone.className,
				color: parseInt(el.id.replace('color_', '')),
				fromHole: true
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
		// Make draggable on mobile devices
		setupTouchDragHole(holeClone, el);
		// Replace
		this.parentNode.replaceChild(holeClone, this);
	});
}

function resetBoard() {
	// Reset color code
	resetColors();
	// Reset used colors
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

		addEvent(element, 'dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			var data = {
				id: this.id,
				color: parseInt(this.id.replace('color_', '')),
				fromHole: false
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
		setupMobileDragDrop(element);
	}
	// Remove event listeners and reset colors
	var attemptRowLength = attemptRows.length - 1;
	for (var j = 0; j < attemptRowLength; j++) {
		var holes = attemptRows[j].getElementsByClassName('hole');
		var length = holes.length;
		for (var k = 0; k < length; k++) {
			var old_element = holes[k];
			var new_element = old_element.cloneNode(true);
			new_element.setAttribute('draggable', 'false');
			if (new_element.className.indexOf('little') > -1) {
				new_element.className = 'hole little';
			} else {
				new_element.className = 'hole';
			}
			old_element.parentNode.replaceChild(new_element, old_element);
		}
		// Hide check button
		var checkButton = attemptRows[j].getElementsByClassName('check')[0];
		if (j === 0) {
			checkButton.style.pointerEvents = 'auto';
			checkButton.style.opacity = '1';
		} else {
			checkButton.style.pointerEvents = 'none';
			checkButton.style.opacity = '0';
		}
	}

	// Reset attempt
	attempt = 0;
	setupAttemptRow();
}

function resetColors() {
	var request = new XMLHttpRequest();
	request.open('POST', 'php/resetColors.php', true);
	request.send();
}

function hideLose() {
	document.getElementById('lose').style.display = 'none';
	document.getElementById('dimmer').style.display = 'none';
}

function hideWin() {
	document.getElementById('win').style.display = 'none';
	document.getElementById('dimmer').style.display = 'none';
}

function removeEventListeners(element) {
	var newElement = element.cloneNode(true);
	element.parentNode.replaceChild(newElement, element);
}

function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;
	
	while(element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
}

// This is a function from https://github.com/remy/html5demos
var addEvent = (function () {
	if (document.addEventListener) {
		return function (el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.addEventListener(type, fn, false);
			} else if (el && el.length) {
				for (var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	} else {
		return function (el, type, fn) {
			if (el && el.nodeName || el === window) {
				el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
			} else if (el && el.length) {
				for (var i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	}
})();
