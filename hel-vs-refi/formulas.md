# Mathematical Formulas Used in HEL vs Refi Calculator

## Loan-to-Value (LTV) Calculation

LTV = Loan Amount / Home Value

## Monthly Payment Calculation

Monthly Payment = P _ r _ (1 + r)^n / ((1 + r)^n - 1)

Where:

- P = Principal loan amount
- r = Monthly interest rate (Annual rate / 12)
- n = Total number of months (Term in years \* 12)

## Remaining Balance Calculation

Remaining Balance = P _ (1 + r)^t - (M _ ((1 + r)^t - 1) / r)

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

```
Cash-Out Refi Rate = (Current Mortgage Principal * Current Mortgage Rate +
                      New Loan Amount * (Current Mortgage Rate + 0.5%))
                     / Total Loan Amount
```

## Home Equity Investment (HEI) Repayment Calculation

1. Calculate future home value:

   ```
   Future Home Value = Current Home Value * (1 + Annual Appreciation Rate)^Years
   ```

2. Calculate share of appreciation:

   ```
   Share of Appreciation = (Future Home Value - Appreciation Starting Amount) * Point Percentage
   ```

   Where:

   - Appreciation Starting Amount = Round down(Current Home Value \* 0.73) to nearest $1000
   - Point Percentage = 2.2 \* (Loan Amount / Current Home Value)

3. Calculate share-based repayment:

   ```
   Share-Based Repayment = Share of Appreciation + Loan Amount
   ```

4. Calculate cap-based repayment:

   ```
   Cap-Based Repayment = Loan Amount * (1 + 0.175 / 12)^(Years * 12)
   ```

5. Final HEI Repayment:
   ```
   HEI Repayment = Minimum(Share-Based Repayment, Cap-Based Repayment)
   ```

## Total Cost Calculations

1. Cash-Out Refinance Total Cost:

   ```
   Total Cost = Monthly Payment * Term in Months
   ```

2. Home Equity Loan Total Cost:

   ```
   Total Cost = (Current Mortgage Payment * Remaining Mortgage Term in Months) +
                (HEL Monthly Payment * HEL Term in Months)
   ```

3. HEI Total Cost:
   ```
   Total Cost = HEI Repayment Amount
   ```

## Savings Calculation

Savings = Higher Cost Option - Lower Cost Option
