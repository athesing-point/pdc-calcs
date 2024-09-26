// Constants
const PERSONAL_LOAN_ORIGINATION_FEE = 0.05; // 5% origination fee for personal loans
const DEFAULT_INTEREST_RATE = 12.4; // 12.42% National average interest rate for personal loans (Source: Bankrate.com)
const DEFAULT_LOAN_AMOUNT = 100000; // $50,000 default loan amount
const DEFAULT_LOAN_TERM = 60; // 60 months (5 years) default loan term

// DOM Elements
const drawAmountInput = document.getElementById("draw-amount");
const interestRateInput = document.getElementById("interest-rate");
const loanTermSelect = document.getElementById("loan-term");
const calculateButton = document.querySelector('[calc-input="calc_button"]');
const resultMonthly = document.getElementById("result-monthly");
const resultInterest = document.getElementById("result-interest");
const resultTotal = document.getElementById("result-total");
const originFeeInput = document.getElementById("origin-fee");

// Initialize inputs
drawAmountInput.value = DEFAULT_LOAN_AMOUNT;
interestRateInput.value = DEFAULT_INTEREST_RATE;
loanTermSelect.value = DEFAULT_LOAN_TERM.toString();

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
  const drawAmount = parseFormattedNumber(drawAmountInput.value);
  const interestRate = parseFormattedNumber(interestRateInput.value.replace("%", "")) / 100;
  const loanTermMonths = parseInt(loanTermSelect.value);
  const originationFee = PERSONAL_LOAN_ORIGINATION_FEE;

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

  // Generate amortization table
  generateAmortizationTable(loanAmountWithFee, interestRate, loanTermMonths, monthlyPayment);
}

function generateAmortizationTable(loanAmount, annualInterestRate, termMonths, monthlyPayment) {
  const tableBody = document.querySelector(".calc_table_body");
  tableBody.innerHTML = ""; // Clear existing rows

  let balance = loanAmount;
  const monthlyInterestRate = annualInterestRate / 12;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    totalInterest += interestPayment;
    totalPrincipal += principalPayment;

    if (month % 12 === 0 || month === termMonths) {
      const year = Math.ceil(month / 12);
      const row = document.createElement("tr");
      row.className = "calc_table_row";

      const yearCell = createCell("year", year);
      const interestCell = createCell("interest", Math.round(totalInterest));
      const principalCell = createCell("principle", Math.round(totalPrincipal));
      const balanceCell = createCell("balance", Math.round(balance));

      row.appendChild(yearCell);
      row.appendChild(interestCell);
      row.appendChild(principalCell);
      row.appendChild(balanceCell);

      tableBody.appendChild(row);

      // Reset totals for the next year
      totalInterest = 0;
      totalPrincipal = 0;
    }
  }
}

function createCell(type, value) {
  const cell = document.createElement("td");
  cell.className = "calc_table_cell";
  if (type === "year") {
    cell.classList.add("year-cell");
  }
  cell.setAttribute("data-cell", type);
  cell.textContent = type === "year" ? value : formatCurrency(value);
  return cell;
}

// Event listeners
loanTermSelect.addEventListener("change", calculateLoan);

calculateButton.addEventListener("click", function (e) {
  e.preventDefault();
  calculateLoan();
});

// Add a specific event listener for the HELOC loan term select
// Removed as per the changes

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

// Wrap the button event listeners in a function
function setupButtonListeners() {
  const decreaseButton = document.querySelector('[data-input="decrease"]');
  const increaseButton = document.querySelector('[data-input="increase"]');

  if (decreaseButton) {
    decreaseButton.addEventListener("click", (e) => {
      e.preventDefault();
      adjustInterestRate(false);
    });
  }

  if (increaseButton) {
    increaseButton.addEventListener("click", (e) => {
      e.preventDefault();
      adjustInterestRate(true);
    });
  }
}

// Call this function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", setupButtonListeners);

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
