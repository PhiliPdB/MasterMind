let pointerElement;
let dragData;

function setupMobileDragDrop(color) {
	addEvent(color, 'touchstart', event => {
		if (!document.body.contains(pointerElement)) {
			pointerElement = color.cloneNode(false);
			pointerElement.style.position = 'absolute';
			pointerElement.style.width = "40px";
			pointerElement.style.height = "40px";
			pointerElement.style.borderRadius = "20px";
			pointerElement.style.boxShadow = "0 0 10px #212121";
			pointerElement.style.opacity = '.7';
			pointerElement.style.zIndex = 1000;
			document.body.appendChild(pointerElement);
			if (event.targetTouches.length === 1) {
				const touch = event.targetTouches[0];
				pointerElement.style.left = `${touch.pageX - 20}px`;
				pointerElement.style.top = `${touch.pageY - 20}px`;
			}
			// Set drag data
			dragData = {
				id: color.id,
				color: parseInt(color.id.replace('color_', '')),
				fromHole: false
			};
		}
	});

	addEvent(color, 'touchmove', event => {
		if (event.targetTouches.length === 1) {
			event.preventDefault();
			const touch = event.targetTouches[0];
			pointerElement.style.left = `${touch.pageX - 20}px`;
			pointerElement.style.top = `${touch.pageY - 20}px`;
		}
	});

	addEvent(color, 'touchend', event => {
		const location = getPosition(pointerElement);
		location.x += 20;
		location.y += 20;
		document.body.removeChild(pointerElement);
		// Check if is hovering hole
		const holes = attemptRows[attempt].getElementsByClassName('hole');

		const length = holes.length;
		for (let i = 0; i < length; i++) {
			if (holes[i].className.indexOf('little') > -1) continue;
			let position = getPosition(holes[i]);
			if (location.x >= position.x && location.x <= position.x + 40 && location.y >= position.y && location.y <= position.y + 40) {
				handleTouchDrop(holes[i]);
				break;
			}
		}
	});

	addEvent(color, 'touchcancel', event => {
		document.body.removeChild(pointerElement);
	});
}

function handleTouchDrop(hole) {
	let el;
	let id = dragData.id;
	if (!dragData.fromHole) {
		// Make the color not draggable anymore
		el = document.getElementById(id);
		el.setAttribute('draggable', 'false');
		el.style.opacity = '.5';
		removeEventListeners(el);

		// Check if hole was filled before
		if (hole.className.indexOf('color') > -1) {
			const classNameArray = hole.className.split(' ');

			let oldColorId = null;
			const classNameArrayLength = classNameArray.length;
			for (let i = 0; i < classNameArrayLength; i++) {
				if (classNameArray[i].indexOf('color') > -1) {
					oldColorId = classNameArray[i];
					break;
				}
			}

			if (oldColorId !== null) {
				// Make old color draggable
				const oldColorElement = document.getElementById(oldColorId);
				oldColorElement.style.opacity = '1';
				setupDraggableColor(oldColorElement);
			}
		}
	} else {
		const otherHole = attemptRows[attempt].getElementsByClassName(dragData.class)[0];
		let otherHoleClone;
		// Check if hole was filled before
		if (hole.className.indexOf('color') > -1) {
			const classNameArray = hole.className.split(' ');

			let oldColorId = null;
			const classNameArrayLength = classNameArray.length;
			for (let i = 0; i < classNameArrayLength; i++) {
				if (classNameArray[i].indexOf('color') > -1) {
					oldColorId = classNameArray[i];
					break;
				}
			}

			if (oldColorId !== null) {
				hole.className.replace(` ${oldColorId}`, '');
				otherHole.className = otherHole.className.replace(
					` color_${dragData.color}`, ` ${oldColorId}`
				);
				// Swap colors
				const index1 = parseInt(hole.id.replace('hole_', ''));
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

		id = `color_${dragData.color}`;
		el = document.getElementById(id);
	}

	// Handle the drop
	hole.className = `hole filled ${id}`;

	// Save color
	let index = parseInt(hole.id.replace('hole_', ''));
	currentInput[index] = dragData.color;

	// Make hole draggable
	// Remove 'old' event listeners
	const holeClone = hole.cloneNode(true);
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
	hole.parentNode.replaceChild(holeClone, hole);
}

function setupTouchDragHole(hole, color) {
	addEvent(hole, 'touchstart', event => {
		if (!document.body.contains(pointerElement)) {
			pointerElement = color.cloneNode(false);
			pointerElement.style.position = 'absolute';
			pointerElement.style.width = "40px";
			pointerElement.style.height = "40px";
			pointerElement.style.borderRadius = "20px";
			pointerElement.style.boxShadow = "0 0 10px #212121";
			pointerElement.style.opacity = '.7';
			pointerElement.style.zIndex = 1000;
			document.body.appendChild(pointerElement);
			if (event.targetTouches.length === 1) {
				const touch = event.targetTouches[0];
				pointerElement.style.left = `${touch.pageX - 20}px`;
				pointerElement.style.top = `${touch.pageY - 20}px`;
			}
			// Set drag data
			dragData = {
				id: hole.id,
				class: hole.className,
				color: parseInt(color.id.replace('color_', '')),
				fromHole: true
			};
		}
	});

	addEvent(hole, 'touchmove', event => {
		if (event.targetTouches.length === 1) {
			event.preventDefault();
			const touch = event.targetTouches[0];
			pointerElement.style.left = `${touch.pageX - 20}px`;
			pointerElement.style.top = `${touch.pageY - 20}px`;
		}
	});

	addEvent(hole, 'touchend', event => {
		const location = getPosition(pointerElement);
		location.x += 20;
		location.y += 20;
		document.body.removeChild(pointerElement);
		// Check if is hovering hole
		const holes = attemptRows[attempt].getElementsByClassName('hole');

		const length = holes.length;
		for (let i = 0; i < length; i++) {
			if (holes[i].className.indexOf('little') > -1) continue;
			const position = getPosition(holes[i]);
			if (location.x >= position.x && location.x <= position.x + 40 && location.y >= position.y && location.y <= position.y + 40) {
				handleTouchDrop(holes[i]);
				break;
			}
		}
	});

	addEvent(hole, 'touchcancel', event => {
		document.body.removeChild(pointerElement);
	});
}