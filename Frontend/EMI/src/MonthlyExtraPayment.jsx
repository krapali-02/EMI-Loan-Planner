import { useState } from "react";

function formatMoney(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(value);
}

function calculateEMI(principal, annualRate, months) {
    if (principal <= 0 || months <= 0) return 0;

    const monthlyRate = annualRate / 1200;

    if (monthlyRate === 0) return principal / months;

    const factor = Math.pow(1 + monthlyRate, months);

    return (principal * monthlyRate * factor) / (factor - 1);
}

function simulateRepayment(principal, annualRate, months, extraPayment = 0) {
    const monthlyRate = annualRate / 1200;
    const emi = calculateEMI(principal, annualRate, months);

    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    const schedule = [];

    for (let month = 1; month <= months && balance > 0.005; month++) {
        const openingBalance = balance;
        const interest = openingBalance * monthlyRate;
        const amountDue = openingBalance + interest;

        // The last payment cannot exceed the amount still due.
        const payment = Math.min(emi + extraPayment, amountDue);
        const principalPaid = Math.min(openingBalance, payment - interest);

        balance = Math.max(0, openingBalance - principalPaid);
        totalInterest += interest;
        totalPaid += payment;

        schedule.push({
            month,
            openingBalance,
            emiPaid: Math.min(emi, payment),
            extraPaid: Math.max(0, payment - emi),
            interest,
            principalPaid,
            closingBalance: balance,
            totalPayment: payment,
        });
    }

    return {
        emi,
        totalInterest,
        totalPaid,
        monthsPaid: schedule.length,
        schedule,
    };
}

