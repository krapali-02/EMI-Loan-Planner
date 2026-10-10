import { useState } from "react";

function money(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(value);
}

// Calculates a standard reducing-balance EMI.
function calculateEMI(balance, annualRate, months) {
    if (balance <= 0 || months <= 0) return 0;

    const monthlyRate = annualRate / 1200;

    if (monthlyRate === 0) return balance / months;

    return (
        (balance *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
}

// Simulates future monthly payments and optional prepayment.
function simulateLoan({
    balance,
    annualRate,
    months,
    prepayment = 0,
    prepaymentMonth = 1,
    mode = "baseline",
}) {
    const monthlyRate = annualRate / 1200;
    const originalEMI = calculateEMI(balance, annualRate, months);

    let remaining = balance;
    let totalInterest = 0;
    let totalPaid = 0;
    let emi = originalEMI;
    let actualMonths = 0;

    for (let month = 1; month <= months + 1; month++) {
        if (remaining <= 0.005) break;

        const interest = remaining * monthlyRate;
        const payment = Math.min(emi, remaining + interest);

        totalInterest += interest;
        totalPaid += payment;
        remaining = Math.max(0, remaining + interest - payment);
        actualMonths = month;

        if (mode !== "baseline" && month === prepaymentMonth) {
            const extra = Math.min(prepayment, remaining);

            remaining = Math.max(0, remaining - extra);
            totalPaid += extra;

            if (remaining <= 0.005) {
                remaining = 0;
                break;
            }

            const monthsLeft = months - month;

            if (mode === "reduce-emi" && monthsLeft > 0) {
                emi = calculateEMI(remaining, annualRate, monthsLeft);
            }
        }
    }

    return {
        totalInterest,
        totalPaid,
        months: actualMonths,
        finalBalance: remaining,
        emi: originalEMI,
    };
}

export default function LoanPrepayment() {
    const [balance, setBalance] = useState("500000");
    const [rate, setRate] = useState("8.5");
    const [tenure, setTenure] = useState("60");
    const [prepayment, setPrepayment] = useState("50000");
    const [prepaymentMonth, setPrepaymentMonth] = useState("12");
    const [submitted, setSubmitted] = useState(false);

    const principal = Number(balance);
    const annualRate = Number(rate);
    const months = Number(tenure);
    const extra = Number(prepayment);
    const month = Number(prepaymentMonth);

    const valid =
        balance.trim() !== "" &&
        rate.trim() !== "" &&
        tenure.trim() !== "" &&
        prepayment.trim() !== "" &&
        prepaymentMonth.trim() !== "" &&
        Number.isFinite(principal) &&
        Number.isFinite(annualRate) &&
        Number.isFinite(months) &&
        Number.isFinite(extra) &&
        Number.isFinite(month) &&
        principal > 0 &&
        annualRate >= 0 &&
        annualRate <= 100 &&
        Number.isInteger(months) &&
        months >= 1 &&
        months <= 600 &&
        extra > 0 &&
        extra < principal &&
        Number.isInteger(month) &&
        month >= 1 &&
        month <= months;

    const baseline = valid
        ? simulateLoan({
            balance: principal,
            annualRate,
            months,
        })
        : null;

    const reduceTenure = valid
        ? simulateLoan({
            balance: principal,
            annualRate,
            months,
            prepayment: extra,
            prepaymentMonth: month,
            mode: "reduce-tenure",
        })
        : null;

    const reduceEMI = valid
        ? simulateLoan({
            balance: principal,
            annualRate,
            months,
            prepayment: extra,
            prepaymentMonth: month,
            mode: "reduce-emi",
        })
        : null;

    const originalEMI = valid
        ? calculateEMI(principal, annualRate, months)
        : 0;

    const revisedEMI =
        valid && month < months
            ? calculateEMI(
                Math.max(
                    0,
                    principal -
                    simulateLoan({
                        balance: principal,
                        annualRate,
                        months,
                        prepayment: 0,
                    }).finalBalance
                ),
                annualRate,
                months
            )
            : originalEMI;

    // Compute the balance immediately after the selected month's EMI.
    function getBalanceAfterMonth() {
        let current = principal;
        const monthlyRate = annualRate / 1200;

        for (let i = 1; i <= month; i++) {
            const interest = current * monthlyRate;
            const payment = Math.min(originalEMI, current + interest);
            current = Math.max(0, current + interest - payment);
        }

        return current;
    }

    const balanceBeforeExtra = valid ? getBalanceAfterMonth() : 0;
    const balanceAfterExtra = Math.max(0, balanceBeforeExtra - extra);

    const newEMI =
        valid && month < months
            ? calculateEMI(balanceAfterExtra, annualRate, months - month)
            : 0;

    return (
        <section className="prepayment-section">
            <div className="prepayment-heading">
                <p className="prepayment-eyebrow">PAY OFF SMARTER</p>
                <h2>Lump-Sum Prepayment Simulator</h2>
                <p>
                    See how one extra payment can reduce your future interest or loan
                    tenure.
                </p>
            </div>

            <div className="prepayment-layout">
                <div className="prepayment-form">
                    <h3>Your current loan</h3>

                    <label>
                        Outstanding balance (₹)
                        <input
                            type="number"
                            min="1"
                            value={balance}
                            onChange={(e) => {
                                setBalance(e.target.value);
                                setSubmitted(false);
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
                            value={rate}
                            onChange={(e) => {
                                setRate(e.target.value);
                                setSubmitted(false);
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
                            value={tenure}
                            onChange={(e) => {
                                setTenure(e.target.value);
                                setSubmitted(false);
                            }}
                        />
                    </label>

                    <h3 className="prepayment-subheading">Extra payment</h3>

                    <label>
                        One-time prepayment (₹)
                        <input
                            type="number"
                            min="1"
                            value={prepayment}
                            onChange={(e) => {
                                setPrepayment(e.target.value);
                                setSubmitted(false);
                            }}
                        />
                    </label>

                    <label>
                        Make prepayment after which EMI? (month)
                        <input
                            type="number"
                            min="1"
                            max={months || 1}
                            step="1"
                            value={prepaymentMonth}
                            onChange={(e) => {
                                setPrepaymentMonth(e.target.value);
                                setSubmitted(false);
                            }}
                        />
                    </label>

                    <button
                        type="button"
                        className="prepayment-button"
                        onClick={() => setSubmitted(true)}
                    >
                        Calculate Savings
                    </button>

                    {submitted && !valid && (
                        <p className="prepayment-error">
                            Please enter valid values. The extra payment must be positive
                            and smaller than the outstanding balance. The prepayment month
                            must be within the remaining tenure.
                        </p>
                    )}
                </div>

                <div className="prepayment-results">
                    <h3>Current loan estimate</h3>

                    {valid ? (
                        <>
                            <div className="prepayment-stat">
                                <span>Current monthly EMI</span>
                                <strong>{money(originalEMI)}</strong>
                            </div>

                            <div className="prepayment-stat">
                                <span>Interest without prepayment</span>
                                <strong>{money(baseline.totalInterest)}</strong>
                            </div>

                            {submitted && (
                                <>
                                    <div className="prepayment-stat">
                                        <span>Balance after selected month's EMI</span>
                                        <strong>{money(balanceBeforeExtra)}</strong>
                                    </div>

                                    <div className="prepayment-stat">
                                        <span>Balance after extra payment</span>
                                        <strong>{money(balanceAfterExtra)}</strong>
                                    </div>

                                    <div className="prepayment-option">
                                        <h4>Option 1: Reduce tenure</h4>
                                        <p>
                                            New EMI: <strong>{money(originalEMI)}</strong>
                                        </p>
                                        <p>
                                            Revised payoff time:{" "}
                                            <strong>{reduceTenure.months} months</strong>
                                        </p>
                                        <p>
                                            Interest saved:{" "}
                                            <strong>
                                                {money(
                                                    Math.max(
                                                        0,
                                                        baseline.totalInterest -
                                                        reduceTenure.totalInterest
                                                    )
                                                )}
                                            </strong>
                                        </p>
                                    </div>

                                    <div className="prepayment-option">
                                        <h4>Option 2: Reduce EMI</h4>
                                        <p>
                                            Revised EMI after prepayment:{" "}
                                            <strong>{money(newEMI)}</strong>
                                        </p>
                                        <p>
                                            Remaining scheduled tenure:{" "}
                                            <strong>{Math.max(0, months - month)} months</strong>
                                        </p>
                                        <p>
                                            Interest saved:{" "}
                                            <strong>
                                                {money(
                                                    Math.max(
                                                        0,
                                                        baseline.totalInterest - reduceEMI.totalInterest
                                                    )
                                                )}
                                            </strong>
                                        </p>
                                    </div>

                                    <p className="prepayment-note">
                                        Estimate assumes a fixed rate, monthly reducing-balance
                                        interest and no lender fees or prepayment penalties. The
                                        extra payment is applied after the selected month's EMI.
                                        Your lender's actual schedule may differ.
                                    </p>
                                </>
                            )}

                            {!submitted && (
                                <p className="prepayment-note">
                                    Change the inputs and select Calculate Savings to view both
                                    prepayment options.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="prepayment-note">
                            Enter valid loan details to calculate your estimate.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}