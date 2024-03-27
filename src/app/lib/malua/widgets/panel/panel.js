/*
 */

"use strict";

class MPanel extends MMalua {
  // @brief: disables the ability to right click inside the panel
  //
  // @arguments: `element` = main panel element
  //             `headerElement` = header element wrapper
  //             (in case the user wants to disable right click on it)
  disableRightClick = (element, headerElement = null) => {
    element.addEventListener("contextmenu", (event) => event.preventDefault());
    headerElement.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
  };

  // @brief: handles panel dragging (movement)
  //
  // @arguments: `element` = main panel element (what will be dragged alongside the 'draggable-area')
  //             `headerElement` = header element ('area-to-drag')
  //             `static` = this can be enabled to make the panel static (non-draggable)
  handleMovement = (element, headerElement, isStatic) => {
    if (isStatic === true) {
      return;
    }

    // 'static' mutable variables
    let animFrameId = 0;
    let isMouseDown = false;
    let isMouseInside = false;
    let mouseX = 0;
    let mouseY = 0;
    let elementRect = element.getBoundingClientRect();

    // @brief: updates panel animation frame whenever this function is called
    //
    // @note: this is used to make the dragging "animation" more smooth and responsible
    const animateFrame = () => {
      // animate panel 
      animFrameId = window.requestAnimationFrame(() => {});

      // update panel dimensions every frame
      elementRect = element.getBoundingClientRect();
    };

    // @brief: mouse enter/leave 'lambda' event
    //
    // @note: (these events will only be triggered if it's inside 
    // the headerElement area)
    headerElement.addEventListener("mouseenter", () => {
      isMouseInside = true;
    });
    headerElement.addEventListener("mouseleave", () => {
      isMouseInside = false;

      // stop updating panel frame
      window.cancelAnimationFrame(animFrameId);
    });

    // @brief: mouse click down 'lambda' event
    //
    // @note: only listen to clicks inside the hader element
    // (in case this needs to be changed, feel free to do so)
    headerElement.addEventListener("mousedown", (event) => {
      // grab current cursor position
      mouseX = event.clientX;
      mouseY = event.clientY;

      // update panel dimentions
      elementRect = element.getBoundingClientRect();

      // set click state
      isMouseDown = true;

      // update panel anim frame 
      animateFrame();
    });

    // @brief: mouse movement 'lambda' event
    //
    // @note: this will handle all mouse move events
    // (this in theory could be further optimized to only 'listen'
    // for movement when inside the panel)
    document.addEventListener("mousemove", (event) => {
      if (isMouseDown === false || isMouseInside === false) {
        return;
      }

      // calcualte panel delta position
      const posDeltaX = (+event.clientX - +mouseX);
      const posDeltaY = (+event.clientY - +mouseY);

      // move panel element
      element.style.left = `${+elementRect.left + +posDeltaX}px`;
      element.style.top = `${+elementRect.top + +posDeltaY}px`;
    });

    // @brief: mouse click up 'lambda' event
    //
    // @note: this will listen in the entire document because we
    // just want to check if the user has let go of the mouse left button
    document.addEventListener("mouseup", () => {
      // reset states
      isMouseDown = false;
      
      // stop updating panel frame
      window.cancelAnimationFrame(animFrameId);
    });
  };

  // @brief: widget constructor (don't touch this unless you know what you're doing!)
  constructor() {
    // ..
    super();

    // create shadow root
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
          ${globalMaluaStyleInclude}
          <main class="m-panel">
          <header class="m-panel-header">
          <span class='m-panel-header-image-container'>
          <img alt="figure" class='m-figure'></img>
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
      "label",
      "id",
      "alt",
      "shader",
      "effect",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
      "static",
    ];

    // set attributes if present
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(panelElement, attribute);
    });

    // set panel size
    const elementSize = [
      this.getAttribute("width") || "moz-fit-content" || "fit-content",
      this.getAttribute("height"),
    ];
    this.setSize(panelElement, elementSize);

    // set panel label (greeting text)
    const elementLabel = this.getAttribute("label");
    this.setLabel(panelLabelElement, elementLabel);

    //
    // NOTE: these are fixed values because of "artistic" reasons,
    // feel free to change these if you're modifying malua's default design
    //
    {
      // set panel image size
      const panelImageSize = [
        "45", // width
        "45", // height
      ];
      this.setSize(panelImageElement, panelImageSize);

      // set panel image radius
      panelImageElement.style.borderRadius = "50px";

      // disable dragging from panel image
      panelImageElement.setAttribute("draggable", "false");

      // set panel widget area initial position
      const panelWidgetAreaTopPosition = "60";
      this.setTopPosition(panelWidgetArea, panelWidgetAreaTopPosition);
      panelWidgetArea.style.position = "absolute";
    }

    // set panel header and widget area size
    const panelHeaderWidth = this.getAttribute("width") || "moz-fit-content" || "fit-content";
    this.setWidth(panelHeaderElement, panelHeaderWidth);

    // set panel abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(panelElement, elementPosition);

    // set panel shader
    const elementShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    this.setShader(panelElement, elementShader);

    // set panel image source and alt text
    if (this.hasAttribute("src")) {
      panelImageElement.src = this.getAttribute("src");

      this.setPlaceholder(panelImageElement, this.getAttribute("alt"));
    } else {
      panelImageElement.style.display = "none";
    }

    // handle panel movement
    if (this.hasAttribute("static")) {
      this.handleMovement(panelElement, panelHeaderElement, true);
    } else {
      this.handleMovement(panelElement, panelHeaderElement, false);
    }

    // disable right clicking
    this.disableRightClick(panelElement, panelHeaderElement);
  }
}

// define the new element
customElements.define("m-panel", MPanel);
