# Project Context: Loan & EMI Planner

> **Document Type:** System Architecture & Project Specification Context  
> **Source Document:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Version:** 1.0 (Initial Requirements Specification)  
> **Target Academic Level:** B.Tech Full-Stack Capstone / College Project  
> **Stack:** Next.js (React + TypeScript), Tailwind CSS / Vanilla CSS, Google Gemini API  

---

## 1. Executive Summary & Purpose

The **Loan & EMI Planner** is a full-stack web application engineered to calculate, understand, compare, and simulate various loan options (Personal, Home, Vehicle, Education). 

Traditional EMI calculators only output a single monthly installment number without illustrating the true financial impact over time (amortization breakdown, interest vs. principal distribution, prepayment impact). This project bridges that gap by pairing a **deterministic mathematical calculation engine** with **Google Gemini AI** to produce intuitive, plain-language financial explanations.

---

## 2. Core Architectural Principle (The Golden Rule)

> [!IMPORTANT]
> **Strict Separation of Calculation and AI Explanation (SRS Section 30):**
> 
> $$\text{User Input} \longrightarrow \text{Validation} \longrightarrow \text{Financial Calculation Engine} \longrightarrow \text{Deterministic Results} \longrightarrow \begin{cases} \text{UI Charts \& Tables} \\ \text{Gemini AI Explanation API} \end{cases}$$
> 
> **Gemini must NEVER perform or be the source of truth for financial calculations.**
> All mathematical formulas (EMI, amortization, prepayment savings, moratorium interest) run locally in deterministic TypeScript functions. Google Gemini is utilized **exclusively** to explain, interpret, and contextualize already-calculated results in simple natural language.

---

## 3. Technology Stack & Environment

| Layer | Technology | Specification / Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Full-stack React framework for SSR, client rendering, and serverless API routes |
| **Frontend** | React 18+ / TypeScript | Component-driven, type-safe interactive UI |
| **Styling** | Modern CSS / Tailwind CSS | Responsive, accessible, high-aesthetic layout (cards, glassmorphism, micro-animations) |
| **AI Integration** | Google Gemini API (`@google/genai`) | Server-side LLM inference for natural-language loan summaries and insights |
| **Database** | *None required for V1.0* | In-memory / client-state session calculations (no user auth or persistent DB needed in V1) |
| **Runtime / Package**| Node.js (v18+) & npm/pnpm | Development environment and dependency management |

---

## 4. System Scope & Boundaries

### 4.1 In Scope (v1.0)
- **Standard EMI Calculator:** Principal, interest rate, tenure, EMI, total interest, total repayment.
- **Full Amortization Schedule:** Month-by-month and year-by-year principal, interest, and closing balance table.
- **Multi-Loan Comparison:** Side-by-side comparison of 2 or 3 loan configurations (identifying cheapest interest, best monthly cash flow).
- **One-Time Prepayment Simulator:** Simulates lump-sum payment at month $M$; recalculates tenure reduction or EMI reduction and total interest saved.
- **Prepayment Strategy Planner:** Simulates recurring monthly extra payments (e.g. +$100/month or +10% EMI) and displays savings.
- **Education Loan Planner:** Specialized planner accommodating course duration, moratorium period, simple/compound interest accumulation during study, and post-moratorium repayment.
- **Vehicle Loan Planner:** Computes financing based on on-road vehicle price, down payment, loan amount, and tenure.
- **AI Explanation Module:** Server-side route calling Gemini to explain results, compare trade-offs, and give actionable insights with disclaimers.
- **Client & Server Input Validation:** Robust handling of bounds, zero values, negative values, and non-numeric inputs.

### 4.2 Out of Scope (v1.0)
- Real banking API integrations, net banking or live bank feeds.
- Credit score (CIBIL/FICO) retrieval or credit checking.
- Actual loan applications, payment gateway transactions, or approval workflows.
- User authentication, login credentials, or persistent database management.
- Real-time live lender scraping or investment/portfolio management.

---

## 5. Mathematical Formulas & Calculation Specifications

### 5.1 Standard Reducing-Balance EMI Formula
$$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$

- $P$ = Principal loan amount
- $r$ = Monthly interest rate $= \frac{\text{Annual Interest Rate}}{12 \times 100}$
- $n$ = Loan tenure in months $= \text{Years} \times 12$
- *Edge case*: If $r = 0$, $\text{EMI} = \frac{P}{n}$

### 5.2 Amortization Calculation (Per Period $t$)
- $\text{Interest}_t = \text{Opening Balance}_t \times r$
- $\text{Principal}_t = \text{EMI} - \text{Interest}_t$
- $\text{Closing Balance}_t = \text{Opening Balance}_t - \text{Principal}_t$
- Final period closing balance converges to 0 (accounting for floating-point rounding adjustments).

