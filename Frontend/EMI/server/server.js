
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 5001;


app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
    })
);

app.use(express.json({ limit: "10kb" }));

if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in server/.env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.post("/api/ai/explain", async (req, res) => {
    try {
        const { amount, rate, years, emi, totalInterest, totalPayment } =
            req.body || {};

        const values = [amount, rate, years, emi, totalInterest, totalPayment];

        if (
            values.some(
                (value) =>
                    value === "" || value === null || value === undefined
            ) ||
            values.some((value) => !Number.isFinite(Number(value))) ||
            Number(amount) <= 0 ||
            Number(rate) < 0 ||
            Number(years) <= 0 ||
            Number(emi) < 0 ||
            Number(totalInterest) < 0 ||
            Number(totalPayment) < 0
        ) {
            return res.status(400).json({
                error: "Please provide valid loan calculation results.",
            });
        }

        const prompt = `
You are a loan education assistant for a student project.
Explain these already-calculated loan figures in simple English.

Loan amount: ₹${Number(amount).toFixed(2)}
Annual interest rate: ${Number(rate)}%
Tenure: ${Number(years)} years
Monthly EMI: ₹${Number(emi).toFixed(2)}
Total interest: ₹${Number(totalInterest).toFixed(2)}
Total payment: ₹${Number(totalPayment).toFixed(2)}

Include:
1. What the monthly EMI means.
2. How much interest is paid compared with the loan amount.
3. A short summary of total repayment.
4. Two general budgeting tips.

Do not recalculate or change the supplied numbers.
Do not assume the user's income or affordability.
State that this is an estimate, not professional financial advice.
Use headings and short bullet points.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
        });

        if (!response.text) {
            return res.status(502).json({
                error: "Gemini returned an empty explanation. Please try again.",
            });
        }

        return res.json({ explanation: response.text });

    } catch (error) {
        console.error("Gemini request failed:", error);

        return res.status(500).json({
            error: error.message || "Unknown Gemini API error",
        });
    }

});

app.listen(PORT, () => {
    console.log(`AI backend running at http://localhost:${PORT}`);
});
