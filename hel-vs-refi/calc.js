document.addEventListener("DOMContentLoaded", () => {
  // Input elements
  const homeValueInput = document.querySelector('[calc-input="home-value"]');
  const currentMortgagePrincipalInput = document.querySelector('[calc-input="mortgage-principal"]');
  const remainingMortgageTermInput = document.querySelector('[calc-input="mortgage-term"]');
  const currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
  const creditScoreInput = document.querySelector('[calc-input="credit-score"]');
  const loanAmountInput = document.querySelector('[calc-input="loan-amount"]');
  const cashRefiTermInputs = document.querySelectorAll('[calc-input^="refi-"]');
  const homeEquityLoanTermInputs = document.querySelectorAll('[calc-input^="heloc-"]');
  const calcButton = document.querySelector('[calc-input="calc_button"]');

  // Result elements
  const savingsAmountElement = document.querySelector('[calc-result="savings-amount"]');
  const savingsPercentElement = document.querySelector('[calc-result="savings-percent"]');
  const homeEquityLoanAPRElement = document.querySelector('[calc-result="heloc-apr"]');

  const formatCurrency = (value) => parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;

  const calculateMonthlyPayment = (principal, annualRate, termYears) => {
    const monthlyRate = annualRate / 12;
    const numberOfPayments = termYears * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    console.log(`Monthly Payment: Principal: ${principal}, Rate: ${annualRate}, Term: ${termYears}, Payment: ${payment}`);
    return payment;
  };

  const calculateHomeEquityLoanPayment = (principal, annualRate, termYears) => {
    return calculateMonthlyPayment(principal, annualRate, termYears);
  };

  const calculateSavings = () => {
    let homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, ""));
    let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100;
    let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let cashRefiTerm = parseInt(document.querySelector('[calc-input^="refi-"]:checked').value);
    let homeEquityLoanTerm = parseInt(document.querySelector('[calc-input^="heloc-"]:checked').value);

    console.log(
      `Inputs: Home Value: ${homeValue}, Current Principal: ${currentMortgagePrincipal}, Remaining Term: ${remainingMortgageTerm}, Current Rate: ${currentMortgageRate}, Loan Amount: ${loanAmount}, Cash-Out Refi Term: ${cashRefiTerm}, Home Equity Loan Term: ${homeEquityLoanTerm}`
    );

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount)) {
      console.log("Invalid inputs detected");
      return;
    }

    const homeEquityLoanAPR = calculateHomeEquityLoanAPR(creditScoreInput.value);
    console.log(`Home Equity Loan APR: ${homeEquityLoanAPR}`);

    const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
    const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, currentMortgageRate, cashRefiTerm);
    const homeEquityLoanPayment = calculateHomeEquityLoanPayment(loanAmount, homeEquityLoanAPR, homeEquityLoanTerm);

    console.log(`Payments: Current Mortgage: ${currentMortgagePayment}, Cash-Out Refi: ${cashRefiPayment}, Home Equity Loan: ${homeEquityLoanPayment}`);

    const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
    const totalCashRefiPayments = cashRefiPayment * cashRefiTerm * 12;
    const totalHomeEquityLoanPayments = homeEquityLoanPayment * homeEquityLoanTerm * 12;

    console.log(`Total Payments: Current Mortgage: ${totalCurrentMortgagePayments}, Cash-Out Refi: ${totalCashRefiPayments}, Home Equity Loan: ${totalHomeEquityLoanPayments}`);

    const remainingBalance = calculateRemainingBalance(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm, homeEquityLoanTerm);
    console.log(`Remaining Balance after Home Equity Loan term: ${remainingBalance}`);

    const homeEquityLoanOptionCost = totalCurrentMortgagePayments + totalHomeEquityLoanPayments;
    const cashRefiOptionCost = totalCashRefiPayments;

    console.log(`Total Costs: Home Equity Loan Option: ${homeEquityLoanOptionCost}, Cash-Out Refi Option: ${cashRefiOptionCost}`);
    console.log(`Home Equity Loan APR: ${homeEquityLoanAPR}, Current Mortgage Rate: ${currentMortgageRate}`);

    const savings = cashRefiOptionCost - homeEquityLoanOptionCost;
    console.log(`Savings: ${savings}`);

    savingsAmountElement.innerText = `$${formatCurrency(Math.abs(savings))}`;
    savingsPercentElement.innerText = formatPercentage((Math.abs(savings) / Math.max(homeEquityLoanOptionCost, cashRefiOptionCost)) * 100);
    homeEquityLoanAPRElement.innerText = formatPercentage(homeEquityLoanAPR * 100);

    const betterOptionElement = document.querySelector('[calc-result="better-option"]');
    if (betterOptionElement) {
      betterOptionElement.innerText = savings > 0 ? "Home Equity Loan" : "Cash-Out Refinance";
    }
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
    currentRate = Math.min(Math.max(currentRate + increment, 0), 100); // Adjust the range as needed
    currentRate = Math.round(currentRate * 100) / 100; // Round to nearest 0.01%
    currentMortgageRateInput.value = formatPercentage(currentRate);
    debounce(calculateSavings, 500)();
  };

  const handleDollarAmountChange = (input, increment) => {
    let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
    currentAmount = Math.max(currentAmount + increment, 0);
    input.value = formatCurrency(currentAmount);
    debounce(calculateSavings, 500)();
  };

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
        let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
        input.value = isNaN(value) ? "" : formatCurrency(value);
        calculateSavings();
      });
    }
  });

  if (remainingMortgageTermInput) {
    remainingMortgageTermInput.addEventListener("input", () => {
      let value = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
      remainingMortgageTermInput.value = isNaN(value) ? "" : `${value} yrs`;
      calculateSavings();
    });
  }

  if (currentMortgageRateInput) {
    currentMortgageRateInput.addEventListener("input", () => {
      let value = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
      currentMortgageRateInput.value = isNaN(value) ? "" : formatPercentage(value);
      calculateSavings();
    });
  }

  if (creditScoreInput) {
    // console.log("Credit score input found:", creditScoreInput);

    const updateHomeEquityLoanAPR = () => {
      const selectedOption = creditScoreInput.options[creditScoreInput.selectedIndex];
      const creditScoreText = selectedOption ? selectedOption.value : creditScoreInput.value;
      // console.log(`Selected credit score text: ${creditScoreText}`);

      const homeEquityLoanAPR = calculateHomeEquityLoanAPR(creditScoreText);
      // console.log(`Calculated Home Equity Loan APR: ${homeEquityLoanAPR * 100}%`);
      homeEquityLoanAPRElement.innerText = formatPercentage(homeEquityLoanAPR * 100);
      calculateSavings();
    };

    creditScoreInput.addEventListener("change", updateHomeEquityLoanAPR);

    // Set default value and trigger initial calculation
    creditScoreInput.value = "good";
    // console.log(`Default credit score set to: ${creditScoreInput.value}`);
    updateHomeEquityLoanAPR();
  } else {
    // console.log("Credit score input not found");
  }

  if (calcButton) {
    calcButton.addEventListener("click", calculateSavings);
  }

  cashRefiTermInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", calculateSavings);
    }
  });

  homeEquityLoanTermInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", calculateSavings);
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
          // Handle remaining mortgage term separately
          let currentTerm = parseFloat(input.value);
          currentTerm = Math.max(currentTerm + (event.key === "ArrowUp" ? 1 : -1), 0);
          input.value = `${currentTerm} yrs`;
          debounce(calculateSavings, 500)();
        }
      }
    });
  });

  // Update the default value settings
  homeValueInput.value = formatCurrency(500000);
  currentMortgagePrincipalInput.value = formatCurrency(275000);
  remainingMortgageTermInput.value = "20 yrs";
  currentMortgageRateInput.value = formatPercentage(7.75); // Updated to 7.75%
  loanAmountInput.value = formatCurrency(100000);
  // Run calculation for default values when the page loads
  calculateSavings();
});

// Add this new function to calculate the remaining balance
const calculateRemainingBalance = (principal, annualRate, totalTerm, elapsedTerm) => {
  console.log(`Calculating remaining balance: Principal: ${principal}, Rate: ${annualRate}, Total Term: ${totalTerm}, Elapsed Term: ${elapsedTerm}`);

  if (typeof calculateMonthlyPayment !== "function") {
    console.error("calculateMonthlyPayment is not a function");
    return 0;
  }

  const monthlyRate = annualRate / 12;
  const totalPayments = totalTerm * 12;
  const elapsedPayments = elapsedTerm * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalTerm);

  console.log(`Monthly payment calculated: ${monthlyPayment}`);

  const remainingBalance = principal * Math.pow(1 + monthlyRate, elapsedPayments) - (monthlyPayment * (Math.pow(1 + monthlyRate, elapsedPayments) - 1)) / monthlyRate;

  console.log(`Remaining balance calculated: ${remainingBalance}`);

  return remainingBalance;
};
