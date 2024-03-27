/*
 */

"use strict";

class MModal extends MMalua {
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
    ${globalMaluaStyleInclude}
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
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(modalBoxElement, attribute);
    });

    // set modal size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(modalElement, elementSize);

    // set the title of the modal 'trigger' button modal and abs position
    const elementLabel = this.getAttribute("label");
    this.setLabel(modalOpenButtonElement, elementLabel);
    modalOpenButtonElement.style.position = "absolute";

    // set modal shader
    const elementShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    this.setShader(modalElement, elementShader);

    // get rid of the "black" background if the modal has a shader
    if (this.hasAttribute("shader") || this.hasAttribute("effect")) {
      modalBackgroundElement.style.background = "none";
    }

    // set modal background shader
    const backgroundShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    this.setShader(modalBackgroundElement, backgroundShader);

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
