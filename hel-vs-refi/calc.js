// Constants
const MAX_LTV = 0.8;
const MIN_LTV = 0.05;
const MIN_LOAN_AMOUNT = 1;
const MAX_LOAN_AMOUNT = 500000;
const MIN_HOME_VALUE = 80000;
const MIN_MORTGAGE_BALANCE = 10000;

// Global variables
let isCreditScoreApproved = true;

// Element selectors
const homeValueInput = document.querySelector('[calc-input="home-value"]');
const currentMortgagePrincipalInput = document.querySelector('[calc-input="mortgage-principal"]');
const remainingMortgageTermInput = document.querySelector('[calc-input="mortgage-term"]');
const currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
const creditScoreInput = document.querySelector('[calc-input="credit-score"]');
const loanAmountInput = document.querySelector('[calc-input="loan-amount"]');
const termInputs = document.querySelectorAll('[name="term-length"]');
const calcButton = document.querySelector('[calc-input="calc_button"]');
const savingsAmountElement = document.querySelector('[calc-result="savings-amount"]');

// Helper functions
function formatCurrency(value) {
  if (isNaN(value) || value === undefined) return "0";
  return parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatCurrencyWithSymbol(value) {
  if (isNaN(value) || value === undefined) return "$0";
  return "$" + formatCurrency(value);
}

function formatPercentage(value) {
  if (isNaN(value) || value === undefined) return "0.00%";
  return parseFloat(value).toFixed(2) + "%";
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Event handlers
function handleNumericInput(event) {
  const input = event.target;
  let numericValue = input.value.replace(/[^0-9.]/g, "");
  if (input.getAttribute("input-format") === "dollar") {
    input.value = numericValue ? formatCurrency(parseFloat(numericValue)) : "";
  } else if (input.getAttribute("input-format") === "percent") {
    input.value = numericValue ? formatPercentage(parseFloat(numericValue)) : "";
  } else if (input.getAttribute("input-format") === "year") {
    input.value = numericValue ? parseFloat(numericValue) + " yrs" : "";
  }
  calculateSavings();
}

function preventNonNumericInput(event) {
  if (!/[0-9.]/.test(event.key)) {
    event.preventDefault();
  }
}

function handleDollarInput(event) {
  const input = event.target;
  let value = input.value.replace(/[^0-9.-]+/g, "");
  if (value !== "") {
    value = parseFloat(value);
    if (!isNaN(value)) {
      input.value = formatCurrency(value);
    }
  }
  calculateSavings();
}

function handleDollarInputBlur(event) {
  const input = event.target;
  let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
  if (isNaN(value) || value === 0) {
    if (input === homeValueInput) {
      value = MIN_HOME_VALUE;
    } else if (input === currentMortgagePrincipalInput) {
      value = MIN_MORTGAGE_BALANCE;
    } else {
      value = MIN_LOAN_AMOUNT;
    }
  }
  if (input === homeValueInput) {
    value = Math.max(value, MIN_HOME_VALUE);
  } else if (input === currentMortgagePrincipalInput) {
    value = Math.max(value, MIN_MORTGAGE_BALANCE);
  } else if (input === loanAmountInput) {
    value = Math.min(value, MAX_LOAN_AMOUNT);
  }
  input.value = formatCurrency(value);
  calculateSavings();
}

function handleMortgageTermInput() {
  let value = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
  value = Math.min(Math.max(value, 1), 30);
  remainingMortgageTermInput.value = isNaN(value) ? "" : value + " yrs";
  calculateSavings();
}

function handleMortgageRateInput(event) {
  let value = currentMortgageRateInput.value.replace(/[^0-9.]/g, "");
  let cursorPosition = event.target.selectionStart;
  let dotIndex = value.indexOf(".");

  if (dotIndex !== -1 && value.length - dotIndex > 3) {
    value = value.slice(0, dotIndex + 3);
  }

  let numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    numValue = Math.min(Math.max(numValue, 1.5), 15);
    value = numValue.toFixed(2);
  }

  currentMortgageRateInput.value = value ? value + "%" : "";

  if (value) {
    cursorPosition += currentMortgageRateInput.value.length - value.length;
  }
  currentMortgageRateInput.setSelectionRange(cursorPosition, cursorPosition);

  debounce(calculateSavings, 500)();
}

function handleMortgageRateInputBlur() {
  let value = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
  value = Math.min(Math.max(value, 1.5), 15);
  currentMortgageRateInput.value = isNaN(value) ? "" : formatPercentage(value);
  calculateSavings();
}

function updateHomeEquityLoanAPR() {
  const selectedOption = creditScoreInput.options[creditScoreInput.selectedIndex];
  const creditScoreText = selectedOption ? selectedOption.value : creditScoreInput.value;

  isCreditScoreApproved = ["excellent", "very good", "good"].includes(creditScoreText.toLowerCase());
  calculateSavings();
}

function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateSavings();
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const isShiftPressed = event.shiftKey;
    if (event.target === currentMortgageRateInput) {
      handleInterestRateChange(event.key === "ArrowUp" ? 0.1 : -0.1);
    } else if (event.target.getAttribute("input-format") === "dollar") {
      const increment = isShiftPressed ? 10000 : 1000;
      handleDollarAmountChange(event.target, event.key === "ArrowUp" ? increment : -increment);
    } else if (event.target === remainingMortgageTermInput) {
      let currentTerm = parseFloat(event.target.value);
      currentTerm = Math.min(Math.max(currentTerm + (event.key === "ArrowUp" ? 1 : -1), 1), 30);
      event.target.value = currentTerm + " yrs";
      debounce(calculateSavings, 500)();
    }
  }
}

