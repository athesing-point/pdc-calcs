function calculateHELOCQualification() {
  let income = document.querySelector("[calc-input='monthly_income']").value;
  let creditScoreOption = document.querySelector("[calc-input='credit_score']").value;
  let homeValue = document.querySelector("[calc-input='home_value']").value;
  let mortgageOwed = document.querySelector("[calc-input='mortage_balance']").value;
  let expenses = document.querySelector("[calc-input='monthly_expenses']").value;

  income = parseInt(income, 10);
  homeValue = parseFloat(homeValue);
  mortgageOwed = parseFloat(mortgageOwed);
  expenses = parseInt(expenses, 10);

  let dti = calculateDTI(income, expenses);
  let ltv = Math.round((mortgageOwed / homeValue) * 100);

  let creditScore = mapCreditScore(creditScoreOption);
  let creditLine = 0;

  if (creditScore >= 700 && ltv <= 80) {
    creditLine = homeValue * 0.85 - mortgageOwed;
  } else if (creditScore >= 650 && ltv <= 85) {
    creditLine = homeValue * 0.8 - mortgageOwed;
  } else if (creditScore < 650 || ltv > 85) {
    alert("Sorry, you do not qualify.");
    return {
      heloc: "Unfortunately, you do not qualify for a HELOC with our institution.",
      dti: Math.round(dti) + "%",
      ltv: Math.round(ltv) + "%",
    };
  }

  if (income < 50000) {
    creditLine *= 0.9;
  }

  let borrowAmount = Math.floor((homeValue * (ltv / 100) * 0.85) / 1000) * 1000;

  return {
    heloc: `You qualify for a HELOC of up to $${Math.round(creditLine)}.`,
    dti: Math.round(dti) + "%",
    ltv: Math.round(ltv) + "%",
    borrow: `$${borrowAmount}k`,
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
