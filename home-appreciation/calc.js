const initializeHomeAppreciationCalculator = () => {
  // Input elements
  const homeValueInput = document.querySelector('[calc-input="home_value"]');
  const yearsSelect = document.querySelector('[calc-input="years"]');
  const growthRateSelect = document.querySelector('[calc-input="growth_rate"]');
  const calcButton = document.querySelector('[calc-input="calc_button"]');

  // Result elements
  const futureValueResult = document.querySelector('[calc-result="hv-appreciated"]');
  const appreciationResult = document.querySelector('[calc-result="value-increase"]');
  const alertElement = document.querySelector(".calc-alert");

  // Alert handling
  let isInitialCalculation = true;
  const showAlert = (message = "Results updated") => {
    if (alertElement && !isInitialCalculation) {
      alertElement.textContent = message;
      alertElement.classList.remove("hide");
      setTimeout(() => {
        alertElement.classList.add("hide");
      }, 1500);
    }
  };

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Formatting functions
  const formatInputCurrency = (value) => {
    if (isNaN(value) || value === undefined) return "0";
    return parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatResultCurrency = (value) => {
    if (isNaN(value) || value === undefined) return "$0";
    return "$" + parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const parseFormattedNumber = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
  };

  // Calculate appreciation
  const calculateAppreciation = () => {
    const homeValue = parseFormattedNumber(homeValueInput?.value || "0");
    const years = parseInt(yearsSelect?.value || "0");
    const growthRate = parseFloat(growthRateSelect?.value || "0");

    if (isNaN(homeValue) || isNaN(years) || isNaN(growthRate)) return;

    // Calculate future value using compound interest formula
    const futureValue = homeValue * Math.pow(1 + growthRate, years);
    const appreciation = futureValue - homeValue;

    // Store previous values to check if they've changed
    const prevFutureValue = futureValueResult?.textContent;
    const prevAppreciation = appreciationResult?.textContent;

    // Update results
    if (futureValueResult) {
      const newFutureValue = formatResultCurrency(futureValue);
      futureValueResult.textContent = newFutureValue;
      if (prevFutureValue !== newFutureValue) {
        showAlert("Results updated");
      }
    }
    if (appreciationResult) {
      appreciationResult.textContent = formatResultCurrency(appreciation);
    }
  };

  // Debounced calculation
  const debouncedCalculation = debounce(calculateAppreciation, 300);

  // Input formatting and event handlers
  const handleInputChange = (input) => {
    let value = parseFormattedNumber(input.value);
    input.value = isNaN(value) ? "" : formatInputCurrency(value);
    debouncedCalculation();
  };

  // Set up input listeners
  if (homeValueInput) {
    homeValueInput.addEventListener("input", () => {
      handleInputChange(homeValueInput);
    });
  }

  if (yearsSelect) {
    yearsSelect.addEventListener("change", debouncedCalculation);
    // Remove the disabled option to allow selection
    const disabledOption = yearsSelect.querySelector("option[disabled]");
    if (disabledOption) {
      disabledOption.removeAttribute("disabled");
    }
  }

  if (growthRateSelect) {
    growthRateSelect.addEventListener("change", debouncedCalculation);
    // Remove the disabled option to allow selection
    const disabledOption = growthRateSelect.querySelector("option[disabled]");
    if (disabledOption) {
      disabledOption.removeAttribute("disabled");
    }
  }

  // Prevent non-numeric input for the home value field
  if (homeValueInput) {
    homeValueInput.addEventListener("keypress", (event) => {
      if (!/[0-9.]/.test(event.key)) {
        event.preventDefault();
      }
    });
  }

  // Handle calculate button click
  if (calcButton) {
    calcButton.addEventListener("click", (e) => {
      e.preventDefault();
      calculateAppreciation();
    });
  }

  // Handle Enter key press
  document.querySelectorAll(".calc-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateAppreciation();
      }
    });
  });

  // Set default values with null checks
  if (homeValueInput) {
    homeValueInput.value = formatInputCurrency(500000);
  }
  if (yearsSelect) {
    yearsSelect.value = "15"; // Set default to 15 years
  }
  if (growthRateSelect) {
    growthRateSelect.value = ".035"; // Set default to average rate (3.5%)
  }

  // Calculate initial values and set initial calculation flag
  calculateAppreciation();
  isInitialCalculation = false;
};

// Auto-initialize if script is loaded after DOM content is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeHomeAppreciationCalculator);
} else {
  initializeHomeAppreciationCalculator();
}

export default initializeHomeAppreciationCalculator;
