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
  if (homeValue === 0 || mortgageOwed > homeValue) return 0; // Return 0 if homeValue is 0 or mortgageOwed exceeds homeValue
  let ltv = Math.round((mortgageOwed / homeValue) * 100);
  return isNaN(ltv) ? 0 : ltv; // Check for NaN and default to 0 if true
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
    case "good":
      return Math.floor(availableEquity * 0.55);
    case "fair":
      return Math.floor(availableEquity * 0.5);
    default:
      return 0;
  }
}

function calculateBorrowAmount(creditLine) {
  // Calculate the final borrow amount, rounding down to the nearest thousand
  let borrowAmount = Math.floor(creditLine / 1000) * 1000;
  // Cap the borrow amount at $500,000
  return Math.min(borrowAmount, 500000);
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
    case "improving":
    case "needs improvement":
    case "poor":
      if (texturedCard) texturedCard.style.display = "none";
      if (helocNA) helocNA.style.display = "flex";
      isApproved = false;
      break;
    case "excellent":
    case "good":
    case "fair":
      // These are valid options, do nothing special
      break;
    default:
      // console.log("Invalid credit score.");
      isApproved = false;
  }

  // Add condition for DTI greater than 45%
  if (dti > 45) {
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

// Set up event listener for the calculate button
document.addEventListener("DOMContentLoaded", () => {
  const calcButton = document.querySelector('[calc-input="calc_button"]');
  if (calcButton) {
    calcButton.addEventListener("click", () => {
      const results = calculateHELOCQualification();
      // console.log(results);

      // Display each result in the corresponding HTML element
      document.querySelectorAll("[calc-result]").forEach((element) => {
        const resultType = element.getAttribute("calc-result");
        // console.log(resultType, results[resultType]);
        if (results[resultType]) {
          element.innerText = results[resultType];
        }
      });

      // // Find the element with 'calc-card' and 'textured-card' and add the 'calc-result' class
      // const targetElement = document.querySelector("#approved");
      // if (targetElement) {
      //   targetElement.classList.add("calc-result");
      //   // console.log("Class 'calc-result' added to the element.");
      // }
    });
  }
});

// Format input fields with commas
document.querySelectorAll(".calc-input[type='text']").forEach((input) => {
  input.addEventListener("input", () => {
    // Remove any existing commas and non-numeric characters except for numbers
    let numericValue = input.value.replace(/[^0-9]/g, "");
    // Insert commas for thousands, millions, etc.
    let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Update the input field with the formatted value
    input.value = formattedValue;
  });
});
