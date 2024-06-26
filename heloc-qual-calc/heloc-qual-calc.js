// Utility functions
function formatCurrency(value) {
  return `$${(value / 1000).toFixed(0)}k`;
}

function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

function calculateDTI(income, expenses) {
  if (income === 0) return 0; // Return 0 if income is 0 to avoid division by zero
  let dti = Math.round((expenses / income) * 100);
  return isNaN(dti) ? 0 : dti; // Check for NaN and default to 0 if true
}

function calculateLTV(mortgageOwed, homeValue) {
  if (homeValue === 0) return 0; // Return 0 if homeValue is 0 to avoid division by zero
  let ltv = Math.round((mortgageOwed / homeValue) * 100);
  return isNaN(ltv) ? 0 : ltv; // Return calculated LTV, ensure it doesn't return NaN
}

function calculateAvailableEquity(homeValue, mortgageOwed) {
  // Calculate available equity by subtracting the mortgage owed from the home value
  return homeValue - mortgageOwed;
}

function calculateCreditLine(availableEquity, creditScoreOption) {
  // Determine credit line based on credit score using a switch statement
  switch (creditScoreOption.trim().toLowerCase()) {
    case "excellent":
      return Math.floor(availableEquity * 0.6);
    case "very good":
      return Math.floor(availableEquity * 0.55);
    case "good":
      return Math.floor(availableEquity * 0.5);
    default:
      return 0;
  }
}

function calculateBorrowAmount(creditLine) {
  // Calculate the final borrow amount, rounding down to the nearest thousand
  let borrowAmount = Math.floor(creditLine / 1000) * 1000;
  // Cap the borrow amount at $500,000 and set a minimum of $10,000
  return Math.min(Math.max(borrowAmount, 10000), 500000);
}

// Main function
function calculateHELOCQualification() {
  // Retrieve and clean input values from the form
  const income = parseInt(document.querySelector("[calc-input='monthly_income']").value.replace(/,/g, ""), 10);
  const creditScoreOption = document.querySelector("[calc-input='credit_score']").value;
  const homeValue = parseFloat(document.querySelector("[calc-input='home_value']").value.replace(/,/g, ""));
  const mortgageOwed = parseFloat(document.querySelector("[calc-input='mortage_balance']").value.replace(/,/g, ""));
  const expenses = parseInt(document.querySelector("[calc-input='monthly_expenses']").value.replace(/,/g, ""), 10);

  // Check if required fields are filled
  if (!homeValue || !mortgageOwed || !creditScoreOption) {
    // console.log("Required fields are missing.");
    return; // Exit the function if any required field is not filled
  }

  // Log initial values for debugging
  // console.log("Initial Values:", { income, creditScoreOption, homeValue, mortgageOwed, expenses });

  // Calculate derived values
  const dti = calculateDTI(income, expenses);
  const ltv = calculateLTV(mortgageOwed, homeValue);
  const availableEquity = calculateAvailableEquity(homeValue, mortgageOwed);
  const creditLine = calculateCreditLine(availableEquity, creditScoreOption);
  const borrowAmount = calculateBorrowAmount(creditLine);

  // Log calculated values for debugging
  // console.log("Calculated DTI:", dti);
  // console.log("Calculated LTV:", ltv);
  // console.log("Available Equity:", availableEquity);
  // console.log("Credit Line based on Credit Score:", creditLine);
  // console.log("Final Borrow Amount:", borrowAmount);

  // Determine approval status
  let isApproved = true;
  const texturedCard = document.querySelector("#approved");
  const helocNA = document.querySelector(".calc-card-na");
  const naGraphic = document.getElementById("na-graphic");

  // Reset display properties to default each time calculation is performed
  if (texturedCard) texturedCard.style.display = "flex";
  if (helocNA) helocNA.style.display = "none";
  if (naGraphic) naGraphic.style.display = "none";

  // Add condition for negative available equity
  if (availableEquity < 0) {
    if (texturedCard) texturedCard.style.display = "none";
    if (helocNA) helocNA.style.display = "flex";
    isApproved = false;
  }

  switch (creditScoreOption.trim().toLowerCase()) {
    case "average":
    case "low":
    case "very low":
      if (texturedCard) texturedCard.style.display = "none";
      if (helocNA) helocNA.style.display = "flex";
      isApproved = false;
      break;
    case "excellent":
    case "very good":
    case "good":
      // These are valid options, do nothing special
      break;
    default:
      // console.log("Invalid credit score.");
      isApproved = false;
  }

  // Add condition for DTI greater than 40%
  if (dti > 40) {
    if (texturedCard) texturedCard.style.display = "none";
    if (helocNA) helocNA.style.display = "flex";
    isApproved = false;
  }

  // Add condition for LTV greater than 85%
  if (ltv > 85) {
    if (texturedCard) texturedCard.style.display = "none";
    if (helocNA) helocNA.style.display = "flex";
    isApproved = false;
  }

  // Add condition for borrow amount being 0 or negative
  if (borrowAmount <= 0) {
    if (texturedCard) texturedCard.style.display = "none";
    if (helocNA) helocNA.style.display = "flex";
    isApproved = false;
  }

  // Return the calculated results
  return {
    borrow: formatCurrency(borrowAmount),
    dti: formatPercentage(dti),
    ltv: formatPercentage(ltv),
    approved: isApproved,
  };
}

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Set up event listener for the calculate button
window.addEventListener("load", () => {
  calcButton = document.querySelector('[calc-input="calc_button"]');
  if (calcButton) {
    console.log("Calc button found, adding event listener."); // Debugging log
    calcButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default link behavior
      console.log("Calc button clicked."); // Debugging log
      const results = calculateHELOCQualification();
      console.log(results); // Debugging log

      // Display each result in the corresponding HTML element
      document.querySelectorAll("[calc-result]").forEach((element) => {
        const resultType = element.getAttribute("calc-result");
        console.log(resultType, results[resultType]); // Debugging log
        if (results[resultType]) {
          element.innerText = results[resultType];
        }
      });
    });
  } else {
    console.log("Calc button not found."); // Debugging log
  }
});

// Format input fields with commas
document.querySelectorAll(".calc-input[type='text']").forEach((input) => {
  input.addEventListener(
    "input",
    debounce(() => {
      // Remove any existing commas and non-numeric characters except for numbers
      let numericValue = input.value.replace(/[^0-9]/g, "");
      // Insert commas for thousands, millions, etc.
      let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // Update the input field with the formatted value
      input.value = formattedValue;
    }, 500)
  );
});

// Add event listener to trigger calculation on Enter key press
document.querySelectorAll(".calc-input").forEach((input) => {
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action to avoid submitting the form
      const results = calculateHELOCQualification();
      document.querySelectorAll("[calc-result]").forEach((element) => {
        const resultType = element.getAttribute("calc-result");
        if (results[resultType]) {
          element.innerText = results[resultType];
        }
      });
    }
  });
});

// Add event listener to trigger calculation on input change with debounce
document.querySelectorAll(".calc-input").forEach((input) => {
  input.addEventListener(
    "input",
    debounce(() => {
      const results = calculateHELOCQualification();
      document.querySelectorAll("[calc-result]").forEach((element) => {
        const resultType = element.getAttribute("calc-result");
        if (results[resultType]) {
          element.innerText = results[resultType];
        }
      });
    }, 500)
  );
});
