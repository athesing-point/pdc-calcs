// Constants
const ORIGINATION_FEE = 0.04; // 4% origination fee
const DEFAULT_INTEREST_RATE = 9.75; // 9.75% starting interest rate
const DEFAULT_LOAN_AMOUNT = 50000; // $50,000 default loan amount

// DOM Elements
const drawAmountInput = document.getElementById("draw-amount");
const interestRateInput = document.getElementById("interest-rate");
const loanTermSelect = document.getElementById("loan-term");
const calculateButton = document.querySelector('[calc-input="calc_button"]');
const resultMonthly = document.getElementById("result-monthly");
const resultInterest = document.getElementById("result-interest");
const resultTotal = document.getElementById("result-total");

// Initialize inputs
drawAmountInput.value = DEFAULT_LOAN_AMOUNT;
interestRateInput.value = DEFAULT_INTEREST_RATE;

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

// Calculate loan details
function calculateLoan() {
  const drawAmount = parseFloat(drawAmountInput.value);
  const interestRate = parseFloat(interestRateInput.value) / 100;
  const loanTermMonths = parseInt(loanTermSelect.value);

  const monthlyInterestRate = interestRate / 12;
  const totalPayments = loanTermMonths;

  // Calculate monthly payment
  const monthlyPayment = (drawAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  // Calculate total interest
  const totalInterest = monthlyPayment * totalPayments - drawAmount;

  // Calculate total cost
  const totalCost = drawAmount + totalInterest;

  // Update results
  resultMonthly.textContent = formatCurrency(monthlyPayment);
  resultInterest.textContent = formatCurrency(totalInterest);
  resultTotal.textContent = formatCurrency(totalCost);
}

// Event listeners
calculateButton.addEventListener("click", function (e) {
  e.preventDefault();
  calculateLoan();
});

// Initialize calculation on page load
calculateLoan();

// Add event listeners for real-time updates (optional)
[drawAmountInput, interestRateInput, loanTermSelect].forEach((element) => {
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