function handleInterestRateChange(increment) {
  let currentRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
  currentRate = Math.min(Math.max(currentRate + increment, 1.5), 15);
  currentRate = Math.round(currentRate * 100) / 100;
  currentMortgageRateInput.value = formatPercentage(currentRate);
  debounce(calculateSavings, 500)();
}

function handleMortgageTermChange(increment) {
  let currentTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
  currentTerm = Math.min(Math.max(currentTerm + increment, 1), 30);
  remainingMortgageTermInput.value = currentTerm + " yrs";
  debounce(calculateSavings, 500)();
}

function handleDollarAmountChange(input, increment) {
  let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
  currentAmount = Math.max(currentAmount + increment, 0);
  if (input === loanAmountInput) {
    currentAmount = Math.min(currentAmount, MAX_LOAN_AMOUNT);
  }
  input.value = formatCurrency(currentAmount);
  debounce(calculateSavings, 500)();
}

// Calculation functions
function calculateLTV(loanAmount, homeValue) {
  return loanAmount / homeValue;
}

function calculateMonthlyPayment(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = termYears * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

function calculateHomeEquityLoanPayment(principal, annualRate, termYears) {
  return calculateMonthlyPayment(principal, annualRate, termYears);
}

function calculateRemainingBalance(principal, annualRate, totalTerm, elapsedTerm) {
  const monthlyRate = annualRate / 12;
  const totalPayments = totalTerm * 12;
  const elapsedPayments = elapsedTerm * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalTerm);
  return principal * Math.pow(1 + monthlyRate, elapsedPayments) - (monthlyPayment * (Math.pow(1 + monthlyRate, elapsedPayments) - 1)) / monthlyRate;
}

function calculateHomeEquityLoanAPR(creditScoreText) {
  const baseAPR = 0.0859;
  switch (creditScoreText.toLowerCase()) {
    case "excellent":
      return baseAPR - 0.0083;
    case "very good":
      return baseAPR - 0.0037;
    case "good":
      return baseAPR;
    case "average":
      return baseAPR + 0.0083;
    case "low":
      return baseAPR + 0.0164;
    default:
      return baseAPR + 0.0164;
  }
}

function calculateCashOutRefiRate(creditScoreText) {
  const helRate = calculateHomeEquityLoanAPR(creditScoreText);
  const cashOutRefiAdjustment = -0.005;
  return Math.max(helRate + cashOutRefiAdjustment, 0.03);
}

