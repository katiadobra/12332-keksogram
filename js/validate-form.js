var formUploadResize = document.forms['upload-resize'],
	resizeX = formUploadResize['resize-x'],
	resizeY = formUploadResize['resize-y'],
	resizeSize = formUploadResize['resize-size'];

var MAX_RESIZE_X,
	MAX_RESIZE_Y,
	MAX_RESIZE_SIZE,
	MIN_RESIZE_X = 1,
	MIN_RESIZE_Y = 1,
	MIN_RESIZE_SIZE = 1;

resizeX.value = 10;
resizeY.value = 10;

resizeX.min = 0;
resizeY.min = 0;



