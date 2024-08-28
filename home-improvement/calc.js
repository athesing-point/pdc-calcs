// Constants
const PERSONAL_LOAN_ORIGINATION_FEE = 0.05; // 5% origination fee for personal loans
const DEFAULT_INTEREST_RATE = 9.75; // 9.75% starting interest rate
const DEFAULT_LOAN_AMOUNT = 50000; // $50,000 default loan amount
const DEFAULT_LOAN_TERM = 60; // 60 months (5 years) default loan term
const DEFAULT_HELOC_TERM = 240; // 240 months (20 years) default HELOC repayment term

// DOM Elements
const loanTypeSelect = document.getElementById("loan-type");
const drawAmountInput = document.getElementById("draw-amount");
const interestRateInput = document.getElementById("interest-rate");
const loanTermPersonalSelect = document.getElementById("loan-term-personal");
const loanTermHelocSelect = document.getElementById("loan-term-heloc");
const calculateButton = document.querySelector('[calc-input="calc_button"]');
const resultMonthly = document.getElementById("result-monthly");
const resultInterest = document.getElementById("result-interest");
const resultTotal = document.getElementById("result-total");
const originFeeInput = document.getElementById("origin-fee");
const helocTooltip = document.getElementById("heloc-tooltip");

// Initialize inputs
drawAmountInput.value = DEFAULT_LOAN_AMOUNT;
interestRateInput.value = DEFAULT_INTEREST_RATE;
loanTypeSelect.value = "1"; // Default to personal loan
loanTermPersonalSelect.value = DEFAULT_LOAN_TERM.toString();

// Helper function to format currency without cents
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to parse formatted number strings
function parseFormattedNumber(value) {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}

// Calculate loan details
function calculateLoan() {
  const loanType = loanTypeSelect.value;
  const drawAmount = parseFormattedNumber(drawAmountInput.value);
  // const interestRate = parseFloat(interestRateInput.value) / 100;
  const interestRate = parseFormattedNumber(interestRateInput.value.replace("%", "")) / 100;
  let loanTermMonths;
  let originationFee = 0;

  if (loanType === "1") {
    // Personal loan
    loanTermMonths = parseInt(loanTermPersonalSelect.value);
    originationFee = PERSONAL_LOAN_ORIGINATION_FEE;
  } else if (loanType === "2") {
    // HELOC
    loanTermMonths = parseInt(loanTermHelocSelect.value);
  }

  // Update origination fee input
  originFeeInput.value = (originationFee * 100).toFixed(0) + "%";

  const monthlyInterestRate = interestRate / 12;
  const totalPayments = loanTermMonths;

  // Calculate monthly payment
  const loanAmountWithFee = drawAmount * (1 + originationFee);
  const monthlyPayment = (loanAmountWithFee * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  // Calculate total interest
  const totalInterest = monthlyPayment * totalPayments - loanAmountWithFee;

  // Calculate total cost
  const totalCost = loanAmountWithFee + totalInterest;

  // Update results with rounding to whole dollars
  resultMonthly.textContent = formatCurrency(Math.round(monthlyPayment));
  resultInterest.textContent = formatCurrency(Math.round(totalInterest));
  resultTotal.textContent = formatCurrency(Math.round(totalCost));
}

// Function to toggle loan term selects based on loan type
function toggleLoanTermSelects() {
  const loanType = loanTypeSelect.value;
  if (loanType === "1") {
    // Personal loan
    loanTermPersonalSelect.classList.remove("hide");
    loanTermHelocSelect.classList.add("hide");
    loanTermPersonalSelect.value = DEFAULT_LOAN_TERM.toString();
    helocTooltip.classList.add("hide"); // Hide HELOC tooltip
  } else if (loanType === "2") {
    // HELOC
    loanTermPersonalSelect.classList.add("hide");
    loanTermHelocSelect.classList.remove("hide");
    loanTermHelocSelect.value = DEFAULT_HELOC_TERM.toString();
    helocTooltip.classList.remove("hide"); // Show HELOC tooltip
  }
  calculateLoan(); // Recalculate when switching loan types
}

// Add a specific event listener for the HELOC loan term select
loanTermHelocSelect.addEventListener("change", function () {
  calculateLoan();
});

// Event listeners
loanTypeSelect.addEventListener("change", toggleLoanTermSelects);
loanTermPersonalSelect.addEventListener("change", calculateLoan);
loanTermHelocSelect.addEventListener("change", calculateLoan);

calculateButton.addEventListener("click", function (e) {
  e.preventDefault();
  calculateLoan();
});

// Initialize calculation on page load
toggleLoanTermSelects();

//Formatting/Helper functions

// Add event listeners for real-time updates
document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"], input[input-format="year"]').forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      formatInputField(input);
      calculateLoan();
    });

    input.addEventListener("keypress", (event) => {
      if (!/[0-9.]/.test(event.key)) {
        event.preventDefault();
      }
    });
  }
});

