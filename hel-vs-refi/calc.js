class LoanCalculator {
  constructor() {
    this.MAX_LTV = 0.85;
    this.MIN_LTV = 0.05;
    this.MIN_LOAN_AMOUNT = 1;
    this.isCreditScoreApproved = true;

    this.initializeElements();
    this.addEventListeners();
    this.setDefaultValues();
  }

  initializeElements() {
    this.homeValueInput = document.querySelector('[calc-input="home-value"]');
    this.currentMortgagePrincipalInput = document.querySelector('[calc-input="mortgage-principal"]');
    this.remainingMortgageTermInput = document.querySelector('[calc-input="mortgage-term"]');
    this.currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
    this.creditScoreInput = document.querySelector('[calc-input="credit-score"]');
    this.loanAmountInput = document.querySelector('[calc-input="loan-amount"]');
    this.termInputs = document.querySelectorAll('[name="term-length"]');
    this.calcButton = document.querySelector('[calc-input="calc_button"]');
    this.savingsAmountElement = document.querySelector('[calc-result="savings-amount"]');
  }

  addEventListeners() {
    this.addNumericInputListeners();
    this.addSpecificInputListeners();
    this.addButtonListeners();
    this.addTermInputListeners();
    this.addEnterKeyListener();
  }

  addNumericInputListeners() {
    document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"], input[input-format="year"]').forEach((input) => {
      input.addEventListener("input", this.handleNumericInput.bind(this));
      input.addEventListener("keypress", this.preventNonNumericInput);
    });
  }

  addSpecificInputListeners() {
    [this.homeValueInput, this.currentMortgagePrincipalInput, this.loanAmountInput].forEach((input) => {
      input.addEventListener("input", this.handleDollarInput.bind(this));
      input.addEventListener("blur", this.handleDollarInputBlur.bind(this));
    });

    this.remainingMortgageTermInput.addEventListener("input", this.handleMortgageTermInput.bind(this));
    this.currentMortgageRateInput.addEventListener("input", this.handleMortgageRateInput.bind(this));
    this.currentMortgageRateInput.addEventListener("blur", this.handleMortgageRateInputBlur.bind(this));
    this.creditScoreInput.addEventListener("change", this.updateHomeEquityLoanAPR.bind(this));
  }

  addButtonListeners() {
    this.calcButton.addEventListener("click", () => {
      this.calculateSavings();
      this.calculateTableValues();
    });

    document.querySelector('[btn-inc="increase-mortgage-rate"]').addEventListener("click", () => this.handleInterestRateChange(0.1));
    document.querySelector('[btn-inc="decrease-mortgage-rate"]').addEventListener("click", () => this.handleInterestRateChange(-0.1));
    document.querySelector('[btn-inc="increase-mortgage-term"]').addEventListener("click", () => this.handleMortgageTermChange(1));
    document.querySelector('[btn-inc="decrease-mortgage-term"]').addEventListener("click", () => this.handleMortgageTermChange(-1));
  }

  addTermInputListeners() {
    this.termInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.calculateSavings();
        this.calculateTableValues();
      });
    });
  }

  addEnterKeyListener() {
    document.querySelectorAll(".calc-input").forEach((input) => {
      input.addEventListener("keydown", this.handleEnterKey.bind(this));
    });
  }

  setDefaultValues() {
    this.homeValueInput.value = this.formatCurrency(500000);
    this.currentMortgagePrincipalInput.value = this.formatCurrency(275000);
    this.remainingMortgageTermInput.value = "20 yrs";
    this.currentMortgageRateInput.value = this.formatPercentage(7.75);
    this.loanAmountInput.value = this.formatCurrency(50000);
    this.creditScoreInput.value = "good";
    this.creditScoreInput.dispatchEvent(new Event("change"));
  }

  handleNumericInput(event) {
    const input = event.target;
    let numericValue = input.value.replace(/[^0-9.]/g, "");
    if (input.getAttribute("input-format") === "dollar") {
      input.value = numericValue ? `${parseFloat(numericValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "";
    } else if (input.getAttribute("input-format") === "percent") {
      input.value = numericValue ? `${parseFloat(numericValue).toFixed(2)}%` : "";
    } else if (input.getAttribute("input-format") === "year") {
      input.value = numericValue ? `${parseFloat(numericValue)} yrs` : "";
    }
    this.calculateSavings();
  }

  preventNonNumericInput(event) {
    if (!/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  }

  handleDollarInput(event) {
    const input = event.target;
    let value = input.value.replace(/[^0-9.-]+/g, "");
    if (value !== "") {
      value = parseFloat(value);
      if (!isNaN(value)) {
        input.value = this.formatCurrency(value);
      }
    }
    this.calculateSavings();
  }

  handleDollarInputBlur(event) {
    const input = event.target;
    let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
    if (isNaN(value) || value === 0) {
      value = input === this.homeValueInput ? 1 : this.MIN_LOAN_AMOUNT;
    }
    input.value = this.formatCurrency(value);
    this.calculateSavings();
  }

  handleMortgageTermInput() {
    let value = parseFloat(this.remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    value = Math.min(Math.max(value, 1), 30);
    this.remainingMortgageTermInput.value = isNaN(value) ? "" : `${value} yrs`;
    this.calculateSavings();
  }

  handleMortgageRateInput(event) {
    let value = this.currentMortgageRateInput.value.replace(/[^0-9.]/g, "");
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

    this.currentMortgageRateInput.value = value ? `${value}%` : "";

    if (value) {
      cursorPosition += this.currentMortgageRateInput.value.length - value.length;
    }
    this.currentMortgageRateInput.setSelectionRange(cursorPosition, cursorPosition);

    this.debounce(this.calculateSavings.bind(this), 500)();
  }

  handleMortgageRateInputBlur() {
    let value = parseFloat(this.currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    value = Math.min(Math.max(value, 1.5), 15);
    this.currentMortgageRateInput.value = isNaN(value) ? "" : this.formatPercentage(value);
    this.calculateSavings();
  }

  updateHomeEquityLoanAPR() {
    const selectedOption = this.creditScoreInput.options[this.creditScoreInput.selectedIndex];
    const creditScoreText = selectedOption ? selectedOption.value : this.creditScoreInput.value;

    this.isCreditScoreApproved = ["excellent", "very good", "good"].includes(creditScoreText.toLowerCase());
    this.calculateSavings();
  }

  handleEnterKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.calculateSavings();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const isShiftPressed = event.shiftKey;
      if (event.target === this.currentMortgageRateInput) {
        this.handleInterestRateChange(event.key === "ArrowUp" ? 0.1 : -0.1);
      } else if (event.target.getAttribute("input-format") === "dollar") {
        const increment = isShiftPressed ? 10000 : 1000;
        this.handleDollarAmountChange(event.target, event.key === "ArrowUp" ? increment : -increment);
      } else if (event.target === this.remainingMortgageTermInput) {
        let currentTerm = parseFloat(event.target.value);
        currentTerm = Math.min(Math.max(currentTerm + (event.key === "ArrowUp" ? 1 : -1), 1), 30);
        event.target.value = `${currentTerm} yrs`;
        this.debounce(this.calculateSavings.bind(this), 500)();
      }
    }
  }

  handleInterestRateChange(increment) {
    let currentRate = parseFloat(this.currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentRate = Math.min(Math.max(currentRate + increment, 1.5), 15);
    currentRate = Math.round(currentRate * 100) / 100;
    this.currentMortgageRateInput.value = this.formatPercentage(currentRate);
    this.debounce(this.calculateSavings.bind(this), 500)();
  }

  handleMortgageTermChange(increment) {
    let currentTerm = parseFloat(this.remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    currentTerm = Math.min(Math.max(currentTerm + increment, 1), 30);
    this.remainingMortgageTermInput.value = `${currentTerm} yrs`;
    this.debounce(this.calculateSavings.bind(this), 500)();
  }

  handleDollarAmountChange(input, increment) {
    let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
    currentAmount = Math.max(currentAmount + increment, 0);
    input.value = this.formatCurrency(currentAmount);
    this.debounce(this.calculateSavings.bind(this), 500)();
  }

  calculateSavings() {
    let homeValue = parseFloat(this.homeValueInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let currentMortgagePrincipal = parseFloat(this.currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let remainingMortgageTerm = parseFloat(this.remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let currentMortgageRate = parseFloat(this.currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100 || 0;
    let loanAmount = parseFloat(this.loanAmountInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount) || isNaN(selectedTerm)) {
      return;
    }

    // Update input values only if they're at the minimum value
    if (homeValue === 1) this.homeValueInput.value = this.formatCurrency(homeValue);
    if (currentMortgagePrincipal === this.MIN_LOAN_AMOUNT) this.currentMortgagePrincipalInput.value = this.formatCurrency(currentMortgagePrincipal);
    if (loanAmount === this.MIN_LOAN_AMOUNT) this.loanAmountInput.value = this.formatCurrency(loanAmount);

    let totalLoanAmount = currentMortgagePrincipal + loanAmount;
    let ltv = this.calculateLTV(totalLoanAmount, homeValue);
    let isLtvApproved = ltv >= this.MIN_LTV && ltv <= this.MAX_LTV;

    this.updateApprovalStatus(isLtvApproved);

    if (ltv > this.MAX_LTV) {
      loanAmount = Math.max(this.MIN_LOAN_AMOUNT, this.MAX_LTV * homeValue - currentMortgagePrincipal);
      this.loanAmountInput.value = this.formatCurrency(loanAmount);
    } else if (ltv < this.MIN_LTV) {
      loanAmount = Math.max(this.MIN_LOAN_AMOUNT, this.MIN_LTV * homeValue - currentMortgagePrincipal);
      this.loanAmountInput.value = this.formatCurrency(loanAmount);
    }

    // Calculate the current mortgage payment
    const currentMortgagePayment = this.calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);

    // Calculate the effective cash-out refinance rate
    const cashOutRefiRate = (currentMortgagePrincipal * currentMortgageRate + loanAmount * (currentMortgageRate + 0.005)) / totalLoanAmount;

    const homeEquityLoanAPR = this.calculateHomeEquityLoanAPR(this.creditScoreInput.value);

    const homeEquityLoanPayment = this.calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

    const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
    const totalHomeEquityLoanPayments = homeEquityLoanPayment * selectedTerm * 12;

    const homeEquityLoanOptionCost = totalCurrentMortgagePayments + totalHomeEquityLoanPayments;
    const totalInterestCostHEL = homeEquityLoanOptionCost - (currentMortgagePrincipal + loanAmount);

    const cashRefiPayment = this.calculateMonthlyPayment(totalLoanAmount, cashOutRefiRate, selectedTerm);
    const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
    const cashRefiOptionCost = totalCashRefiPayments;

    // Calculate HEI option cost
    const calculateHEIValues = (years) => {
      const appreciation = 0.035;
      const appreciationStartingAmount = Math.round((homeValue * 0.73) / 1000) * 1000;
      const homeValueForYear = homeValue * Math.pow(1 + appreciation, years);
      const simpleAppreciationMultiple = 2.2;
      const pointPercentage = simpleAppreciationMultiple * (loanAmount / homeValue);
      const shareOfAppreciation = (homeValueForYear - appreciationStartingAmount) * pointPercentage;
      const shareBasedRepayment = shareOfAppreciation + loanAmount;
      const capBasedRepayment = loanAmount * Math.pow(1 + 0.175 / 12, years * 12);
      return Math.min(capBasedRepayment, shareBasedRepayment);
    };

    const heiRepayment = calculateHEIValues(selectedTerm);
    const heiOptionCost = totalCurrentMortgagePayments + heiRepayment;

    // Find the lowest cost option
    const lowestCost = Math.min(homeEquityLoanOptionCost, cashRefiOptionCost, heiOptionCost);
    let savings, betterOptionText;

    // Compare only HELoan and Cash-out refi for the better option text
    if (homeEquityLoanOptionCost <= cashRefiOptionCost) {
      savings = cashRefiOptionCost - homeEquityLoanOptionCost;
      betterOptionText = "With a HELoan you would save";
    } else {
      savings = homeEquityLoanOptionCost - cashRefiOptionCost;
      betterOptionText = "With a Cash-out refi you would save";
    }

    this.savingsAmountElement.innerText = this.formatCurrencyWithSymbol(Math.abs(savings));

    // Update the better option text
    const betterOptionTextElement = document.querySelector('[calc-result="better-option"]');
    if (betterOptionTextElement) betterOptionTextElement.textContent = betterOptionText;

    // Update table styling
    const cashoutTable = document.querySelector("#cashout-table");
    const helTable = document.querySelector("#hel-table");
    const heiTable = document.querySelector("#hei-table");
    const cashoutElements = document.querySelectorAll('[calc-result^="cash-out-refi-"]');
    const helElements = document.querySelectorAll('[calc-result^="hel-"]');
    const heiElements = document.querySelectorAll('[calc-result^="hei-"]');

    [cashoutElements, helElements, heiElements].forEach((elements, index) => {
      const isWinner = (index === 0 && lowestCost === cashRefiOptionCost) || (index === 1 && lowestCost === homeEquityLoanOptionCost) || (index === 2 && lowestCost === heiOptionCost);
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

    if (cashoutTable) cashoutTable.classList.toggle("text-color-black", lowestCost === cashRefiOptionCost);
    if (helTable) helTable.classList.toggle("text-color-black", lowestCost === homeEquityLoanOptionCost);
    if (heiTable) heiTable.classList.toggle("text-color-black", lowestCost === heiOptionCost);

    // Update the table values
    this.calculateTableValues(cashOutRefiRate, homeEquityLoanAPR);
  }

  calculateTableValues(cashOutRefiRate, homeEquityLoanAPR) {
    let currentMortgagePrincipal = parseFloat(this.currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, ""));
    let remainingMortgageTerm = parseFloat(this.remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgageRate = parseFloat(this.currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100;
    let loanAmount = parseFloat(this.loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");
    let homeValue = parseFloat(this.homeValueInput.value.replace(/[^0-9.-]+/g, ""));

    const currentMortgagePayment = this.calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
    const cashRefiPayment = this.calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, cashOutRefiRate, selectedTerm);
    const homeEquityLoanPayment = this.calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

    const totalPrincipal = currentMortgagePrincipal + loanAmount;
    const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
    const totalHomeEquityLoanPayments = currentMortgagePayment * remainingMortgageTerm * 12 + homeEquityLoanPayment * selectedTerm * 12;

    const totalInterestCostCashOutRefi = totalCashRefiPayments - totalPrincipal;
    const totalInterestCostHEL = totalHomeEquityLoanPayments - totalPrincipal;

    if (isNaN(cashRefiPayment) || isNaN(homeEquityLoanPayment) || isNaN(totalPrincipal) || isNaN(totalInterestCostCashOutRefi) || isNaN(totalInterestCostHEL) || isNaN(totalCashRefiPayments) || isNaN(totalHomeEquityLoanPayments)) {
      return;
    }

    // Update the table
    document.querySelector('[calc-result="hel-effective-rate"]').innerText = this.formatPercentage(homeEquityLoanAPR * 100);
    document.querySelector('[calc-result="cash-out-refi-effective-rate"]').innerText = this.formatPercentage(cashOutRefiRate * 100);

    document.querySelector('[calc-result="cash-out-refi-monthly-payment"]').innerText = this.formatCurrencyWithSymbol(cashRefiPayment);
    document.querySelector('[calc-result="hel-monthly-payment"]').innerText = this.formatCurrencyWithSymbol(homeEquityLoanPayment);

    document.querySelector('[calc-result="cash-out-refi-total-principal"]').innerText = this.formatCurrencyWithSymbol(totalPrincipal);
    document.querySelector('[calc-result="hel-total-principal"]').innerText = this.formatCurrencyWithSymbol(totalPrincipal);

    document.querySelector('[calc-result="cash-out-refi-total-interest-cost"]').innerText = this.formatCurrencyWithSymbol(totalInterestCostCashOutRefi);
    document.querySelector('[calc-result="hel-total-interest-cost"]').innerText = this.formatCurrencyWithSymbol(totalInterestCostHEL);

    document.querySelector('[calc-result="cash-out-refi-total-cost"]').innerText = this.formatCurrencyWithSymbol(totalCashRefiPayments);
    document.querySelector('[calc-result="hel-total-cost"]').innerText = this.formatCurrencyWithSymbol(totalHomeEquityLoanPayments);

    // Calculate HEI values
    const calculateHEIValues = (years) => {
      const appreciation = 0.035;
      const appreciationStartingAmount = Math.round((homeValue * 0.73) / 1000) * 1000;
      const homeValueForYear = homeValue * Math.pow(1 + appreciation, years);
      const simpleAppreciationMultiple = 2.2;
      const pointPercentage = simpleAppreciationMultiple * (loanAmount / homeValue);
      const shareOfAppreciation = (homeValueForYear - appreciationStartingAmount) * pointPercentage;
      const shareBasedRepayment = shareOfAppreciation + loanAmount;
      const capBasedRepayment = loanAmount * Math.pow(1 + 0.175 / 12, years * 12);
      return Math.min(capBasedRepayment, shareBasedRepayment);
    };

    const heiRepayment15 = calculateHEIValues(15);
    const heiRepayment30 = calculateHEIValues(30);

    const heiTotalCost = selectedTerm === 15 ? heiRepayment15 : heiRepayment30;
    const heiFinanceCost = heiTotalCost - loanAmount;

    // Update the table with HEI values
    document.querySelector('[calc-result="hei-total-principal"]').innerText = this.formatCurrencyWithSymbol(loanAmount);
    document.querySelector('[calc-result="hei-total-interest-cost"]').innerText = this.formatCurrencyWithSymbol(heiFinanceCost);
    document.querySelector('[calc-result="hei-total-cost"]').innerText = this.formatCurrencyWithSymbol(heiTotalCost);

    // Calculate total costs for each option
    const totalCashRefiCost = totalCashRefiPayments;
    const totalHELCost = totalHomeEquityLoanPayments;
    const totalHEICost = heiTotalCost;

    // Find the lowest cost option
    const lowestCost = Math.min(totalCashRefiCost, totalHELCost, totalHEICost);

    // Update table styling based on lowest cost
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

    // Update table headers
    document.querySelector("#cashout-table").classList.toggle("text-color-black", totalCashRefiCost === lowestCost);
    document.querySelector("#hel-table").classList.toggle("text-color-black", totalHELCost === lowestCost);
    document.querySelector("#hei-table").classList.toggle("text-color-black", totalHEICost === lowestCost);
  }

  updateApprovalStatus(isLtvApproved) {
    const isApproved = isLtvApproved && this.isCreditScoreApproved;
    const approvalTrueCard = document.querySelector('[approval="true"]');
    const approvalFalseCard = document.querySelector('[approval="false"]');
    const calcAccordion = document.querySelector(".calc-accordion");

    if (approvalTrueCard && approvalFalseCard && calcAccordion) {
      if (isApproved) {
        approvalTrueCard.classList.remove("hide");
        approvalFalseCard.classList.add("hide");
        calcAccordion.classList.remove("hide");
      } else {
        approvalTrueCard.classList.add("hide");
        approvalFalseCard.classList.remove("hide");
        calcAccordion.classList.add("hide");
      }
    }
  }

  calculateLTV(loanAmount, homeValue) {
    return loanAmount / homeValue;
  }

  calculateMonthlyPayment(principal, annualRate, termYears) {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  calculateHomeEquityLoanPayment(principal, annualRate, termYears) {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  calculateRemainingBalance(principal, annualRate, totalTerm, elapsedTerm) {
    const monthlyRate = annualRate / 12;
    const totalPayments = totalTerm * 12;
    const elapsedPayments = elapsedTerm * 12;
    const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, totalTerm);
    return principal * Math.pow(1 + monthlyRate, elapsedPayments) - (monthlyPayment * (Math.pow(1 + monthlyRate, elapsedPayments) - 1)) / monthlyRate;
  }

  calculateHomeEquityLoanAPR(creditScoreText) {
    const baseAPR = 0.0917;
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

  formatCurrency(value) {
    if (isNaN(value) || value === undefined) return "0";
    return parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatCurrencyWithSymbol(value) {
    if (isNaN(value) || value === undefined) return "$0";
    return "$" + this.formatCurrency(value);
  }

  formatPercentage(value) {
    if (isNaN(value) || value === undefined) return "0.00%";
    return `${parseFloat(value).toFixed(2)}%`;
  }

  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LoanCalculator();
});