// Main calculation function
function calculateSavings() {
  let homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, "")) || 0;
  let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, "")) || 0;
  let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, "")) || 0;
  let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100 || 0;
  let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, "")) || 0;
  let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");

  if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount) || isNaN(selectedTerm)) {
    return;
  }

  // Update input values only if they're at the minimum value
  if (homeValue === MIN_HOME_VALUE) homeValueInput.value = formatCurrency(homeValue);
  if (currentMortgagePrincipal === MIN_MORTGAGE_BALANCE) currentMortgagePrincipalInput.value = formatCurrency(currentMortgagePrincipal);
  if (loanAmount === MIN_LOAN_AMOUNT) loanAmountInput.value = formatCurrency(loanAmount);

  let totalLoanAmount = currentMortgagePrincipal + loanAmount;
  let ltv = calculateLTV(totalLoanAmount, homeValue);
  let isLtvApproved = ltv >= MIN_LTV && ltv <= MAX_LTV;

  let isApproved = updateApprovalStatus(isLtvApproved);

  if (ltv > MAX_LTV) {
    loanAmount = Math.max(MIN_LOAN_AMOUNT, MAX_LTV * homeValue - currentMortgagePrincipal);
    loanAmountInput.value = formatCurrency(loanAmount);
  } else if (ltv < MIN_LTV) {
    loanAmount = Math.max(MIN_LOAN_AMOUNT, MIN_LTV * homeValue - currentMortgagePrincipal);
    loanAmountInput.value = formatCurrency(loanAmount);
  }

  // Cap the loan amount at MAX_LOAN_AMOUNT
  loanAmount = Math.min(loanAmount, MAX_LOAN_AMOUNT);
  loanAmountInput.value = formatCurrency(loanAmount);

  // Calculate the current mortgage payment
  const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);

  // Calculate the effective cash-out refinance rate
  const homeEquityLoanAPR = calculateHomeEquityLoanAPR(creditScoreInput.value);
  const cashOutRefiRate = calculateCashOutRefiRate(creditScoreInput.value);

  const homeEquityLoanPayment = calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

  const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
  const totalHomeEquityLoanPayments = homeEquityLoanPayment * selectedTerm * 12;

  const homeEquityLoanOptionCost = totalCurrentMortgagePayments + totalHomeEquityLoanPayments;
  const totalInterestCostHEL = homeEquityLoanOptionCost - (currentMortgagePrincipal + loanAmount);

  const cashRefiPayment = calculateMonthlyPayment(totalLoanAmount, cashOutRefiRate, selectedTerm);
  const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
  const cashRefiOptionCost = totalCashRefiPayments;

  // Calculate HEI option cost
  const calculateHEIValues = (years) => {
    const appreciation = 0.035;
    const appreciationStartingAmount = Math.round((homeValue * 0.73) / 1000) * 1000;
    const homeValueForYear = homeValue * Math.pow(1 + appreciation, years);

    // Determine the simple appreciation multiple based on credit score
    const creditScoreText = creditScoreInput.value.toLowerCase();
    let simpleAppreciationMultiple;
    switch (creditScoreText) {
      case "very low":
        simpleAppreciationMultiple = 3.04;
        break;
      case "low":
        simpleAppreciationMultiple = 2.56;
        break;
      case "average":
        simpleAppreciationMultiple = 2.48;
        break;
      case "good":
        simpleAppreciationMultiple = 2.32;
        break;
      case "very good":
        simpleAppreciationMultiple = 2.2;
        break;
      case "excellent":
        simpleAppreciationMultiple = 2.2;
        break;
      default:
        simpleAppreciationMultiple = 2.2; // Default value if no match
    }

    const pointPercentage = simpleAppreciationMultiple * (loanAmount / homeValue);
    const shareOfAppreciation = (homeValueForYear - appreciationStartingAmount) * pointPercentage;
    const shareBasedRepayment = shareOfAppreciation + loanAmount;
    const capBasedRepayment = loanAmount * Math.pow(1 + 0.175 / 12, years * 12);
    return Math.min(capBasedRepayment, shareBasedRepayment);
  };

  const heiRepayment = calculateHEIValues(selectedTerm);
  const heiOptionCost = heiRepayment;
  const heiFinanceCost = heiOptionCost - loanAmount;

  // Always update HEI table values
  document.querySelector('[calc-result="hei-total-principal"]').innerText = formatCurrencyWithSymbol(loanAmount);
  document.querySelector('[calc-result="hei-total-interest-cost"]').innerText = formatCurrencyWithSymbol(heiFinanceCost);
  document.querySelector('[calc-result="hei-total-cost"]').innerText = formatCurrencyWithSymbol(heiOptionCost);

  if (isApproved) {
    // Perform calculations and update table values for all options
    calculateTableValues(cashOutRefiRate, homeEquityLoanAPR);

    // Find the lowest cost option
    const lowestCost = Math.min(homeEquityLoanOptionCost, cashRefiOptionCost, heiOptionCost);

    // Update table styling
    updateTableStyling(lowestCost, homeEquityLoanOptionCost, cashRefiOptionCost, heiOptionCost);
  } else {
    // Set only HEL and Cash Out Refi column values to zero
    document.querySelectorAll('[calc-result^="hel-"], [calc-result^="cash-out-refi-"]').forEach((el) => {
      el.innerText = el.getAttribute("calc-result").includes("rate") ? "0%" : "$0";
    });

    // Remove highlighting from HEL and Cash Out Refi columns
    removeHighlighting("#cashout-table");
    removeHighlighting("#hel-table");

    // Only consider HEI for highlighting when not approved
    updateTableStyling(heiOptionCost, Infinity, Infinity, heiOptionCost);
  }

  // Find the lowest cost option
  const lowestCost = Math.min(homeEquityLoanOptionCost, cashRefiOptionCost, heiOptionCost);
  let savings, betterOptionText;

  // Compare only HELoan and Cash-out refi for the better option text
  if (homeEquityLoanOptionCost <= cashRefiOptionCost) {
    savings = cashRefiOptionCost - homeEquityLoanOptionCost;
    betterOptionText = "With a home equity loan you would save:";
  } else {
    savings = homeEquityLoanOptionCost - cashRefiOptionCost;
    betterOptionText = "With a cash-out refi you would save:";
  }

  savingsAmountElement.innerText = formatCurrencyWithSymbol(Math.abs(savings));

  // Update the better option text
  const betterOptionTextElement = document.querySelector('[calc-result="better-option"]');
  if (betterOptionTextElement) betterOptionTextElement.textContent = betterOptionText;
}

