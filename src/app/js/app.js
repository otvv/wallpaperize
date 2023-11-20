/*
 */

"use strict";

const fileInput = document.querySelector("#fileInput");
const fileLabel = document.querySelector("#fileLabel");
const checkboxes = document.querySelectorAll("m-checkbox");
const textboxes = document.querySelectorAll("m-textbox");

const drawForegroundImage = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  radius,
  rounded,
  shadow
) => {
  if (rounded) {
    // Create a temporary canvas to draw the rounded image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.beginPath();
    tempCtx.moveTo(radius, 0);
    tempCtx.arcTo(width, 0, width, height, radius);
    tempCtx.arcTo(width, height, 0, height, radius);
    tempCtx.arcTo(0, height, 0, 0, radius);
    tempCtx.arcTo(0, 0, width, 0, radius);
    tempCtx.closePath();

    tempCtx.clip();
    tempCtx.drawImage(image, 0, 0, width, height);

    // Apply shadow to the entire temporary canvas
    if (shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.50)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      ctx.shadowBlur = 15;
    }

    // Draw the temporary canvas onto the main canvas
    ctx.drawImage(tempCanvas, x, y);

    // Reset modifications after drawing fgimg
    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
  } else {
    // Only apply drop shadow without rounded corners
    if (shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.50)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      ctx.shadowBlur = 15;
    }

    // Draw the image without clipping
    ctx.drawImage(image, x, y, width, height);

    // Reset modifications after drawing fgimg
    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
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

  console.log("[wallpaperize] - textboxes", textboxes);

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

    // calculate the new dimensions to fill the canvas
    const scaledWidth = bgimg.width * scaleFactor;
    const scaledHeight = bgimg.height * scaleFactor;

    // calculate the position to center the image
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // draw background image
    ctx.filter = "blur(35px)";
    ctx.transform = "scale(1.1)"; // get rid of uggly white border
    ctx.drawImage(bgimg, offsetX, offsetY, scaledWidth, scaledHeight);
    ctx.filter = "none";

    // generate highlight image
    fgimg.onload = () => {
      // resize highlight image accordingly

      const mantainSizeCheckboxElement = checkboxes[2].shadowRoot.querySelector("#checkbox-mantain-size");

      if (!mantainSizeCheckboxElement) {
        return;
      }

      let highlightImageWidth = 350;
      let highlightImageHeight = 350;

      if (mantainSizeCheckboxElement.checked) {

        highlightImageWidth = fgimg.width * 0.6;
        highlightImageHeight = fgimg.height * 0.6;

        if (highlightImageWidth >= customWidth) {
          highlightImageWidth = fgimg.width * 0.5;
        }

        if (highlightImageHeight >= customHeight) {
          highlightImageHeight = fgimg.height * 0.5;
        }
      }

      // const highlightImageWidth = 350;
      // const highlightImageHeight = 350;

      // calculate middle of the screen (canvas)
      const middleX = canvas.width / 2 - highlightImageWidth / 2;
      const middleY = canvas.height / 2 - highlightImageHeight / 2;

      // handle options
      const roundedCheckboxElement =
        checkboxes[0].shadowRoot.querySelector("#checkbox-rounded");
      const shadowCheckboxElement =
        checkboxes[1].shadowRoot.querySelector("#checkbox-shadow");

      if (!roundedCheckboxElement || !shadowCheckboxElement) {
        return;
      }
        // draw foreground image at the middle of the canvas
        drawForegroundImage(
          ctx,
          fgimg,
          middleX,
          middleY,
          highlightImageWidth,
          highlightImageHeight,
          10,
          roundedCheckboxElement.checked,
          shadowCheckboxElement.checked
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

  if (!currFile) {
    return;
  }

  // clamp file name
  const limit = 15;
  let truncatedString = "null";
  if (currFile[0].name.length >= limit) {
    truncatedString = `${currFile[0].name.substring(0, limit)}...`;
  } else {
    truncatedString = currFile[0].name;
  }

  // change preview label with currently open file name
  fileLabel.textContent = `image loaded: ${truncatedString}`;
});