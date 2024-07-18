# Home Equity Loan vs. Cash-Out Refinance Calculator: Mathematical Formulas and Examples

## 1. Core Formulas

### 1.1 Monthly Payment Calculation

The monthly payment for a loan is calculated using the following formula:

$$
\text{Payment} = P \cdot \frac{r(1 + r)^n}{(1 + r)^n - 1}
$$

Where:

- $P$ = Principal loan amount
- $r$ = Monthly interest rate (annual rate ÷ 12)
- $n$ = Total number of monthly payments (loan term in years × 12)

### 1.2 Remaining Balance Calculation

The remaining balance after a certain period is calculated using:

$$
\text{Remaining Balance} = P(1 + r)^e - \text{Payment} \cdot \frac{(1 + r)^e - 1}{r}
$$

Where:

- $P$ = Original principal loan amount
- $r$ = Monthly interest rate
- $e$ = Number of payments made
- $\text{Payment}$ = Monthly payment (from formula 1.1)

### 1.3 Home Equity Loan APR Calculation

The APR for a Home Equity Loan is based on the credit score:

| Credit Score | APR Adjustment   |
| ------------ | ---------------- |
| Excellent    | Base APR - 0.83% |
| Very Good    | Base APR - 0.37% |
| Good         | Base APR         |
| Average      | Base APR + 0.83% |
| Low          | Base APR + 1.64% |

Base APR: 9.17% (national average for "good" credit)

## 2. Example Calculations

### 2.1 Current Mortgage

**Inputs:**

- Principal: $275,000
- Annual Interest Rate: 7.75%
- Term: 20 years

**Calculation:**

$$
\begin{aligned}
P &= 275,000 \\
r &= 0.0775 \div 12 \approx 0.006458 \\
n &= 20 \times 12 = 240 \\
\text{Payment} &= 275,000 \cdot \frac{0.006458(1 + 0.006458)^{240}}{(1 + 0.006458)^{240} - 1} \\
&\approx \$2,276.99
\end{aligned}
$$

### 2.2 Cash-Out Refinance

**Inputs:**

- Principal: $375,000 (Current Mortgage + $100,000 cash-out)
- Annual Interest Rate: 7.75%
- Term: 30 years

**Calculation:**

$$
\begin{aligned}
P &= 375,000 \\
r &= 0.0775 \div 12 \approx 0.006458 \\
n &= 30 \times 12 = 360 \\
\text{Payment} &= 375,000 \cdot \frac{0.006458(1 + 0.006458)^{360}}{(1 + 0.006458)^{360} - 1} \\
&\approx \$2,695.12
\end{aligned}
$$

### 2.3 Home Equity Loan

**Inputs:**

- Principal: $100,000
- Annual Interest Rate: 9.17% (for "Good" credit score)
- Term: 15 years

**Calculation:**

$$
\begin{aligned}
P &= 100,000 \\
r &= 0.0917 \div 12 \approx 0.007642 \\
n &= 15 \times 12 = 180 \\
\text{Payment} &= 100,000 \cdot \frac{0.007642(1 + 0.007642)^{180}}{(1 + 0.007642)^{180} - 1} \\
&\approx \$1,028.61
\end{aligned}
$$

### 2.4 Remaining Balance (Current Mortgage after 5 years)

**Inputs:**

- Original Principal: $275,000
- Annual Interest Rate: 7.75%
- Original Term: 20 years
- Elapsed Time: 5 years

**Calculation:**

$$
\begin{aligned}
P &= 275,000 \\
r &= 0.0775 \div 12 \approx 0.006458 \\
e &= 5 \times 12 = 60 \\
\text{Payment} &\approx 2,276.99 \text{ (from 2.1)} \\
\text{Remaining Balance} &= 275,000(1 + 0.006458)^{60} - 2,276.99 \cdot \frac{(1 + 0.006458)^{60} - 1}{0.006458} \\
&\approx \$241,234.56
\end{aligned}
$$

## 3. Comparison of Options

### 3.1 Total Costs

1. **Current Mortgage:**

   - Monthly Payment: $2,276.99
   - Total Payments: $2,276.99 × 240 = $546,477.60
   - Total Interest: $546,477.60 - $275,000 = $271,477.60

2. **Cash-Out Refinance:**

   - Monthly Payment: $2,695.12
   - Total Payments: $2,695.12 × 360 = $970,243.20
   - Total Interest: $970,243.20 - $375,000 = $595,243.20

3. **Home Equity Loan + Current Mortgage:**
   - Combined Monthly Payment: $2,276.99 + $1,028.61 = $3,305.60
   - Total Payments: ($2,276.99 × 240) + ($1,028.61 × 180) = $731,827.60
   - Total Interest: $731,827.60 - $375,000 = $356,827.60

### 3.2 Savings Comparison

Savings with Home Equity Loan vs. Cash-Out Refinance:

$$
\begin{aligned}
\text{Savings} &= \text{Total Cost (Cash-Out Refi)} - \text{Total Cost (HEL + Current Mortgage)} \\
&= \$970,243.20 - \$731,827.60 \\
&= \$238,415.60
\end{aligned}
$$

Savings Percentage:

$$
\text{Savings %} = \frac{\$238,415.60}{\$970,243.20} \times 100\% \approx 24.57\%
$$

## 5. Disclaimers

- These calculations are for illustrative purposes only and may not reflect actual loan terms.
- APR rates used are based on averages and may vary depending on individual circumstances and market conditions.
- This analysis does not account for potential changes in interest rates, property values, or other economic factors over time.
- Consult with a qualified financial advisor or loan officer for personalized advice and accurate loan information.