function calculateTableValues(cashOutRefiRate, homeEquityLoanAPR) {
  let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, ""));
  let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
  let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100;
  let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
  let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");
  let homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, ""));

  const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
  const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, cashOutRefiRate, selectedTerm);
  const homeEquityLoanPayment = calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

  const totalCashRefiPrincipal = currentMortgagePrincipal + loanAmount;
  const totalHELPrincipal = loanAmount;

  const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
  const totalExistingMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
  const totalHELPayments = homeEquityLoanPayment * selectedTerm * 12;
  const totalHomeEquityLoanPayments = totalHELPayments;

  const totalInterestCostCashOutRefi = totalCashRefiPayments - totalCashRefiPrincipal;
  const helInterest = totalHELPayments - loanAmount;
  const totalInterestCostHEL = helInterest;

  if (isNaN(cashRefiPayment) || isNaN(homeEquityLoanPayment) || isNaN(totalCashRefiPrincipal) || isNaN(totalInterestCostCashOutRefi) || isNaN(totalInterestCostHEL) || isNaN(totalCashRefiPayments) || isNaN(totalHomeEquityLoanPayments)) {
    return;
  }

  // Update the table
  document.querySelector('[calc-result="hel-effective-rate"]').innerText = formatPercentage(homeEquityLoanAPR * 100);
  document.querySelector('[calc-result="cash-out-refi-effective-rate"]').innerText = formatPercentage(cashOutRefiRate * 100);

  document.querySelector('[calc-result="cash-out-refi-monthly-payment"]').innerText = formatCurrencyWithSymbol(cashRefiPayment);
  document.querySelector('[calc-result="hel-monthly-payment"]').innerText = formatCurrencyWithSymbol(homeEquityLoanPayment);

  document.querySelector('[calc-result="cash-out-refi-total-principal"]').innerText = formatCurrencyWithSymbol(totalCashRefiPrincipal);
  document.querySelector('[calc-result="hel-total-principal"]').innerText = formatCurrencyWithSymbol(totalHELPrincipal);

  document.querySelector('[calc-result="cash-out-refi-total-interest-cost"]').innerText = formatCurrencyWithSymbol(totalInterestCostCashOutRefi);
  document.querySelector('[calc-result="hel-total-interest-cost"]').innerText = formatCurrencyWithSymbol(totalInterestCostHEL);

  document.querySelector('[calc-result="cash-out-refi-total-cost"]').innerText = formatCurrencyWithSymbol(totalCashRefiPayments);
  document.querySelector('[calc-result="hel-total-cost"]').innerText = formatCurrencyWithSymbol(totalHomeEquityLoanPayments);

  // Calculate HEI values
  const heiValues = calculateHEIValues(selectedTerm);
  const heiOptionCost = heiValues.repayment;
  const heiFinanceCost = heiOptionCost - loanAmount;

  // Update HEI values in the table
  document.querySelector('[calc-result="hei-total-principal"]').innerText = formatCurrencyWithSymbol(loanAmount);
  document.querySelector('[calc-result="hei-total-interest-cost"]').innerText = formatCurrencyWithSymbol(heiFinanceCost);
  document.querySelector('[calc-result="hei-total-cost"]').innerText = formatCurrencyWithSymbol(heiOptionCost);

  // Calculate total costs for each option
  const totalCashRefiCost = totalCashRefiPayments;
  const totalHELCost = totalHomeEquityLoanPayments;
  const totalHEICost = heiOptionCost;

  // Find the lowest cost option and update table styling
  const lowestCost = Math.min(totalCashRefiCost, totalHELCost, totalHEICost);

  const cashoutElements = document.querySelectorAll('[calc-result^="cash-out-refi-"]');
  const helElements = document.querySelectorAll('[calc-result^="hel-"]');
  const heiElements = document.querySelectorAll('[calc-result^="hei-"]');

  [
    { elements: cashoutElements, cost: totalCashRefiCost },
    { elements: helElements, cost: totalHELCost },
    { elements: heiElements, cost: totalHEICost },
  ].forEach(({ elements, cost }) => {
    const isWinner = cost === lowestCost;
    elements.forEach((el) => {
      if (isWinner) {
        el.classList.add("text-color-black", "text-weight-semibold");
        el.classList.remove("text-weight-normal");
      } else {
        el.classList.remove("text-color-black", "text-weight-semibold");
        el.classList.add("text-weight-normal");
      }
    });
  });

  document.querySelector("#cashout-table").classList.toggle("text-color-black", totalCashRefiCost === lowestCost);
  document.querySelector("#hel-table").classList.toggle("text-color-black", totalHELCost === lowestCost);
  document.querySelector("#hei-table").classList.toggle("text-color-black", totalHEICost === lowestCost);
}

