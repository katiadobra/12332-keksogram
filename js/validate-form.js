'use strict';

(function() {

  var uploadResizeForm = document.forms['upload-resize'];


  var resizeX = uploadResizeForm['resize-x'];
  var resizeY = uploadResizeForm['resize-y'];
  var resizeSize = uploadResizeForm['resize-size'];

  var resizeImg = uploadResizeForm.querySelector('.resize-image-preview');

  // The initial values of the fields
  resizeX.value = 0;
  resizeY.value = 0;
  resizeSize.value = 100;
  // resizeSize.value = Math.min(resizeImgW, resizeImgH);
  resizeX.min = 0;
  resizeY.min = 0;
  resizeSize.min = 50;
  
  //-----
  var cropRect = document.createElement("div");
  uploadResizeForm.appendChild(cropRect);
  cropRect.style.background = "white";
  cropRect.style.opacity = "0.5";
  cropRect.style.position = "absolute";
  // console.log(cropRect);

  
  
  // Setting the maximum displacement and adjustment to these values. 
  // If the sizes do not match - change the value of input
  function setDisplacement() {

  }
  function setSideValue() {

  }
  // console.log(resizeImg);
  resizeSize.onchange = resizeY.onchange = resizeX.onchange = function(evt) {
    var resizeImgW = resizeImg.offsetWidth;
    var resizeImgH = resizeImg.offsetHeight;

    var resizeValueX = resizeX.value;
    var resizeValueY = resizeY.value;
    resizeSize.value = Math.min(resizeImgW, resizeImgH);

    var maxSize = Math.min(resizeImgW - resizeValueX, resizeImgH - resizeValueY);
    var resizeSizeValue = resizeSize.value = (resizeSize.value >= maxSize) ? maxSize : resizeSize.value ;
    
    // console.log("onchange");
    //-----
    cropRect.style.width = cropRect.style.height = resizeSizeValue + "px";
    cropRect.style.left = resizeValueX + "px";
    cropRect.style.top = resizeValueY + "px";
  }


  



  
})()