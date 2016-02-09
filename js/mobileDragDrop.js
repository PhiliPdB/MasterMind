var pointerElement;
var dragData;

function setupMobileDragDrop(color) {
	addEvent(color, 'touchstart', function (event) {
		if (!document.body.contains(pointerElement)) {
			pointerElement = color.cloneNode(false);
			pointerElement.style.position = 'absolute';
			pointerElement.style.width = "40px";
			pointerElement.style.height = "40px";
			pointerElement.style.borderRadius = "20px";
			pointerElement.style.boxShadow = "0 0 10px #212121";
			pointerElement.style.zIndex = 1000;
			document.body.appendChild(pointerElement);
			if (event.targetTouches.length === 1) {
				var touch = event.targetTouches[0];
				pointerElement.style.left = touch.pageX - 20 + 'px';
				pointerElement.style.top = touch.pageY - 20 + 'px';
			}
			// Set drag data
			dragData = {
				id: color.id,
				color: parseInt(color.id.replace('color_', '')),
				fromHole: false
			};
		}
	});

	addEvent(color, 'touchmove', function (event) {
		if (event.targetTouches.length === 1) {
			event.preventDefault();
			var touch = event.targetTouches[0];
			pointerElement.style.left = touch.pageX - 20 + 'px';
			pointerElement.style.top = touch.pageY - 20 + 'px';
		}
	});

	addEvent(color, 'touchend', function (event) {
		var location = getPosition(pointerElement);
		location.x += 20;
		location.y += 20;
		document.body.removeChild(pointerElement);
		// Check if is hovering hole
		var holes = attemptRows[attempt].getElementsByClassName('hole');

		var length = holes.length;
		for (var i = 0; i < length; i++) {
			if (holes[i].className.indexOf('little') > -1) continue;
			position = getPosition(holes[i]);
			if (location.x >= position.x && location.x <= position.x + 40 && location.y >= position.y && location.y <= position.y + 40) {
				// TODO handle drop
				handleTouchDrop(holes[i]);
				break;
			}
		}
	});
}

function handleTouchDrop(hole) {
	var el;
	var id = dragData.id;
	if (!dragData.fromHole) {
		// Make the color not draggable anymore
		el = document.getElementById(id);
		el.setAttribute('draggable', 'false');
		el.style.opacity = '.5';
		removeEventListeners(el);

		// Check if hole was filled before
		if (hole.className.indexOf('color') > -1) {
			classNameArray = hole.className.split(' ');

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
				oldColorElement.setAttribute('draggable', 'true');
				oldColorElement.style.opacity = '1';
				setupMobileDragDrop(oldColorElement);
			}
		}
	} else {
		var otherHole = attemptRows[attempt].getElementsByClassName(dragData.class)[0];
		// Check if hole was filled before
		if (hole.className.indexOf('color') > -1) {
			classNameArray = hole.className.split(' ');

			oldColorId = null;
			classNameArrayLength = classNameArray.length;
			for (i = 0; i < classNameArrayLength; i++) {
				if (classNameArray[i].indexOf('color') > -1) {
					oldColorId = classNameArray[i];
					break;
				}
			}

			if (oldColorId !== null) {
				hole.className.replace(' ' + oldColorId, '');
				otherHole.className = otherHole.className.replace(
					' color_' + dragData.color, ' ' + oldColorId
				);
				// Swap colors
				var index1 = parseInt(hole.id.replace('hole_', ''));
				var index2 = parseInt(otherHole.id.replace('hole_', ''));
				currentInput[index2] = currentInput[index1];

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
				// TODO Add mobile touch event
				// Replace
				otherHole.parentNode.replaceChild(otherHoleClone, otherHole);
			}
		} else {
			otherHole.className = 'hole';
			otherHole.setAttribute('draggable', 'false');
			currentInput[parseInt(otherHole.id.replace('hole_', ''))] = null;
		}

		id = 'color_' + dragData.color;
		el = document.getElementById(id);
	}

	// Handle the drop
	hole.className = 'hole filled ' + id;

	// Save color
	var index = parseInt(hole.id.replace('hole_', ''));
	currentInput[index] = dragData.color;

	// Make hole draggable
	hole.setAttribute('draggable', 'true');

	addEvent(hole, 'dragstart', function (e) {
		e.dataTransfer.effectAllowed = 'copy';
		var data = {
			id: hole.id,
			class: hole.className,
			color: parseInt(el.id.replace('color_', '')),
			fromHole: true
		};
		e.dataTransfer.setData('Text', JSON.stringify(data));
	});
	// TODO make draggable on mobile devices
}
