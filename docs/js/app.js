/*
 */

"use strict";

const generateButton = document.querySelector("#generateButton");
const fileInput = document.querySelector("#fileInput");
const fileLabel = document.querySelector("#fileLabel");
const checkboxes = document.querySelectorAll("m-checkbox");
const textboxes = document.querySelectorAll("m-textbox");
const sliders = document.querySelectorAll("m-slider");

const getUserScreenSize = () => {
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
};

const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  outline,
) => {
  // apply shadow to the image when drawing onto the main canvas
  const applyShadow = () => {
    if (dropShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.70)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  };

  const applyOutline = () => {
    if (!outline) {
      return;
    }

    const outlineDarkColor = "rgb(0, 0, 0)";
    const outlineLightColor = "rgb(195, 195, 195)";

    // draw outlines without accounting for the shadow, to avoid blurred/offset lines
    ctx.save();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // dark outer line (half-pixel alignment)
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = outlineDarkColor;
    ctx.roundRect(x - 0.5, y - 0.5, width + 1, height + 1, cornerRadius);
    ctx.stroke();
    ctx.closePath();

    // inner light line (slight inset to be inside the darker outline)
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = outlineLightColor;
    ctx.roundRect(
      x + 0.25,
      y + 0.25,
      Math.max(0, width - 0.5),
      Math.max(0, height - 0.5),
      cornerRadius,
    );
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  };

  // use an offscreen canvas to clip the image
  if (cornerRadius >= 10) {
    const tempWidth = Math.max(1, Math.round(width));
    const tempHeight = Math.max(1, Math.round(height));
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = tempWidth;
    tempCanvas.height = tempHeight;
    const tempCtx = tempCanvas.getContext("2d");

    // rounded-rect clipping path on temp canvas
    tempCtx.beginPath();
    tempCtx.moveTo(cornerRadius, 0);
    tempCtx.arcTo(tempWidth, 0, tempWidth, tempHeight, cornerRadius);
    tempCtx.arcTo(tempWidth, tempHeight, 0, tempHeight, cornerRadius);
    tempCtx.arcTo(0, tempHeight, 0, 0, cornerRadius);
    tempCtx.arcTo(0, 0, tempWidth, 0, cornerRadius);
    tempCtx.closePath();
    tempCtx.clip();

    // draw source image
    tempCtx.drawImage(image, 0, 0, tempWidth, tempHeight);
    applyShadow();
    ctx.drawImage(tempCanvas, x, y);
    applyOutline();
  } else {
    // corner radius too small ignore outline while handling shadows and radius
    applyShadow();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();

    applyOutline();
  }
};

