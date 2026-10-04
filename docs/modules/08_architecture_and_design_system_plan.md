# Module 08 Plan: Shared Foundation, Design System & Validation Rules

> **SRS References:** Section 8 (Detailed Module Description), Section 14 (Frontend Requirements), Section 17 (Validation Requirements), Section 20 (Non-Functional Requirements)  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
The shared foundation establishes the global aesthetic, reusable UI component library, currency and tenure formatting utilities, and centralized validation rules across all modules.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Validation Rules** | `src/lib/validations/loan-validation.ts` | Centralized boundary checking and sanitation for inputs |
| **Error Messages** | `src/lib/validations/error-messages.ts` | Standardized, user-friendly error strings per SRS Section 18 |
| **Formatting Helpers**| `src/lib/formatting/currency.ts` | Indian Rupee (₹) & USD ($) formatting, lakh/crore shorthands, month/year string formatters |
| **Dual-Sync Slider** | `src/components/common/NumberInputSlider.tsx` | Range slider synchronized with formatted numeric input box |
| **Metric Stat Card** | `src/components/displays/LoanSummaryCards.tsx` | Key-value metric card with icons, subtext, and gradient backgrounds |
| **Breakdown Chart** | `src/components/displays/LoanBreakdownChart.tsx` | Principal vs. Interest percentage donut/progress visualizer |
| **Navigation Bar** | `src/components/common/Navbar.tsx` | Top responsive nav with links to all 6 planners, brand logo, and active state indicators |
| **Footer** | `src/components/common/Footer.tsx` | Disclaimers, B.Tech capstone credits, and viva quick links |
| **Error Banner** | `src/components/common/ErrorBanner.tsx` | Inline reactive error warning alerts |
| **Global Theme** | `src/app/globals.css` | Tailored color palette, glassmorphism tokens, and micro-interaction animations |

---

## 3. Validation Matrix (SRS Section 17 & 18)

| Parameter | Minimum | Maximum | Error Message When Invalid |
| :--- | :--- | :--- | :--- |
| **Loan Amount ($P$)** | $> 0$ (e.g. ₹1,000) | ₹100,000,000 (10 Cr) | *"Please enter a valid loan amount greater than 0."* |
| **Interest Rate ($R$)**| $\ge 0.0\%$ | $\le 50.0\%$ | *"Interest rate cannot be negative or exceed 50%."* |
| **Tenure ($N$)** | $\ge 1$ month | $\le 600$ months (50 yrs)| *"Please enter a valid tenure between 1 month and 50 years."* |
| **Vehicle Down Payment**| $\ge 0$ | $< \text{Vehicle Price}$ | *"Down payment cannot be negative and must be less than the vehicle price."* |
| **Prepayment Amount** | $> 0$ | $\le \text{Outstanding Balance}$ | *"Prepayment cannot exceed the current outstanding loan balance."* |
| **Prepayment Month** | $\ge 1$ | $< \text{Total Tenure}$ | *"Prepayment month must be within the active loan tenure."* |

---

## 4. Design System & Aesthetics Guidelines

1. **Color Palette:**
   - **Primary:** Deep Emerald / Indigo (`#0f766e` / `#4338ca`) for trust and financial stability.
   - **Accent:** Vibrant Amber / Teal (`#f59e0b` / `#06b6d4`) for call-to-actions and AI badges.
   - **Surfaces:** Clean slate/neutral card backgrounds with subtle borders (`border-slate-200 dark:border-slate-800`) and soft backdrop blurs.
2. **Typography:** Clean, legible sans-serif (Inter / Outfit) with clear hierarchy and bold financial numbers.
3. **Micro-Interactions:**
   - Smooth slider transitions.
   - Animated count-up transitions for EMI changes.
   - Subtle hover elevation on planner selection cards.
4. **Responsive Layout:**
   - Fully optimized for mobile screens (single-column card stacks), tablets, and desktop displays (side-by-side input and visualization grids).
