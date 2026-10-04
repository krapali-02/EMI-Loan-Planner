# Module 01 Plan: EMI Calculator & Amortization Schedule (FR-01 & FR-02)

> **SRS References:** FR-01 (EMI Calculator), FR-02 (Amortization Table), UC-01, UC-02  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
The EMI Calculator is the core baseline module of the application. It accepts the principal loan amount, annual interest rate, and tenure (in months or years), calculates the exact monthly EMI using standard reducing-balance math, and generates a comprehensive period-by-period amortization table.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/emi.ts` | Type interfaces for input parameters, summary results, and amortization rows |
| **Calculation Engine** | `src/lib/calculations/emi.ts` | Pure reducing-balance EMI formula and summary aggregator |
| **Amortization Engine**| `src/lib/calculations/amortization.ts`| Period schedule generator (monthly and yearly aggregated) |
| **Calculator UI** | `src/components/calculators/EmiCalculator.tsx` | Interactive form with synchronized sliders and direct number inputs |
| **Amortization UI** | `src/components/displays/AmortizationTable.tsx` | Paginated schedule with monthly/yearly view toggle and export preview |
| **Page Route** | `src/app/page.tsx` | Main landing page hosting the standard EMI calculator |

---

## 3. Mathematical Formula & Algorithms

### 3.1 Reducing-Balance Monthly EMI Formula
$$\text{EMI} = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$$

- $P$: Principal loan amount ($> 0$)
- $r$: Monthly interest rate $= \frac{\text{Annual Interest Rate}}{12 \times 100}$
- $n$: Number of monthly installments $= \text{Tenure in Years} \times 12$ (or months directly)
- **Zero-Interest Edge Case:** If $r = 0$, then $\text{EMI} = \frac{P}{n}$

### 3.2 Period Amortization (Month $t \in [1, n]$)
- $\text{Opening Balance}_1 = P$
- $\text{Interest}_t = \text{Opening Balance}_t \times r$
- $\text{Principal}_t = \text{EMI} - \text{Interest}_t$
- $\text{Closing Balance}_t = \text{Opening Balance}_t - \text{Principal}_t$
- $\text{Opening Balance}_{t+1} = \text{Closing Balance}_t$
- **Rounding Adjustment:** For the final payment ($t = n$), $\text{Principal}_n = \text{Opening Balance}_n$ and $\text{Closing Balance}_n = 0.00$.

---

## 4. TypeScript Type Definitions (`src/types/emi.ts`)

```typescript
export interface EmiInputParams {
  principal: number;        // Loan amount (e.g. 1,000,000)
  annualRate: number;       // Annual interest rate percentage (e.g. 8.5)
  tenureValue: number;      // Tenure number (e.g. 5)
  tenureUnit: 'years' | 'months'; // Tenure unit selector
}

export interface EmiSummaryResult {
  monthlyEmi: number;
  principal: number;
  totalInterest: number;
  totalPayment: number;
  tenureMonths: number;
  interestToPrincipalRatio: number; // For visualization donut chart
}

export interface AmortizationPeriod {
  periodNumber: number;
  monthName?: string;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface YearlyAmortizationSummary {
  yearNumber: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}
```

---

## 5. UI & Interaction Design

1. **Dual-Input Synchronization:** Every parameter (Principal, Interest Rate, Tenure) features both a smooth range slider and a formatted numeric text input box.
2. **Dynamic Live Calculation:** Results update instantaneously on every slider drag or numeric keystroke.
3. **Stat Cards:**
   - Monthly EMI (Primary highlight with gradient text)
   - Total Interest Payable
   - Total Amount Payable (Principal + Interest)
4. **Visual Chart:** Interactive donut chart comparing Principal vs Total Interest percentage.
5. **Amortization Controls:** Toggle between "Monthly Breakdown" and "Yearly Summary", with quick pagination or search.
6. **AI Explanation Trigger:** "Explain Loan Impact with AI" button docked beneath the summary card.

---

## 6. Input Validation & Error Handling
- $P > 0$: Cannot be empty, negative, or zero.
- $R \ge 0$: Can be 0% (0% interest loan) up to 50%.
- $N > 0$: Minimum 1 month, maximum 600 months (50 years).
- User-friendly error message banners rendered inline if bounds are exceeded.
