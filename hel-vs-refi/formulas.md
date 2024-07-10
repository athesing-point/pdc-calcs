# Home Equity Loan vs. Cash-Out Refinance Calculator Explanation

## Introduction

This document explains the mathematical formulas used in the Home Equity Loan vs. Cash-Out Refinance Calculator and provides example calculations for different scenarios.

## Mathematical Formulas

### Monthly Payment Calculation

The monthly payment for a loan is calculated using the formula:
\[ \text{Payment} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1} \]
where:

- \( P \) is the principal loan amount.
- \( r \) is the monthly interest rate (annual rate divided by 12).
- \( n \) is the number of monthly payments (loan term in years multiplied by 12).

### Remaining Balance Calculation

The remaining balance of a loan after a certain period is calculated using the formula:
\[ \text{Remaining Balance} = P \cdot (1 + r)^e - \frac{\text{Payment} \cdot ((1 + r)^e - 1)}{r} \]
where:

- \( P \) is the principal loan amount.
- \( r \) is the monthly interest rate.
- \( e \) is the number of elapsed monthly payments.
- \(\text{Payment}\) is the monthly payment calculated using the formula above.

### Home Equity Loan APR Calculation

The APR for a Home Equity Loan is determined based on the credit score:

- Excellent: Base APR - 0.83%
- Very Good: Base APR - 0.37%
- Good: Base APR
- Average: Base APR + 0.83%
- Low: Base APR + 1.64%

## Example Calculations

### Scenario 1: Current Mortgage

- Principal: $275,000
- Annual Interest Rate: 7.75%
- Term: 20 years

#### Monthly Payment Calculation

\[ P = 275,000 \]
\[ r = \frac{7.75}{100 \cdot 12} = 0.006458 \]
\[ n = 20 \cdot 12 = 240 \]

\[ \text{Payment} = \frac{275,000 \cdot 0.006458 \cdot (1 + 0.006458)^{240}}{(1 + 0.006458)^{240} - 1} \approx 2,276.99 \]

### Scenario 2: Cash-Out Refinance

- Principal: $375,000 (Current Principal + Loan Amount)
- Annual Interest Rate: 7.75%
- Term: 30 years

#### Monthly Payment Calculation

\[ P = 375,000 \]
\[ r = \frac{7.75}{100 \cdot 12} = 0.006458 \]
\[ n = 30 \cdot 12 = 360 \]

\[ \text{Payment} = \frac{375,000 \cdot 0.006458 \cdot (1 + 0.006458)^{360}}{(1 + 0.006458)^{360} - 1} \approx 2,695.12 \]

### Scenario 3: Home Equity Loan

- Principal: $100,000
- Annual Interest Rate: 9.17% (for "Good" credit score)
- Term: 15 years

#### Monthly Payment Calculation

\[ P = 100,000 \]
\[ r = \frac{9.17}{100 \cdot 12} = 0.007642 \]
\[ n = 15 \cdot 12 = 180 \]

\[ \text{Payment} = \frac{100,000 \cdot 0.007642 \cdot (1 + 0.007642)^{180}}{(1 + 0.007642)^{180} - 1} \approx 1,028.61 \]

### Remaining Balance Calculation Example

- Principal: $275,000
- Annual Interest Rate: 7.75%
- Total Term: 20 years
- Elapsed Term: 5 years

#### Remaining Balance Calculation

\[ P = 275,000 \]
\[ r = \frac{7.75}{100 \cdot 12} = 0.006458 \]
\[ n = 20 \cdot 12 = 240 \]
\[ e = 5 \cdot 12 = 60 \]

First, calculate the monthly payment:
\[ \text{Payment} = \frac{275,000 \cdot 0.006458 \cdot (1 + 0.006458)^{240}}{(1 + 0.006458)^{240} - 1} \approx 2,276.99 \]

Then, calculate the remaining balance:
\[ \text{Remaining Balance} = 275,000 \cdot (1 + 0.006458)^{60} - \frac{2,276.99 \cdot ((1 + 0.006458)^{60} - 1)}{0.006458} \approx 241,234.56 \]

## Disclaimers

- The calculations provided are for illustrative purposes only and may not reflect the actual terms of your loan.
- The APR rates used in the examples are based on average rates and may vary depending on individual circumstances and market conditions.
- Always consult with a financial advisor or loan officer to get accurate and personalized loan information.

## Conclusion

This document provides the mathematical background and example calculations for the Home Equity Loan vs. Cash-Out Refinance Calculator. By understanding these formulas, you can better comprehend how the calculator determines the monthly payments, remaining balances, and overall costs for different loan scenarios.
