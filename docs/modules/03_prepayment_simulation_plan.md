# Module 03 Plan: One-Time Prepayment Simulation (FR-04)

> **SRS References:** FR-04 (Prepayment Simulation), UC-04  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
Borrowers often receive bonuses, tax refunds, or maturity windfalls and wish to inject a lump-sum prepayment toward their principal. The One-Time Prepayment Simulator calculates how making an extra payment at a specific month ($M$) impacts the loan, illustrating either a drastically shortened loan tenure or a lowered monthly EMI, alongside total interest savings.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/prepayment.ts` | Types for one-time prepayment input, simulation result, and revised schedule |
| **Calculation Engine** | `src/lib/calculations/prepayment.ts` | Recalculation math after one-time principal reduction |
| **Prepayment UI** | `src/components/calculators/PrepaymentSimulator.tsx` | Prepayment input controls, comparison cards, and before/after timeline |
| **Page Route** | `src/app/prepayment/page.tsx` | Dedicated page for one-time prepayment simulation |

---

## 3. Mathematical Formula & Algorithm

### 3.1 Scenario Flow
1. **Original Schedule:** Generate original month-by-month schedule up to month $M$.
2. **Outstanding Balance at Prepayment:** Identify $B_M$ (the closing principal balance at month $M$).
3. **Validation:** $0 < \text{Prepayment Amount } (L) \le B_M$.
4. **Post-Prepayment Balance:** $B'_M = B_M - L$.
5. **Two Recalculation Modes:**
   - **Mode A: Reduce Tenure (Keep EMI constant - Default & Recommended):**
     Compute new remaining months $n_{\text{rem}}'$ required to pay off $B'_M$ at rate $r$ with unchanged $\text{EMI}$:
     $$n_{\text{rem}}' = \left\lceil \frac{\ln\left(\frac{\text{EMI}}{\text{EMI} - B'_M \times r}\right)}{\ln(1 + r)} \right\rceil$$
     - Total New Tenure $= M + n_{\text{rem}}'$
     - Time Saved $= n_{\text{original}} - (M + n_{\text{rem}}')$
   - **Mode B: Reduce EMI (Keep Tenure constant):**
     Compute revised lower EMI for the remaining $(n_{\text{original}} - M)$ months:
     $$\text{EMI}' = \frac{B'_M \times r \times (1+r)^{n - M}}{(1+r)^{n - M} - 1}$$
6. **Total Savings Calculation:**
   $$\text{Interest Saved} = \text{Total Interest}_{\text{original}} - \text{Total Interest}_{\text{revised}}$$

---

## 4. TypeScript Type Definitions (`src/types/prepayment.ts`)

```typescript
export type PrepaymentImpactMode = 'reduce_tenure' | 'reduce_emi';

export interface PrepaymentSimulationInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  prepaymentAmount: number;
  prepaymentMonth: number; // Month number when payment is made (e.g. Month 12)
  impactMode: PrepaymentImpactMode;
}

export interface PrepaymentSimulationResult {
  originalTenureMonths: number;
  newTenureMonths: number;
  monthsSaved: number;
  yearsSavedFormatted: string;
  originalEmi: number;
  newEmi: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
  prepaymentAmount: number;
  prepaymentMonth: number;
  outstandingBalanceAtPrepayment: number;
}
```

---

## 5. UI & Interaction Design
1. **Interactive Timeline Slider:** Select the month of prepayment with immediate visual indication of outstanding balance.
2. **Strategy Mode Toggle:** Switch between "Reduce Tenure (Fast Payoff)" and "Reduce Monthly EMI (Cash Flow Relief)".
3. **Before vs. After Comparison Cards:**
   - Green Highlight: Total Interest Saved (₹)
   - Blue Highlight: Time Saved (Years & Months)
4. **Visual Repayment Timeline:** Dual comparison progress bars visualizing the original payoff date vs. revised accelerated payoff date.
5. **AI Evaluation:** "Analyze Prepayment with Gemini" summarizes the financial ROI and opportunity cost.