// Function to format input fields
function formatInputField(input) {
  if (input) {
    let value = parseFormattedNumber(input.value);
    if (input.getAttribute("input-format") === "dollar") {
      input.value = isNaN(value) ? "" : value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else if (input.getAttribute("input-format") === "percent") {
      input.value = isNaN(value) ? "" : `${value.toFixed(2)}%`;
    } else if (input.getAttribute("input-format") === "year") {
      input.value = isNaN(value) ? "" : `${value} yrs`;
    }
  }
}

// Format inputs on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input[input-format]").forEach(formatInputField);
  calculateLoan();
});

// Update the existing event listener for the interest rate input
interestRateInput.addEventListener("input", () => {
  let numericValue = interestRateInput.value.replace(/[^0-9.]/g, "");

  // Enforce maximum 2 decimal places
  let parts = numericValue.split(".");
  if (parts.length > 1) {
    parts[1] = parts[1].slice(0, 2);
    numericValue = parts.join(".");
  }

  // Ensure minimum of 1.00%
  let rate = Math.max(1, parseFloat(numericValue) || 1);

  // Format the value with percentage
  interestRateInput.value = `${rate.toFixed(2)}%`;

  calculateLoan();
});

// Update the function to handle arrow key presses for the interest rate
function handleInterestRateKeydown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    let currentRate = parseFloat(interestRateInput.value.replace("%", ""));
    let step = event.shiftKey ? 1 : 0.25;

    if (event.key === "ArrowUp") {
      currentRate += step;
    } else {
      currentRate = Math.max(1, currentRate - step); // Ensure minimum of 1.00%
    }

    currentRate = Math.min(100, currentRate); // Ensure maximum of 100%
    interestRateInput.value = `${currentRate.toFixed(2)}%`;
    calculateLoan();
  }
}

// The event listener remains the same
interestRateInput.addEventListener("keydown", handleInterestRateKeydown);

// Add these lines after the handleInterestRateKeydown function
function adjustInterestRate(increment) {
  let currentRate = parseFloat(interestRateInput.value.replace("%", ""));
  let step = 0.25;

  if (increment) {
    currentRate += step;
  } else {
    currentRate = Math.max(1, currentRate - step);
  }

  currentRate = Math.min(100, currentRate);

  // Update the input value
  interestRateInput.value = `${currentRate.toFixed(2)}%`;

  // Trigger the input event to ensure all related functions are called
  interestRateInput.dispatchEvent(new Event("input"));
}

// Update the button click event listeners
document.querySelector('[data-input="decrease"]').addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button behavior
  adjustInterestRate(false);
});

document.querySelector('[data-input="increase"]').addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button behavior
  adjustInterestRate(true);
});

// Update the existing event listener for the draw amount input
drawAmountInput.addEventListener("input", () => {
  let numericValue = drawAmountInput.value.replace(/[^0-9]/g, "");

  // Enforce minimum 4 digits and maximum 6 digits
  if (numericValue.length < 4) {
    numericValue = numericValue.padStart(4, "0");
  } else if (numericValue.length > 6) {
    numericValue = numericValue.slice(0, 6);
  }

  // Format the value with commas
  drawAmountInput.value = parseInt(numericValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  calculateLoan();
});

// Update the handleDrawAmountKeydown function
function handleDrawAmountKeydown(event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    let currentAmount = parseFormattedNumber(drawAmountInput.value);
    let step = event.shiftKey ? 1000 : 100;

    if (event.key === "ArrowUp") {
      currentAmount += step;
    } else {
      currentAmount = Math.max(1000, currentAmount - step); // Ensure minimum of 1000
    }

    currentAmount = Math.min(999999, currentAmount); // Ensure maximum of 999999
    drawAmountInput.value = currentAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    calculateLoan();
  }
}

// Add this event listener after the existing event listeners
drawAmountInput.addEventListener("keydown", handleDrawAmountKeydown);
