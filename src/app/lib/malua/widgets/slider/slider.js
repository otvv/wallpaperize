/*
 */

"use strict";

class MSlider extends MMalua {
  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          <link rel="stylesheet" href="lib/malua/malua.css">
          <link rel="stylesheet" href="lib/malua/widgets/slider/slider.css">
          <label class="m-slider-label"></label>
          <div class="m-slider-box">
            <input class="m-slider" type="range">
            <output class='m-slider-output-text'/>
          </div>
        `;

    // range input wrapper and box div
    const sliderElement = shadow.querySelector("input");
    const boxDivElement = shadow.querySelector("div");

    // range input title
    const sliderLabelElement = shadow.querySelector("label");

    // range input sufix and output
    const sufix = this.getAttribute("sufix") || "";
    const sliderOutput = shadow.querySelector("output");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "placeholder",
      "sufix",
      "value",
      "min",
      "max",
      "padding",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(sliderElement, attribute);
    });

    // slider title and string attribution
    sliderLabelElement.textContent = this.getAttribute("label");

    if (sliderElement.id.length > 0) {
      sliderLabelElement.setAttribute("for", sliderElement.id);
    }

    // set default value
    sliderOutput.textContent = sufix
      ? `${+sliderElement.valueAsNumber} (${sufix})`
      : +sliderElement.valueAsNumber;

    // update slider
    sliderElement.oninput = (event) => {
      sliderOutput.innerHTML = sufix
        ? `${+event.target.valueAsNumber} (${sufix})`
        : +event.target.valueAsNumber;
    };

    // set slider div box abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(sliderElement, elementPosition);

    // set slider box div size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(sliderElement, elementSize);

    // in case the slider has a sufix
    // set a fixed box height of 35 pixels and set up padding accordingly
    if (sufix) {
      boxDivElement.style.height = "35px";
      sliderOutput.style.paddingTop = "10px";
      sliderOutput.style.paddingBottom = "10px";
    }
  }
}

// define the new element
customElements.define("m-slider", MSlider);
