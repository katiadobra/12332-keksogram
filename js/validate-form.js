(function() {
  
  var MIN_RESIZE_X = 0,
      MIN_RESIZE_Y = 0,
      MIN_RESIZE_SIZE = 50;

  var uploadResizeForm = document.forms['upload-resize'];
  var resizeX = uploadResizeForm['resize-x'];
  var resizeY = uploadResizeForm['resize-y'];
  var resizeSize = uploadResizeForm['resize-size'];
  
  //-----
  var cropRect = document.createElement("div");
  uploadResizeForm.appendChild(cropRect);
  cropRect.style.background = "white";
  cropRect.style.opacity = "0.5";
  cropRect.style.position = "absolute";
  // console.log(cropRect);

  var resizeImg = uploadResizeForm.querySelector('img');
  var resizeImgW = resizeImg.offsetWidth;
  var resizeImgH = resizeImg.offsetHeight;
  
  console.log(resizeImg);
  resizeSize.onchange = resizeY.onchange = resizeX.onchange = function(evt) {
    var resizeValueX = resizeX.value;
    var resizeValueY = resizeY.value;
    var maxSize = Math.min(resizeImgW - resizeValueX, resizeImgH - resizeValueY);
    var resizeSizeValue = resizeSize.value = (resizeSize.value >= maxSize) ? maxSize : resizeSize.value ;
    
    // console.log("onchange");
    //-----
    cropRect.style.width = cropRect.style.height = resizeSizeValue + "px";
    cropRect.style.left = resizeValueX + "px";
    cropRect.style.top = resizeValueY + "px";
  }


  resizeX.value = MIN_RESIZE_X;
  resizeY.value = MIN_RESIZE_Y;
  // resizeSize.value = Math.min(resizeImgW, resizeImgH);
  resizeX.min = MIN_RESIZE_X;
  resizeY.min = MIN_RESIZE_Y;

  
})()