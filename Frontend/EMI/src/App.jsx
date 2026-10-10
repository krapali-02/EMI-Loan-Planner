import LoanComparison from "./LoanComparison.jsx";
import { useState } from "react";
import LoanPrepayment from "./LoanPrepayment.jsx";
import MonthlyExtraPayment from "./MonthlyExtraPayment.jsx";
import EducationLoanPlanner from "./EducationLoanPlanner.jsx";
import VehicleLoanPlanner from "./VehicleLoanPlanner.jsx";
import AIExplanation from "./AIExplanation.jsx";

function App() {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(8.5);
    const [years, setYears] = useState(5);
    const [result, setResult] = useState(null);

    function calculateEMI(e) {
        e.preventDefault();

        const principal = Number(amount);
        const annualRate = Number(rate);
        const tenure = Number(years);

        if (
            !Number.isFinite(principal) ||
            !Number.isFinite(annualRate) ||
            !Number.isFinite(tenure) ||
            principal <= 0 ||
            annualRate < 0 ||
            tenure <= 0
        ) {
            alert("Please enter valid loan details.");
            return;
        }

        const monthlyRate = annualRate / 1200;
        const months = Math.round(tenure * 12);

        const emi =
            monthlyRate === 0
                ? principal / months
                : (principal *
                    monthlyRate *
                    Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);

        let balance = principal;
        let totalInterest = 0;
        const schedule = [];

        for (let month = 1; month <= months; month++) {
            const openingBalance = balance;
            const interest = openingBalance * monthlyRate;
            const regularPrincipal = emi - interest;

            // Final installment clears the remaining balance.
            const principalPaid =
                month === months
                    ? openingBalance
                    : Math.min(openingBalance, regularPrincipal);

            const payment = principalPaid + interest;
            balance = Math.max(0, openingBalance - principalPaid);
            totalInterest += interest;

            schedule.push({
                month,
                openingBalance,
                payment,
                principalPaid,
                interest,
                closingBalance: balance,
            });
        }

        const totalPayment = principal + totalInterest;

        setResult({
            emi,
            totalPayment,
            totalInterest,
            schedule,
        });
    }

    const money = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <main className="app-container">
            <header className="page-header">
                <p className="eyebrow">SMART FINANCIAL PLANNING</p>
                <h1>Loan &amp; EMI Planner</h1>
                <p>Understand your monthly payments and plan your loan better.</p>
            </header>

            <section className="calculator-card">
                <h2>Calculate your EMI</h2>

                <form onSubmit={calculateEMI}>
                    <label htmlFor="amount">Loan Amount (₹)</label>
                    <input
                        id="amount"
                        type="number"
                        min="1"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <label htmlFor="rate">Annual Interest Rate (%)</label>
                    <input
                        id="rate"
                        type="number"
                        min="0"
                        step="any"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        required
                    />

                    <label htmlFor="years">Loan Tenure (Years)</label>
                    <input
                        id="years"
                        type="number"
                        min="0.0833333333"
                        max="50"
                        step="any"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        required
                    />

                    <button type="submit">Calculate EMI</button>
                </form>
            </section>

            {result && (
                <>
                    <section className="results-grid">
                        <article className="result-card featured">
                            <p>Monthly EMI</p>
                            <h2>{money(result.emi)}</h2>
                        </article>

                        <article className="result-card">
                            <p>Total Interest</p>
                            <h2>{money(result.totalInterest)}</h2>
                        </article>

                        <article className="result-card">
                            <p>Total Payment</p>
                            <h2>{money(result.totalPayment)}</h2>
                        </article>
                    </section>

                    <section className="schedule-section">
                        <div className="schedule-header">
                            <div>
                                <h2>Amortization Schedule</h2>
                                <p>See how every monthly payment reduces your loan.</p>
                            </div>
                            <span>{result.schedule.length} installments</span>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Opening Balance</th>
                                        <th>EMI Payment</th>
                                        <th>Principal Paid</th>
                                        <th>Interest Paid</th>
                                        <th>Closing Balance</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {result.schedule.map((row) => (
                                        <tr key={row.month}>
                                            <td>{row.month}</td>
                                            <td>{money(row.openingBalance)}</td>
                                            <td>{money(row.payment)}</td>
                                            <td>{money(row.principalPaid)}</td>
                                            <td>{money(row.interest)}</td>
                                            <td>{money(row.closingBalance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="schedule-note">
                            Interest is calculated monthly on the opening balance.
                            The final installment is adjusted to clear the remaining
                            principal. Actual lender schedules may differ due to rounding
                            and payment-date conventions.
                        </p>
                    </section>
                </>
            )}

            <AIExplanation
                loanData={
                    result
                        ? {
                            amount: Number(amount),
                            rate: Number(rate),
                            years: Number(years),
                            emi: result.emi,
                            totalInterest: result.totalInterest,
                            totalPayment: result.totalPayment,
                        }
                        : null
                }
            />



            <LoanComparison />
            <LoanPrepayment />
            <MonthlyExtraPayment />
            <EducationLoanPlanner />
            <VehicleLoanPlanner />

        </main>
    );
}

export default App;


