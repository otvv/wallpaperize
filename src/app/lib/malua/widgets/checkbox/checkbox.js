/*
 */

"use strict";

class MCheckBox extends MMalua {
  // @brief: perform initial operations when mounting element
  connectedCallback() {
    const checkboxElement = this.shadowRoot.querySelector(".m-checkbox");

    // set color button default color
    this.setState(
      checkboxElement,
      this.getAttribute("checked") ||
        this.getAttribute("value") ||
        this.getAttribute("state") ||
        false
    );
  }

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          ${globalMaluaStyleInclude}
          <span class="m-checkbox-box">
            <input class="m-checkbox" type="checkbox">
            <label class="m-checkbox-label"></label>
          </span>
        `;

    // checkbox input wrapper and box div
    const checkboxElement = shadow.querySelector("input");
    const boxSpanElement = shadow.querySelector("span");

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

    // set checkbox div box abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(boxSpanElement, elementPosition);

    // set checkbox box div size
    const elementSize = [
      this.getAttribute("width") || "moz-fit-content" || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(boxSpanElement, elementSize);

    // set checkbox label
    const elementLabel = this.getAttribute("label");
    this.setLabel(checkboxLabelElement, elementLabel, true);
    checkboxElement.title = elementLabel;

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
