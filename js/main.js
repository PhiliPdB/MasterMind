const colorElements = document.getElementsByClassName('color');
const attemptRows = [].slice.call(document.getElementsByClassName('row')).reverse();
let currentInput = [null, null, null, null];
let attempt = 0;

window.onload = function() {
	setupAttemptRow();

	// Make the colors draggable
	const colorElementsSize = colorElements.length;
	for (let i = 0; i < colorElementsSize; i++) {
		setupDraggableColor(colorElements[i]);
	}

	window.setInterval(refreshPHPSession, 3600 * 1000);
};

// Scrolls automatically to the bottom when page is taller than screen
window.scrollTo(0, document.body.clientHeight);

function setupDraggableColor(color) {
	color.setAttribute('draggable', 'true');

	addEvent(color, 'dragstart', e => {
		e.dataTransfer.effectAllowed = 'copy';
		const data = {
			id: color.id,
			color: parseInt(color.id.replace('color_', '')),
			fromHole: false
		};
		e.dataTransfer.setData('Text', JSON.stringify(data));
	});

	setupMobileDragDrop(color);
}

function setupAttemptRow() {
	setDropTargets();
	// Display check button
	const checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.opacity = '1';
	checkButton.style.pointerEvents = 'auto';
}

function setDropTargets() {
	const holes = attemptRows[attempt].getElementsByClassName('hole');

	const length = holes.length;
	for (let i = 0; i < length; i++) {
		if (holes[i].className.indexOf('little') > -1) continue;
		setDropZone(holes[i]);
	}
}

function checkColors() {
	if (currentInput.indexOf(null) > -1) {
		// Not all holes are filled
		return;
	}
	// Display spinner
	const spinner = attemptRows[attempt].getElementsByClassName('spinner')[0];
	const check = attemptRows[attempt].getElementsByClassName('check')[0];
	check.style.opacity = '0';
	check.style.pointerEvents = 'none';
	check.style.display = 'none';
	spinner.style.display = 'block';
	spinner.style.opacity = '1';

	// Send request
	const request = new XMLHttpRequest();
	const params = `colors=${currentInput}`;

	request.open('POST', 'php/validateColors.php', true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			// Hide spinner
			spinner.style.opacity = '0';
			spinner.style.display = 'none';
			check.style.display = 'block';
			check.style.opacity = '1';
			check.style.pointerEvents = 'auto';

			if (request.status === 200) {
				// Handle output
				handleColorValidation(JSON.parse(request.responseText));
			}
		}
	};
	request.send(params);
}

function handleColorValidation(validation) {
	const won = validation.black == 4;
	const little_holes = attemptRows[attempt].getElementsByClassName('little hole');
	// Fill the little holes
	const length = little_holes.length;
	for (let i = 0; i < length; i++) {
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
		document.getElementById('win').style.display = 'block';
		document.getElementById('dimmer').style.display = 'block';

		const request = new XMLHttpRequest();
		request.open('POST', 'php/getScore.php', true);

		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					// Handle output
					const response = JSON.parse(request.responseText);
					document.getElementById('score').innerHTML = response.score;
				}
			}
		};
		request.send();
	} else if (attempt + 1 === 12) {
		// show lose
		document.getElementById('lose').style.display = 'block';
		document.getElementById('dimmer').style.display = 'block';
	}
}

