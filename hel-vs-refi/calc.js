document.addEventListener("DOMContentLoaded", () => {
  // Function definitions
  const formatCurrency = (value) => {
    if (isNaN(value) || value === undefined) return "0";
    return parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatCurrencyWithSymbol = (value) => {
    if (isNaN(value) || value === undefined) return "$0";
    return "$" + formatCurrency(value);
  };

  const formatPercentage = (value) => {
    if (isNaN(value) || value === undefined) return "0.00%";
    return `${parseFloat(value).toFixed(2)}%`;
  };

  const calculateMonthlyPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    console.log(`Monthly Payment: Principal: ${principal}, Rate: ${annualRate}, Term: ${termYears}, Payment: ${payment}`);
    return payment;
  };

  const calculateHomeEquityLoanPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    console.log(`HELOAN Payment Calculation: Principal: ${principal}, Rate: ${annualRate}, Term: ${termYears}, Payment: ${payment}`);
    return payment;
  };

  const calculateRemainingBalance = (principal, annualRate, totalTerm, elapsedTerm) => {
    console.log(`Calculating remaining balance: Principal: ${principal}, Rate: ${annualRate}, Total Term: ${totalTerm}, Elapsed Term: ${elapsedTerm}`);

    const monthlyRate = annualRate / 12;
    const totalPayments = totalTerm * 12;
    const elapsedPayments = elapsedTerm * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalTerm);

    console.log(`Monthly payment calculated: ${monthlyPayment}`);

    const remainingBalance = principal * Math.pow(1 + monthlyRate, elapsedPayments) - (monthlyPayment * (Math.pow(1 + monthlyRate, elapsedPayments) - 1)) / monthlyRate;
    console.log(`Remaining balance calculated: ${remainingBalance}`);

    return remainingBalance;
  };

  const calculateTableValues = (cashOutRefiRate, homeEquityLoanAPR) => {
    console.log("Table values input:", {
      cashOutRefiRate,
      homeEquityLoanAPR,
    });

    let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, ""));
    let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100;
    let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");

    const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, cashOutRefiRate, selectedTerm);
    const homeEquityLoanPayment = calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

    const totalPrincipal = currentMortgagePrincipal + loanAmount;
    const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
    const totalHomeEquityLoanPayments = homeEquityLoanPayment * selectedTerm * 12;

    const totalInterestCostCashOutRefi = totalCashRefiPayments - totalPrincipal;
    const totalInterestCostHEL = totalHomeEquityLoanPayments - loanAmount;

    console.log("Table values calculated:", {
      helEffectiveRate: formatPercentage(homeEquityLoanAPR * 100),
      cashOutRefiEffectiveRate: formatPercentage(cashOutRefiRate * 100),
      cashRefiPayment,
      homeEquityLoanPayment,
      totalPrincipal,
      totalInterestCostCashOutRefi,
      totalInterestCostHEL,
      totalCashRefiPayments,
      totalHomeEquityLoanPayments,
    });

    if (isNaN(cashRefiPayment) || isNaN(homeEquityLoanPayment) || isNaN(totalPrincipal) || isNaN(totalInterestCostCashOutRefi) || isNaN(totalInterestCostHEL) || isNaN(totalCashRefiPayments) || isNaN(totalHomeEquityLoanPayments)) {
      console.error("NaN values detected in calculations");
      return; // Exit the function to prevent updating the table with invalid values
    }

    // Update the table
    document.querySelector('[calc-result="hel-effective-rate"]').innerText = formatPercentage(homeEquityLoanAPR * 100);
    document.querySelector('[calc-result="cash-out-refi-effective-rate"]').innerText = formatPercentage(cashOutRefiRate * 100);

    document.querySelector('[calc-result="cash-out-refi-monthly-payment"]').innerText = formatCurrencyWithSymbol(cashRefiPayment);
    document.querySelector('[calc-result="hel-monthly-payment"]').innerText = formatCurrencyWithSymbol(homeEquityLoanPayment);

    document.querySelector('[calc-result="cash-out-refi-total-principal"]').innerText = formatCurrencyWithSymbol(totalPrincipal);
    document.querySelector('[calc-result="hel-total-principal"]').innerText = formatCurrencyWithSymbol(totalPrincipal);

    document.querySelector('[calc-result="cash-out-refi-total-interest-cost"]').innerText = formatCurrencyWithSymbol(totalInterestCostCashOutRefi);
    document.querySelector('[calc-result="hel-total-interest-cost"]').innerText = formatCurrencyWithSymbol(totalInterestCostHEL);

    document.querySelector('[calc-result="cash-out-refi-total-cost"]').innerText = formatCurrencyWithSymbol(totalCashRefiPayments);
    document.querySelector('[calc-result="hel-total-cost"]').innerText = formatCurrencyWithSymbol(totalHomeEquityLoanPayments);
  };

  // Add these constants at the top of your file
  const MAX_LTV = 0.85; // 85% maximum LTV
  const MIN_LTV = 0.05; // 5% minimum LTV
  const MIN_LOAN_AMOUNT = 1; // Minimum loan amount of $1

  // Add a global variable to track credit score approval
  let isCreditScoreApproved = true;

  const calculateLTV = (loanAmount, homeValue) => {
    return loanAmount / homeValue;
  };

  const updateApprovalStatus = (isLtvApproved) => {
    const isApproved = isLtvApproved && isCreditScoreApproved;
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
  };

  const calculateSavings = () => {
    let homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100 || 0;
    let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, "")) || 0;
    let selectedTerm = parseInt(document.querySelector('[name="term-length"]:checked')?.value || "15");

    console.log("Inputs:", {
      homeValue,
      currentMortgagePrincipal,
      remainingMortgageTerm,
      currentMortgageRate,
      loanAmount,
      selectedTerm,
    });

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount) || isNaN(selectedTerm)) {
      console.log("Invalid inputs detected");
      return;
    }

    // Update input values only if they're at the minimum value
    if (homeValue === 1) homeValueInput.value = formatCurrency(homeValue);
    if (currentMortgagePrincipal === MIN_LOAN_AMOUNT) currentMortgagePrincipalInput.value = formatCurrency(currentMortgagePrincipal);
    if (loanAmount === MIN_LOAN_AMOUNT) loanAmountInput.value = formatCurrency(loanAmount);

    let totalLoanAmount = currentMortgagePrincipal + loanAmount;
    let ltv = calculateLTV(totalLoanAmount, homeValue);
    let isLtvApproved = ltv >= MIN_LTV && ltv <= MAX_LTV;

    updateApprovalStatus(isLtvApproved);

    if (ltv > MAX_LTV) {
      loanAmount = Math.max(MIN_LOAN_AMOUNT, MAX_LTV * homeValue - currentMortgagePrincipal);
      loanAmountInput.value = formatCurrency(loanAmount);
      // TODO: Add alert to user about amount adjustment
      // alert(`The loan amount has been adjusted to $${formatCurrency(loanAmount)} to maintain a maximum LTV of ${MAX_LTV * 100}%.`);
    } else if (ltv < MIN_LTV) {
      loanAmount = Math.max(MIN_LOAN_AMOUNT, MIN_LTV * homeValue - currentMortgagePrincipal);
      loanAmountInput.value = formatCurrency(loanAmount);
      // TODO: Add alert to user about amount adjustment
      // alert(`The loan amount has been adjusted to $${formatCurrency(loanAmount)} to maintain a minimum LTV of ${MIN_LTV * 100}%.`);
    }

    // Calculate the effective cash-out refinance rate
    const cashOutRefiRate = (currentMortgagePrincipal * currentMortgageRate + loanAmount * (currentMortgageRate + 0.005)) / totalLoanAmount;

    const homeEquityLoanAPR = calculateHomeEquityLoanAPR(creditScoreInput.value);
    console.log("Calculated rates:", {
      cashOutRefiRate,
      homeEquityLoanAPR,
    });

    console.log("Input values:", {
      currentMortgagePrincipal,
      remainingMortgageTerm,
      currentMortgageRate,
      loanAmount,
      selectedTerm,
      homeEquityLoanAPR,
    });

    const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
    const homeEquityLoanPayment = calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, selectedTerm);

    console.log("Calculated payments:", {
      currentMortgagePayment,
      homeEquityLoanPayment,
    });

    const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
    const totalHomeEquityLoanPayments = homeEquityLoanPayment * selectedTerm * 12;

    console.log("Total payments:", {
      totalCurrentMortgagePayments,
      totalHomeEquityLoanPayments,
    });

    const homeEquityLoanOptionCost = totalCurrentMortgagePayments + totalHomeEquityLoanPayments;
    const totalInterestCostHEL = totalHomeEquityLoanPayments - loanAmount;

    console.log("HELOAN results:", {
      homeEquityLoanAPR,
      homeEquityLoanPayment,
      totalHomeEquityLoanPayments,
      homeEquityLoanOptionCost,
      totalInterestCostHEL,
    });

    const cashRefiPayment = calculateMonthlyPayment(totalLoanAmount, cashOutRefiRate, selectedTerm);
    const totalCashRefiPayments = cashRefiPayment * selectedTerm * 12;
    const cashRefiOptionCost = totalCashRefiPayments;
    const savings = cashRefiOptionCost - homeEquityLoanOptionCost;
    console.log(`Savings: ${savings}`);

    savingsAmountElement.innerText = formatCurrencyWithSymbol(Math.abs(savings));

    // Add class based on the comparison
    const cashoutTable = document.querySelector("#cashout-table");
    const helTable = document.querySelector("#hel-table");
    const cashoutElements = document.querySelectorAll('[calc-result^="cash-out-refi-"]');
    const helElements = document.querySelectorAll('[calc-result^="hel-"]');
    const betterOptionText = document.querySelector('[calc-result="better-option"]');

    if (cashoutElements.length > 0 && helElements.length > 0) {
      if (cashRefiOptionCost < homeEquityLoanOptionCost) {
        // Cash-out refi is the winner
        cashoutElements.forEach((el) => {
          el.classList.add("text-color-black", "text-weight-semibold");
          el.classList.remove("text-weight-normal");
        });
        helElements.forEach((el) => {
          el.classList.remove("text-color-black", "text-weight-semibold");
          el.classList.add("text-weight-normal");
        });
        if (cashoutTable) cashoutTable.classList.add("text-color-black", "text-weight-semibold");
        if (helTable) helTable.classList.remove("text-color-black", "text-weight-semibold");
        if (betterOptionText) betterOptionText.textContent = "With a Cash-out refi you would save";
      } else {
        // Home Equity Loan is the winner
        helElements.forEach((el) => {
          el.classList.add("text-color-black", "text-weight-semibold");
          el.classList.remove("text-weight-normal");
        });
        cashoutElements.forEach((el) => {
          el.classList.remove("text-color-black", "text-weight-semibold");
          el.classList.add("text-weight-normal");
        });
        if (helTable) helTable.classList.add("text-color-black", "text-weight-semibold");
        if (cashoutTable) cashoutTable.classList.remove("text-color-black", "text-weight-semibold");
        if (betterOptionText) betterOptionText.textContent = "With a HELoan you would save";
      }
    } else {
      console.warn("Cash-out refi or Home Equity Loan elements not found");
    }

    // Update the table values
    calculateTableValues(cashOutRefiRate, homeEquityLoanAPR);
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const calculateHomeEquityLoanAPR = (creditScoreText) => {
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

  const handleInterestRateChange = (increment) => {
    let currentRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentRate = Math.min(Math.max(currentRate + increment, 1.5), 15); // Cap between 1.5% and 15%
    currentRate = Math.round(currentRate * 100) / 100; // Round to nearest 0.01%
    currentMortgageRateInput.value = formatPercentage(currentRate);
    debounce(calculateSavings, 500)();
  };

  const handleMortgageTermChange = (increment) => {
    let currentTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    currentTerm = Math.min(Math.max(currentTerm + increment, 1), 30); // Cap between 1 and 30 years
    remainingMortgageTermInput.value = `${currentTerm} yrs`;
    debounce(calculateSavings, 500)();
  };

  const handleDollarAmountChange = (input, increment) => {
    let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, "")) || 0;
    currentAmount = Math.max(currentAmount + increment, 0);
    input.value = formatCurrency(currentAmount);
    debounce(calculateSavings, 500)();
  };

  // Input elements
  const homeValueInput = document.querySelector('[calc-input="home-value"]');
  const currentMortgagePrincipalInput = document.querySelector('[calc-input="mortgage-principal"]');
  const remainingMortgageTermInput = document.querySelector('[calc-input="mortgage-term"]');
  const currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
  const creditScoreInput = document.querySelector('[calc-input="credit-score"]');
  const loanAmountInput = document.querySelector('[calc-input="loan-amount"]');
  const termInputs = document.querySelectorAll('[name="term-length"]');
  const calcButton = document.querySelector('[calc-input="calc_button"]');

  // Result elements
  const savingsAmountElement = document.querySelector('[calc-result="savings-amount"]');

  // Prevent non-numeric input for dollar, percentage, and year fields
  document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"], input[input-format="year"]').forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        let numericValue = input.value.replace(/[^0-9.]/g, "");
        if (input.getAttribute("input-format") === "dollar") {
          input.value = numericValue ? `${parseFloat(numericValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "";
        } else if (input.getAttribute("input-format") === "percent") {
          input.value = numericValue ? `${parseFloat(numericValue).toFixed(2)}%` : "";
        } else if (input.getAttribute("input-format") === "year") {
          input.value = numericValue ? `${parseFloat(numericValue)} yrs` : "";
        }
        calculateSavings(); // Recalculate savings on each input change
      });

      input.addEventListener("keypress", (event) => {
        if (!/[0-9.]/.test(event.key)) {
          event.preventDefault();
        }
      });
    }
  });

  // Update the input event listeners for dollar inputs
  [homeValueInput, currentMortgagePrincipalInput, loanAmountInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        let value = input.value.replace(/[^0-9.-]+/g, "");
        if (value !== "") {
          value = parseFloat(value);
          if (!isNaN(value)) {
            input.value = formatCurrency(value);
          }
        }
        calculateSavings();
      });

      input.addEventListener("blur", () => {
        let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
        if (isNaN(value) || value === 0) {
          value = input === homeValueInput ? 1 : MIN_LOAN_AMOUNT;
        }
        input.value = formatCurrency(value);
        calculateSavings();
      });
    }
  });

  if (remainingMortgageTermInput) {
    remainingMortgageTermInput.addEventListener("input", () => {
      let value = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
      value = Math.min(Math.max(value, 1), 30); // Cap between 1 and 30 years
      remainingMortgageTermInput.value = isNaN(value) ? "" : `${value} yrs`;
      calculateSavings();
    });
  }

  if (currentMortgageRateInput) {
    currentMortgageRateInput.addEventListener("input", (event) => {
      let value = currentMortgageRateInput.value.replace(/[^0-9.]/g, "");
      let cursorPosition = event.target.selectionStart;
      let dotIndex = value.indexOf(".");

      // Allow only two decimal places
      if (dotIndex !== -1 && value.length - dotIndex > 3) {
        value = value.slice(0, dotIndex + 3);
      }

      // Ensure the value is between 1.5 and 15
      let numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        numValue = Math.min(Math.max(numValue, 1.5), 15);
        value = numValue.toFixed(2);
      }

      currentMortgageRateInput.value = value ? `${value}%` : "";

      // Adjust cursor position if a '%' was added
      if (value) {
        cursorPosition += currentMortgageRateInput.value.length - value.length;
      }
      currentMortgageRateInput.setSelectionRange(cursorPosition, cursorPosition);

      debounce(calculateSavings, 500)();
    });

    currentMortgageRateInput.addEventListener("blur", () => {
      let value = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
      value = Math.min(Math.max(value, 1.5), 15); // Ensure value is between 1.5% and 15%
      currentMortgageRateInput.value = isNaN(value) ? "" : formatPercentage(value);
      calculateSavings();
    });
  }

  if (creditScoreInput) {
    const updateHomeEquityLoanAPR = () => {
      const selectedOption = creditScoreInput.options[creditScoreInput.selectedIndex];
      const creditScoreText = selectedOption ? selectedOption.value : creditScoreInput.value;

      // Check if credit score is good enough for approval
      isCreditScoreApproved = ["excellent", "very good", "good"].includes(creditScoreText.toLowerCase());
      calculateSavings(); // This will trigger updateApprovalStatus with the current LTV approval status
    };

    creditScoreInput.addEventListener("change", updateHomeEquityLoanAPR);

    // Set default value and trigger initial calculation
    creditScoreInput.value = "good";
    const event = new Event("change");
    creditScoreInput.dispatchEvent(event);
  }

  if (calcButton) {
    calcButton.addEventListener("click", () => {
      calculateSavings();
      calculateTableValues();
    });
  }

  termInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", () => {
        calculateSavings();
        calculateTableValues();
      });
    }
  });

  // Add event listener for Enter key to run calculation
  document.querySelectorAll(".calc-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateSavings();
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
          currentTerm = Math.min(Math.max(currentTerm + (event.key === "ArrowUp" ? 1 : -1), 1), 30);
          input.value = `${currentTerm} yrs`;
          debounce(calculateSavings, 500)();
        }
      }
    });
  });

  // Add event listeners for mortgage rate buttons
  document.querySelector('[btn-inc="increase-mortgage-rate"]').addEventListener("click", () => handleInterestRateChange(0.1));
  document.querySelector('[btn-inc="decrease-mortgage-rate"]').addEventListener("click", () => handleInterestRateChange(-0.1));

  // Add event listeners for mortgage term buttons
  document.querySelector('[btn-inc="increase-mortgage-term"]').addEventListener("click", () => handleMortgageTermChange(1));
  document.querySelector('[btn-inc="decrease-mortgage-term"]').addEventListener("click", () => handleMortgageTermChange(-1));

  // Update the default value settings
  homeValueInput.value = formatCurrency(500000);
  currentMortgagePrincipalInput.value = formatCurrency(275000);
  remainingMortgageTermInput.value = "20 yrs";
  currentMortgageRateInput.value = formatPercentage(7.75); // Updated to 7.75%
  loanAmountInput.value = formatCurrency(50000);

  // Run calculation for default values when the page loads
  calculateSavings();
  calculateTableValues();
});