function updateApprovalStatus(isLtvApproved) {
  const isApproved = isLtvApproved && isCreditScoreApproved;
  const approvalTrueCard = document.querySelector('[approval="true"]');
  const approvalFalseCard = document.querySelector('[approval="false"]');
  const calcAccordion = document.querySelector(".calc-accordion");

  if (approvalTrueCard && approvalFalseCard && calcAccordion) {
    if (isApproved) {
      approvalTrueCard.classList.remove("hide");
      approvalFalseCard.classList.add("hide");
    } else {
      approvalTrueCard.classList.add("hide");
      approvalFalseCard.classList.remove("hide");
    }
  }

  return isApproved;
}

function calculateHEIValues(years) {
  const homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, ""));
  const loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
  const appreciation = 0.035;
  const appreciationStartingAmount = Math.round((homeValue * 0.73) / 1000) * 1000;
  const homeValueForYear = homeValue * Math.pow(1 + appreciation, years);

  // Determine the simple appreciation multiple based on credit score
  const creditScoreText = creditScoreInput.value.toLowerCase();
  let simpleAppreciationMultiple;
  switch (creditScoreText) {
    case "very low":
      simpleAppreciationMultiple = 3.04;
      break;
    case "low":
      simpleAppreciationMultiple = 2.56;
      break;
    case "average":
      simpleAppreciationMultiple = 2.48;
      break;
    case "good":
      simpleAppreciationMultiple = 2.32;
      break;
    case "very good":
      simpleAppreciationMultiple = 2.2;
      break;
    case "excellent":
      simpleAppreciationMultiple = 2.2;
      break;
    default:
      simpleAppreciationMultiple = 2.2; // Default value if no match
  }

  const pointPercentage = simpleAppreciationMultiple * (loanAmount / homeValue);
  const shareOfAppreciation = (homeValueForYear - appreciationStartingAmount) * pointPercentage;
  const shareBasedRepayment = shareOfAppreciation + loanAmount;
  const capBasedRepayment = loanAmount * Math.pow(1 + 0.175 / 12, years * 12);
  const repayment = Math.min(capBasedRepayment, shareBasedRepayment);

  return { repayment };
}

