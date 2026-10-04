# Implementation Plan: Loan & EMI Planner (Modular Architecture)

> **Document Version:** 1.0  
> **Reference SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Project Context:** [PROJECT_CONTEXT.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/PROJECT_CONTEXT.md)  
> **Key Architecture Rule:** Every single module has its own independent calculation file, type definition, component, and page route.

---

## 1. Modular Directory Structure (Every Module Separated)

```
Project 1 EMI/
├── docs/
│   ├── Loan_and_EMI_Planner_SRS.pdf
│   ├── README.md                           # Documentation Index
│   ├── PROJECT_CONTEXT.md                  # System Context
│   ├── IMPLEMENTATION_PLAN.md              # Master Implementation Plan
│   └── modules/                            # Individual Module Plans (01 - 08)
│       ├── 01_emi_calculator_plan.md
│       ├── 02_loan_comparison_plan.md
│       ├── 03_prepayment_simulation_plan.md
│       ├── 04_prepayment_strategy_plan.md
│       ├── 05_education_loan_plan.md
│       ├── 06_vehicle_loan_plan.md
│       ├── 07_gemini_ai_explanation_plan.md
│       └── 08_architecture_and_design_system_plan.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── explain/
│   │   │           └── route.ts                 # FR-08: Dedicated Gemini API route
│   │   ├── compare/
│   │   │   └── page.tsx                         # FR-03: Loan Comparison Page
│   │   ├── prepayment/
│   │   │   └── page.tsx                         # FR-04: Prepayment Simulation Page
│   │   ├── strategy/
│   │   │   └── page.tsx                         # FR-05: Prepayment Strategy Page
│   │   ├── education/
│   │   │   └── page.tsx                         # FR-06: Education Loan Planner Page
│   │   ├── vehicle/
│   │   │   └── page.tsx                         # FR-07: Vehicle Loan Planner Page
│   │   ├── globals.css                          # Modern design system & styles
│   │   ├── layout.tsx                           # Global layout (Navbar + Footer)
│   │   └── page.tsx                             # FR-01 & FR-02: Home EMI Calculator
│   ├── components/
│   │   ├── calculators/
│   │   │   ├── EmiCalculator.tsx                # FR-01: EMI Calculator Form & Controller
│   │   │   ├── LoanComparison.tsx               # FR-03: Multi-Loan Comparison Controller
│   │   │   ├── PrepaymentSimulator.tsx          # FR-04: One-time Prepayment Controller
│   │   │   ├── PrepaymentStrategy.tsx           # FR-05: Monthly Strategy Controller
│   │   │   ├── EducationLoanPlanner.tsx         # FR-06: Education Loan Controller
│   │   │   └── VehicleLoanPlanner.tsx           # FR-07: Vehicle Financing Controller
│   │   ├── displays/
│   │   │   ├── AmortizationTable.tsx            # FR-02: Month/Year Amortization Schedule
│   │   │   ├── LoanSummaryCards.tsx             # Metric summaries (EMI, Interest, Total)
│   │   │   ├── LoanBreakdownChart.tsx           # Visual pie / donut ratio chart
│   │   │   └── AiExplanationCard.tsx            # FR-08: Gemini explanation card with states
│   │   └── common/
│   │       ├── Navbar.tsx                       # Navigation bar with active route highlight
│   │       ├── Footer.tsx                       # Project footer with disclaimer
│   │       ├── NumberInputSlider.tsx            # Dual sync slider + numeric input
│   │       └── ErrorBanner.tsx                  # User-friendly error message display
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── gemini.ts                        # Gemini SDK client configuration
│   │   │   └── prompts.ts                       # Structured explanation prompt templates
│   │   ├── calculations/
│   │   │   ├── emi.ts                           # FR-01: Reducing-balance EMI math
│   │   │   ├── amortization.ts                  # FR-02: Period schedule generator
│   │   │   ├── comparison.ts                    # FR-03: Multi-loan difference engine
│   │   │   ├── prepayment.ts                    # FR-04: Lump-sum savings math
│   │   │   ├── strategy.ts                      # FR-05: Monthly prepayment strategy math
│   │   │   ├── education.ts                     # FR-06: Moratorium & compounding math
│   │   │   └── vehicle.ts                       # FR-07: Down payment & financing math
│   │   ├── formatting/
│   │   │   └── currency.ts                      # Currency & tenure formatting helpers
│   │   └── validations/
│   │       ├── loan-validation.ts               # Input bounds & type validators
│   │       └── error-messages.ts                # SRS-compliant user-facing messages
│   └── types/
│       ├── emi.ts                               # FR-01 Types
│       ├── amortization.ts                      # FR-02 Types
│       ├── comparison.ts                        # FR-03 Types
│       ├── prepayment.ts                        # FR-04 & FR-05 Types
│       ├── education.ts                         # FR-06 Types
│       ├── vehicle.ts                           # FR-07 Types
│       └── ai.ts                                # FR-08 Types
├── .env.example                                 # GEMINI_API_KEY template
├── .gitignore
├── package.json
├── PROJECT_CONTEXT.md
├── IMPLEMENTATION_PLAN.md
├── README.md
└── tsconfig.json
```

