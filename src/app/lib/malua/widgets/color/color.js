/*
 */

"use strict";

class MColor extends MMalua {
  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ...
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          <link rel="stylesheet" href="lib/malua/malua.css">
          <link rel="stylesheet" href="lib/malua/widgets/color/color.css">
          <div class="m-color-button-box">
          <input class="m-color-button" type="color">
          <label class="m-color-button-label"></label>
          </div>
        `;

    // color button wrapper and box div
    const colorButtonElement = shadow.querySelector("input");
    const boxDivElement = shadow.querySelector("div");

    // color input title
    const colorButtonLabelElement = shadow.querySelector("label");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "placeholder",
      "disabled",
      "color",
      "value",
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
      this.setAttributeWhenPresent(colorButtonElement, attribute);
    });

    // set colorpicker label and string attribution
    const elementLabel = this.getAttribute("label");
    this.setLabel(colorButtonLabelElement, elementLabel);

    if (colorButtonElement.id.length > 0) {
      colorButtonLabelElement.setAttribute("for", colorButtonElement.id);
    }

    // set default color
    const elementValue =
      this.getAttribute("color") || this.getAttribute("value");
    this.setValue(colorButtonElement, elementValue);

    // set colorpicker div box abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(boxDivElement, elementPosition);

    // set colorpicker box div size
    const elementSize = [
      this.getAttribute("width") || "-moz-fit-content" || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(boxDivElement, elementSize);
  }
}

// define the new element
customElements.define("m-color", MColor);
