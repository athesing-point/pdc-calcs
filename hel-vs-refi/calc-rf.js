document.addEventListener("DOMContentLoaded", () => {
  // Input elements
  const inputs = {
    homeValue: document.querySelector('[calc-input="home-value"]'),
    currentMortgagePrincipal: document.querySelector('[calc-input="mortgage-principal"]'),
    remainingMortgageTerm: document.querySelector('[calc-input="mortgage-term"]'),
    currentMortgageRate: document.querySelector('[calc-input="mortgage-rate"]'),
    creditScore: document.querySelector('[calc-input="credit-score"]'),
    loanAmount: document.querySelector('[calc-input="loan-amount"]'),
    cashRefiTerms: document.querySelectorAll('[calc-input^="refi-"]'),
    helocTerms: document.querySelectorAll('[calc-input^="heloc-"]'),
    calcButton: document.querySelector('[calc-input="calc_button"]'),
  };

  // Result elements
  const results = {
    savingsAmount: document.querySelector('[calc-result="savings-amount"]'),
    savingsPercent: document.querySelector('[calc-result="savings-percent"]'),
    helocAPR: document.querySelector('[calc-result="heloc-apr"]'),
  };

  // Utility functions
  const formatCurrency = (value) => parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;
  const parseNumericInput = (value) => parseFloat(value.replace(/[^0-9.-]+/g, ""));

  // Add a new function for formatting savings
  const formatSavings = (value) => {
    const numValue = parseFloat(value);
    if (numValue >= 1000000) {
      return "999k+";
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(0)}k`;
    } else {
      return formatCurrency(numValue);
    }
  };

  const calculateSavings = () => {
    let homeValue = parseNumericInput(inputs.homeValue.value);
    let currentMortgagePrincipal = parseNumericInput(inputs.currentMortgagePrincipal.value);
    let remainingMortgageTerm = parseNumericInput(inputs.remainingMortgageTerm.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgageRate = parseNumericInput(inputs.currentMortgageRate.value.replace(/[^0-9.-]+/g, "")) / 100;
    let loanAmount = parseNumericInput(inputs.loanAmount.value);
    let cashRefiTerm = parseInt(document.querySelector('[calc-input^="refi-"]:checked').value);
    let helocTerm = parseInt(document.querySelector('[calc-input^="heloc-"]:checked').value);

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount)) return;

    // Perform calculations
    const helocAPR = calculateHelocAPR(inputs.creditScore.value);
    const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
    const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, currentMortgageRate, cashRefiTerm);
    const helocPayment = calculateHelocPayment(loanAmount, helocAPR);
    const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
    const totalCashRefiPayments = cashRefiPayment * cashRefiTerm * 12;
    const totalHelocPayments = helocPayment * helocTerm * 12;
    const savings = totalCurrentMortgagePayments - (totalCashRefiPayments + totalHelocPayments);

    // Update UI
    results.savingsAmount.innerText = formatSavings(savings);
    results.savingsPercent.innerText = formatPercentage((savings / totalCurrentMortgagePayments) * 100);
    results.helocAPR.innerText = formatPercentage(helocAPR * 100);
  };

  const calculateMonthlyPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    return (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  const calculateHelocPayment = (principal, annualRate) => {
    const monthlyRate = annualRate / 12;
    return principal * monthlyRate; // Assuming interest-only payments
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const calculateHelocAPR = (creditScoreText) => {
    const baseAPR = 0.0917; // 9.17% (national average for "good" credit)
    switch (creditScoreText.toLowerCase()) {
      case "excellent":
        return baseAPR - 0.0083; // 8.34% (0.83% lower than base)
      case "very good":
        return baseAPR - 0.0037; // 8.80% (0.37% lower than base)
      case "good":
        return baseAPR; // 9.17% (base rate)
      case "average":
        return baseAPR + 0.0083; // 10.00% (0.83% higher than base)
      case "low":
        return baseAPR + 0.0164; // 10.81% (1.64% higher than base)
      default:
        return baseAPR + 0.0164; // Default to highest rate
    }
  };

  const handleInputChange = (input, formatter) => {
    let value = parseNumericInput(input.value);
    input.value = isNaN(value) ? "" : formatter(value);
    calculateSavings();
  };

  const setupInputListeners = () => {
    const dollarInputs = [inputs.homeValue, inputs.currentMortgagePrincipal, inputs.loanAmount];
    dollarInputs.forEach((input) => {
      input.addEventListener("input", () => handleInputChange(input, formatCurrency));
    });

    inputs.remainingMortgageTerm.addEventListener("input", () => handleInputChange(inputs.remainingMortgageTerm, (value) => `${value} yrs`));
    inputs.currentMortgageRate.addEventListener("input", () => handleInputChange(inputs.currentMortgageRate, formatPercentage));

    if (inputs.creditScore) {
      const updateHelocAPR = () => {
        const selectedOption = inputs.creditScore.options[inputs.creditScore.selectedIndex];
        const creditScoreText = selectedOption ? selectedOption.value : inputs.creditScore.value;
        const helocAPR = calculateHelocAPR(creditScoreText);
        results.helocAPR.innerText = formatPercentage(helocAPR * 100);
        calculateSavings();
      };

      inputs.creditScore.addEventListener("change", updateHelocAPR);
      inputs.creditScore.value = "good";
      updateHelocAPR();
    }

    inputs.calcButton.addEventListener("click", calculateSavings);

    [...inputs.cashRefiTerms, ...inputs.helocTerms].forEach((input) => {
      input.addEventListener("change", calculateSavings);
    });

    document.querySelectorAll(".calc-input").forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          calculateSavings();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          if (input === inputs.currentMortgageRate) {
            handleInterestRateChange(event.key === "ArrowUp" ? 0.1 : -0.1);
          } else if (input.getAttribute("input-format") === "dollar") {
            handleDrawAmountChange(input, event.key === "ArrowUp" ? 1000 : -1000);
          } else if (input === inputs.remainingMortgageTerm) {
            handleDrawAmountChange(input, event.key === "ArrowUp" ? 1 : -1);
          }
        }
      });
    });
  };

  const setDefaultValues = () => {
    inputs.homeValue.value = formatCurrency(500000);
    inputs.currentMortgagePrincipal.value = formatCurrency(275000);
    inputs.remainingMortgageTerm.value = "20 yrs";
    inputs.currentMortgageRate.value = formatPercentage(7.75);
    inputs.loanAmount.value = formatCurrency(100000);
    calculateSavings();
  };

  setupInputListeners();
  setDefaultValues();
});
