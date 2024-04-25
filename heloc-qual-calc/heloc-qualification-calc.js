function calculateHELOCQualification() {
  let income = document.querySelector("[calc-input='monthly_income']").value.replace(/,/g, "");
  let creditScoreOption = document.querySelector("[calc-input='credit_score']").value;
  let homeValue = document.querySelector("[calc-input='home_value']").value.replace(/,/g, "");
  let mortgageOwed = document.querySelector("[calc-input='mortage_balance']").value.replace(/,/g, "");
  let expenses = document.querySelector("[calc-input='monthly_expenses']").value.replace(/,/g, "");

  console.log("Initial Values:", { income, creditScoreOption, homeValue, mortgageOwed, expenses });

  income = parseInt(income, 10);
  homeValue = parseFloat(homeValue);
  mortgageOwed = parseFloat(mortgageOwed);
  expenses = parseInt(expenses, 10);

  console.log("Parsed Values:", { income, homeValue, mortgageOwed, expenses });

  let dti = calculateDTI(income, expenses);
  let ltv = Math.round((mortgageOwed / homeValue) * 100);

  console.log("Calculated DTI:", dti);
  console.log("Calculated LTV:", ltv);

  let availableEquity = homeValue - mortgageOwed;
  console.log("Available Equity:", availableEquity);

  let creditLine = 0;
  creditScoreOption = creditScoreOption.trim().toLowerCase();
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
    case "needs improvement":
      creditLine = availableEquity * 0.45;
      break;
    case "poor":
      creditLine = availableEquity * 0.4;
      break;
    default:
      alert("Invalid credit score.");
      return {
        heloc: "Invalid credit score provided.",
        dti: Math.round(dti) + "%",
        ltv: Math.round(ltv) + "%",
      };
  }

  console.log("Credit Line based on Credit Score:", creditLine);

  let borrowAmount = Math.floor(creditLine / 1000) * 1000;
  console.log("Final Borrow Amount:", borrowAmount);

  return {
    borrow: `$${borrowAmount / 1000}k`,
    dti: Math.round(dti) + "%",
    ltv: Math.round(ltv) + "%",
  };
}

function mapCreditScore(option) {
  switch (option) {
    case "Poor":
      return 580;
    case "Needs Improvement":
      return 620;
    case "Fair":
      return 660;
    case "Good":
      return 700;
    case "Excellent":
      return 740;
    default:
      return 0;
  }
}
function calculateDTI(income, expenses) {
  if (income === 0) return 0;
  return Math.round((expenses / income) * 100);
}
function displayResult() {
  const results = calculateHELOCQualification();
  console.log(results); // Log the results to see what is being returned from the calculation.
  document.querySelectorAll("[calc-result]").forEach((element) => {
    const resultType = element.getAttribute("calc-result");
    console.log(resultType, results[resultType]); // Log each result type and corresponding value.
    if (results[resultType]) {
      element.innerText = results[resultType];
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const calcButton = document.querySelector('[calc-input="calc_button"]');
  if (calcButton) {
    calcButton.addEventListener("click", displayResult);
  }
});
document.querySelectorAll(".calc-input_field[type='text']").forEach((input) => {
  input.addEventListener("input", () => {
    const cursorPosition = input.selectionStart;
    let numericValue = input.value.replace(/,/g, "");
    let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    input.value = formattedValue;
    input.selectionStart = input.selectionEnd = cursorPosition + (formattedValue.length - numericValue.length);
  });
});