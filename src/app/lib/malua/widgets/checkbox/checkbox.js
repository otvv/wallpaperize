/*
 */

"use strict";

class MCheckBox extends MMalua {
  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          <link rel="stylesheet" href="lib/malua/malua.css">
          <link rel="stylesheet" href="lib/malua/widgets/checkbox/checkbox.css">
          <div class="m-checkbox-box">
          <input class="m-checkbox" type="checkbox">
          <label class="m-checkbox-label"></label>
          </div>
        `;

    // checkbox input wrapper and box div
    const checkboxElement = shadow.querySelector("input");
    const boxDivElement = shadow.querySelector("div");

    // checkbox input title
    const checkboxLabelElement = shadow.querySelector("label");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "disabled",
      "padding",
      "checked",
      "value",
      "state",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(checkboxElement, attribute);
    });

    // set checkbox label and string attribution
    const elementLabel = this.getAttribute("label");
    this.setLabel(checkboxLabelElement, elementLabel);

    if (checkboxElement.id.length > 0) {
      checkboxLabelElement.setAttribute("for", checkboxElement.id);
    }

    // set default checkbox state
    const elementState =
      this.getAttribute("checked") ||
      this.getAttribute("value") ||
      this.getAttribute("state");
    this.setState(checkboxElement, elementState);

    // set checkbox div box abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(boxDivElement, elementPosition);

    // set checkbox box div size
    const elementSize = [
      this.getAttribute("width") || "-moz-fit-content" || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(boxDivElement, elementSize);

    checkboxElement.setAttribute("id", this.getAttribute("id"));
    checkboxElement.setAttribute(
      "placeholder",
      this.getAttribute("placeholder")
    );
    checkboxLabelElement.setAttribute("for", this.getAttribute("id"));

    // this fixes some incompatibility issues
    this.removeAttribute("id");
  }
}

// define the new element
customElements.define("m-checkbox", MCheckBox);
