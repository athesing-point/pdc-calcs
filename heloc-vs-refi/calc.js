document.addEventListener("DOMContentLoaded", () => {
  // Input elements
  const homeValueInput = document.querySelector('[calc-input="home-value"]');
  const currentMortgagePrincipalInput = document.querySelector('[calc-input="current-mortgage-principal"]');
  const remainingMortgageTermInput = document.querySelector('[calc-input="remaining-mortgage-term"]');
  const currentMortgageRateInput = document.querySelector('[calc-input="mortgage-rate"]');
  const creditScoreInput = document.getElementById("creditScore");
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
    let creditScore = creditScoreInput.value;
    let loanAmount = parseFloat(loanAmountInput.value.replace(/[^0-9.-]+/g, ""));
    let cashRefiTerm = document.querySelector('[calc-input^="refi-"]:checked').value;
    let helocTerm = document.querySelector('[calc-input^="heloc-"]:checked').value;

    if (isNaN(homeValue) || isNaN(currentMortgagePrincipal) || isNaN(remainingMortgageTerm) || isNaN(currentMortgageRate) || isNaN(loanAmount)) return;

    // Perform calculations
    const helocAPR = calculateHelocAPR(creditScore);
    const savings = calculateSavingsAmount(currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm, loanAmount, cashRefiTerm, helocTerm, helocAPR);

    // Update UI
    savingsAmountElement.innerText = formatCurrency(savings);
    savingsPercentElement.innerText = formatPercentage(calculateSavingsPercentage(savings, currentMortgagePrincipal));
    helocAPRElement.innerText = formatPercentage(helocAPR * 100);
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const calculateHelocAPR = (creditScore) => {
    // Placeholder function to determine HELOC APR based on credit score
    if (creditScore === "700 - 759") {
      return 0.0905; // Example APR for this credit score range
    }
    // Add more conditions for different credit score ranges
    return 0.1; // Default APR
  };

  const calculateSavingsAmount = (currentMortgagePrincipal, currentMortgageRate, remainingMortgageTerm, loanAmount, cashRefiTerm, helocTerm, helocAPR) => {
    // Placeholder function to calculate savings
    // Implement the actual savings calculation logic here
    return 428000; // Example savings amount in dollars
  };

  const calculateSavingsPercentage = (savings, currentMortgagePrincipal) => {
    // Placeholder function to calculate savings percentage
    return (savings / currentMortgagePrincipal) * 100;
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

  // Event listeners for input fields
  [homeValueInput, currentMortgagePrincipalInput, loanAmountInput].forEach((input) => {
    input.addEventListener("blur", () => {
      let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
      input.value = isNaN(value) ? "" : formatCurrency(value);
      calculateSavings();
    });
  });

  remainingMortgageTermInput.addEventListener("blur", () => {
    let value = parseFloat(remainingMortgageTermInput.value.replace(/[^0-9.-]+/g, ""));
    remainingMortgageTermInput.value = isNaN(value) ? "" : value;
    calculateSavings();
  });

  currentMortgageRateInput.addEventListener("blur", () => {
    let value = parseFloat(currentMortgageRateInput.value.replace(/[^0-9.-]+/g, ""));
    currentMortgageRateInput.value = isNaN(value) ? "" : formatPercentage(value);
    calculateSavings();
  });

  [...cashRefiTermInputs, ...helocTermInputs].forEach((input) => {
    input.addEventListener("change", calculateSavings);
  });

  calcButton.addEventListener("click", (event) => {
    event.preventDefault();
    calculateSavings();
  });

  // Prevent non-numeric input for dollar and percentage fields
  document.querySelectorAll('input[input-format="dollar"], input[input-format="percent"]').forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        let numericValue = input.value.replace(/[^0-9.]/g, "");
        if (input.getAttribute("input-format") === "dollar") {
          input.value = numericValue ? `$${parseFloat(numericValue).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "";
        } else {
          input.value = numericValue ? `${parseFloat(numericValue).toFixed(2)}%` : "";
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
  });

  // Set default values
  homeValueInput.value = formatCurrency(400000);
  currentMortgagePrincipalInput.value = formatCurrency(300000);
  remainingMortgageTermInput.value = "20";
  currentMortgageRateInput.value = formatPercentage(4);
  creditScoreInput.value = "700 - 759";
  loanAmountInput.value = formatCurrency(50000);
  // document.querySelector('[calc-input="refi-30"]').checked = true;
  // document.querySelector('[calc-input="heloc-30"]').checked = true;

  // Run calculation for default values when the page loads
  calculateSavings();
});
