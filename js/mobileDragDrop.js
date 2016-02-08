var pointerElement;
var dragData;

function setupMobileDragDrop(color) {
	addEvent(color, 'touchstart', function (event) {
		console.log('touchstart');
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
		}
	});

	addEvent(color, 'touchmove', function (event) {
		console.log('touchmove');
		if (event.targetTouches.length === 1) {
			event.preventDefault();
			var touch = event.targetTouches[0];
			pointerElement.style.left = touch.pageX - 20 + 'px';
			pointerElement.style.top = touch.pageY - 20 + 'px';
		}
	});

	addEvent(color, 'touchend', function (event) {
		console.log('touchend');
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
			}
		}
	});
}
