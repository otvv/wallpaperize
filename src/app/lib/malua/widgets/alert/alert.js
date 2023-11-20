/*
 */

"use strict";

class MAlert extends MMalua {
  // @brief: this function will checks for clicks around the area of the alert
  // after a click is registered it will proceed to hide it with a little fade-out animation
  // @arguments: `alertElement` = alert element wrapper
  hideAlerts = (element) => {
    // hide alerts on click
    element.onclick = () => {
      // set the opacity of the alert (fade out animation)
      element.style.opacity = 0;
      element.style.transition = "0.35s";

      // hide selected alert on a given time (350ms)
      setTimeout(() => {
        element.style.visibility = "hidden";
        element.style.display = "none";
        element.remove;
      }, 350);
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
    <link rel="stylesheet" href="lib/malua/widgets/alert/alert.css">
    <div class="m-alert-box">
      <span class="m-alert">
      <a class="m-alert-label"></a>
      </span>
    </div>
  `;

    // alert span wrapper
    const alertSpanElement = shadow.querySelector("span");

    // alert text wrapper
    const alertLabelElement = shadow.querySelector("a");

    // list of attributes to look for
    const attributesToSet = [
      "label",
      "id",
      "shader",
      "effect",
      "type",
      "x",
      "y",
      "top",
      "left",
      "width",
      "height",
    ];

    // apply alert attributes
    attributesToSet.forEach((attribute) => {
      this.setAttributeWhenPresent(alertSpanElement, attribute);
    });

    // set alert abs pos
    const elementPosition = [
      this.getAttribute("x") || this.getAttribute("left"),
      this.getAttribute("y") || this.getAttribute("top"),
    ];
    this.setPosition(alertSpanElement, elementPosition);

    // set alert size
    const elementSize = [
      this.getAttribute("width"),
      this.getAttribute("height"),
    ];
    this.setSize(alertSpanElement, elementSize);

    // handle different types of alerts
    const elementShader =
      this.getAttribute("shader") || this.getAttribute("effect");
    if (this.hasAttribute("type")) {
      // set alert shader and type
      this.setShader(
        alertSpanElement,
        elementShader,
        `m-alert-${this.getAttribute("type")}`
      );
    } else {
      // set alert shader
      this.setShader(alertSpanElement, elementShader, "m-alert-default");
    }

    // set alert label
    const elementLabel = this.getAttribute("label");
    this.setLabel(alertLabelElement, elementLabel);

    // set alert link/href
    const elementHref = this.getAttribute("href");
    this.setHref(alertSpanElement, elementHref);

    // hide alert (notification) if the user clicks on it
    this.hideAlerts(alertSpanElement);
  }
}

// define the new element
customElements.define("m-alert", MAlert);
