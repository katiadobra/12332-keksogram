(function(){

  var uploadResizeForm = document.forms['upload-resize'];
  var resizeX = uploadResizeForm['resize-x'];
  var resizeY = uploadResizeForm['resize-y'];
  var resizeSize = uploadResizeForm['resize-size'];

  var resizeImg = uploadResizeForm.querySelector('img');
  var resizeImgW = resizeImg.offsetWidth;
  var resizeImgH = resizeImg.offsetHeight;

  var defaultSize = function(){
    if ( resizeImgW > resizeImgH ) {
      defaultSize = resizeImgH;
    } else {
      defaultSize = resizeImgW;
    }
  }

  resizeX.onchange = function(evt) {
    var resizeValueX = resizeX.value;
    var resizeValueY = resizeY.value;
    var resizeSizeValue = resizeSize.value;

    // if ( ) {

    // } 
  }


  var MAX_RESIZE_X,
    MAX_RESIZE_Y,
    MIN_RESIZE_X = 0,
    MIN_RESIZE_Y = 0,
    MIN_RESIZE_SIZE = 50;

  resizeX.value = MIN_RESIZE_X;
  resizeY.value = MIN_RESIZE_Y;
  resizeSize.value = defaultSize;
  resizeX.min = 0;
  resizeY.min = 0;

  
  
})();