function uploadHighScore() {
	const username = document.getElementById('nickname').value;
	const request = new XMLHttpRequest();
	const params = `username=${username}`;
	request.open('POST', 'php/uploadHighscore.php', true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.send(params);
}

function nextAttempt() {
	// reset used colors
	currentInput = [null, null, null, null];
	// Make the colors draggable
	const colorElementsSize = colorElements.length;
	for (let i = 0; i < colorElementsSize; i++) {
		const element = colorElements[i];

		if (element.getAttribute('draggable') == "true") {
			continue;
		}

		element.setAttribute('draggable', 'true');
		element.style.opacity = '1';

		addEvent(element, 'dragstart', e => {
			e.dataTransfer.effectAllowed = 'copy';
			const data = {
				id: element.id,
				color: parseInt(element.id.replace('color_', '')),
				fromHole: false
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
		setupMobileDragDrop(element);
	}
	// Remove event listeners
	const holes = attemptRows[attempt].getElementsByClassName('hole');
	const length = holes.length;
	for (let j = 0; j < length; j++) {
		const old_element = holes[j];
		const new_element = old_element.cloneNode(true);
		new_element.setAttribute('draggable', 'false');
		old_element.parentNode.replaceChild(new_element, old_element);
	}
	// Hide check button
	const checkButton = attemptRows[attempt].getElementsByClassName('check')[0];
	checkButton.style.opacity = '0';
	checkButton.style.pointerEvents = 'none';

	// Setup next row
	attempt++;
	setupAttemptRow();
}

function setDropZone(element) {
	addEvent(element, 'dragover', e => {
		if (e.preventDefault()) e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		return false;
	});

	addEvent(element, 'drop', e => {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
		
		const data = JSON.parse(e.dataTransfer.getData('Text'));
		let el, classNameArray, classNameArrayLength, oldColorId, i;
		let id = data.id;
		if (!data.fromHole) {
			// Make the color not draggable anymore
			el = document.getElementById(id);
			el.setAttribute('draggable', 'false');
			el.style.opacity = '.5';
			removeEventListeners(el);

			// Check if hole was filled before
			if (element.className.indexOf('color') > -1) {
				const classNameArray = element.className.split(' ');

				let oldColorId = null;
				const classNameArrayLength = classNameArray.length;
				for (let i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					const oldColorElement = document.getElementById(oldColorId);
					oldColorElement.style.opacity = '1';
					setupDraggableColor(oldColorElement);
				}
			}
		} else {
			const otherHole = attemptRows[attempt].getElementsByClassName(data.class)[0];
			let otherHoleClone;
			// Check if hole was filled before
			if (element.className.indexOf('color') > -1) {
				const classNameArray = element.className.split(' ');

				let oldColorId = null;
				const classNameArrayLength = classNameArray.length;
				for (let i = 0; i < classNameArrayLength; i++) {
					if (classNameArray[i].indexOf('color') > -1) {
						oldColorId = classNameArray[i];
						break;
					}
				}

				if (oldColorId !== null) {
					element.className.replace(` ${oldColorId}`, '');
					otherHole.className = otherHole.className.replace(
						` color_${data.color}`, ` ${oldColorId}`
					);
					// Swap colors
					const index1 = parseInt(element.id.replace('hole_', ''));
					let index2 = parseInt(otherHole.id.replace('hole_', ''));
					currentInput[index2] = currentInput[index1];

					otherHoleClone = otherHole.cloneNode(true);
					// Set event listeners
					setDropZone(otherHoleClone);
					addEvent(otherHoleClone, 'dragstart', e => {
						e.dataTransfer.effectAllowed = 'copy';
						const data = {
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

			id = `color_${data.color}`;
			el = document.getElementById(id);
		}

		// Handle the drop
		element.className = `hole filled ${id}`;

		// Save color
		let index = parseInt(element.id.replace('hole_', ''));
		currentInput[index] = data.color;

		// Make hole draggable
		// Remove 'old' event listeners
		const holeClone = element.cloneNode(true);
		// Add 'new' event listeners
		holeClone.setAttribute('draggable', 'true');
		setDropZone(holeClone);
		addEvent(holeClone, 'dragstart', e => {
			e.dataTransfer.effectAllowed = 'copy';
			const data = {
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
		element.parentNode.replaceChild(holeClone, element);
	});
}

function resetBoard() {
	// Reset color code
	resetColors();
	// Reset used colors
	currentInput = [null, null, null, null];
	// Make the colors draggable
	const colorElementsSize = colorElements.length;
	for (let i = 0; i < colorElementsSize; i++) {
		let element = colorElements[i];

		if (element.getAttribute('draggable') == "true") {
			continue;
		}

		element.setAttribute('draggable', 'true');
		element.style.opacity = '1';

		addEvent(element, 'dragstart', e => {
			e.dataTransfer.effectAllowed = 'copy';
			const data = {
				id: element.id,
				color: parseInt(element.id.replace('color_', '')),
				fromHole: false
			};
			e.dataTransfer.setData('Text', JSON.stringify(data));
		});
		setupMobileDragDrop(element);
	}
	// Remove event listeners and reset colors
	const attemptRowLength = attemptRows.length - 1;
	for (let j = 0; j < attemptRowLength; j++) {
		const holes = attemptRows[j].getElementsByClassName('hole');
		const length = holes.length;
		for (let k = 0; k < length; k++) {
			const old_element = holes[k];
			const new_element = old_element.cloneNode(true);
			new_element.setAttribute('draggable', 'false');
			if (new_element.className.indexOf('little') > -1) {
				new_element.className = 'hole little';
			} else {
				new_element.className = 'hole';
			}
			old_element.parentNode.replaceChild(new_element, old_element);
		}
		// Hide check button
		const checkButton = attemptRows[j].getElementsByClassName('check')[0];
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
	const request = new XMLHttpRequest();
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
	const newElement = element.cloneNode(true);
	element.parentNode.replaceChild(newElement, element);
}

function getPosition(element) {
	let xPosition = 0;
	let yPosition = 0;
	
	while(element) {
		xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
		yPosition += element.offsetTop - element.scrollTop + element.clientTop;
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
}

function refreshPHPSession() {
	const request = new XMLHttpRequest();
	request.open('GET', 'php/startSession.php', true);
	request.send();
}

// This is a function from https://github.com/remy/html5demos
const addEvent = ((() => {
	if (document.addEventListener) {
		return (el, type, fn) => {
			if (el && el.nodeName || el === window) {
				el.addEventListener(type, fn, false);
			} else if (el && el.length) {
				for (let i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	} else {
		return (el, type, fn) => {
			if (el && el.nodeName || el === window) {
				el.attachEvent(`on${type}`, () => { return fn.call(el, window.event); });
			} else if (el && el.length) {
				for (let i = 0; i < el.length; i++) {
					addEvent(el[i], type, fn);
				}
			}
		};
	}
}))();