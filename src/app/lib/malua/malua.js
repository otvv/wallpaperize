/*
 */

"use strict";

class MMalua extends HTMLElement {
  // @brief: function to set the absolute position of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `top` = top position (Y in pixels)
  //             `left` = left position (X in pixels)
  //
  // @overloads: `position` = a 2d array containing the position (left and right in pixels)
  setPosition(element, top, left) {
    if (element === null) {
      return;
    }

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  }
  setPosition(element, position) {
    if (element === null) {
      return;
    }

    if (position) {
      element.style.left = `${position[0]}px`;
      element.style.top = `${position[1]}px`;
    }
  }

  // @brief: function to set the size of a HTML element
  //
  // @arguments: `element` = element to set the size
  //             `width` = element width (in pixels)
  //             `height` = element height (in pixels)
  //
  // @overloads: `size` = a 2d array containing the size (width and height in pixels)
  setSize(element, width, height) {
    if (element === null) {
      return;
    }

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }
  setSize(element, size) {
    if (element === null) {
      return;
    }

    if (size) {
      element.style.width = `${size[0]}px`;
      element.style.height = `${size[1]}px`;
    }
  }

  // @brief: function to set the title and placeholder text of a HTML element
  //
  // @arguments: `element` = element to set the title
  //             `title` = title/text label (string)
  //             `skipPlaceHolder` = tell the framework to skip naming the placeholder
  //              (some widgets my need a different placeholder text)
  setLabel(element, title = null, skipPlaceholder = false) {
    if (element === null) {
      return;
    }

    if (title) {
      if (skipPlaceholder === false) {
        element.placeholder = title;
      }
      element.textContent = title;
    }
  }

  // @brief: function to set the placeholder text of a HTML element
  //
  // @arguments: `element` = element to set the title
  //             `placeholder` = placeholder text label (string)
  setPlaceholder(element, placeholder = null) {
    if (element === null) {
      return;
    }

    if (placeholder) {
      element.placeholder = title;
    }
  }

  // @brief: function to set a specific value of a HTML element
  //
  // @arguments: `element` = element to set the title
  //             `value` = element value (any)
  setValue(element, value = null) {
    if (element === null) {
      return;
    }

    if (value) {
      element.value = value;
    }
  }

  // @brief: function to set the state of a HTML element
  // (checked, opened, etc)
  //
  // @arguments: `element` = element to set the title
  //             `state` = element state (string)
  setState(element, state = "false") {
    if (element === null) {
      return;
    }

    if (state === "true") {
      element.checked = state;

      // if the element has a click event, trigger it
      if (element.checked === "true") {
        element.click();
      }
    }
  }

  // @brief: function to add a shader in a HTML element
  //
  // @arguments: `element` = element to set the shader
  //             `shader` = shader param name (blur, glass, etc)
  //             `additional` = additional classes (in case the widget has any/needs one)
  //              defaults to null
  setShader(element, shader, additional = null) {
    if (element === null) {
      return;
    }

    if (shader) {
      if (additional) {
        element.classList.add(shader,additional);
      } else {
        element.classList.add(shader);
      }
    }
  }

  // @brief: with this function the user can set a href link to a HTML element
  // that can handle `onclick` events (in this case the target widget)
  //
  // @arguments: `element` = target element that will handle the 'onclick' event
  //             `hrefLink` = hyper reference link name (with #)
  setHref = (element, hrefLink = null) => {
    if (element === null) {
      return;
    }

    if (hrefLink) {
      element.onclick = () => {
        window.location.href = hrefLink;
      };
    }
  };

  // @brief: this function will check if a certain attribute exists within a HTML element
  // context and if it exists, it will set that attribute accordingly
  //
  // @arguments: `element` = element to set the attribute
  //             `attributeName` = attribute to check (in case it exists, apply its value to the element)
  //             (the value that will be aplied to the attribute is the same that the user provided when "inlining"
  //              the element in the html root page, as long as it's one of the attributes in the list.)
  setAttributeWhenPresent = (element, attributeName = null) => {
    if (element === null) {
      return;
    }

    const attributeValue = element.getAttribute(attributeName);

    if (attributeValue) {
      element.setAttribute(attributeName, attributeValue);
    }
  };
}
