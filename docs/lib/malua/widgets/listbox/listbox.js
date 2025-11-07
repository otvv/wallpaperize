/*
 */

"use strict";

class MListBox extends MMalua {
  // @brief: this function will add a new entry/option into the listbox element
  //
  // @arguments: `listbox` = listbox element that will be used to add new options
  //             `name` = entry/option name
  //             `value` = entry value
  addOption(listbox, name, value = 0) {
    if (listbox === null) {
      return;
    }

    if (name) {
      const dummyOption = document.createElement("option");

      // set option properties
      dummyOption.textContent = name;
      dummyOption.value = value;

      // append option into listbox element
      listbox.appendChild(dummyOption);
    }
  }

  // @brief: this function returns the index of the selected option
  getIndex() {
    const listboxElement = this.shadowRoot.querySelector(".m-listbox");
    
    if (listboxElement === null) {
      return;
    }

    const selectedIndex = listboxElement.selectedIndex;

    return selectedIndex || 0;
  }

  // @brief: this function returns the value of the currently selected option
  getValue() {
    const listboxElement = this.shadowRoot.querySelector(".m-listbox");
    const selectedOption = listboxElement.options[listboxElement.selectedIndex];

    return selectedOption.value;
  }

  // @brief: perform initial operations when mounting element
  connectedCallback() {
    const listboxElement = this.shadowRoot.querySelector(".m-listbox");

    // set listbox default index
    this.setIndex(listboxElement, 0);
  }

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    ${globalMaluaStyleInclude}
    <label class="m-listbox-label"></label>
    <select class="m-listbox" multiple>  
    </select>  
   `;

    // listbox element wrapper
    const listboxElement = shadow.querySelector("select");

    // listbox label wrapper
    const listboxLabelElement = shadow.querySelector("label");

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
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(listboxElement, attribute);
    });

    // set listbox label
    const elementLabel = this.getAttribute("label");
    this.setLabel(listboxLabelElement, elementLabel);
    listboxElement.title = elementLabel;

    // set listbox abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(listboxElement, elementPosition);

    // set listbox size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height") || "fit-element",
    ];
    this.setSize(listboxElement, elementSize);

    // set listbox id and label attribution
    if (this.hasAttribute("id")) {
      listboxElement.setAttribute("id", this.getAttribute("id"));
      listboxLabelElement.setAttribute("for", listboxElement.id);
    }

    // this fixes some incompatibility issues
    this.removeAttribute("id");

    // handle child elements
    for (let i = 1; i < this.childNodes.length; i++) {
      listboxElement.appendChild(this.childNodes[i]);
    }
  }
}

// define the new element
customElements.define("m-listbox", MListBox);
