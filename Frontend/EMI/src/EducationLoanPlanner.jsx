
import { useState } from "react";

const money = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

function calculateEMI(principal, annualRate, months) {
    if (principal <= 0 || months <= 0) return 0;

    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0) return principal / months;

    const factor = Math.pow(1 + monthlyRate, months);

    return (
        (principal * monthlyRate * factor) /
        (factor - 1)
    );
}

function buildSchedule(principal, annualRate, months, emi) {
    const monthlyRate = annualRate / 12 / 100;
    let balance = principal;
    let totalInterest = 0;
    let totalPayment = 0;
    const schedule = [];

    for (let month = 1; month <= months && balance > 0.005; month++) {
        const openingBalance = balance;
        const interest = openingBalance * monthlyRate;
        const payment = Math.min(emi, openingBalance + interest);
        const principalPaid = payment - interest;

        balance = Math.max(0, openingBalance - principalPaid);
        totalInterest += interest;
        totalPayment += payment;

        schedule.push({
            month,
            openingBalance,
            payment,
            interest,
            principalPaid,
            closingBalance: balance,
        });
    }

    return { schedule, totalInterest, totalPayment };
}

export default function EducationLoanPlanner() {
    const [principal, setPrincipal] = useState("1000000");
    const [rate, setRate] = useState("9");
    const [studyMonths, setStudyMonths] = useState("48");
    const [moratoriumMonths, setMoratoriumMonths] = useState("12");
    const [repaymentMonths, setRepaymentMonths] = useState("120");
    const [interestMode, setInterestMode] = useState("capitalize");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    function calculate() {
        const p = Number(principal);
        const r = Number(rate);
        const study = Number(studyMonths);
        const moratorium = Number(moratoriumMonths);
        const repayment = Number(repaymentMonths);

        if (!principal.trim() || !rate.trim() ||
            !studyMonths.trim() || !moratoriumMonths.trim() ||
            !repaymentMonths.trim()) {
            setError("Please fill in all fields.");
            setResult(null);
            return;
        }

        if (!Number.isFinite(p) || p <= 0) {
            setError("Loan amount must be greater than zero.");
            setResult(null);
            return;
        }

        if (!Number.isFinite(r) || r < 0 || r > 100) {
            setError("Interest rate must be between 0 and 100.");
            setResult(null);
            return;
        }

        if (
            !Number.isInteger(study) || study < 0 || study > 120 ||
            !Number.isInteger(moratorium) || moratorium < 0 || moratorium > 120
        ) {
            setError("Study and moratorium periods must be whole months between 0 and 120.");
            setResult(null);
            return;
        }

        if (!Number.isInteger(repayment) || repayment < 1 || repayment > 600) {
            setError("Repayment tenure must be between 1 and 600 months.");
            setResult(null);
            return;
        }

        const graceMonths = study + moratorium;
        const monthlyRate = r / 12 / 100;

        // Assumption: interest accrues on the original principal
        // during the study and moratorium period, without compounding.
        const graceInterest = p * monthlyRate * graceMonths;

        const repaymentPrincipal =
            interestMode === "capitalize" ? p + graceInterest : p;

        const emi = calculateEMI(repaymentPrincipal, r, repayment);
        const repaymentResult = buildSchedule(
            repaymentPrincipal,
            r,
            repayment,
            emi
        );

        const graceInterestPaid =
            interestMode === "pay" ? graceInterest : 0;

        setResult({
            graceMonths,
            graceInterest,
            graceInterestPaid,
            repaymentPrincipal,
            emi,
            totalRepayment: repaymentResult.totalPayment,
            repaymentInterest: repaymentResult.totalInterest,
            totalInterest: graceInterest + repaymentResult.totalInterest,
            totalOutflow: graceInterestPaid + repaymentResult.totalPayment,
            schedule: repaymentResult.schedule,
        });

        setError("");
    }

    return (
        <section className="education-planner">
            <div className="education-header">
                <span className="education-eyebrow">SPECIALIZED LOAN PLANNER</span>
                <h2>Education Loan Planner</h2>
                <p>
                    Estimate interest during your studies and plan your repayment
                    after the moratorium period.
                </p>
            </div>

            <div className="education-layout">
                <div className="education-form">
                    <label>
                        Education loan amount (₹)
                        <input
                            type="number"
                            min="1"
                            value={principal}
                            onChange={(e) => setPrincipal(e.target.value)}
                            placeholder="e.g. 1000000"
                        />
                    </label>

                    <label>
                        Annual interest rate (%)
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="e.g. 9"
                        />
                    </label>

                    <label>
                        Study period (months)
                        <input
                            type="number"
                            min="0"
                            max="120"
                            value={studyMonths}
                            onChange={(e) => setStudyMonths(e.target.value)}
                        />
                    </label>

                    <label>
                        Moratorium after study (months)
                        <input
                            type="number"
                            min="0"
                            max="120"
                            value={moratoriumMonths}
                            onChange={(e) => setMoratoriumMonths(e.target.value)}
                        />
                    </label>

                    <label>
                        Repayment tenure (months)
                        <input
                            type="number"
                            min="1"
                            max="600"
                            value={repaymentMonths}
                            onChange={(e) => setRepaymentMonths(e.target.value)}
                        />
                    </label>

                    <label>
                        Interest during study and moratorium
                        <select
                            value={interestMode}
                            onChange={(e) => setInterestMode(e.target.value)}
                        >
                            <option value="capitalize">
                                Add unpaid interest to loan
                            </option>
                            <option value="pay">
                                Pay interest during this period
                            </option>
                        </select>
                    </label>

                    <button
                        type="button"
                        className="education-button"
                        onClick={calculate}
                    >
                        Calculate Education Loan
                    </button>

                    {error && <p className="education-error">{error}</p>}
                </div>

                <div className="education-info">
                    <h3>How it works</h3>
                    <ul>
                        <li>
                            <strong>Study period:</strong> Interest accumulates while you
                            study.
                        </li>
                        <li>
                            <strong>Moratorium:</strong> An additional grace period after
                            your study period.
                        </li>
                        <li>
                            <strong>Capitalized interest:</strong> Unpaid interest is added
                            to the repayment principal.
                        </li>
                        <li>
                            <strong>Interest paid:</strong> You pay the accrued interest
                            separately, so it is not added to the loan balance.
                        </li>
                    </ul>
                    <p className="education-note">
                        This is an estimate, not a lender quote. Actual education-loan
                        rules, disbursements, and interest calculations may differ.
                    </p>
                </div>
            </div>

            {result && (
                <div className="education-results">
                    <h3>Your Education Loan Estimate</h3>

                    <div className="education-metrics">
                        <div className="education-metric">
                            <span>Monthly EMI</span>
                            <strong>{money(result.emi)}</strong>
                        </div>

                        <div className="education-metric">
                            <span>Interest during grace period</span>
                            <strong>{money(result.graceInterest)}</strong>
                        </div>

                        <div className="education-metric">
                            <span>Balance when repayment starts</span>
                            <strong>{money(result.repaymentPrincipal)}</strong>
                        </div>

                        <div className="education-metric">
                            <span>Interest during repayment</span>
                            <strong>{money(result.repaymentInterest)}</strong>
                        </div>

                        <div className="education-metric">
                            <span>Total interest over loan life</span>
                            <strong>{money(result.totalInterest)}</strong>
                        </div>

                        <div className="education-metric">
                            <span>Total amount paid</span>
                            <strong>{money(result.totalOutflow)}</strong>
                        </div>
                    </div>

                    <p className="education-summary">
                        Interest accrues for {result.graceMonths} months before
                        repayment.{" "}
                        {interestMode === "capitalize"
                            ? "It is added to the loan balance, so your repayment EMI is calculated on the increased principal."
                            : "It is paid separately during the grace period, so your repayment EMI is calculated on the original principal."}
                    </p>

                    <h3>Repayment Schedule</h3>
                    <div className="education-table-wrap">
                        <table className="education-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Opening Balance</th>
                                    <th>EMI</th>
                                    <th>Interest</th>
                                    <th>Principal Paid</th>
                                    <th>Closing Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.schedule.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{money(row.openingBalance)}</td>
                                        <td>{money(row.payment)}</td>
                                        <td>{money(row.interest)}</td>
                                        <td>{money(row.principalPaid)}</td>
                                        <td>{money(row.closingBalance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
