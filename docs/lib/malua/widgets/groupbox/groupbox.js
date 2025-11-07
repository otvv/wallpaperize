/*
 */

"use strict";

class MGroupBox extends MMalua {
  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          ${globalMaluaStyleInclude}
          <fieldset class="m-groupbox">
          <legend class="m-groupbox-label"/>
          </fieldset>
        `;

    // fieldset wrapper
    const fieldsetElement = shadow.querySelector("fieldset");

    // fieldset title
    const fieldsetLegendElement = shadow.querySelector("legend");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "shader",
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
      this.setAttributeWhenPresent(fieldsetElement, attribute);
    });

    // set fieldset abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(fieldsetElement, elementPosition);

    // set fieldset size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(fieldsetElement, elementSize);

    // set fieldset shader
    const elementShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    this.setShader(fieldsetElement, elementShader);

    // set fieldset label
    const elementLabel = this.getAttribute("label");
    this.setLabel(fieldsetLegendElement, elementLabel);

    // set fieldset id and string attribution
    if (this.hasAttribute("id")) {
      fieldsetElement.setAttribute("id", this.getAttribute("id"));
      fieldsetLegendElement.setAttribute("for", fieldsetElement.id);
    }

    // this fixes some incompatibility issues
    this.removeAttribute("id");

    // handle child elements
    for (let i = 1; i < this.childNodes.length; i++) {
      fieldsetElement.appendChild(this.childNodes[i]);
    }
  }
}

// define the new element
customElements.define("m-groupbox", MGroupBox);
