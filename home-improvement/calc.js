// Constants
const PERSONAL_LOAN_ORIGINATION_FEE = 0.04; // 4% origination fee for personal loans
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

// Calculate loan details
function calculateLoan() {
  const loanType = loanTypeSelect.value;
  const drawAmount = parseFloat(drawAmountInput.value);
  const interestRate = parseFloat(interestRateInput.value) / 100;
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
    loanTermPersonalSelect.classList.remove("hide");
    loanTermHelocSelect.classList.add("hide");
    loanTermPersonalSelect.value = DEFAULT_LOAN_TERM.toString();
  } else if (loanType === "2") {
    loanTermPersonalSelect.classList.add("hide");
    loanTermHelocSelect.classList.remove("hide");
    loanTermHelocSelect.value = DEFAULT_HELOC_TERM.toString();
  }
}

// Event listeners
loanTypeSelect.addEventListener("change", function () {
  toggleLoanTermSelects();
  calculateLoan();
});

calculateButton.addEventListener("click", function (e) {
  e.preventDefault();
  calculateLoan();
});

// Initialize calculation on page load
toggleLoanTermSelects();
calculateLoan();

// Add event listeners for real-time updates
[drawAmountInput, interestRateInput, loanTermPersonalSelect, loanTermHelocSelect].forEach((element) => {
  element.addEventListener("input", calculateLoan);
});

// Implement increment/decrement functionality for interest rate
const btnDecrease = document.getElementById("btn-decrease");
const btnIncrease = document.getElementById("btn-increase");

btnDecrease.addEventListener("click", () => {
  let currentRate = parseFloat(interestRateInput.value);
  interestRateInput.value = Math.max(0, currentRate - 0.25).toFixed(2);
  calculateLoan();
});

btnIncrease.addEventListener("click", () => {
  let currentRate = parseFloat(interestRateInput.value);
  interestRateInput.value = (currentRate + 0.25).toFixed(2);
  calculateLoan();
});
