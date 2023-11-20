/*
 */

"use strict";

class MModal extends HTMLElement {
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

  // @brief: disables the ability to right click inside the modal
  //
  // @arguments: `element` = main modal element
  // `headerElement` = header element wrapper
  // (in case the user wants to disable right click on it)
  disableRightClick = (element = null) => {
    element.addEventListener("contextmenu", (event) => event.preventDefault());
  };

  // @brief: handles the "opening" and "closing" operations of the modal box
  //
  // @arguments: `targetElement` = target element, the element/node that will trigger the action
  //             `modalElementsGroupArr` = array with modal nodes to be affected by the new display rules
  //             `action` = action to perform (open, close)
  handleModalOperation = (targetElement, modalElementsGroupArr, action) => {
    targetElement.onclick = () => {
      switch (action) {
        case "open":
          modalElementsGroupArr.forEach((element) => {
            element.style.display = "flex";
          });
          break;
        case "close":
          modalElementsGroupArr.forEach((element) => {
            element.style.display = "none";
          });
        default:
          modalElementsGroupArr.forEach((element) => {
            element.style.display = "none";
          });
          break;
      }
    };
  };

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="lib/malua/malua.css">
    <link rel="stylesheet" href="lib/malua/widgets/modal/modal.css">
    <link rel="stylesheet" href="lib/malua/widgets/button/button.css">
    <button class="m-button" style="position: inherit;"></button>
    <section class="m-modal-background" style="display: none;">
      <div class="m-modal-box">
        <dialog class="m-modal">
          <span class="m-modal-button">x</span>
        </dialog>
      </div>
    </section>
  `;

    // modal background wrapper
    const modalBackgroundElement = shadow.querySelector("section");

    // open modal button wrapper
    const modalOpenButtonElement = shadow.querySelector("button");

    // modal box wrapper
    const modalBoxElement = shadow.querySelector("div");

    // modal dialog wrapper
    const modalElement = shadow.querySelector("dialog");

    // modal close button wrapper
    const modalCloseButtonElement = shadow.querySelector("span");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "placeholder",
      "shader",
      "type",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(modalBoxElement, attribute);
    });

    // set modal size
    modalElement.style.width = this.getAttribute("width");
    modalElement.style.height = this.getAttribute("height");

    // set "open modal" button placeholder text and absolute position
    modalOpenButtonElement.textContent =
      this.getAttribute("placeholder") || this.getAttribute("label");
    modalOpenButtonElement.style.position = "absolute";

    if (this.hasAttribute("shader") || this.hasAttribute("effect")) {
      // set modal dialog shader
      modalElement.classList.add(
        this.getAttribute("shader") || this.getAttribute("effect")
      );

      // get rid of the "black" background if the modal has a shader
      modalBackgroundElement.style.background = "none";

      // set background shader
      modalBackgroundElement.classList.add(
        this.getAttribute("shader") || this.getAttribute("effect")
      );
    }

    const modalElementsGroup = [
      modalBackgroundElement,
      modalBoxElement,
      modalElement,
    ];

    // handle modal open and close "operations"
    this.handleModalOperation(
      modalOpenButtonElement,
      modalElementsGroup,
      "open",
      1.0
    ); /* (1.0/100) = 100% opacity */
    this.handleModalOperation(
      modalCloseButtonElement,
      modalElementsGroup,
      "close",
      0.0
    ); /* (0.0/100) = 0% opacity */

    // disables right click on the modal dialog
    this.disableRightClick(modalElement);

    // handle child elements
    for (let i = 1; i < this.childNodes.length; i++) {
      modalElement.appendChild(this.childNodes[i]);
    }
  }
}

// define the new element
customElements.define("m-modal", MModal);
