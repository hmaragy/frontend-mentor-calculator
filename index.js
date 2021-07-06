"use strict";

class Screen {
  static element = document.querySelector(".app__result");

  static display(content) {
    Screen.element.innerText = content.join("");
  }

  static clear() {
    Screen.element.innerText = "";
  }
}

class Calculator {
  static OPERATIONS = ["+", "-", "*", "/"];
  static DEL = "del";
  static EQ = "=";
  static RESET = "rst";

  static result = null;
  static values = [];

  static appendValue(value) {
    if (
      (!Number.isNaN(
        Number.parseInt(Calculator.values.slice(-1)[0]?.slice(-1))
      ) ||
        Calculator.values.slice(-1)[0]?.slice(-1) === ".") &&
      (!Number.isNaN(Number.parseFloat(value)) || value == ".")
    ) {
      //append number.
      Calculator.values[Calculator.values.length - 1] += value;
      if (value !== ".") {
        Calculator.values[Calculator.values.length - 1] = parseFloat(
          Calculator.values[Calculator.values.length - 1]
        ).toString();
      }
    } else if (
      //if entered value is an operation and there's an operation entered before it.
      Calculator.OPERATIONS.includes(Calculator.values.slice(-1)[0]) &&
      Calculator.OPERATIONS.includes(value)
    ) {
      Calculator.values[Calculator.values.length - 1] = value;
    } else if (Calculator.OPERATIONS.includes(value)) {
      if (Calculator.values.length === 0 && Calculator.result) {
        Calculator.values.push(Calculator.result.toString());
        Calculator.result = null;
      }
      Calculator.values.push(value);
    } else {
      Calculator.values.push(value);
    }
    Screen.display(Calculator.values);
  }

  static backspace() {
    if (!Calculator.values.length) {
      Calculator.result = null;
      Screen.display(Calculator.values);
      return;
    }
    let lastValue = Calculator.values.length - 1;
    if (Calculator.values[lastValue].length > 1) {
      Calculator.values[lastValue] = Calculator.values[lastValue].slice(0, -1);
    } else {
      Calculator.values.pop();
    }
    Screen.display(Calculator.values);
  }
  static reset() {
    Screen.clear();
    Calculator.values = [];
    Calculator.result = null;
  }

  static calculate() {
    if (Calculator.values.length === 0) {
      return;
    }
    if (!Calculator.OPERATIONS.includes(Calculator.values[0])) {
      Calculator.result = 0;
    }
    Calculator.result = eval(Calculator.values.join(""));
    Calculator.values = [];
    Screen.display([
      parseFloat(Calculator.result)
        .toFixed(3)
        .replace(/[.,]000$/, ""),
    ]);
  }

  static handleInput(value) {
    if (
      !Number.isNaN(Number.parseFloat(value)) ||
      Calculator.OPERATIONS.includes(value) ||
      value == "."
    ) {
      Calculator.appendValue(value);
    } else if (value == Calculator.DEL) {
      Calculator.backspace();
    } else if (value == Calculator.RESET) {
      Calculator.reset();
    } else if (value == "=") {
      Calculator.calculate();
    }
  }
}

/* Event Listeners */
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  let body = document.querySelector("body");
  let bodyTheme = document.querySelector("body").classList[0];
  body.classList.remove(bodyTheme);
  body.classList.add("theme-3");
  document.querySelector(".app__toggle--toggle-area").value = "3";
}

document
  .querySelector(".app__toggle--toggle-area")
  .addEventListener("click", (e) => {
    let body = document.querySelector("body");
    let bodyTheme = document.querySelector("body").classList[0];
    if (bodyTheme !== `theme-${e.target.value}`) {
      body.classList.remove(bodyTheme);
      body.classList.add(`theme-${e.target.value}`);
    }
  });

document.querySelectorAll(".app__keypad-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    Calculator.handleInput(e.target.dataset.value);
  });
});
