let currentOperation = null;

document.querySelectorAll(".app__keypad-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    handleValue(e.target.dataset.value);
  });
});

class Screen {
  static screen = document.querySelector(".app__result");

  static display(content) {
    Screen.screen.innerText = content.join("");
  }

  static clear() {
    Screen.screen.innerText = "";
  }
}

class Calculator {
  static OPERATIONS = ["+", "-", "x", "/"];
  static DEL = "del";
  static EQ = "=";
  static RESET = "rst";

  static result = null;
  static values = [];

  static add(a, b) {
    return a + b;
  }

  static sub(a, b) {
    return a - b;
  }

  static div(a, b) {
    return a / b;
  }

  static mul(a, b) {
    return a * b;
  }

  static appendValue(value) {
    if (
      //If the entered value is a number or decimal
      (!Number.isNaN(
        Number.parseInt(Calculator.values.slice(-1)[0]?.slice(-1))
      ) ||
        Calculator.values.slice(-1)[0]?.slice(-1) === ".") &&
      (!Number.isNaN(Number.parseFloat(value)) || value == ".")
    ) {
      Calculator.values[Calculator.values.length - 1] += value;
    } else if (
      //if entered value is an operation and there's an operation entered before it.
      Calculator.OPERATIONS.includes(Calculator.values.slice(-1)[0]) &&
      Calculator.OPERATIONS.includes(value)
    ) {
      Calculator.values[Calculator.values.length - 1] = value;
    } else if (Calculator.OPERATIONS.includes(value)) {
      if (Calculator.values.length === 0 && Calculator.result) {
        Calculator.values.push(Calculator.result);
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
    if (!Calculator.OPERATIONS.includes(Calculator.values[0])) {
      Calculator.result = 0;
    }
    console.log(Calculator.result, Calculator.values);
    for (let i = 0; i < Calculator.values.length; i++) {
      let value = Calculator.values[i];
      if (!Number.isNaN(Number.parseFloat(value))) {
        Calculator.result = Number.parseFloat(value);
      } else {
        switch (value) {
          case "+":
            console.log(
              "Addition",
              Calculator.result,
              +Calculator.values[i + 1]
            );
            Calculator.result = Calculator.add(
              Calculator.result,
              +Calculator.values[++i]
            );
            break;
          case "-":
            Calculator.result = Calculator.sub(
              Calculator.result,
              +Calculator.values[++i]
            );
            break;
          case "x":
            Calculator.result = Calculator.mul(
              Calculator.result,
              +Calculator.values[++i]
            );
            break;

          case "/":
            Calculator.result = Calculator.div(
              Calculator.result,
              +Calculator.values[++i]
            );
            break;
        }
      }
    }
    Calculator.values = [];
    Screen.display([Calculator.result]);
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

function handleValue(value) {
  Calculator.handleInput(value);
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
