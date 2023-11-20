/*
 */

"use strict";

class MTextBox extends MMalua {
  // @brief: this function will check if a certain attribute exists
  // in the widget context and if it exists, it will set that attribute accordingly
  //
  // @arguments: `element` = element to set the attribute
  //             `attributeName` = attribute to check if it exists, in case it does, apply its value
  //             (the value that will be aplied to the attribute is the same that the user provided when "declaring"
  //              the element in the html root page.)
  setAttributeWhenPresent = (element, attributeName) => {
    const attributeValue = this.getAttribute(attributeName);

    // only set attribute if the user has set a value to it
    if (attributeValue) {
      element.setAttribute(attributeName, attributeValue);
    }
  };

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          <link rel="stylesheet" href="lib/malua/malua.css">
          <link rel="stylesheet" href="lib/malua/widgets/textbox/textbox.css">
          <input class="m-textbox" type="text">
        `;

    // text input wrapper
    const textboxElement = shadow.querySelector("input");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "placeholder",
      "text",
      "value",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(textboxElement, attribute);
    });

    // set textbox default value
    textboxElement.placeholder =
      this.getAttribute("text") || this.getAttribute("value") || "";

    // set textbox label
    const elementLabel =
      this.getAttribute("label") || this.getAttribute("placeholder");
    this.setLabel(textboxElement, elementLabel);

    // set textbox default value
    const elementValue =
      this.getAttribute("text") || this.getAttribute("value");
    this.setValue(textboxElement, elementValue);

    // set textbox abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(textboxElement, elementPosition);

    // set textbox size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(textboxElement, elementSize);
  }
}

// define the new element
customElements.define("m-textbox", MTextBox);