---

## 2. Phase-by-Phase Implementation Blueprint

### Phase 1: Environment & Project Foundation
- **Goal:** Set up Next.js (App Router, TypeScript, Tailwind CSS) in the current directory.
- **Tasks:**
  1. Initialize Next.js project with TypeScript and Tailwind CSS.
  2. Configure `.env.example` with `GEMINI_API_KEY`.
  3. Set up clean color palette (emerald/indigo modern financial theme), glassmorphism styles, and typography.
  4. Create `src/lib/formatting/currency.ts` (e.g. INR / USD currency formatting and month/year formatters).

---

### Phase 2: Core Calculation Modules (Separate Engine Files)
- **Goal:** Build 100% deterministic, testable calculation functions for all modules according to SRS formulas.
- **Files & Modules:**
  1. **`src/types/emi.ts` & `src/lib/calculations/emi.ts` (FR-01)**
     - $EMI = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$
     - Edge case: $r = 0 \implies EMI = P / n$
     - Calculates: Monthly EMI, Total Principal, Total Interest, Total Payment.
  2. **`src/types/amortization.ts` & `src/lib/calculations/amortization.ts` (FR-02)**
     - Generates month-by-month and yearly aggregate schedule.
     - Tracks: Period #, Opening Balance, EMI, Principal Paid, Interest Paid, Closing Balance.
     - Closes final penny/cent balance strictly to 0.
  3. **`src/types/comparison.ts` & `src/lib/calculations/comparison.ts` (FR-03)**
     - Computes side-by-side metrics for 2 or 3 loans.
     - Calculates differentials: EMI difference, total interest savings, total cost delta.
  4. **`src/types/prepayment.ts` & `src/lib/calculations/prepayment.ts` (FR-04)**
     - Lump-sum prepayment at month $M$.
     - Computes: Revised tenure, total interest saved, time saved (months/years).
  5. **`src/types/strategy.ts` & `src/lib/calculations/strategy.ts` (FR-05)**
     - Simulates ongoing monthly additional payment (+amount or +% EMI).
     - Computes: Accelerated payoff schedule, new payoff date, total interest saved.
  6. **`src/types/education.ts` & `src/lib/calculations/education.ts` (FR-06)**
     - Computes study period + moratorium grace period.
     - Computes simple interest or compound interest accrued during moratorium.
     - Computes post-moratorium principal capitalized and revised post-college EMI.
  7. **`src/types/vehicle.ts` & `src/lib/calculations/vehicle.ts` (FR-07)**
     - Calculates Loan Amount = On-Road Price - Down Payment.
     - Computes down payment percentage, loan-to-value (LTV) ratio, monthly EMI, total interest.
  8. **`src/lib/validations/loan-validation.ts`**
     - Enforces SRS Section 17 rules: Amount > 0, Rate >= 0, Tenure > 0, Down Payment <= Price, Prepayment <= Outstanding balance.