export default function MonthlyExtraPayment() {
    const [principalInput, setPrincipalInput] = useState("500000");
    const [rateInput, setRateInput] = useState("8.5");
    const [tenureInput, setTenureInput] = useState("60");
    const [extraInput, setExtraInput] = useState("2000");
    const [showResults, setShowResults] = useState(false);

    const principal = Number(principalInput);
    const annualRate = Number(rateInput);
    const months = Number(tenureInput);
    const extraPayment = Number(extraInput);

    const valid =
        principalInput.trim() !== "" &&
        rateInput.trim() !== "" &&
        tenureInput.trim() !== "" &&
        extraInput.trim() !== "" &&
        Number.isFinite(principal) &&
        Number.isFinite(annualRate) &&
        Number.isFinite(months) &&
        Number.isFinite(extraPayment) &&
        principal > 0 &&
        annualRate >= 0 &&
        annualRate <= 100 &&
        Number.isInteger(months) &&
        months >= 1 &&
        months <= 600 &&
        extraPayment >= 0 &&
        extraPayment <= principal;

    const baseline = valid
        ? simulateRepayment(principal, annualRate, months)
        : null;

    const withExtra = valid
        ? simulateRepayment(principal, annualRate, months, extraPayment)
        : null;

    const interestSaved =
        baseline && withExtra
            ? Math.max(0, baseline.totalInterest - withExtra.totalInterest)
            : 0;

    const monthsSaved =
        baseline && withExtra
            ? Math.max(0, baseline.monthsPaid - withExtra.monthsPaid)
            : 0;

    return (
        <section className="monthly-extra-section">
            <div className="monthly-extra-heading">
                <p className="monthly-extra-eyebrow">BUILD A SMARTER REPAYMENT PLAN</p>
                <h2>Monthly Extra Payment Planner</h2>
                <p>
                    See how adding a little extra to every EMI can help you repay your
                    loan sooner and reduce interest.
                </p>
            </div>

            <div className="monthly-extra-layout">
                <div className="monthly-extra-form">
                    <h3>Your loan details</h3>

                    <label>
                        Outstanding loan amount (₹)
                        <input
                            type="number"
                            min="1"
                            value={principalInput}
                            onChange={(e) => {
                                setPrincipalInput(e.target.value);
                                setShowResults(false);
                            }}
                        />
                    </label>

                    <label>
                        Annual interest rate (%)
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            value={rateInput}
                            onChange={(e) => {
                                setRateInput(e.target.value);
                                setShowResults(false);
                            }}
                        />
                    </label>

                    <label>
                        Remaining tenure (months)
                        <input
                            type="number"
                            min="1"
                            max="600"
                            step="1"
                            value={tenureInput}
                            onChange={(e) => {
                                setTenureInput(e.target.value);
                                setShowResults(false);
                            }}
                        />
                    </label>

                    <label>
                        Extra payment every month (₹)
                        <input
                            type="number"
                            min="0"
                            step="any"
                            value={extraInput}
                            onChange={(e) => {
                                setExtraInput(e.target.value);
                                setShowResults(false);
                            }}
                        />
                    </label>

                    <p className="monthly-extra-hint">
                        The extra payment is applied every month from the first repayment.
                        Enter 0 to compare with the normal EMI schedule.
                    </p>

                    <button
                        type="button"
                        className="monthly-extra-button"
                        onClick={() => setShowResults(true)}
                    >
                        Calculate Repayment Impact
                    </button>

                    {showResults && !valid && (
                        <p className="monthly-extra-error">
                            Enter a positive loan amount, a rate from 0% to 100%, a whole
                            number of months from 1 to 600, and an extra payment from 0 to
                            the loan amount.
                        </p>
                    )}
                </div>

                <div className="monthly-extra-results">
                    <h3>Repayment summary</h3>

                    {valid ? (
                        <>
                            <div className="monthly-extra-stat">
                                <span>Regular monthly EMI</span>
                                <strong>{formatMoney(baseline.emi)}</strong>
                            </div>

                            <div className="monthly-extra-stat">
                                <span>Monthly payment with extra</span>
                                <strong>{formatMoney(baseline.emi + extraPayment)}</strong>
                            </div>

                            {showResults && (
                                <>
                                    <div className="monthly-extra-stat">
                                        <span>Interest without extra payments</span>
                                        <strong>{formatMoney(baseline.totalInterest)}</strong>
                                    </div>

                                    <div className="monthly-extra-stat">
                                        <span>Interest with extra payments</span>
                                        <strong>{formatMoney(withExtra.totalInterest)}</strong>
                                    </div>

                                    <div className="monthly-extra-highlight">
                                        <span>Total interest saved</span>
                                        <strong>{formatMoney(interestSaved)}</strong>
                                    </div>

                                    <div className="monthly-extra-highlight">
                                        <span>Months saved</span>
                                        <strong>{monthsSaved} months</strong>
                                    </div>

                                    <div className="monthly-extra-stat">
                                        <span>Normal loan payoff</span>
                                        <strong>{baseline.monthsPaid} months</strong>
                                    </div>

                                    <div className="monthly-extra-stat">
                                        <span>Payoff with extra payments</span>
                                        <strong>{withExtra.monthsPaid} months</strong>
                                    </div>
                                </>
                            )}

                            {!showResults && (
                                <p className="monthly-extra-hint">
                                    Click Calculate Repayment Impact to view savings and the
                                    month-by-month repayment schedule.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="monthly-extra-hint">
                            Enter valid loan details to see your repayment estimate.
                        </p>
                    )}
                </div>
            </div>

            {showResults && valid && (
                <div className="monthly-extra-table-wrapper">
                    <h3>Repayment schedule with extra payments</h3>
                    <p className="monthly-extra-hint">
                        Each row shows how the monthly extra payment affects the outstanding
                        balance.
                    </p>

                    <div className="monthly-extra-table-scroll">
                        <table className="monthly-extra-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Opening balance</th>
                                    <th>Regular EMI</th>
                                    <th>Extra payment</th>
                                    <th>Interest</th>
                                    <th>Principal paid</th>
                                    <th>Closing balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withExtra.schedule.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{formatMoney(row.openingBalance)}</td>
                                        <td>{formatMoney(row.emiPaid)}</td>
                                        <td>{formatMoney(row.extraPaid)}</td>
                                        <td>{formatMoney(row.interest)}</td>
                                        <td>{formatMoney(row.principalPaid)}</td>
                                        <td>{formatMoney(row.closingBalance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="monthly-extra-hint">
                        Estimates assume a fixed annual interest rate, monthly reducing
                        balance, and no extra fees or prepayment penalties. Actual lender
                        schedules may differ.
                    </p>
                </div>
            )}
        </section>
    );
}
