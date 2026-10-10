
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIExplanation({ loanData }) {
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function getExplanation() {
        if (!loanData) return;

        setLoading(true);
        setError("");
        setExplanation("");

        try {
            const response = await fetch(
                "http://localhost:5001/api/ai/explain",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loanData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Could not generate explanation."
                );
            }

            setExplanation(data.explanation);
        } catch (err) {
            setError(
                err.message ||
                "Could not connect to the AI server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="ai-explanation">
            <h2>AI Loan Explanation</h2>

            <p>
                Understand your EMI, interest, and total repayment
                in simple English with Gemini AI.
            </p>

            <button
                type="button"
                onClick={getExplanation}
                disabled={!loanData || loading}
            >
                {loading
                    ? "Generating explanation..."
                    : "Explain My Loan with AI"}
            </button>

            {!loanData && (
                <p className="ai-muted">
                    Calculate your EMI first to enable AI explanation.
                </p>
            )}

            {error && <p className="ai-error">{error}</p>}


            {explanation && (
                <div className="ai-response">
                    <h3>Here's what your loan figures mean</h3>
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                </div>
            )}

        </section>
    );
}
