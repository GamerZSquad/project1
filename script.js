let display = document.getElementById("display");
let historyList = document.getElementById("history-list");
let mainScreen = document.querySelector(".main-screen");
let historyScreen = document.querySelector(".history-screen");
let showHistoryButton = document.getElementById("show-history");
let backToCalculatorButton = document.getElementById("back-to-calculator");

let currentValue = "0";
let operator = null;
let previousValue = null;
let waitingForOperand = false;

function handleInput(value) {
  if (!isNaN(value)) {
    inputDigit(value);
  } else if (value === ".") {
    inputDot();
  } else if (value === "C") {
    resetCalculator();
  } else if (value === "±") {
    toggleSign();
  } else if (value === "%") {
    handlePercentage();
  } else if (["+", "-", "*", "/"].includes(value)) {
    performCalculation(value);
  } else if (value === "=") {
    if (operator && !waitingForOperand) {
      const result = performCalculation(operator);
      operator = null;
    }
  } else if (value === "Backspace") {
    currentValue = currentValue.slice(0, -1) || "0";
    updateDisplay();
  }
}

function inputDigit(digit) {
  if (waitingForOperand) {
    currentValue = digit;
    waitingForOperand = false;
  } else {
    currentValue = currentValue === "0" ? digit : currentValue + digit;
  }
  updateDisplay();
}

function inputDot() {
  if (!currentValue.includes(".")) {
    currentValue += ".";
    updateDisplay();
  }
}

function resetCalculator() {
  currentValue = "0";
  operator = null;
  previousValue = null;
  waitingForOperand = false;
  updateDisplay();
}

function toggleSign() {
  currentValue = String(parseFloat(currentValue) * -1);
  updateDisplay();
}

function handlePercentage() {
  currentValue = String(parseFloat(currentValue) / 100);
  updateDisplay();
}

function performCalculation(nextOp) {
  const inputValue = parseFloat(currentValue);
  if (previousValue === null) {
    previousValue = inputValue;
    operator = nextOp;
    waitingForOperand = true;
    return;
  }
  if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    addHistory(`${previousValue} ${operator} ${inputValue} = ${result}`, result);
    currentValue = String(result);
    previousValue = result;
    operator = nextOp;
    waitingForOperand = true;
    updateDisplay();
    return result;
  }
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : "Error";
    default: return b;
  }
}

function addHistory(entry, result) {
  const item = document.createElement("div");
  item.classList.add("history-item");
  if (result === "Error") {
    item.classList.add("error");
    item.textContent = entry;
  } else {
    item.innerHTML = entry.replace("=", "<span>=</span>") + ` <span class="result"></span>`;
  }
  historyList.appendChild(item);
}

function updateDisplay() {
  display.textContent = currentValue;
}


document.querySelectorAll(".button").forEach(button => {
  button.addEventListener("click", e => {
    handleInput(e.target.getAttribute("data-value"));
  });
});
document.addEventListener("keydown", e => {
  handleInput(
    e.key === "Enter" ? "=" :
    e.key
  );
});

showHistoryButton.addEventListener("click", () => {
  mainScreen.style.display = "none";
  historyScreen.style.display = "flex";
});
backToCalculatorButton.addEventListener("click", () => {
  historyScreen.style.display = "none";
  mainScreen.style.display = "block";
});


updateDisplay();
addHistory("Calculator started", "0");


document.addEventListener("keydown", e => {
  if (e.key === "Backspace") {
    handleInput("Backspace");
  }
  if (e.key === "Escape") {
    resetCalculator();
  }
});


historyList.addEventListener("click", e => {
  if (e.target.classList.contains("history-item")) {
    const text = e.target.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert("History entry copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  }
});


historyList.addEventListener("mouseover", e => {
  if (e.target.classList.contains("history-item")) {
    e.target.classList.add("hovered");
  }
});
historyList.addEventListener("mouseout", e => {
  if (e.target.classList.contains("history-item")) {
    e.target.classList.remove("hovered");
  }
});

document.getElementById("clear-history").addEventListener("click", () => {
  historyList.innerHTML = "";
  addHistory("History cleared", "0");
});