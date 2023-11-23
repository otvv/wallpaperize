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
      "id",
      "disabled",
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
      this.getAttribute("width") || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(boxDivElement, elementSize);

    // set checkbox label
    const elementLabel = this.getAttribute("label");
    this.setLabel(checkboxLabelElement, elementLabel, true);

    // set checkbox placeholder
    const elementPlaceholder = this.getAttribute("placeholder");
    this.setPlaceholder(checkboxElement, elementPlaceholder);

    // set checkbox id and string attribution
    if (this.hasAttribute("id")) {
      checkboxElement.setAttribute("id", this.getAttribute("id"));
      checkboxLabelElement.setAttribute("for", checkboxElement.id);
    }

    // this fixes some incompatibility issues
    this.removeAttribute("id");
  }
}

// define the new element
customElements.define("m-checkbox", MCheckBox);
