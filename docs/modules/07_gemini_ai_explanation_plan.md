# Module 07 Plan: Gemini AI Explanation Service (FR-08)

> **SRS References:** FR-08 (Gemini AI Explanation), Section 13 (API-01), Section 19 (Security), Section 30 (Core Architectural Principle)  
> **Source SRS:** [Loan_and_EMI_Planner_SRS.pdf](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/docs/Loan_and_EMI_Planner_SRS.pdf)  
> **Master Plan:** [IMPLEMENTATION_PLAN.md](file:///c:/Users/WELCOME/OneDrive/Desktop/Project 1 EMI/IMPLEMENTATION_PLAN.md)  

---

## 1. Overview & Objectives
The Gemini AI Explanation Service translates cold, calculated numbers into actionable, plain-English financial insights. In accordance with **SRS Section 30**, Gemini is **strictly explanatory**:
- The application math engine computes all numbers first.
- The server sends verified mathematical outputs to Gemini.
- Gemini returns a structured, beginner-friendly explanation (e.g., breakdown of interest burden, impact of prepayment, comparison trade-offs, and cautionary tips).

---

## 2. Dedicated Separate Files for This Module

| File Role | Path | Purpose |
| :--- | :--- | :--- |
| **Types Definition** | `src/types/ai.ts` | Request and response schema for AI explanation payloads |
| **Gemini Client** | `src/lib/ai/gemini.ts` | Server-side Google Gen AI SDK client initialization |
| **Prompt Engineering** | `src/lib/ai/prompts.ts` | Modular prompt builders tailored for each planner type |
| **Server API Route** | `src/app/api/ai/explain/route.ts` | Next.js server route handling POST requests, error handling, and key isolation |
| **UI Component** | `src/components/displays/AiExplanationCard.tsx` | Front-end card showing loading skeleton, streaming/rendered text, and retry buttons |

---

## 3. Server-Side API Specification (`POST /api/ai/explain`)

### 3.1 Request Payload
```typescript
export interface AiExplanationRequest {
  plannerType: 'standard_emi' | 'comparison' | 'prepayment' | 'strategy' | 'education' | 'vehicle';
  summary: {
    principal: number;
    interestRate: number;
    tenureMonths: number;
    monthlyEmi?: number;
    totalInterest?: number;
    totalPayment?: number;
    [key: string]: any;
  };
  details?: Record<string, any>; // Extra context (e.g. down payment, moratorium, comparison loans)
}
```

### 3.2 Response Payload
```typescript
export interface AiExplanationResponse {
  success: boolean;
  explanation?: {
    summary: string;
    keyTakeaways: string[];
    interestBurdenAnalysis: string;
    smartRecommendation: string;
    disclaimer: string;
  };
  error?: string;
}
```

---

## 4. Prompt Engineering Architecture (`src/lib/ai/prompts.ts`)

Prompts enforce strict behavioral constraints:
1. **Never recalculate:** Trust the provided calculated figures completely.
2. **Financial Tone:** Friendly, objective, transparent, and non-jargon.
3. **Structured Output:** Return responses adhering to clear headings or clean JSON format.
4. **Mandatory Disclaimer:** Always include the note: *"This summary is for informational and educational purposes only and does not constitute certified financial or investment advice."*

---

## 5. Security & Error Handling Constraints
1. **Zero Secret Leakage:** The `GEMINI_API_KEY` is loaded strictly via `process.env.GEMINI_API_KEY` in the server route. It is never exposed in client bundles.
2. **Input Sanitization:** Validate request JSON payload lengths and reject malformed objects.
3. **Graceful Fallbacks:** If the Gemini API fails, times out, or the API key is not configured, the frontend gracefully shows: *"AI explanation temporarily unavailable. Your calculated results above remain 100% accurate."* The core application functionality remains fully operational.