### 5.3 Prepayment Simulation Logic
- Outstanding balance at month $M$: $B_M$.
- After prepayment $L$: $B'_M = \max(0, B_M - L)$.
- **Option A (Reduce Tenure):** Keep EMI constant, solve for new tenure $n' = \frac{\ln(\text{EMI}) - \ln(\text{EMI} - B'_M \cdot r)}{\ln(1 + r)}$.
- **Option B (Reduce EMI):** Keep remaining tenure $(n - M)$ constant, recompute lower EMI.
- Compute: $\text{Total Interest Saved} = \text{Original Total Interest} - \text{New Total Interest}$.

---

## 6. Functional Requirements Breakdown

| Req ID | Module Name | Inputs | Expected Output |
| :--- | :--- | :--- | :--- |
| **FR-01** | EMI Calculator | Principal ($P$), Annual Rate ($R$), Tenure ($Y$ or $M$) | Monthly EMI, Total Principal, Total Interest, Total Payment, Visual Pie/Bar representation |
| **FR-02** | Amortization Table | Calculated loan params | Complete table with Payment #, Opening Balance, EMI, Principal Paid, Interest Paid, Closing Balance |
| **FR-03** | Loan Comparison | Up to 3 loan parameter sets ($A, B, C$) | Side-by-side breakdown of EMI, total interest, total cost, visual delta highlighting |
| **FR-04** | Prepayment Simulation | Loan params, Prepayment Amount, Month of Payment | Revised balance, tenure saved, interest saved, side-by-side before/after comparison |
| **FR-05** | Prepayment Strategy | Loan params, Regular monthly extra payment | Revised schedule, shortened tenure, total interest saved |
| **FR-06** | Education Loan | Course fee, Moratorium period (study + grace), Interest rate, Repayment tenure | Accrued interest during moratorium, adjusted post-moratorium principal & EMI |
| **FR-07** | Vehicle Loan | Vehicle price, Down payment, Interest rate, Tenure | Loan amount ($=\text{Price} - \text{Down Payment}$), EMI, Total Interest, Amortization |
| **FR-08** | Gemini AI Explanation | Validated loan calculation summary | Plain-language narrative interpreting affordability, interest burden, and prepayment recommendations |

---

## 7. Backend & API Architecture

### 7.1 Server-Side Gemini Route (`POST /api/ai/explain`)

- **Method:** `POST`
- **Authentication:** Server-side API key (`GEMINI_API_KEY`) via process environment variables.
- **Request Payload Structure:**
```typescript
interface LoanExplanationRequest {
  plannerType: 'standard_emi' | 'loan_comparison' | 'prepayment' | 'education' | 'vehicle';
  summary: {
    principal: number;
    interestRate: number;
    tenureMonths: number;
    monthlyEmi: number;
    totalInterest: number;
    totalPayment: number;
    [key: string]: any;
  };
  comparisonData?: any;
  userContext?: {
    monthlyIncome?: number;
    financialGoal?: string;
  };
}
```

- **Response Payload Structure:**
```typescript
interface LoanExplanationResponse {
  success: boolean;
  explanation: {
    summary: string;
    keyTakeaways: string[];
    riskOrImpactAnalysis: string;
    actionableAdvice: string;
    disclaimer: string;
  };
  error?: string;
}
```

- **Resilience Principle:** If the Gemini API times out, fails, or key is missing, the application UI must fail gracefully without hindering the core calculation results or amortization schedule.

---

## 8. Directory & Codebase Architecture (Next.js)

Recommended structure adhering to modularity and B.Tech viva evaluation standards:

```
project-root/
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
├── public/
├── src/
│   ├── app/
│   │   ├── api/ai/explain/route.ts
│   │   ├── compare/page.tsx
│   │   ├── prepayment/page.tsx
│   │   ├── strategy/page.tsx
│   │   ├── education/page.tsx
│   │   ├── vehicle/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   └── types/
```

---

## 9. Security, Validation & Viva Defense Points

### 9.1 Security & Boundaries
1. **Gemini Key Protection:** Strictly stored in `.env.local` as `GEMINI_API_KEY`. Never exposed to client-side bundles (`NEXT_PUBLIC_` is prohibited for the secret key).
2. **Payload Sanitization:** Validate all numeric inputs before passing to calculations or backend routes to prevent injection or DoS via excessive tenure arrays (capped at 600 months / 50 years).
3. **Financial Disclaimer:** Explicitly stated in UI: *"AI explanations are for educational and planning purposes only and do not constitute certified financial advice."*

### 9.2 Key Viva Defense Topics
- **Why Next.js?** Single full-stack repository providing fast React UI rendering combined with secure server-side Node.js API routes for external AI credentials.
- **Why not ask Gemini for the EMI calculation?** LLMs are probabilistic text predictors and can hallucinate mathematical formulas, decimal points, and compounding values. Deterministic mathematical functions guarantee 100% calculation accuracy, while Gemini excels at humanized textual summaries.
- **How is edge-case rounding handled?** Final amortization periods reconcile residual cents/paise so closing balance hits precisely zero.