const generateCanvas = (wallWidth, wallHeight) => {
  const currFile = fileInput.files;

  if (!currFile) {
    return;
  }

  // create new window/tab to generate the canvas with a new dom
  const newWindow = window.open("", "_blank");
  const newDocument = newWindow.document;

  if (!newWindow || !newDocument) {
    return;
  }

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

  if (!currFile || !currFile[0]) {
    return;
  }

  // use users defined resolution (defaults to main screen size)
  const customWidth = widthTextboxElement.value;
  const customHeight = heightTextboxElement.value;

  // create canvas inside a new dom (blank page)
  const canvas = generateCanvas(customWidth, customHeight);
  const ctx = canvas.getContext("2d");

  const bgimg = new Image();
  const fgimg = new Image();

  // generate wallpaper background
  bgimg.onload = () => {
    if (!currFile[0]) {
      return;
    }

    // calculate scaling factors for the background image
    const scaleFactorX = canvas.width / bgimg.width;
    const scaleFactorY = canvas.height / bgimg.height;
    const scaleFactor = Math.max(scaleFactorX, scaleFactorY);

    // zoomFactor (in pixels) to avoid edge artifacts
    const zoomFactor = 100;
    const extraFactor = 2;

    // calculate the new dimensions to fill the canvas
    const scaledWidth = bgimg.width * scaleFactor + zoomFactor * extraFactor;
    const scaledHeight = bgimg.height * scaleFactor + zoomFactor * extraFactor;

    // calculate the position to center the image
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    const sliderBackgroundBlurElement = sliders[1].shadowRoot.querySelector(
      "#slider-background-blur",
    );

    if (!sliderBackgroundBlurElement) {
      return;
    }

    ctx.filter = `blur(${+sliderBackgroundBlurElement.value}px)`;

    // draw background image
    ctx.drawImage(bgimg, offsetX, offsetY, scaledWidth, scaledHeight);

    // generate highlight image
    ctx.filter = "none";
    fgimg.onload = () => {
      const checkboxMantainSizeElement = checkboxes[0].shadowRoot.querySelector(
        "#checkbox-mantain-size",
      );

      if (!checkboxMantainSizeElement) {
        return;
      }

      // compute highlight image default width/height
      let highlightImageDefaultWidth = 0;
      let highlightImageDefaultHeight = 0;

      // resize highlight image if the user decides to use the image's original proportions
      if (checkboxMantainSizeElement.checked) {
        // scale the source image down to fit canvas while preserving the aspect ratio
        const maxFraction = 0.5; // highlight will try to fit within half the canvas by default
        const maxW = Math.max(
          1,
          Math.min(fgimg.width, Math.floor(customWidth * maxFraction)),
        );
        const maxH = Math.max(
          1,
          Math.min(fgimg.height, Math.floor(customHeight * maxFraction)),
        );

        // preserve aspect ratio
        const ratio = fgimg.width / fgimg.height;
        let w = fgimg.width;
        let h = fgimg.height;

        // Scale down to fit within maxW x maxH
        if (w > maxW) {
          w = maxW;
          h = Math.round(w / ratio);
        }
        if (h > maxH) {
          h = maxH;
          w = Math.round(h * ratio);
        }

        // ensure to never exceed the canvas size
        w = Math.min(w, customWidth);
        h = Math.min(h, customHeight);

        highlightImageDefaultWidth = w;
        highlightImageDefaultHeight = h;
      } else {
        // fixed size of the highlight image
        highlightImageDefaultWidth = 350;
        highlightImageDefaultHeight = 350;
      }

      // get middle of the canvas (screen)
      const middleX = +canvas.width / 2 - +highlightImageDefaultWidth / 2;
      const middleY = +canvas.height / 2 - +highlightImageDefaultHeight / 2;

      const checkboxShadowElement =
        checkboxes[1].shadowRoot.querySelector("#checkbox-shadow");
      const checkboxOutlineElement =
        checkboxes[2].shadowRoot.querySelector("#checkbox-outline");
      const sliderCornerRadiusElement = sliders[0].shadowRoot.querySelector(
        "#slider-corner-radius",
      );

      if (
        !sliderCornerRadiusElement ||
        !checkboxShadowElement ||
        !checkboxOutlineElement
      ) {
        return;
      }

      // set custom highlighted image border,
      // corner radius and drop shadow
      const highlightImageCornerRadius = +sliderCornerRadiusElement.value || 10;
      const highlightImageDropShadow = checkboxShadowElement.checked || false;
      const highglightImageOutline = checkboxOutlineElement.checked || false;

      // draw highlight image at the middle of the canvas
      drawHighlightImage(
        ctx,
        fgimg,
        middleX,
        middleY,
        highlightImageDefaultWidth,
        highlightImageDefaultHeight,
        highlightImageCornerRadius,
        highlightImageDropShadow,
        highglightImageOutline,
      );

      const base64 = canvas.toDataURL();
      const randomFileName = generateRandomName();

      // generate image file with base64 data and create
      // the download link
      const downloadLink = document.createElement("a");
      downloadLink.href = base64;

      // set a custom file name for the
      // file and trigger the download
      downloadLink.download = `${randomFileName}.png`;
      downloadLink.click();

      return;
    };

    fgimg.src = URL.createObjectURL(currFile[0]);
  };

  bgimg.src = URL.createObjectURL(currFile[0]);
};

document.addEventListener("DOMContentLoaded", () => {
  const { width, height } = getUserScreenSize();

  const widthTextboxElement = textboxes[0].shadowRoot.querySelector("#textbox-width");
  const heightTextboxElement = textboxes[1].shadowRoot.querySelector("#textbox-height");

  if (!widthTextboxElement || !heightTextboxElement) {
    return;
  }

  widthTextboxElement.value = width;
  heightTextboxElement.value = height;
});

fileInput.addEventListener("change", (event) => {
  if (!event.target) {
    return;
  }

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
  if (fileInput && fileInput.files) {
    generateImage();
  }
});
