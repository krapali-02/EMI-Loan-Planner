# Module 06 Plan: Vehicle Loan Planner (FR-07)

> **SRS References:** FR-07 (Vehicle Loan Planner)  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
Vehicle purchases (Cars, Two-Wheelers, EVs) differ from unsecured personal loans because they revolve around a **Down Payment** and **Loan-To-Value (LTV)** proportion. Higher down payments significantly lower monthly installments and guard against vehicle depreciation outstripping the loan balance. This module calculates financed amounts based on vehicle pricing, down payment ratios, and vehicle loan terms.

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/vehicle.ts` | Types for on-road vehicle price, down payment, financed amount, and repayment summary |
| **Calculation Engine** | `src/lib/calculations/vehicle.ts` | Math engine computing net loan amount, down payment ratios, and auto loan amortization |
| **Vehicle UI** | `src/components/calculators/VehicleLoanPlanner.tsx` | Specialized controls for vehicle type, price, down payment percentage slider, and loan terms |
| **Page Route** | `src/app/vehicle/page.tsx` | Dedicated page for vehicle loan planning |

---

## 3. Mathematical Formula & Algorithms

### 3.1 Financed Amount & Down Payment Ratio
Let $V$ = Total Vehicle On-Road Price ($V > 0$).  
Let $D$ = Down Payment Amount ($0 \le D < V$).  
Let $P = V - D$ (Total Loan / Financed Amount).

$$\text{Down Payment Percentage} = \left(\frac{D}{V}\right) \times 100\%$$
$$\text{Loan-To-Value (LTV) Ratio} = \left(\frac{P}{V}\right) \times 100\%$$

### 3.2 Vehicle EMI Calculation
$$\text{EMI}_{\text{vehicle}} = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$$
- Standard tenure range for auto loans is typically 1 to 7 years (12 to 84 months).
- $\text{Total Cost of Vehicle} = D + \text{Total Repayment} = D + (\text{EMI} \times n)$.

---

## 4. TypeScript Type Definitions (`src/types/vehicle.ts`)

```typescript
export interface VehicleLoanInput {
  vehiclePrice: number;        // On-road price (e.g. ₹1,200,000)
  downPayment: number;         // Upfront payment (e.g. ₹250,000)
  annualRate: number;          // Interest rate (e.g. 8.75%)
  tenureYears: number;         // Typical auto loan tenure (e.g. 5 years)
  vehicleType?: 'car' | 'bike' | 'ev';
}

export interface VehicleLoanResult {
  vehiclePrice: number;
  downPayment: number;
  downPaymentPercentage: number;
  loanAmount: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  totalVehicleCost: number; // Down Payment + Total Repayment
  tenureMonths: number;
}
```

---

## 5. UI & Interaction Design
1. **Vehicle Type Presets:** Quick selection tabs for Car, Two-Wheeler, and Electric Vehicle (EV) with typical default interest rates and price ranges.
2. **Linked Down Payment Slider:** Sliders for both down payment currency amount (₹) and percentage (10%, 20%, 30%, 50%), automatically keeping each other in sync.
3. **Vehicle Ownership Total Cost:** Highlight shows how much the vehicle will ultimately cost including interest over the loan lifespan.
4. **Depreciation vs Loan Warning:** Visual tip showing why keeping LTV under 80% protects the buyer from being "underwater" on a car loan.
5. **AI Vehicle Advisor:** "Explain Vehicle Financing with Gemini" evaluates if the EMI fits within the recommended 10–15% of monthly income.
