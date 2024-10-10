/*
 */

"use strict";

const generateButton = document.querySelector("#generateButton");
const fileInput = document.querySelector("#fileInput");
const fileLabel = document.querySelector("#fileLabel");
const checkboxes = document.querySelectorAll("m-checkbox");
const textboxes = document.querySelectorAll("m-textbox");
const sliders = document.querySelectorAll("m-slider");

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const generateRandomName = () => {
  const STRING_SIZE = 8;
  const randomString = generateRandomString(STRING_SIZE);
  return `wallpaperize_${randomString}`;
};

const drawHighlightImage = (
  ctx,
  image,
  x,
  y,
  width,
  height,
  cornerRadius,
  dropShadow,
  outline
) => {
  const applyShadow = () => {
    if (dropShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.70)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  };

  const applyOutline = () => {
    if (outline) {
      const outlineDarkColor = "rgb(0, 0, 0)";
      const outlineLightColor = "rgb(195, 195, 195)";
  
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = outlineDarkColor;
      ctx.roundRect(
          x - 1,
          y - 1, 
          width + (1.5 * 1.5), 
          height + (1.5 * 1.5), 
          cornerRadius
      );
      ctx.closePath();
      ctx.stroke(); 
      ctx.restore();
      
      //
  
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = outlineLightColor; 
      ctx.roundRect(
          x, 
          y, 
          width,
          height,
          cornerRadius
      );
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };

  if (cornerRadius >= 10) {
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

    applyShadow();
    ctx.drawImage(tempCanvas, x, y);
    applyOutline();
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
  canvasElement.width = +wallWidth;
  canvasElement.height = +wallHeight;

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

  // create canvas inside a new dom (blank page)
  const canvas = generateCanvas(customWidth, customHeight);

  // grab canvas context
  const ctx = canvas.getContext("2d");

  // dummy img "pointers"/instances
  const bgimg = new Image();
  const fgimg = new Image();

  // generate wallpaper background
  bgimg.onload = () => {
    // calculate scaling factors for the background image
    const scaleFactorX = canvas.width / bgimg.width;
    const scaleFactorY = canvas.height / bgimg.height;
    const scaleFactor = Math.max(scaleFactorX, scaleFactorY);

    // zoomFactor (in pixels) (this is used to avoid a weird blurred white/blue border in the
    // background of the wallpaper/canvas)
    const zoomFactor = 100;
    const extraFactor = 2;

    // calculate the new dimensions to fill the canvas
    const scaledWidth = bgimg.width * scaleFactor + zoomFactor * extraFactor;
    const scaledHeight = bgimg.height * scaleFactor + zoomFactor * extraFactor;

    // calculate the position to center the image
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    // handle options
    const sliderBackgroundBlurElement = sliders[1].shadowRoot.querySelector(
      "#slider-background-blur"
    );

    if (!sliderBackgroundBlurElement) {
      return;
    }

    // background blur
    ctx.filter = `blur(${+sliderBackgroundBlurElement.value}px)`;

    // draw background image
    ctx.drawImage(bgimg, offsetX, offsetY, scaledWidth, scaledHeight);
    ctx.filter = "none";

    // generate highlight image
    fgimg.onload = () => {
      // handle options
      const checkboxMantainSizeElement = checkboxes[0].shadowRoot.querySelector(
        "#checkbox-mantain-size"
      );

      if (!checkboxMantainSizeElement) {
        return;
      }

      // "default" size of the highlight image
      let highlightImageDefaultWidth = 350;
      let highlightImageDefaultHeight = 350;

      // resize highlight image if the user decides to use the image's original proportions
      if (checkboxMantainSizeElement.checked) {
        highlightImageDefaultWidth = +(fgimg.width * 0.3);
        highlightImageDefaultHeight = +(fgimg.height * 0.3);

        // adjust image accordingly if its bigger than the wallpaper background size
        // (width and height set in the options)
        if (highlightImageDefaultWidth >= +customWidth) {
          highlightImageDefaultWidth = +(fgimg.width * 0.3);
        }

        if (highlightImageDefaultHeight >= +customHeight) {
          highlightImageDefaultHeight = +(fgimg.height * 0.3);
        }
      }

      // calculate middle of the canvas (screen)
      const middleX = +canvas.width / 2 - +highlightImageDefaultWidth / 2;
      const middleY = +canvas.height / 2 - +highlightImageDefaultHeight / 2;

      // handle options
      const checkboxShadowElement =
        checkboxes[1].shadowRoot.querySelector("#checkbox-shadow");
      const checkboxOutlineElement =
        checkboxes[2].shadowRoot.querySelector("#checkbox-outline");
      const sliderCornerRadiusElement = sliders[0].shadowRoot.querySelector(
        "#slider-corner-radius"
      );

      if (
        !sliderCornerRadiusElement ||
        !checkboxShadowElement ||
        !checkboxOutlineElement
      ) {
        return;
      }

      // set custom highlighted image border corner radius and drop shadow
      // TODO: properly handle corner radius if the user uses the image's original proportions
      // the user wants to keep the original image size
      const highlightImageCornerRadius = sliderCornerRadiusElement.value || 10;
      const highlightImageDropShadow = checkboxShadowElement.checked || false;
      const highglightImageOutline = checkboxOutlineElement.checked || false;

      // draw highglight image at the middle of the canvas
      drawHighlightImage(
        ctx,
        fgimg,
        middleX,
        middleY,
        highlightImageDefaultWidth,
        highlightImageDefaultHeight,
        highlightImageCornerRadius,
        highlightImageDropShadow,
        highglightImageOutline
      );

      const base64 = canvas.toDataURL();
      const randomFileName = generateRandomName();

      // generate download link
      const link = document.createElement("a");
      link.href = base64;

      // random file name
      link.download = `${randomFileName}.png`;

      // trigger download
      link.click();

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

  const CHAR_LIMIT = 15;
  let truncatedString = "null";

  // clamp file name
  if (currFile[0].name.length >= CHAR_LIMIT) {
    truncatedString = `${currFile[0].name.substring(0, CHAR_LIMIT)}...`;
  } else {
    truncatedString = currFile[0].name;
  }

  // change preview label with currently open file name
  fileLabel.textContent = `image loaded: ${truncatedString}`;
});

generateButton.addEventListener("click", () => {
  generateImage();
});
