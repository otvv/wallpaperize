/*
 */

"use strict";

// global malua styles import 
const globalMaluaStyleInclude = "<link rel='stylesheet' href='lib/malua/malua.css'/>"

class MMalua extends HTMLElement {
  // @brief: function to set the absolute position of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `left` = left position (X in pixels)
  //             `top` = top position (Y in pixels)
  //
  // @overloads: `position` = a 2d array containing the position (left and top in pixels)
  setPosition(element, left, top) {
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

  // @brief: function to set the marging of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `leftMargin` = left margin (in pixels)
  //             `topMargin` = top margin (in pixels)
  //
  // @overloads: `margin` = a 2d array containing the margin (left and top in pixels)
  setMargin(element, leftMargin, topMargin) {
    if (element === null) {
      return;
    }

    element.style.marginLeft = `${leftMargin}px`;
    element.style.marginTop = `${topMargin}px`;
  }
  setMargin(element, margin) {
    if (element === null) {
      return;
    }

    if (margin) {
      element.style.marginLeft = `${margin[0]}px`;
      element.style.marginTop = `${margin[1]}px`;
    }
  }

  // @brief: function to set the absolute left position of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `left` = left position (X in pixels)
  setLeftPosition(element, left) {
    if (element === null) {
      return;
    }

    if (left) {
      element.style.left = `${left}px`;
    }
  }

  // @brief: function to set the left margin of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `leftMargin` = left margin (in pixels)
  setLeftMargin(element, leftMargin) {
    if (element === null) {
      return;
    }

    if (leftMargin) {
      element.style.marginLeft = `${leftMargin}px`;
    }
  }

  // @brief: function to set the absolute top position of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `top` = top position (Y in pixels)
  setTopPosition(element, top) {
    if (element === null) {
      return;
    }

    if (top) {
      element.style.top = `${top}px`;
    }
  }

  // @brief: function to set the top margin of a HTML element
  //
  // @arguments: `element` = element to set the position
  //             `topMargin` = top margin (in pixels)
  setTopMargin(element, topMargin) {
    if (element === null) {
      return;
    }

    if (topMargin) {
      element.style.marginTop = `${topMargin}px`;
    }
  }

  // @brief: function to set the size of a HTML element
  //
  // @arguments: `element` = element to set the size
  //             `width` = element width (in pixels)
  //             `height` = element height (in pixels)
  //
  // @overloads: `size` = a 2d array containing the size (width and height in pixels)
  //             `width` = only width will be set
  //             `height` = only height will be set
  setSize(element, width, height) {
    if (element === null) {
      return;
    }
    // img size alternative
    if (element.nodeName === "img") {
      element.width = `${width}px`;
      element.height = `${height}px`;
    } else {
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    }
  }
  setSize(element, size) {
    if (element === null) {
      return;
    }

    if (size) {
      // img size alternative
      if (element.nodeName === "img") {
        element.width = `${size[0]}px`;
        element.height = `${size[1]}px`;
      } else {
        element.style.width = `${size[0]}px`;
        element.style.height = `${size[1]}px`;
      }
    }
  }

  // @brief: function to set the width of a HTML element
  //
  // @arguments: `element` = element to set the size
  //             `width` = element width (in pixels)
  //
  setWidth(element, width) {
    if (element === null) {
      return;
    }

    if (width) {
      element.style.width = `${width}px`;
    }
  }

  // @brief: function to set the height of a HTML element
  //
  // @arguments: `element` = element to set the size
  //             `height` = element height (in pixels)
  //
  setHeight(element, height) {
    if (element === null) {
      return;
    }

    if (height) {
      element.style.height = `${height}px`;
    }
  }

  // @brief: function to set the title and placeholder text of a HTML element
  //
  // @arguments: `element` = element to set the title
  //             `title` = title/text label (string)
  //             `skipPlaceHolder` = tell the framework to skip naming the placeholder
  //              (some widgets my need a different placeholder text)
  setLabel(element, title, skipPlaceholder = false) {
    if (element === null) {
      return;
    }

    if (title !== null) {
      if (skipPlaceholder === false) {
        if (element.placeholder !== null) {
          element.placeholder = title;
        }
      }

      if (element.textContent !== null) {
        element.textContent = title;
      }

      if (element.title !== null) {
        element.title = title;
      }
    }
  }

  // @brief: function to set the placeholder text of a HTML element
  //
  // @arguments: `element` = element to set the placeholder
  //             `placeholder` = placeholder text label (string)
  setPlaceholder(element, placeholder = null) {
    if (element === null) {
      return;
    }

    if (placeholder !== null) {
      element.placeholder = placeholder;

      if (element.alt !== null) {
        element.alt = placeholder;
      }
    }
  }

  // @brief: function to set a specific value of a HTML element
  //
  // @arguments: `element` = element to set the value
  //             `value` = element value (any)
  setValue(element, value = null) {
    if (element === null) {
      return;
    }

    if (value !== null) {
      element.value = value;
    }
  }

  // @brief: function to set a specific index of a HTML element
  // (useful for ListBoxes and ComboBoxes)
  //
  // @arguments: `element` = element to set the index
  //             `index` = element index (number)
  setIndex(element, index = 0) {
    if (element === null) {
      return;
    }

    if (index !== 0) {
      if (element.selectedIndex !== null) {
        element.selectedIndex = index;
      }
    }
  }

  // @brief: function to set the state of a HTML element
  // (checked, opened, etc)
  //
  // @arguments: `element` = element to set the state
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
  //             `skipLabel` = this will tell the function to skip label related elements from having blur applied
  //              defaults to true
  //             `additional` = additional classes (in case the widget has any/needs one)
  //              defaults to null
  setShader(element, shader, skipLabel = true, additional = null) {
    if (!(element instanceof Element)) {
      return;
    }
  
    if (shader) {
      const elementsToApplyShader = !skipLabel
        ? Array.from(element.children).filter(
            (child) =>
              child.tagName &&
              (child.tagName.toLowerCase() === "label" ||
                child.tagName.toLowerCase() === "legend")
          )
        : [element];
  
      elementsToApplyShader.forEach((element) => {
        if (additional !== null) {
          element.classList.add(shader, additional);
        } else {
          element.classList.add(shader);
        }
      });
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

    if (hrefLink !== null) {
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

    if (attributeValue !== null) {
      element.setAttribute(attributeName, attributeValue);
    }
  };
}
