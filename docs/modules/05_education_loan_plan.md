# Module 05 Plan: Education Loan Planner (FR-06)

> **SRS References:** FR-06 (Education Loan Planner)  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
Education loans have unique financial dynamics that distinguish them from standard retail loans:
1. **Study Period:** Duration of the degree program (e.g. 2 to 4 years).
2. **Moratorium (Grace) Period:** Additional time granted before loan repayment begins (typically course duration + 6 months to 1 year).
3. **Interest Handling during Moratorium:** Interest accrues during the study years. Some lenders offer simple interest options or full capitalization onto the principal.
4. **Post-Moratorium Repayment:** Amortization starts only after the student graduates and the grace period ends.

This planner models the moratorium interest accumulation and computes the accurate post-moratorium EMI.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/education.ts` | Types for study period, moratorium, accrued interest, and post-moratorium EMI |
| **Calculation Engine** | `src/lib/calculations/education.ts` | Math engine computing moratorium interest accumulation and repayment phase |
| **Education UI** | `src/components/calculators/EducationLoanPlanner.tsx` | Specialized controls for study duration, grace period, and career start timeline |
| **Page Route** | `src/app/education/page.tsx` | Dedicated page for education loan planning |

---

## 3. Mathematical Formula & Assumptions

### 3.1 Moratorium Phase
- Let $P_{\text{initial}}$ = Total Education Loan sanction amount.
- $T_{\text{study}}$ = Course duration (in months/years).
- $T_{\text{grace}}$ = Post-course grace period (in months, typically 6–12 months).
- $\text{Total Moratorium Months } (M_{\text{total}}) = T_{\text{study}} + T_{\text{grace}}$.

### 3.2 Interest Accumulation Models
- **Standard Simple Interest Option (Option 1):**
  $$\text{Accrued Interest} = P_{\text{initial}} \times \left(\frac{R_{\text{annual}}}{100}\right) \times \left(\frac{M_{\text{total}}}{12}\right)$$
- **Compounded Option (Option 2 - Bank Standard Capitalization):**
  $$P_{\text{adjusted}} = P_{\text{initial}} \times (1 + r)^{M_{\text{total}}}$$
  $$\text{Accrued Moratorium Interest} = P_{\text{adjusted}} - P_{\text{initial}}$$
- If interest is serviced during the course (subsidy/parent payment), $P_{\text{repayment}} = P_{\text{initial}}$. If capitalized, $P_{\text{repayment}} = P_{\text{adjusted}}$.

### 3.3 Repayment Phase
- Repayment starts at Month $(M_{\text{total}} + 1)$.
- Repayment Tenure $= N_{\text{repayment}}$ months.
- Post-Moratorium EMI:
  $$\text{EMI}_{\text{post}} = \frac{P_{\text{repayment}} \times r \times (1+r)^{N_{\text{repayment}}}}{(1+r)^{N_{\text{repayment}}} - 1}$$

---

## 4. TypeScript Type Definitions (`src/types/education.ts`)

```typescript
export interface EducationLoanInput {
  courseFee: number;                // e.g. ₹1,500,000
  livingExpenses?: number;          // e.g. ₹500,000
  annualInterestRate: number;       // e.g. 9.5%
  studyDurationYears: number;       // e.g. 4 years
  gracePeriodMonths: number;        // e.g. 6 or 12 months
  repaymentTenureYears: number;     // e.g. 10 years
  interestServicedDuringStudy: boolean; // True if paying interest monthly during study
}

export interface EducationLoanResult {
  totalLoanSanctioned: number;
  totalMoratoriumMonths: number;
  accruedMoratoriumInterest: number;
  principalAtRepaymentStart: number;
  postMoratoriumMonthlyEmi: number;
  totalInterestDuringRepayment: number;
  totalOverallInterest: number;
  totalOverallRepayment: number;
  graduationYearOffset: number;
}
```

---

## 5. UI & Interaction Design
1. **Two-Stage Visual Timeline:**
   - **Stage 1 (Study + Grace):** Highlighted in light blue/amber indicating loan disbursements & interest accumulation.
   - **Stage 2 (Repayment):** Highlighted in emerald green showing career start & monthly EMI payments.
2. **Interest Servicing Toggle:** "Will you pay simple interest during study?" (Demonstrating massive interest savings if parents service interest early).
3. **Career Readiness Callout:** Shows expected monthly EMI relative to entry-level graduate salaries.
4. **AI Academic Loan Advisor:** "Explain Education Loan with Gemini" provides tips on tax deductions (e.g. Section 80E in India or international education loan grants).
