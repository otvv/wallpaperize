/*
 */

"use strict";

class MPanel extends HTMLElement {
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

  // @brief: disables the ability to right click inside the panel
  //
  // @arguments: `element` = main panel element
  // `headerElement` = header element wrapper
  // (in case the user wants to disable right click on it)
  disableRightClick = (element, headerElement = null) => {
    element.addEventListener("contextmenu", (event) => event.preventDefault());
    headerElement.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
  };

  //
  // @brief: handles panel dragging (movement)
  //
  // @arguments: `element` = main panel element (what will be dragged alongside the 'draggable-area')
  // `headerElement` = headerElement ('area-to-drag')
  handleMovement = (element, headerElement) => {
    // 'static' mutable variables
    let isMouseDown = false;
    let isMouseInside = false;
    let mouseX = 0;
    let mouseY = 0;
    let elementX = 0;
    let elementY = 0;
    // TODO: ^^^ clean this up

    // set mouse status accordingly
    // (if it's inside the headerElement area or not)
    headerElement.addEventListener("mouseenter", () => {
      isMouseInside = true;
    });
    headerElement.addEventListener("mouseleave", () => {
      isMouseInside = false;
    });

    // @brief: mouse click down 'lambda' event
    //
    // @note: only listen to clicks inside the hader element
    // (in case this needs to be changed, feel free to do so)
    headerElement.addEventListener("mousedown", (event) => {
      // grab current cursor position
      mouseX = event.clientX;
      mouseY = event.clientY;

      // set click state
      isMouseDown = true;
    });

    // @brief: mouse movement 'lambda' event
    //
    // @note: this will handle all mouse move events
    // (this in theory could be further optimized to only 'listen'
    // for movement when inside the panel)
    document.addEventListener("mousemove", (event) => {
      if (!isMouseDown || !isMouseInside) {
        return;
      }

      // calcualte panel delta position
      let posDeltaX = +event.clientX - +mouseX;
      let posDeltaY = +event.clientY - +mouseY;

      // move panel element
      element.style.left = +elementX + +posDeltaX + "px";
      element.style.top = +elementY + +posDeltaY + "px";
    });

    // @brief: mouse click up 'lambda' event
    //
    // @note: this will listen in the entire document because we
    // just want to check if the user has let go of the mouse left button
    document.addEventListener("mouseup", () => {
      // reset click and mouse states
      isMouseDown = false;
      isMouseInside = false;

      elementX = +element.style.left;
      elementY = +element.style.top;
    });
  };

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          <link rel="stylesheet" href="lib/malua/malua.css">
          <link rel="stylesheet" href="lib/malua/widgets/panel/panel.css">
          <link rel="stylesheet" href="lib/malua/widgets/figure/figure.css">
          <main class="m-panel">
          <header class="m-panel-header">
          <span class='m-panel-header-image-container'>
          <img class='m-figure'></img>
          <a class="m-panel-header-label"></a>
          </span>
          </header>
          <section class="m-panel-widget-area">
          </section>
          </main>
        `;

    // panel element and title wrapper
    const panelElement = shadow.querySelector("main");
    const panelLabelElement = shadow.querySelector("a");

    // panel header and widget area
    const panelHeaderElement = shadow.querySelector("header");
    const panelWidgetArea = shadow.querySelector("section");

    // filter child elements
    for (let i = 1; i < this.childNodes.length; i++) {
      panelWidgetArea.appendChild(this.childNodes[i]);
    }

    // panel image wrapper
    const panelImageElement = shadow.querySelector("img");

    // list of attributes to look for
    const attributesToSet = [
      "title",
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
      this.setAttributeWhenPresent(panelElement, attribute);
    });

    // set panel title
    panelLabelElement.textContent = this.getAttribute("label");

    // set panel size
    panelElement.style.width = this.getAttribute("width") || "fit-content";
    panelElement.style.height = this.getAttribute("height");

    // NOTE: these are fixed values because of artistic reasons,
    // feel free to change these when creating another design
    {
      // set panel image size
      panelImageElement.style.width = "45px";
      panelImageElement.style.height = "45px";

      // set panel image radius
      panelImageElement.style.borderRadius = "50%";

      // set panel widget area initial position
      panelWidgetArea.style.top = "60px";
      panelWidgetArea.style.position = "absolute";
    }

    // set panel image source and alt text
    panelImageElement.src = this.getAttribute("src");
    panelImageElement.alt = this.getAttribute("alt");

    // set panel header and widget area size
    panelHeaderElement.style.width =
      this.getAttribute("width") || "fit-content";

    // set panel pos
    panelElement.style.left =
      this.getAttribute("x") || this.getAttribute("left");
    panelElement.style.top = this.getAttribute("y") || this.getAttribute("top");

    // set panel shader
    panelElement.classList.add(
      this.getAttribute("shader") || this.getAttribute("effect")
    );

    // handle panel movement
    this.handleMovement(panelElement, panelHeaderElement);

    // disable right clicking
    this.disableRightClick(panelElement, panelHeaderElement);
  }
}

// define the new element
customElements.define("m-panel", MPanel);
