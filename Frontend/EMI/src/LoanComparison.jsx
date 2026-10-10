import { useState } from "react";

const initialLoans = [
    { name: "Loan A", amount: 500000, rate: 8.5, years: 5 },
    { name: "Loan B", amount: 500000, rate: 9.0, years: 5 },
    { name: "Loan C", amount: 500000, rate: 8.0, years: 4 },
];

function calculateLoan(loan) {
    const principal = Number(loan.amount);
    const annualRate = Number(loan.rate);
    const years = Number(loan.years);

    if (
        !Number.isFinite(principal) ||
        !Number.isFinite(annualRate) ||
        !Number.isFinite(years) ||
        principal <= 0 ||
        annualRate < 0 ||
        years <= 0 ||
        years > 100
    ) {
        return null;
    }

    const months = Math.round(years * 12);
    const monthlyRate = annualRate / 1200;

    const emi =
        monthlyRate === 0
            ? principal / months
            : (principal *
                monthlyRate *
                Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

    if (!Number.isFinite(emi)) return null;

    const totalPayment = emi * months;

    return {
        emi,
        totalPayment,
        totalInterest: totalPayment - principal,
    };
}

function formatRupees(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(value);
}

export default function LoanComparison() {
    const [loans, setLoans] = useState(initialLoans);

    const updateLoan = (index, field, value) => {
        setLoans((current) =>
            current.map((loan, i) =>
                i === index ? { ...loan, [field]: value } : loan
            )
        );
    };

    const results = loans.map((loan) => calculateLoan(loan));
    const validResults = results.filter(Boolean);

    const lowestInterest =
        validResults.length > 0
            ? Math.min(...validResults.map((result) => result.totalInterest))
            : null;

    return (
        <section className="comparison-section">
            <div className="comparison-heading">
                <div>
                    <p className="comparison-eyebrow">PLAN SMARTER</p>
                    <h2>Loan Comparison</h2>
                    <p className="comparison-description">
                        Compare up to 3 loan offers and understand their costs.
                    </p>
                </div>
            </div>

            <div className="loan-input-grid">
                {loans.map((loan, index) => {
                    const result = results[index];

                    return (
                        <article className="loan-card" key={index}>
                            <div className="loan-card-heading">
                                <h3>{loan.name}</h3>
                                <span>Offer {index + 1}</span>
                            </div>

                            <label>
                                Loan name
                                <input
                                    value={loan.name}
                                    onChange={(e) =>
                                        updateLoan(index, "name", e.target.value)
                                    }
                                    maxLength={40}
                                    required
                                />
                            </label>

                            <label>
                                Loan amount (₹)
                                <input
                                    type="number"
                                    min="1"
                                    step="any"
                                    value={loan.amount}
                                    onChange={(e) =>
                                        updateLoan(index, "amount", e.target.value)
                                    }
                                />
                            </label>

                            <label>
                                Annual interest rate (%)
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="any"
                                    value={loan.rate}
                                    onChange={(e) =>
                                        updateLoan(index, "rate", e.target.value)
                                    }
                                />
                            </label>

                            <label>
                                Tenure (years)
                                <input
                                    type="number"
                                    min="0.083333"
                                    max="100"
                                    step="any"
                                    value={loan.years}
                                    onChange={(e) =>
                                        updateLoan(index, "years", e.target.value)
                                    }
                                />
                            </label>

                            {result ? (
                                <div className="loan-result">
                                    <div>
                                        <span>Monthly EMI</span>
                                        <strong>{formatRupees(result.emi)}</strong>
                                    </div>
                                    <div>
                                        <span>Total interest</span>
                                        <strong>{formatRupees(result.totalInterest)}</strong>
                                    </div>
                                    <div>
                                        <span>Total payment</span>
                                        <strong>{formatRupees(result.totalPayment)}</strong>
                                    </div>
                                    {result.totalInterest === lowestInterest && (
                                        <p className="best-loan">Lowest total interest</p>
                                    )}
                                </div>
                            ) : (
                                <p className="loan-error">
                                    Enter a positive amount and tenure, and a valid rate
                                    between 0% and 100%.
                                </p>
                            )}
                        </article>
                    );
                })}
            </div>

            <div className="comparison-table-wrapper">
                <h3>Side-by-side comparison</h3>
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Loan</th>
                            <th>Principal</th>
                            <th>Interest rate</th>
                            <th>Tenure</th>
                            <th>Monthly EMI</th>
                            <th>Total interest</th>
                            <th>Total payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => {
                            const result = results[index];

                            return (
                                <tr key={index}>
                                    <td>{loan.name || `Loan ${index + 1}`}</td>
                                    <td>
                                        {Number(loan.amount) > 0
                                            ? formatRupees(Number(loan.amount))
                                            : "—"}
                                    </td>
                                    <td>
                                        {loan.rate !== "" && Number(loan.rate) >= 0 &&
                                            Number(loan.rate) <= 100
                                            ? `${loan.rate}%`
                                            : "—"}
                                    </td>
                                    <td>
                                        {Number(loan.years) > 0 &&
                                            Number(loan.years) <= 100
                                            ? `${loan.years} years`
                                            : "—"}
                                    </td>
                                    <td>{result ? formatRupees(result.emi) : "Invalid"}</td>
                                    <td>
                                        {result ? formatRupees(result.totalInterest) : "Invalid"}
                                    </td>
                                    <td>
                                        {result ? formatRupees(result.totalPayment) : "Invalid"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="comparison-note">
                Estimates assume a fixed interest rate and equal monthly repayments.
                Actual lender charges, fees, taxes and rounding may change the final
                amount. Compare loans with similar amounts and repayment periods for
                a fairer comparison.
            </p>
        </section>
    );
}