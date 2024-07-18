document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const CONFIG = {
    baseAPR: 0.0917,
    aprAdjustments: {
      excellent: -0.0083,
      veryGood: -0.0037,
      good: 0,
      average: 0.0083,
      low: 0.0164,
    },
    defaultValues: {
      homeValue: 500000,
      currentMortgagePrincipal: 275000,
      remainingMortgageTerm: 20,
      currentMortgageRate: 7.75,
      loanAmount: 100000,
    },
  };

  // State management
  const state = {
    inputs: {},
    results: {},
  };

  // Utility functions
  const formatCurrency = (value) => parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;

  // Calculation functions
  const calculateMonthlyPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  const calculateRemainingBalance = (principal, annualRate, totalTerm, elapsedTerm) => {
    const monthlyRate = annualRate / 12;
    const elapsedPayments = elapsedTerm * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalTerm);
    return principal * Math.pow(1 + monthlyRate, elapsedPayments) - (monthlyPayment * (Math.pow(1 + monthlyRate, elapsedPayments) - 1)) / monthlyRate;
  };

  const calculateHomeEquityLoanAPR = (creditScoreText) => {
    const adjustment = CONFIG.aprAdjustments[creditScoreText.toLowerCase()] || CONFIG.aprAdjustments.low;
    return CONFIG.baseAPR + adjustment;
  };

  // Core calculation functions
  const calculateSavings = () => {
    try {
      const { homeValue, currentMortgagePrincipal, remainingMortgageTerm, currentMortgageRate, loanAmount, cashRefiTerm, homeEquityLoanTerm } = state.inputs;
      const homeEquityLoanAPR = calculateHomeEquityLoanAPR(state.inputs.creditScore);

      const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
      const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, currentMortgageRate, cashRefiTerm);
      const homeEquityLoanPayment = calculateMonthlyPayment(loanAmount, homeEquityLoanAPR, homeEquityLoanTerm);

      const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
      const totalCashRefiPayments = cashRefiPayment * cashRefiTerm * 12;
      const totalHomeEquityLoanPayments = homeEquityLoanPayment * homeEquityLoanTerm * 12;

      const remainingBalance = calculateRemainingBalance(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm, homeEquityLoanTerm);

      const homeEquityLoanOptionCost = totalCurrentMortgagePayments + totalHomeEquityLoanPayments;
      const cashRefiOptionCost = totalCashRefiPayments;

      const totalPrincipal = currentMortgagePrincipal + loanAmount;
      const totalInterestCostCashOutRefi = cashRefiOptionCost - totalPrincipal;
      const totalInterestCostHEL = homeEquityLoanOptionCost - totalPrincipal;

      const savings = cashRefiOptionCost - homeEquityLoanOptionCost;

      state.results = {
        savings,
        homeEquityLoanAPR,
        cashRefiOptionCost,
        homeEquityLoanOptionCost,
        currentMortgagePayment,
        cashRefiPayment,
        homeEquityLoanPayment,
        totalPrincipal,
        totalInterestCostCashOutRefi,
        totalInterestCostHEL,
        remainingBalance,
      };
    } catch (error) {
      console.error("Error in savings calculation:", error);
    }
  };

  const updateUI = () => {
    const { savings, homeEquityLoanAPR, cashRefiOptionCost, homeEquityLoanOptionCost, cashRefiPayment, homeEquityLoanPayment, totalPrincipal, totalInterestCostCashOutRefi, totalInterestCostHEL } = state.results;
    const { currentMortgageRate } = state.inputs;

    document.querySelector('[calc-result="savings-amount"]').innerText = `$${formatCurrency(Math.abs(savings))}`;
    document.querySelector('[calc-result="savings-percent"]').innerText = formatPercentage((Math.abs(savings) / Math.max(homeEquityLoanOptionCost, cashRefiOptionCost)) * 100);
    document.querySelector('[calc-result="heloc-apr"]').innerText = formatPercentage(homeEquityLoanAPR * 100);

    const betterOptionElement = document.querySelector('[calc-result="better-option"]');
    const comparisonTextElement = document.querySelector('[calc-result="comparison-text"]');
    if (betterOptionElement && comparisonTextElement) {
      if (savings > 0) {
        betterOptionElement.innerText = "With a Home Equity Loan you would save";
        comparisonTextElement.innerText = "Compared to a Cash-out refinance*";
      } else {
        betterOptionElement.innerText = "With a Cash-out refi you would save";
        comparisonTextElement.innerText = "Compared to a Home Equity Loan*";
      }
    }

    // Update table values
    document.querySelector('[calc-result="cash-out-refi-effective-rate"]').innerText = formatPercentage(currentMortgageRate * 100);
    document.querySelector('[calc-result="hel-effective-rate"]').innerText = formatPercentage(homeEquityLoanAPR * 100);
    document.querySelector('[calc-result="cash-out-refi-monthly-payment"]').innerText = `$${formatCurrency(cashRefiPayment)}`;
    document.querySelector('[calc-result="hel-monthly-payment"]').innerText = `$${formatCurrency(homeEquityLoanPayment)}`;
    document.querySelector('[calc-result="cash-out-refi-total-principal"]').innerText = `$${formatCurrency(totalPrincipal)}`;
    document.querySelector('[calc-result="hel-total-principal"]').innerText = `$${formatCurrency(totalPrincipal)}`;
    document.querySelector('[calc-result="cash-out-refi-total-interest-cost"]').innerText = `$${formatCurrency(totalInterestCostCashOutRefi)}`;
    document.querySelector('[calc-result="hel-total-interest-cost"]').innerText = `$${formatCurrency(totalInterestCostHEL)}`;
    document.querySelector('[calc-result="cash-out-refi-total-cost"]').innerText = `$${formatCurrency(cashRefiOptionCost)}`;
    document.querySelector('[calc-result="hel-total-cost"]').innerText = `$${formatCurrency(homeEquityLoanOptionCost)}`;

    // Update table colors
    const cashoutTable = document.querySelector("#cashout-table");
    const helTable = document.querySelector("#hel-table");
    if (cashRefiOptionCost < homeEquityLoanOptionCost) {
      cashoutTable.classList.add("text-color-black");
      helTable.classList.remove("text-color-black");
    } else {
      helTable.classList.add("text-color-black");
      cashoutTable.classList.remove("text-color-black");
    }
  };

  // Event handlers
  const handleInputChange = (event) => {
    const input = event.target;
    let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));

    if (input.getAttribute("input-format") === "dollar") {
      input.value = formatCurrency(value);
    } else if (input.getAttribute("input-format") === "percent") {
      input.value = formatPercentage(value);
    } else if (input.getAttribute("input-format") === "year") {
      input.value = `${value} yrs`;
    }

    state.inputs[input.getAttribute("calc-input")] = value;
    requestAnimationFrame(updateCalculations);
  };

  const handleInterestRateChange = (increment) => {
    let currentRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentRate = Math.min(Math.max(currentRate + increment, 0), 100);
    currentRate = Math.round(currentRate * 100) / 100;
    currentMortgageRateInput.value = formatPercentage(currentRate);
    state.inputs.currentMortgageRate = currentRate / 100;
    requestAnimationFrame(updateCalculations);
  };

  const handleDollarAmountChange = (input, increment) => {
    let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
    currentAmount = Math.max(currentAmount + increment, 0);
    input.value = formatCurrency(currentAmount);
    state.inputs[input.getAttribute("calc-input")] = currentAmount;
    requestAnimationFrame(updateCalculations);
  };

  const updateCalculations = () => {
    calculateSavings();
    updateUI();
  };

  // Initialize inputs and set up event listeners
  const initializeInputs = () => {
    const inputs = document.querySelectorAll("[calc-input]");
    inputs.forEach((input) => {
      const key = input.getAttribute("calc-input");
      const defaultValue = CONFIG.defaultValues[key];
      if (defaultValue !== undefined) {
        if (input.getAttribute("input-format") === "dollar") {
          input.value = formatCurrency(defaultValue);
        } else if (input.getAttribute("input-format") === "percent") {
          input.value = formatPercentage(defaultValue);
        } else if (input.getAttribute("input-format") === "year") {
          input.value = `${defaultValue} yrs`;
        } else {
          input.value = defaultValue;
        }
        state.inputs[key] = defaultValue;
      }
      input.addEventListener("input", handleInputChange);
    });

    document.querySelectorAll('[calc-input^="refi-"], [calc-input^="heloc-"]').forEach((input) => {
      input.addEventListener("change", updateCalculations);
    });

    document.querySelector('[calc-input="credit-score"]').addEventListener("change", updateCalculations);

    document.querySelector('[calc-input="calc_button"]').addEventListener("click", updateCalculations);

    document.querySelectorAll(".calc-input").forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          updateCalculations();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          const isShiftPressed = event.shiftKey;
          if (input === currentMortgageRateInput) {
            handleInterestRateChange(event.key === "ArrowUp" ? 0.1 : -0.1);
          } else if (input.getAttribute("input-format") === "dollar") {
            const increment = isShiftPressed ? 10000 : 1000;
            handleDollarAmountChange(input, event.key === "ArrowUp" ? increment : -increment);
          } else if (input === remainingMortgageTermInput) {
            let currentTerm = parseFloat(input.value);
            currentTerm = Math.max(currentTerm + (event.key === "ArrowUp" ? 1 : -1), 0);
            input.value = `${currentTerm} yrs`;
            state.inputs[input.getAttribute("calc-input")] = currentTerm;
            requestAnimationFrame(updateCalculations);
          }
        }
      });
    });
  };

  // Initialize the calculator
  initializeInputs();
  updateCalculations();
});
