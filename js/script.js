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

		addEvent(element, 'dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			var data = {
				id: this.id,
				color: parseInt(this.id.replace('color_', '')),
				fromHole: false
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
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
	checkButton.style.display = 'none';
	checkButton.style.opacity = '0';

	// Setup next row
	attempt++;
	setupAttemptRow();
}

function setDropZone(element) {
	addEvent(element, 'dragover', function (e) {
		if (e.preventDefault()) e.preventDefault();
		// if (this.className.indexOf(' over') > -1) this.className += ' over';
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

	// to get IE to work
	addEvent(element, 'dragenter', function (e) {
		// if (this.className.indexOf(' over') > -1) this.className += ' over';
		return false;
	});

	addEvent(element, 'dragleave', function () {
		// this.className.replace(' over', '');
	});

	addEvent(element, 'drop', function (e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
		
		var data = JSON.parse(e.dataTransfer.getData('Text'));
		var el;
		var id = data.id;
		if (!data.fromHole) {
			// Make the color not draggable anymore
			el = document.getElementById(data.id);
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
			var otherHole = attemptRows[attempt].getElementsByClassName(data.class)[0];
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
						' color_' + data.color, ' ' + oldColorId
					);

					var otherHoleClone = otherHole.cloneNode(true);
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
					// Replace
					otherHole.parentNode.replaceChild(otherHoleClone, otherHole);
				}
			} else {
				otherHole.className = 'hole';
				otherHole.setAttribute('draggable', 'false');
			}

			id = 'color_' + data.color;
			el = document.getElementById(id);
		}

		// Handle the drop
		this.className = 'hole filled ' + id;

		// Save color
		var index = parseInt(this.id.replace('hole_', ''));
		var color = parseInt(el.id.replace('color_', ''));
		currentInput[index] = color;

		// Make hole draggable
		this.setAttribute('draggable', 'true');

		addEvent(this, 'dragstart', function (e) {
			e.dataTransfer.effectAllowed = 'copy';
			var data = {
				id: this.id,
				class: this.className,
				color: parseInt(el.id.replace('color_', '')),
				fromHole: true
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
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
			checkButton.style.display = 'block';
			checkButton.style.opacity = '1';
		} else {
			checkButton.style.display = 'none';
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

function getCookie(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');
	if (parts.length == 2) return parts.pop().split(';').shift();
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
