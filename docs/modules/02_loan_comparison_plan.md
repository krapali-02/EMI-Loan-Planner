# Module 02 Plan: Multi-Loan Comparison (FR-03)

> **SRS References:** FR-03 (Loan Comparison), UC-03  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
The Loan Comparison module allows users to configure and evaluate **2 or 3 distinct loan options** side-by-side. Borrowers often face offers with different interest rates, tenures, or processing variations (e.g. Bank A: 8.4% for 20 years vs. Bank B: 8.1% for 15 years). This module empowers borrowers to pinpoint the most cost-effective option and understand monthly cash flow trade-offs.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/comparison.ts` | Types for multiple loan scenarios, comparison deltas, and ranking results |
| **Calculation Engine** | `src/lib/calculations/comparison.ts` | Multi-scenario comparison and differential cost calculation |
| **Comparison UI** | `src/components/calculators/LoanComparison.tsx` | Side-by-side card layout with tabbed/column views and delta indicators |
| **Page Route** | `src/app/compare/page.tsx` | Dedicated page for multi-loan comparison |

---

## 3. Comparison Logic & Differential Metrics

For each loan $i \in \{A, B, C\}$:
1. Run independent calculations via `src/lib/calculations/emi.ts`:
   - $\text{EMI}_i$
   - $\text{Total Interest}_i$
   - $\text{Total Payment}_i$
2. Compute Comparative Differentials:
   - $\Delta \text{EMI} = \text{EMI}_i - \min(\text{EMI})$
   - $\Delta \text{Interest} = \text{Total Interest}_i - \min(\text{Total Interest})$
   - $\Delta \text{Total} = \text{Total Payment}_i - \min(\text{Total Payment})$
3. Identify Highlights:
   - **Lowest Monthly Payment:** Best for cash-flow constraints.
   - **Lowest Total Interest:** Best for long-term financial savings.
   - **Shortest Tenure:** Fastest debt-free timeline.

---

## 4. TypeScript Type Definitions (`src/types/comparison.ts`)

```typescript
import { EmiInputParams, EmiSummaryResult } from './emi';

export interface LoanScenario {
  id: string;
  name: string; // e.g. "Loan A (HDFC)", "Loan B (SBI)"
  inputs: EmiInputParams;
  results: EmiSummaryResult;
  isLowestEmi?: boolean;
  isLowestInterest?: boolean;
  isLowestTotal?: boolean;
}

export interface LoanComparisonResult {
  scenarios: LoanScenario[];
  bestForMonthlyBudget: string; // Scenario ID
  bestForTotalCost: string;     // Scenario ID
  maxInterestDifference: number;
  maxMonthlyDifference: number;
}
```

---

## 5. UI & Interaction Design
1. **Scenario Columns / Grid:** Displays Loan A and Loan B by default, with an intuitive `+ Add Loan C` button (and `- Remove Loan C`).
2. **Synchronized or Independent Tuning:** Each loan has individual slider and numeric inputs.
3. **Winner Badges:**
   - Emerald Badge: *"Lowest Total Interest (Saves ₹X)"*
   - Cyan Badge: *"Lowest Monthly EMI (₹X/mo less)"*
4. **Side-by-Side Bar Chart:** Comparing Principal vs Interest for all 2 or 3 loans on the same vertical axis.
5. **AI Comparison Insight:** "Compare with Gemini" button sends all scenarios to Gemini to explain trade-offs (e.g., tenure vs interest drag).
