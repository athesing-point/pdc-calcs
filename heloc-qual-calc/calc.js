function calculateHELOCQualification() {
  let income = document.querySelector("[data-income]").value;
  let creditScore = document.querySelector("[data-credit-score]").value;
  let homeValue = document.querySelector("[data-home-value]").value;
  let mortgageOwed = document.querySelector("[data-mortgage-owed]").value;

  income = parseInt(income, 10);
  creditScore = parseInt(creditScore, 10);
  homeValue = parseFloat(homeValue);
  mortgageOwed = parseFloat(mortgageOwed);

  let loanToValueRatio = (mortgageOwed / homeValue) * 100;
  let creditLine = 0;

  if (creditScore >= 700 && loanToValueRatio <= 80) {
    // High credit score and low loan to value ratio
    creditLine = homeValue * 0.85 - mortgageOwed;
  } else if (creditScore >= 650 && loanToValueRatio <= 85) {
    // Moderate credit score and moderate loan to value ratio
    creditLine = homeValue * 0.8 - mortgageOwed;
  } else if (creditScore < 650 || loanToValueRatio > 85) {
    // Low credit score or high loan to value ratio
    return "Unfortunately, you do not qualify for a HELOC with our institution.";
  }

  if (income < 50000) {
    // Adjusting credit line for lower income
    creditLine *= 0.9;
  }

  return `Congratulations! You qualify for a HELOC of up to $${creditLine.toFixed(2)}.`;
}
