/*
 */

"use strict";

class MComboBox extends MMalua {
  // @brief: this function will add a new entry/option into the combobox element
  //
  // @arguments: `combobox` = combobox element that will be used to add new options
  //             `name` = entry/option name
  //             `value` = entry value
  addOption(combobox, name, value = 0) {
    if (combobox === null) {
      return;
    }

    if (name) {
      const dummyOption = document.createElement("option");

      // set option properties
      dummyOption.textContent = name;
      dummyOption.value = value;

      // append option into combobox element
      combobox.appendChild(dummyOption);
    }
  }

  // @brief: this function returns the index of the selected option
  getIndex() {
    const comboboxElement = this.shadowRoot.querySelector(".m-combobox");
    
    if (comboboxElement === null) {
      return;
    }

    const selectedIndex = comboboxElement.selectedIndex;

    return selectedIndex || 0;
  }

  // @brief: this function returns the value of the currently selected option
  getValue() {
    const comboboxElement = this.shadowRoot.querySelector(".m-combobox");
    const selectedOption = comboboxElement.options[comboboxElement.selectedIndex];

    return selectedOption.value;
  }

  // @brief: perform initial operations when mounting element
  connectedCallback() {
    const comboboxElement = this.shadowRoot.querySelector(".m-combobox");

    // set combobox default index
    this.setIndex(comboboxElement, 0);
  }

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    ${globalMaluaStyleInclude}
    <div class="m-combobox-label-container">
      <label class="m-combobox-label"></label>
    </div>
    <span class="m-combobox-box">
      <select class="m-combobox">  
      </select>  
    </span>
    `;

    // combobox element wrapper
    const comboboxElement = shadow.querySelector("select");
    const boxSpanElement = shadow.querySelector("span");

    // combobox label wrapper
    const comboboxLabelElement = shadow.querySelector("label");
    const labelContainerElement = shadow.querySelector("div");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "index",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
      "size",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(comboboxElement, attribute);
    });

    // set combobox label
    const elementLabel = this.getAttribute("label");
    this.setLabel(comboboxLabelElement, elementLabel);
    comboboxElement.title = elementLabel;

    // set combobox abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(comboboxElement, elementPosition);

    // set combobox size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(comboboxElement, elementSize);

    // set combobox id and label attribution
    if (this.hasAttribute("id")) {
      comboboxElement.setAttribute("id", this.getAttribute("id"));
      comboboxLabelElement.setAttribute("for", comboboxElement.id);
    }

    // this fixes some incompatibility issues
    this.removeAttribute("id");

    // handle child elements
    for (let i = 1; i < this.childNodes.length; i++) {
      comboboxElement.appendChild(this.childNodes[i]);
    }
  }
}

// define the new element
customElements.define("m-combobox", MComboBox);
