# Project Documentation Index

All planning and architectural context documents are organized inside the [docs/](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs) directory:

## 1. Core Planning & Context Documents
- [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf) — Original 13-page SRS document.
- [PROJECT_CONTEXT.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/PROJECT_CONTEXT.md) — Comprehensive architectural and system context derived from the SRS.
- [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/IMPLEMENTATION_PLAN.md) — Master implementation roadmap and modular file matrix.

---

## 2. Individual Module Plan Files (`docs/modules/`)

Every module has its own detailed, independent plan file:

1. [01_emi_calculator_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/01_emi_calculator_plan.md)  
   **FR-01 & FR-02:** Standard Reducing-Balance EMI Calculator & Full Period Amortization Schedule.

2. [02_loan_comparison_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/02_loan_comparison_plan.md)  
   **FR-03:** Multi-Loan Side-by-Side Comparison Engine (2 or 3 loan scenarios).

3. [03_prepayment_simulation_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/03_prepayment_simulation_plan.md)  
   **FR-04:** One-Time Lump-Sum Prepayment Simulator (Tenure vs. EMI reduction).

4. [04_prepayment_strategy_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/04_prepayment_strategy_plan.md)  
   **FR-05:** Prepayment Strategy Planner (Recurring monthly extra contributions).

5. [05_education_loan_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/05_education_loan_plan.md)  
   **FR-06:** Specialized Education Loan Planner (Study period + moratorium interest accumulation).

6. [06_vehicle_loan_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/06_vehicle_loan_plan.md)  
   **FR-07:** Specialized Vehicle Loan Planner (Down payment deduction & auto financing terms).

7. [07_gemini_ai_explanation_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/07_gemini_ai_explanation_plan.md)  
   **FR-08:** Google Gemini AI Natural-Language Explanation Service (`/api/ai/explain`).

8. [08_architecture_and_design_system_plan.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/modules/08_architecture_and_design_system_plan.md)  
   **Shared Foundation:** Design system, dual-sync sliders, responsive layout, and validation matrix.
