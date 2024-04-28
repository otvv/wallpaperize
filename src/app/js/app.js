/*
 */

"use strict";

const fileInput = document.querySelector("#fileInput");
const fileLabel = document.querySelector("#fileLabel");
const checkboxes = document.querySelectorAll("m-checkbox");
const textboxes = document.querySelectorAll("m-textbox");
const sliders = document.querySelectorAll("m-slider");

const drawHighlightImage = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  cornerRadius,
  dropShadow
) => {
  if (cornerRadius > 0) {
    // create a temporary canvas to draw the rounded image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.beginPath();
    tempCtx.moveTo(cornerRadius, 0);
    tempCtx.arcTo(width, 0, width, height, cornerRadius);
    tempCtx.arcTo(width, height, 0, height, cornerRadius);
    tempCtx.arcTo(0, height, 0, 0, cornerRadius);
    tempCtx.arcTo(0, 0, width, 0, cornerRadius);
    tempCtx.closePath();

    tempCtx.clip();
    tempCtx.drawImage(image, 0, 0, width, height);

    // apply shadow to the entire temporary canvas
    if (dropShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.70)";
      ctx.shadowBlur = 10;
    }

    // draw the temporary canvas onto the main canvas
    ctx.drawImage(tempCanvas, x, y);

    // reset modifications after drawing fgimg
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  } else {
    // only apply drop shadow without rounded corners
    if (dropShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.70)";
      ctx.shadowBlur = 10;
    }

    // draw the image without clipping
    ctx.drawImage(image, x, y, width, height);

    // reset modifications after drawing fgimg
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
};

const generateCanvas = (wallWidth, wallHeight) => {
  // create new window/tab to generate the canvas with a new dom
  const newWindow = window.open("", "_blank");
  const newDocument = newWindow.document;

  if (!newWindow || !newDocument) {
    return;
  }

  // generate canvas element
  const canvasElement = newDocument.createElement("canvas");

  if (!canvasElement) {
    return;
  }

  // attach the generated canvas in the new document/page
  newDocument.body.appendChild(canvasElement);

  // set canvas properties
  canvasElement.width = wallWidth;
  canvasElement.height = wallHeight;

  return canvasElement;
};

const generateImage = () => {
  const currFile = fileInput.files;

  if (!currFile) {
    return;
  }

  // get desired wallpaper size
  const widthTextboxElement =
    textboxes[0].shadowRoot.querySelector("#textbox-width");
  const heightTextboxElement =
    textboxes[1].shadowRoot.querySelector("#textbox-height");

  if (!widthTextboxElement || !heightTextboxElement) {
    return;
  }

  const customWidth = +widthTextboxElement.value || 1920; // (if nothing is set it will use 1920 as default width)
  const customHeight = +heightTextboxElement.value || 1080; // (if nothing is set it will use 1080 as default height)

  // create canvas inside a new dom
  const canvas = generateCanvas(customWidth, customHeight);

  // grab canvas context
  const ctx = canvas.getContext("2d");

  // dummy img pointers
  const bgimg = new Image();
  const fgimg = new Image();

  // generate wallpaper background
  bgimg.onload = () => {
    // calculate scaling factors for the background image
    const scaleFactorX = canvas.width / bgimg.width;
    const scaleFactorY = canvas.height / bgimg.height;
    const scaleFactor = Math.max(scaleFactorX, scaleFactorY);
    
    // zoonFactor (in pixels) (this is used to avoid a weird blurred white/blue border in the 
    // background of the wallpaper/canvas)
    const zoomFactor = 100;
    const extra = 2;
    
    // calculate the new dimensions to fill the canvas
    const scaledWidth = (bgimg.width * scaleFactor) + (zoomFactor * extra);
    const scaledHeight = (bgimg.height * scaleFactor) + (zoomFactor * extra);

    // calculate the position to center the image
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // handle options
    const sliderBackgroundBlurElement = sliders[0].shadowRoot.querySelector("#slider-background-blur");

    if (!sliderBackgroundBlurElement) {
      return;
    }

    if (sliderBackgroundBlurElement.value > 0) {
      ctx.filter = `blur(${+sliderBackgroundBlurElement.value}px)`;
    }
    
    // draw background image
    ctx.drawImage(bgimg, offsetX, offsetY, scaledWidth, scaledHeight);
    ctx.filter = "none";

    // generate highlight image
    fgimg.onload = () => {
      const checkboxMantainSizeElement = checkboxes[0].shadowRoot.querySelector("#checkbox-mantain-size");

      if (!checkboxMantainSizeElement) {
        return;
      }
      
      let highlightImageWidth = 350;
      let highlightImageHeight = 350;

      // resize highlight image accordingly
      if (checkboxMantainSizeElement.checked) {
        highlightImageWidth = +fgimg.width * 0.6;
        highlightImageHeight = +fgimg.height * 0.6;

        if (highlightImageWidth >= +customWidth) {
          highlightImageWidth = +fgimg.width * 0.5;
        }

        if (highlightImageHeight >= +customHeight) {
          highlightImageHeight = +fgimg.height * 0.5;
        }
      }

      // calculate middle of the screen (canvas)
      const middleX = (canvas.width / 2) - (highlightImageWidth / 2);
      const middleY = (canvas.height / 2) - (highlightImageHeight / 2);

      // handle options
      const checkboxShadowElement =
        checkboxes[1].shadowRoot.querySelector("#checkbox-shadow");

      if (!checkboxShadowElement) {
        return;
      }
      
      const sliderCornerRadiusElement = sliders[1].shadowRoot.querySelector("#slider-corner-radius");

      if (!sliderCornerRadiusElement) {
        return;
      }
      
      // set custom highlighted image border corner radius
      // TODO: translate the same value accordingly in case 
      // the user wants to keep the original image size
      const highlightImageCornerRadius = sliderCornerRadiusElement.value;

      // draw highglight image at the middle of the canvas
      drawHighlightImage(
        ctx,
        fgimg,
        middleX,
        middleY,
        highlightImageWidth,
        highlightImageHeight,
        highlightImageCornerRadius,
        checkboxShadowElement.checked
      );

      const base64 = canvas.toDataURL();

      return base64;
    };

    fgimg.src = URL.createObjectURL(currFile[0]);
  };

  bgimg.src = URL.createObjectURL(currFile[0]);
};

fileInput.addEventListener("change", (event) => {
  const currFile = event.target.files;

  if (!currFile || !currFile[0].name) {
    return;
  }

  const limit = 15;
  let truncatedString = "null";

  // clamp file name
  if (currFile[0].name.length >= limit) {
    truncatedString = `${currFile[0].name.substring(0, limit)}...`;
  } else {
    truncatedString = currFile[0].name;
  }

  // change preview label with currently open file name
  fileLabel.textContent = `image loaded: ${truncatedString}`;
});
