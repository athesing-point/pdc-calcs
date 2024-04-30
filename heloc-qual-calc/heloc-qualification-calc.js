//Public
function calculateHELOCQualification() {
  // Retrieve and clean input values from the form
  let income = document.querySelector("[calc-input='monthly_income']").value.replace(/,/g, "");
  let creditScoreOption = document.querySelector("[calc-input='credit_score']").value;
  let homeValue = document.querySelector("[calc-input='home_value']").value.replace(/,/g, "");
  let mortgageOwed = document.querySelector("[calc-input='mortage_balance']").value.replace(/,/g, "");
  let expenses = document.querySelector("[calc-input='monthly_expenses']").value.replace(/,/g, "");

  // Log initial values for debugging
  console.log("Initial Values:", { income, creditScoreOption, homeValue, mortgageOwed, expenses });

  // Convert string input values to appropriate numerical types
  income = parseInt(income, 10);
  homeValue = parseFloat(homeValue);
  mortgageOwed = parseFloat(mortgageOwed);
  expenses = parseInt(expenses, 10);

  // Log parsed numerical values for debugging
  console.log("Parsed Values:", { income, homeValue, mortgageOwed, expenses });

  // Calculate Debt-to-Income Ratio
  let dti = calculateDTI(income, expenses);
  // Calculate Loan-to-Value Ratio and round it to the nearest whole number
  let ltv = Math.round((mortgageOwed / homeValue) * 100);

  // Log calculated ratios for debugging
  console.log("Calculated DTI:", dti);
  console.log("Calculated LTV:", ltv);

  // Calculate available equity by subtracting the mortgage owed from the home value
  let availableEquity = homeValue - mortgageOwed;
  console.log("Available Equity:", availableEquity);

  let creditLine = 0;
  // Normalize credit score input to lower case for case-insensitive comparison
  creditScoreOption = creditScoreOption.trim().toLowerCase();
  // Determine credit line based on credit score using a switch statement
  let texturedCard = document.querySelector(".textured-card");
  let helocNA = document.querySelector(".heloc-na");

  // Reset display properties to default each time calculation is performed
  if (texturedCard) texturedCard.style.display = "block"; // Assuming default is 'block'
  if (helocNA) helocNA.style.display = "none"; // Assuming default is 'none'

  let isApproved = true; // Initialize the flag as true, assuming approval unless conditions fail
  let showExitPopup = false; // Flag to control the exit popup display

  switch (creditScoreOption) {
    case "excellent":
      creditLine = availableEquity * 0.6;
      break;
    case "good":
      creditLine = availableEquity * 0.55;
      break;
    case "fair":
      creditLine = availableEquity * 0.5;
      break;
    case "improving":
    case "needs improvement":
    case "poor":
      if (texturedCard) texturedCard.style.display = "none";
      if (helocNA) helocNA.style.display = "flex";
      isApproved = false; // Set flag to false as the user is not approved
      showExitPopup = true; // Set the exit popup flag to true
      return {
        heloc: "Not applicable",
        dti: Math.round(dti) + "%",
        ltv: Math.round(ltv) + "%",
        approved: isApproved,
        showExitPopup: showExitPopup, // Include this flag in the return object
      };
    default:
      console.log("Invalid credit score.");
      isApproved = false; // Set flag to false due to invalid input
      return {
        heloc: "Invalid credit score provided.",
        dti: Math.round(dti) + "%",
        ltv: Math.round(ltv) + "%",
        approved: isApproved, // Include the approval status in the return object
      };
  }

  // Log the determined credit line for debugging
  console.log("Credit Line based on Credit Score:", creditLine);

  // Calculate the final borrow amount, rounding down to the nearest thousand
  let borrowAmount = Math.floor(creditLine / 1000) * 1000;
  console.log("Final Borrow Amount:", borrowAmount);

  // Cap the borrow amount at $500,000
  borrowAmount = Math.min(borrowAmount, 500000);
  console.log("Capped Borrow Amount:", borrowAmount);
  // Return the calculated borrow amount, DTI, and LTV as formatted strings
  return {
    borrow: `$${borrowAmount / 1000}k`,
    dti: Math.round(dti) + "%",
    ltv: Math.round(ltv) + "%",
    approved: isApproved, // Include the approval status in the return object
  };
}

function mapCreditScore(option) {
  // Map human-readable credit score options to numerical values
  switch (option) {
    case "Poor":
      return 500;
    case "Needs Improvement":
      return 549;
    case "Improving":
      return 599;
    case "Fair":
      return 679;
    case "Good":
      return 739;
    case "Excellent":
      return 800;
    default:
      return 0;
  }
}
function calculateDTI(income, expenses) {
  // Return 0 if income is 0 to avoid division by zero
  if (income === 0) return 0;
  // Calculate and return Debt-to-Income ratio as a percentage
  return Math.round((expenses / income) * 100);
}

function displayResult() {
  // Calculate HELOC qualification results and log them
  const results = calculateHELOCQualification();
  console.log(results); // Log the results to see what is being returned from the calculation.

  // Display each result in the corresponding HTML element
  document.querySelectorAll("[calc-result]").forEach((element) => {
    const resultType = element.getAttribute("calc-result");
    console.log(resultType, results[resultType]); // Log each result type and corresponding value.
    if (results[resultType]) {
      element.innerText = results[resultType];
    }
  });

  // Find the element with 'calc-card' and 'textured-card' and add the 'calc-result' class
  const targetElement = document.querySelector(".calc-card.textured-card");
  if (targetElement) {
    targetElement.classList.add("calc-result"); // Add 'calc-result' class to the element
    console.log("Class 'calc-result' added to the element.");
  }

  // Find the element with ID 'update-color' and change its text color to '#01679A'
  const colorElement = document.getElementById("update-color");
  if (colorElement) {
    colorElement.style.color = "#01679A"; // Set the text color
    console.log("Color set to #01679A for element with ID 'update-color'.");
  } else {
    console.log("Element with ID 'update-color' not found.");
  }

  if (results.showExitPopup) {
    document.addEventListener("mousemove", function (event) {
      if (event.clientY <= 50) {
        // Check if the mouse is within 50 pixels of the top of the page
        document.querySelector(".section-exit-popup").style.display = "flex"; // Display the exit popup
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Set up event listener for the calculate button
  const calcButton = document.querySelector('[calc-input="calc_button"]');
  if (calcButton) {
    calcButton.addEventListener("click", displayResult);
  }
});

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
