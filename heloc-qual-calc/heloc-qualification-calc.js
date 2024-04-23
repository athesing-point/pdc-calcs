function calculateHELOCQualification() {
  let income = document.querySelector("[calc-input='monthly_income']").value;
  let creditScoreOption = document.querySelector("[calc-input='credit_score']").value;
  let homeValue = document.querySelector("[calc-input='home_value']").value;
  let mortgageOwed = document.querySelector("[calc-input='mortage_balance']").value;
  let expenses = document.querySelector("[calc-input='monthly_expenses']").value;

  console.log("Initial values:", { income, creditScoreOption, homeValue, mortgageOwed, expenses });

  income = parseInt(income, 10);
  homeValue = parseFloat(homeValue);
  mortgageOwed = parseFloat(mortgageOwed);

  console.log("Parsed values:", { income, homeValue, mortgageOwed });

  // Map credit score descriptions to numeric values
  let creditScore = mapCreditScore(creditScoreOption);
  console.log("Mapped credit score:", creditScore);

  let loanToValueRatio = (mortgageOwed / homeValue) * 100;
  let creditLine = 0;

  console.log("Loan to Value Ratio:", loanToValueRatio);

  if (creditScore >= 700 && loanToValueRatio <= 80) {
    // High credit score and low loan to value ratio
    creditLine = homeValue * 0.85 - mortgageOwed;
  } else if (creditScore >= 650 && loanToValueRatio <= 85) {
    // Moderate credit score and moderate loan to value ratio
    creditLine = homeValue * 0.8 - mortgageOwed;
  } else if (creditScore < 650 || loanToValueRatio > 85) {
    // Low credit score or high loan to value ratio
    console.log("Qualification status: Does not qualify");
    return {
      heloc: "Unfortunately, you do not qualify for a HELOC with our institution.",
      dti: `DTI: N/A`, // Assuming calculateDTI() returns a numeric DTI value
      ltv: `LTV: N/A`, // Assuming calculateLTV() returns a numeric LTV value
    };
  }

  console.log("Initial credit line:", creditLine);

  if (income < 50000) {
    // Adjusting credit line for lower income
    creditLine *= 0.9;
    console.log("Adjusted credit line for income < 50000:", creditLine);
  }

  return {
    heloc: `Congratulations! You qualify for a HELOC of up to $${creditLine.toFixed(2)}.`,
    dti: `DTI: ${calculateDTI().toFixed(2)}%`, // Assuming calculateDTI() returns a numeric DTI value
    ltv: `LTV: ${calculateLTV().toFixed(2)}%`, // Assuming calculateLTV() returns a numeric LTV value
  };
}
function mapCreditScore(option) {
  switch (option) {
    case "Poor":
      return 580; // Example value
    case "Needs Improvement":
      return 620; // Example value
    case "Fair":
      return 660; // Example value
    case "Good":
      return 700; // Example value
    case "Excellent":
      return 740; // Example value
    default:
      return 0; // Fallback if no option is selected
  }
}
function calculateDTI() {
  let income = parseInt(document.querySelector("[calc-input='monthly_income']").value, 10);
  let expenses = parseInt(document.querySelector("[calc-input='monthly_expenses']").value, 10);

  if (income === 0) return 0; // Prevent division by zero

  let dti = (expenses / income) * 100;
  return dti;
}
function displayResult() {
  const results = calculateHELOCQualification();
  document.querySelectorAll("[calc-result]").forEach((element) => {
    const resultType = element.getAttribute("calc-result");
    if (results[resultType]) {
      element.innerText = results[resultType];
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const calcButton = document.querySelector('[calc-input="calc_button"]');
  if (calcButton) {
    calcButton.addEventListener("click", displayResult);
  } else {
    console.error("Calculate button not found");
  }
});
document.querySelectorAll(".calc-input_field").forEach((input) => {
  input.addEventListener("input", () => {
    // Store the current cursor position
    const cursorPosition = input.selectionStart;

    // Remove existing commas for clean numeric input
    let numericValue = input.value.replace(/,/g, "");

    // Format with commas
    let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update the input value with formatted number
    input.value = formattedValue;

    // Restore the cursor position
    input.selectionStart = input.selectionEnd = cursorPosition + (formattedValue.length - numericValue.length);

    console.log("Formatted input value:", input.value);
  });
});
