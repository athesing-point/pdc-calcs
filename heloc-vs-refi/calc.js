document.addEventListener("DOMContentLoaded", () => {
  // Input elements
  const homeValueInput = document.querySelector('[calc-input="home-value"]');
  const currentMortgagePrincipalInput = document.querySelector('[calc-input="mortgage-principal"]');
  const remainingMortgageTermInput = document.querySelector('[calc-input="mortgage-term"]');
  const currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
  const creditScoreInput = document.querySelector('[calc-input="credit-score"]');
  const loanAmountInput = document.querySelector('[calc-input="loan-amount"]');
  const cashRefiTermInputs = document.querySelectorAll('[calc-input^="refi-"]');
  const helocTermInputs = document.querySelectorAll('[calc-input^="heloc-"]');
  const calcButton = document.querySelector('[calc-input="calc_button"]');

  // Result elements
  const savingsAmountElement = document.querySelector('[calc-result="savings-amount"]');
  const savingsPercentElement = document.querySelector('[calc-result="savings-percent"]');
  const helocAPRElement = document.querySelector('[calc-result="heloc-apr"]');

  const formatCurrency = (value) => `$${parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const formatPercentage = (value) => `${parseFloat(value).toFixed(2)}%`;

  const calculateSavings = () => {
    let homeValue = parseFloat(homeValueInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgagePrincipal = parseFloat(currentMortgagePrincipalInput.value.replace(/[^0-9.-]+/g, ""));
    let remainingMortgageTerm = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    let currentMortgageRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, "")) / 100;
    // let creditScoreText = creditScoreInput.value;
    let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let cashRefiTerm = parseInt(document.querySelector('[calc-input^="refi-"]:checked').value);
    let helocTerm = parseInt(document.querySelector('[calc-input^="heloc-"]:checked').value);

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount)) return;

    // Perform calculations
    const helocAPR = calculateHelocAPR(creditScoreInput.value); // Ensure this uses the updated credit score value
    const currentMortgagePayment = calculateMonthlyPayment(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm);
    const cashRefiPayment = calculateMonthlyPayment(currentMortgagePrincipal + loanAmount, currentMortgageRate, cashRefiTerm);
    const helocPayment = calculateHelocPayment(loanAmount, helocAPR);

    const totalCurrentMortgagePayments = currentMortgagePayment * remainingMortgageTerm * 12;
    const totalCashRefiPayments = cashRefiPayment * cashRefiTerm * 12;
    const totalHelocPayments = helocPayment * helocTerm * 12;

    const savings = totalCurrentMortgagePayments - (totalCashRefiPayments + totalHelocPayments);

    // Update UI
    savingsAmountElement.innerText = formatCurrency(savings);
    savingsPercentElement.innerText = formatPercentage((savings / totalCurrentMortgagePayments) * 100);
    helocAPRElement.innerText = formatPercentage(helocAPR * 100); // Update the HELOC APR result
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
    console.log(`Credit score selected: ${creditScoreText}`);
    switch (creditScoreText.toLowerCase()) {
      case "excellent":
        return 0.055; // 5.50%
      case "very good":
        return 0.0734; // 7.34%
      case "good":
        return 0.0918; // 9.18% (national average)
      case "average":
        return 0.1184; // 11.84%
      case "low":
        return 0.145; // 14.50%
      default:
        console.log(`Unrecognized credit score: ${creditScoreText}`);
        return 0.145; // Default to highest rate
    }
  };

  const handleInterestRateChange = (increment) => {
    let currentRate = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentRate = Math.min(Math.max(currentRate + increment, 0), 100); // Adjust the range as needed
    currentRate = Math.round(currentRate * 100) / 100; // Round to nearest 0.01%
    currentMortgageRateInput.value = formatPercentage(currentRate);
    debounce(calculateSavings, 500)();
  };

  const handleDrawAmountChange = (input, increment) => {
    let currentAmount = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
    currentAmount = Math.max(currentAmount + increment, 0); // Adjust the minimum value as needed
    input.value = formatCurrency(currentAmount);
    debounce(calculateSavings, 500)();
  };

  // Prevent non-numeric input for dollar, percentage, and year fields
  document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"], input[input-format="year"]').forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        let numericValue = input.value.replace(/[^0-9.]/g, "");
        if (input.getAttribute("input-format") === "dollar") {
          input.value = numericValue ? `$${parseFloat(numericValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "";
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

  // Event listeners for input fields
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
    console.log("Credit score input found:", creditScoreInput); // Log the credit score input element

    const updateHelocAPR = () => {
      const selectedOption = creditScoreInput.options[creditScoreInput.selectedIndex];
      const creditScoreText = selectedOption ? selectedOption.value : creditScoreInput.value;
      console.log(`Selected credit score text: ${creditScoreText}`);

      const helocAPR = calculateHelocAPR(creditScoreText);
      console.log(`Calculated HELOC APR: ${helocAPR * 100}%`);
      helocAPRElement.innerText = formatPercentage(helocAPR * 100);
      calculateSavings();
    };

    creditScoreInput.addEventListener("change", updateHelocAPR);

    // Set default value and trigger initial calculation
    creditScoreInput.value = "good";
    console.log(`Default credit score set to: ${creditScoreInput.value}`);
    updateHelocAPR();
  } else {
    console.log("Credit score input not found"); // Log if the input is not found
  }

  if (calcButton) {
    calcButton.addEventListener("click", calculateSavings);
  }

  cashRefiTermInputs.forEach((input) => {
    if (input) {
      input.addEventListener("change", calculateSavings);
    }
  });

  helocTermInputs.forEach((input) => {
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
        if (input === currentMortgageRateInput) {
          handleInterestRateChange(event.key === "ArrowUp" ? 0.1 : -0.1);
        } else if (input.getAttribute("input-format") === "dollar") {
          handleDrawAmountChange(input, event.key === "ArrowUp" ? 1000 : -1000);
        } else if (input === remainingMortgageTermInput) {
          handleDrawAmountChange(input, event.key === "ArrowUp" ? 1 : -1);
        }
      }
    });

    // Prevent non-numeric input for dollar fields
    if (input.getAttribute("input-format") === "dollar") {
      input.addEventListener("keypress", (event) => {
        if (!/[0-9.]/.test(event.key)) {
          event.preventDefault();
        }
      });
    }
  });

  // Set default values
  homeValueInput.value = formatCurrency(400000);
  currentMortgagePrincipalInput.value = formatCurrency(300000);
  remainingMortgageTermInput.value = "20 yrs";
  currentMortgageRateInput.value = formatPercentage(9.18);
  // document.querySelector('[calc-input="refi-30"]').checked = true;
  // document.querySelector('[calc-input="heloc-30"]').checked = true;

  // Run calculation for default values when the page loads
  calculateSavings();
});