---

### Phase 3: Shared Reusable UI Components
- **Goal:** Build intuitive, accessible, and reactive input & display components.
- **Files:**
  - `src/components/common/Navbar.tsx`: Top navigation tabs for all 6 planners.
  - `src/components/common/Footer.tsx`: Educational disclaimer & academic project credentials.
  - `src/components/common/NumberInputSlider.tsx`: Interactive dual-synced slider + direct numeric input with units (₹/$, %, Years/Months).
  - `src/components/displays/LoanSummaryCards.tsx`: Stat cards showing Key figures (EMI, Total Interest, Total Payable).
  - `src/components/displays/LoanBreakdownChart.tsx`: Principal vs Interest breakdown donut/progress chart.
  - `src/components/displays/AmortizationTable.tsx`: Full table with pagination/accordion and Month/Year toggle.

---

### Phase 4: Dedicated Feature Pages & Controllers
- **Goal:** Connect each module's calculation engine with its UI in separate, dedicated files.
- **Files:**
  - `src/app/page.tsx` & `src/components/calculators/EmiCalculator.tsx`: Home standard EMI calculator + Amortization table.
  - `src/app/compare/page.tsx` & `src/components/calculators/LoanComparison.tsx`: Compare 2 or 3 loans side-by-side with color-coded comparison badges.
  - `src/app/prepayment/page.tsx` & `src/components/calculators/PrepaymentSimulator.tsx`: One-time prepayment simulator with visual before/after timeline.
  - `src/app/strategy/page.tsx` & `src/components/calculators/PrepaymentStrategy.tsx`: Monthly extra payment strategy with payoff acceleration metrics.
  - `src/app/education/page.tsx` & `src/components/calculators/EducationLoanPlanner.tsx`: Education loan planner with moratorium breakdown.
  - `src/app/vehicle/page.tsx` & `src/components/calculators/VehicleLoanPlanner.tsx`: Vehicle loan planner with down payment slider and financing details.

---

### Phase 5: Gemini AI Explanation Service (FR-08)
- **Goal:** Provide plain-language AI explanation without compromising calculation accuracy.
- **Files:**
  1. `src/lib/ai/gemini.ts`: Safe server-side Google Gen AI initialization.
  2. `src/lib/ai/prompts.ts`: Engineered prompt templates guiding Gemini to interpret already-calculated numbers, highlight risk/savings, and suggest best practices.
  3. `src/app/api/ai/explain/route.ts`: Secure `POST` endpoint that accepts validated calculation results, calls Gemini, and returns structured explanation.
  4. `src/components/displays/AiExplanationCard.tsx`: UI card with "Explain with AI" button, skeleton loading state, markdown/bullet formatting, and error retry.

---

### Phase 6: Verification, Viva Readiness & Polish
- **Goal:** Ensure all 30 SRS sections are satisfied, tests pass, and viva requirements are met.
- **Verification Checklist:**
  - [ ] Standard EMI formula verified against standard financial tables.
  - [ ] Amortization table converges exactly to 0 closing balance.
  - [ ] Prepayment reduces tenure and interest accurately.
  - [ ] Education loan correctly accounts for moratorium interest.
  - [ ] Vehicle loan correctly subtracts down payment from total price.
  - [ ] All inputs validated; negative or invalid values display clear inline messages.
  - [ ] Gemini API key is isolated on the server; client cannot access it.
  - [ ] Application functions 100% properly even if `GEMINI_API_KEY` is not provided (clean fallback).
  - [ ] Fully responsive on desktop, tablet, and mobile browsers.
