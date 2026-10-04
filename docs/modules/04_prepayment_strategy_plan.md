# Module 04 Plan: Prepayment Strategy Planner (FR-05)

> **SRS References:** FR-05 (Prepayment Strategy Planner)  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
Unlike a single lump sum, many disciplined borrowers choose to pay an extra sum each month (e.g., adding ₹2,000 to their monthly EMI, or paying 1 extra EMI every year). The Prepayment Strategy Planner simulates how recurring additions systematically accelerate loan amortization, drastically shrink compounding interest, and bring forward the debt-free date.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/strategy.ts` | Types for recurring extra payments, annual step-ups, and accelerated payoff schedules |
| **Calculation Engine** | `src/lib/calculations/strategy.ts` | Simulation engine for regular monthly additional payments |
| **Strategy UI** | `src/components/calculators/PrepaymentStrategy.tsx` | Interactive strategy controls, savings dashboard, and comparison metrics |
| **Page Route** | `src/app/strategy/page.tsx` | Dedicated page for regular prepayment strategies |

---

## 3. Mathematical Formula & Algorithm

### 3.1 Recurring Monthly Extra Payment Logic
Let $\text{EMI}_{\text{base}}$ be the regular scheduled EMI.  
Let $\Delta_{\text{monthly}}$ be the extra payment contributed every month.  
The total monthly outflow is $\text{EMI}_{\text{effective}} = \text{EMI}_{\text{base}} + \Delta_{\text{monthly}}$.

For each month $t \ge 1$:
1. $\text{Interest}_t = \text{Balance}_{t-1} \times r$
2. $\text{Principal Component} = \text{EMI}_{\text{effective}} - \text{Interest}_t$
3. If $\text{Principal Component} \ge \text{Balance}_{t-1}$:
   - Loan is fully paid off at month $t$.
   - Final payment $= \text{Balance}_{t-1} + \text{Interest}_t$.
   - Terminate schedule.
4. Otherwise:
   - $\text{Balance}_t = \text{Balance}_{t-1} - \text{Principal Component}$.

### 3.2 Savings Metrics
- $\text{Revised Tenure} = t_{\text{final}}$
- $\text{Tenure Reduction} = n_{\text{original}} - t_{\text{final}}$
- $\text{Interest Saved} = \sum \text{Interest}_{\text{original}} - \sum \text{Interest}_{\text{strategy}}$

---

## 4. TypeScript Type Definitions (`src/types/strategy.ts`)

```typescript
export interface PrepaymentStrategyInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  additionalMonthlyPayment: number; // e.g. +₹2,500/month
  startFromMonth?: number;          // Default: 1
}

export interface PrepaymentStrategyResult {
  originalTenureMonths: number;
  revisedTenureMonths: number;
  monthsSaved: number;
  yearsSavedFormatted: string;
  originalTotalInterest: number;
  revisedTotalInterest: number;
  interestSaved: number;
  totalExtraPaid: number;
  netFinancialGain: number; // Interest Saved - Extra Paid (shows pure economic leverage)
  originalPayoffMonths: number;
}
```

---

## 5. UI & Interaction Design
1. **Interactive Strategy Sliders:**
   - Base Loan Parameters (Principal, Rate, Tenure).
   - Extra Monthly Payment Slider (e.g. ₹500 to ₹50,000/mo).
   - Preset Quick-Action Buttons: `+₹1,000/mo`, `+₹5,000/mo`, `+5% of EMI`, `+10% of EMI`.
2. **Impact Dashboard:**
   - Big Bold Metric: **"Become Debt-Free X Years Earlier"**
   - Secondary Metric: **"Total Interest Saved: ₹Y"**
3. **Payoff Progress Curve:** Comparative visual line chart showing balance dropping dramatically faster under the active strategy vs standard schedule.
4. **AI Strategy Review:** "Review Strategy with Gemini" explains the discipline required and trade-offs against emergency funds.
