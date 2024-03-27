/*
 */

"use strict";

class MButton extends MMalua {
  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          ${globalMaluaStyleInclude}
          <button class="m-button" type="button">
        `;

    // button wrapper
    const buttonElement = shadow.querySelector("button");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "shader",
      "href",
      "link",
      "effect",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(buttonElement, attribute);
    });

    // set button abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(buttonElement, elementPosition);

    // set button size
    const elementSize = [
      this.getAttribute("width") || "moz-fit-content" || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(buttonElement, elementSize);

    // set button shader
    const elementShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    this.setShader(buttonElement, elementShader);

    // set button label
    const elementLabel = this.getAttribute("label");
    this.setLabel(buttonElement, elementLabel);

    // set button link/href
    const elementHref = this.getAttribute("href");
    this.setHref(buttonElement, elementHref);
  }
}

// define the new element
customElements.define("m-button", MButton);