function updateTableStyling(lowestCost, helCost, cashRefiCost, heiCost) {
  const tables = [
    { id: "#hel-table", cost: helCost, prefix: "hel-" },
    { id: "#cashout-table", cost: cashRefiCost, prefix: "cash-out-refi-" },
    { id: "#hei-table", cost: heiCost, prefix: "hei-" },
  ];

  tables.forEach(({ id, cost, prefix }) => {
    const table = document.querySelector(id);
    const elements = document.querySelectorAll(`[calc-result^="${prefix}"]`);
    const isWinner = cost === lowestCost;

    if (table) table.classList.toggle("text-color-black", isWinner);
    elements.forEach((el) => {
      if (isWinner) {
        el.classList.add("text-color-black", "text-weight-semibold");
        el.classList.remove("text-weight-normal");
      } else {
        el.classList.remove("text-color-black", "text-weight-semibold");
        el.classList.add("text-weight-normal");
      }
    });
  });
}

function removeHighlighting(tableId) {
  const table = document.querySelector(tableId);
  if (table) {
    table.classList.remove("text-color-black");
    table.querySelectorAll("[calc-result]").forEach((el) => {
      el.classList.remove("text-color-black", "text-weight-semibold");
      el.classList.add("text-weight-normal");
    });
  }
}

// Initialization
function initializeElements() {
  addNumericInputListeners();
  addSpecificInputListeners();
  addButtonListeners();
  addTermInputListeners();
  addEnterKeyListener();
  setDefaultValues();
}

function addNumericInputListeners() {
  document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"], input[input-format="year"]').forEach((input) => {
    input.addEventListener("input", handleNumericInput);
    input.addEventListener("keypress", preventNonNumericInput);
  });
}

function addSpecificInputListeners() {
  [homeValueInput, currentMortgagePrincipalInput, loanAmountInput].forEach((input) => {
    input.addEventListener("input", handleDollarInput);
    input.addEventListener("blur", handleDollarInputBlur);
  });

  remainingMortgageTermInput.addEventListener("input", handleMortgageTermInput);
  currentMortgageRateInput.addEventListener("input", handleMortgageRateInput);
  currentMortgageRateInput.addEventListener("blur", handleMortgageRateInputBlur);
  creditScoreInput.addEventListener("change", updateHomeEquityLoanAPR);
}

function addButtonListeners() {
  calcButton.addEventListener("click", () => {
    calculateSavings();
    calculateTableValues();
  });

  document.querySelector('[btn-inc="increase-mortgage-rate"]').addEventListener("click", () => handleInterestRateChange(0.1));
  document.querySelector('[btn-inc="decrease-mortgage-rate"]').addEventListener("click", () => handleInterestRateChange(-0.1));
  document.querySelector('[btn-inc="increase-mortgage-term"]').addEventListener("click", () => handleMortgageTermChange(1));
  document.querySelector('[btn-inc="decrease-mortgage-term"]').addEventListener("click", () => handleMortgageTermChange(-1));
}

function addTermInputListeners() {
  termInputs.forEach((input) => {
    input.addEventListener("change", () => {
      calculateSavings();
      calculateTableValues();
    });
  });
}

function addEnterKeyListener() {
  document.querySelectorAll(".calc-input").forEach((input) => {
    input.addEventListener("keydown", handleEnterKey);
  });
}

function setDefaultValues() {
  homeValueInput.value = formatCurrency(Math.max(500000, MIN_HOME_VALUE));
  currentMortgagePrincipalInput.value = formatCurrency(Math.max(275000, MIN_MORTGAGE_BALANCE));
  remainingMortgageTermInput.value = "20 yrs";
  currentMortgageRateInput.value = formatPercentage(7.75);
  loanAmountInput.value = formatCurrency(50000);
  creditScoreInput.value = "good";
  creditScoreInput.dispatchEvent(new Event("change"));

  // Trigger calculation after setting default values
  calculateSavings();
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", initializeElements);
