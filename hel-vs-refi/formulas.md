# Mathematical Formulas Used in HEL vs Refi Calculator

## Loan-to-Value (LTV) Calculation

LTV = Loan Amount / Home Value

## Monthly Payment Calculation

Monthly Payment = P * r * (1 + r)^n / ((1 + r)^n - 1)

Where:

- P = Principal loan amount
- r = Monthly interest rate (Annual rate / 12)
- n = Total number of months (Term in years × 12)

## Remaining Balance Calculation

Remaining Balance = P * (1 + r)^t - M * ((1 + r)^t - 1) / r

Where:

- P = Original principal loan amount
- r = Monthly interest rate (Annual rate / 12)
- t = Number of months elapsed
- M = Monthly payment

## Home Equity Loan APR Calculation

Base APR = 9.17%

APR adjustments based on credit score:

- Excellent: Base APR - 0.83%
- Very Good: Base APR - 0.37%
- Good: Base APR (no adjustment)
- Average: Base APR + 0.83%
- Low: Base APR + 1.64%

## Cash-Out Refinance Rate Calculation

Cash-Out Refi Rate = (Current Mortgage Principal * Current Mortgage Rate + New Loan Amount * (Current Mortgage Rate + 0.5%)) / Total Loan Amount

## Home Equity Investment (HEI) Repayment Calculation

1. Calculate future home value:

   Future Home Value = Current Home Value * (1 + Annual Appreciation Rate)^Years

2. Calculate share of appreciation:

   Share of Appreciation = (Future Home Value - Appreciation Starting Amount) * Point Percentage

   Where:
   - Appreciation Starting Amount = Round down(Current Home Value * 0.73) to nearest $1000
   - Point Percentage = 2.2 * (Loan Amount / Current Home Value)

3. Calculate share-based repayment:

   Share-Based Repayment = Share of Appreciation + Loan Amount

4. Calculate cap-based repayment:

   Cap-Based Repayment = Loan Amount * (1 + 0.175 / 12)^(Years * 12)

5. Final HEI Repayment:

   HEI Repayment = min(Share-Based Repayment, Cap-Based Repayment)

## Total Cost Calculations

1. Cash-Out Refinance Total Cost:

   Total Cost = Monthly Payment * Term in Months

2. Home Equity Loan Total Cost:

   Total Cost = (Current Mortgage Payment * Remaining Mortgage Term in Months) + (HEL Monthly Payment * HEL Term in Months)

3. HEI Total Cost:

   Total Cost = HEI Repayment Amount

## Savings Calculation

Savings = Higher Cost Option - Lower Cost Option

## Edge Cases and Input Adjustments

1. Home Value:
   - Minimum value: $1
   - If input is below $1, it's set to $1

2. Current Mortgage Principal and Loan Amount:
   - Minimum value: $1
   - If input is below $1, it's set to $1

3. Remaining Mortgage Term:
   - Range: 1 to 30 years
   - If input is outside this range, it's clamped to the nearest valid value

4. Current Mortgage Rate:
   - Range: 1.5% to 15%
   - If input is outside this range, it's clamped to the nearest valid value

5. Loan-to-Value (LTV) Ratio:
   - Minimum LTV: 5% (0.05)
   - Maximum LTV: 85% (0.85)
   - If LTV is outside this range, the loan amount is adjusted to bring LTV within range

6. Maximum Loan Amount:
   - $500,000
   - If calculated loan amount exceeds this, it's capped at $500,000

7. Credit Score:
   - If credit score is "excellent", "very good", or "good", the loan is approved
   - Other credit scores result in loan denial

8. Arrow Key Adjustments:
   - Mortgage Rate: ±0.1% per arrow key press
   - Dollar Amounts: ±$1,000 per arrow key press (±$10,000 with Shift key)
   - Mortgage Term: ±1 year per arrow key press

These adjustments ensure that all inputs are within acceptable ranges and that the calculator produces meaningful results even when users provide edge case values.