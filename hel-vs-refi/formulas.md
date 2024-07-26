# Mathematical Formulas Used in HEL vs Refi Calculator

## Loan-to-Value (LTV) Calculation

$LTV = \frac{\text{Loan Amount}}{\text{Home Value}}$

## Monthly Payment Calculation

$\text{Monthly Payment} = P \times \frac{r(1 + r)^n}{(1 + r)^n - 1}$

Where:

- $P$ = Principal loan amount
- $r$ = Monthly interest rate (Annual rate / 12)
- $n$ = Total number of months (Term in years × 12)

## Remaining Balance Calculation

$\text{Remaining Balance} = P(1 + r)^t - \left(M \times \frac{(1 + r)^t - 1}{r}\right)$

Where:

- $P$ = Original principal loan amount
- $r$ = Monthly interest rate (Annual rate / 12)
- $t$ = Number of months elapsed
- $M$ = Monthly payment

## Home Equity Loan APR Calculation

Base APR = 9.17%

APR adjustments based on credit score:

- Excellent: Base APR - 0.83%
- Very Good: Base APR - 0.37%
- Good: Base APR (no adjustment)
- Average: Base APR + 0.83%
- Low: Base APR + 1.64%

## Cash-Out Refinance Rate Calculation

$$
\text{Cash-Out Refi Rate} = \frac{\text{Current Mortgage Principal} \times \text{Current Mortgage Rate} + \text{New Loan Amount} \times (\text{Current Mortgage Rate} + 0.5\%)}{\text{Total Loan Amount}}
$$

## Home Equity Investment (HEI) Repayment Calculation

1. Calculate future home value:

   $$
   \text{Future Home Value} = \text{Current Home Value} \times (1 + \text{Annual Appreciation Rate})^{\text{Years}}
   $$

2. Calculate share of appreciation:

   $$
   \text{Share of Appreciation} = (\text{Future Home Value} - \text{Appreciation Starting Amount}) \times \text{Point Percentage}
   $$

   Where:

   - Appreciation Starting Amount = Round down(Current Home Value × 0.73) to nearest $1000
   - Point Percentage = 2.2 × (Loan Amount / Current Home Value)

3. Calculate share-based repayment:

   $$
   \text{Share-Based Repayment} = \text{Share of Appreciation} + \text{Loan Amount}
   $$

4. Calculate cap-based repayment:

   $$
   \text{Cap-Based Repayment} = \text{Loan Amount} \times (1 + 0.175 / 12)^{(\text{Years} \times 12)}
   $$

5. Final HEI Repayment:
   $$
   \text{HEI Repayment} = \min(\text{Share-Based Repayment}, \text{Cap-Based Repayment})
   $$

## Total Cost Calculations

1. Cash-Out Refinance Total Cost:

   $$
   \text{Total Cost} = \text{Monthly Payment} \times \text{Term in Months}
   $$

2. Home Equity Loan Total Cost:

   $$
   \text{Total Cost} = (\text{Current Mortgage Payment} \times \text{Remaining Mortgage Term in Months}) + (\text{HEL Monthly Payment} \times \text{HEL Term in Months})
   $$

3. HEI Total Cost:
   $$
   \text{Total Cost} = \text{HEI Repayment Amount}
   $$

## Savings Calculation

$$
\text{Savings} = \text{Higher Cost Option} - \text{Lower Cost Option}
$$
