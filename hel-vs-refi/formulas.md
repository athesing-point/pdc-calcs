# Home Equity Loan vs. Cash-Out Refinance Calculator: Mathematical Formulas

## 1. Core Formulas

### 1.1 Loan-to-Value (LTV) Ratio

LTV = (Current Mortgage Principal + Loan Amount) / Home Value

### 1.2 Monthly Payment Calculation

The monthly payment for a loan is calculated using the following formula:

$$
\text{Payment} = P \cdot \frac{r(1 + r)^n}{(1 + r)^n - 1}
$$

Where:

- $P$ = Principal loan amount
- $r$ = Monthly interest rate (annual rate ÷ 12)
- $n$ = Total number of monthly payments (loan term in years × 12)

### 1.3 Remaining Balance Calculation

The remaining balance after a certain period is calculated using:

$$
\text{Remaining Balance} = P(1 + r)^e - \text{Payment} \cdot \frac{(1 + r)^e - 1}{r}
$$

Where:

- $P$ = Original principal loan amount
- $r$ = Monthly interest rate
- $e$ = Number of payments made
- $\text{Payment}$ = Monthly payment (from formula 1.2)

### 1.4 Home Equity Loan APR Calculation

The APR for a Home Equity Loan is based on the credit score:

| Credit Score | APR Adjustment   |
| ------------ | ---------------- |
| Excellent    | Base APR - 0.83% |
| Very Good    | Base APR - 0.37% |
| Good         | Base APR         |
| Average      | Base APR + 0.83% |
| Low          | Base APR + 1.64% |

Base APR: 9.17%

### 1.5 Cash-Out Refinance Effective Rate

$$
\text{Effective Rate} = \frac{(P_c \cdot r_c) + (L \cdot (r_c + 0.005))}{P_c + L}
$$

Where:

- $P_c$ = Current mortgage principal
- $r_c$ = Current mortgage rate
- $L$ = Loan amount (cash-out amount)

### 1.6 Home Equity Investment (HEI) Repayment

$$
\text{HEI Repayment} = \min(\text{Cap-based Repayment}, \text{Share-based Repayment})
$$

Where:

- Cap-based Repayment = $L \cdot (1 + 0.175 / 12)^{(y \cdot 12)}$
- Share-based Repayment = $L + \text{Share of Appreciation}$
- Share of Appreciation = $(H_f - A_s) \cdot P_p$
- $H_f$ = Future Home Value = $H_c \cdot (1 + 0.035)^y$
- $A_s$ = Appreciation Starting Amount = $\text{round}((H_c \cdot 0.73) / 1000) \cdot 1000$
- $P_p$ = Point Percentage = $2.2 \cdot (L / H_c)$

Where:

- $L$ = Loan amount
- $y$ = Number of years
- $H_c$ = Current home value
- $H_f$ = Future home value

## 2. Calculation Steps

1. Calculate LTV and check if it's within approved range (5% - 85%).
2. Calculate current mortgage payment.
3. Calculate cash-out refinance effective rate.
4. Calculate home equity loan APR based on credit score.
5. Calculate monthly payments for cash-out refinance and home equity loan.
6. Calculate total costs for each option:
   - Cash-Out Refinance: Monthly payment × Term × 12
   - Home Equity Loan: (Current mortgage payment × Remaining term × 12) + (HEL monthly payment × HEL term × 12)
   - HEI: (Current mortgage payment × Remaining term × 12) + HEI Repayment
7. Calculate total interest costs for each option.
8. Compare total costs to determine the lowest cost option.

## 3. Constraints and Assumptions

- Maximum LTV: 85%
- Minimum LTV: 5%
- Minimum loan amount: $1
- Home appreciation rate for HEI calculations: 3.5% per year
- HEI cap rate: 17.5% per year
- HEI simple appreciation multiple: 2.2
