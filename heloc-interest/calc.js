document.addEventListener("DOMContentLoaded", () => {
  const drawAmountInput = document.querySelector("#draw-amount");
  const interestRateInput = document.querySelector("#interest-rate");
  const calcButton = document.querySelector('[calc-input="calc_button"]');
  const decreaseBtn = document.querySelector("#btn-decrease");
  const increaseBtn = document.querySelector("#btn-increase");

  const formatCurrency = (value) => `$${parseFloat(value).toLocaleString()}`;
  const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;

  const calculatePayments = () => {
    let drawAmount = parseFloat(drawAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let interestRate = parseFloat(interestRateInput.value.replace(/[^0-9.-]+/g, ""));

    if (isNaN(drawAmount) || isNaN(interestRate)) return;

    // Enforce minimum draw amount of $10,000
    drawAmount = Math.max(drawAmount, 10000);
    drawAmountInput.value = drawAmount.toLocaleString(); // Update the input field

    // Round interest rate to the nearest allowable percentage
    interestRate = Math.min(Math.max(interestRate, 5.5), 14.5);
    interestRateInput.value = formatPercentage(interestRate); // Update the input field

    // Calculate interest payment during the draw period
    let interestPayment = (drawAmount * (interestRate / 100)) / 12;

    // Calculate monthly payment during the repayment period
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = 20 * 12; // 20 years
    const monthlyRepayment = (drawAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    // Total payment is the sum of interest payment during draw period and monthly repayment during repayment period
    let totalPayment = interestPayment + monthlyRepayment;

    // Round to the nearest whole number
    interestPayment = Math.round(interestPayment);
    totalPayment = Math.round(totalPayment);

    document.querySelector("[calc-result='interest-payment']").innerText = formatCurrency(interestPayment);
    document.querySelector("[calc-result='total-payment']").innerText = formatCurrency(totalPayment);
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleInterestRateChange = (increment) => {
    let currentRate = parseFloat(interestRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentRate = Math.min(Math.max(currentRate + increment, 5.5), 14.5);
    currentRate = Math.round(currentRate * 10) / 10; // Round to nearest 0.1%
    interestRateInput.value = formatPercentage(currentRate);
    debounce(calculatePayments, 500)();
  };

  const handleDrawAmountChange = (increment) => {
    let currentAmount = parseFloat(drawAmountInput.value.replace(/[^0-9.-]+/g, ""));
    currentAmount = Math.max(currentAmount + increment, 10000); // Enforce minimum draw amount of $10,000
    drawAmountInput.value = currentAmount.toLocaleString();
    debounce(calculatePayments, 500)();
  };

  drawAmountInput.addEventListener("blur", () => {
    let value = parseFloat(drawAmountInput.value.replace(/[^0-9]/g, ""));
    value = isNaN(value) ? 10000 : Math.max(value, 10000); // Enforce minimum draw amount on blur
    drawAmountInput.value = value.toLocaleString();
    calculatePayments();
  });

  drawAmountInput.addEventListener(
    "input",
    debounce(() => {
      let value = drawAmountInput.value.replace(/[^0-9]/g, "");
      if (value === "") {
        drawAmountInput.value = "";
      } else {
        value = parseFloat(value);
        drawAmountInput.value = isNaN(value) ? "" : value.toLocaleString();
      }
    }, 1000)
  );

  interestRateInput.addEventListener("input", debounce(calculatePayments, 500));

  decreaseBtn.addEventListener("click", () => handleInterestRateChange(-0.1));
  increaseBtn.addEventListener("click", () => handleInterestRateChange(0.1));

  calcButton.addEventListener("click", (event) => {
    event.preventDefault();
    calculatePayments();
  });

  // Format draw amount input and set default value
  drawAmountInput.addEventListener("input", () => {
    let value = drawAmountInput.value.replace(/[^0-9]/g, "");
    drawAmountInput.value = value.toLocaleString();
  });

  // Set default draw amount
  drawAmountInput.value = (50000).toLocaleString();

  // Set default interest rate
  interestRateInput.value = formatPercentage(9.0);

  // Prevent non-numeric input for draw amount and interest rate
  document.querySelectorAll(".calc-input[type='text']").forEach((input) => {
    input.addEventListener("input", () => {
      // Remove any existing commas and non-numeric characters except for numbers and decimal points
      let numericValue = input.value.replace(/[^0-9.]/g, "");
      // Insert commas for thousands, millions, etc.
      let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // Update the input field with the formatted value
      input.value = formattedValue;
    });

    input.addEventListener("keypress", (event) => {
      if (!/[0-9.]/.test(event.key)) {
        event.preventDefault();
      }
    });
  });

  // Add event listener for Enter key to run calculation
  document.querySelectorAll(".calc-input").forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculatePayments();
      }
    });
  });

  // Add event listener for up and down arrow keys to increment/decrement interest rate
  interestRateInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleInterestRateChange(0.1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      handleInterestRateChange(-0.1);
    }
  });

  // Add event listener for up and down arrow keys to increment/decrement draw amount
  drawAmountInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleDrawAmountChange(1000);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      handleDrawAmountChange(-1000);
    }
  });

  // Run calculation for default values when the page loads
  calculatePayments();
});
