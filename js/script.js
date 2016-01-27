var colorElements = document.getElementsByClassName('color');
var element = null;

// Make the colors draggable
var colorElementsSize = colorElements.length;
for (var i = 0; i < colorElementsSize; i++) {
	element = colorElements[i];

	element.setAttribute('draggable', 'true');

	element.addEventListener('dragstart', function (e) {
		e.dataTransfer.effectAllowed = 'copy';
		e.dataTransfer.setData('text/plain', this.id);
		e.dataTransfer.setData('text/html', this.outerHTML);
	});
}
