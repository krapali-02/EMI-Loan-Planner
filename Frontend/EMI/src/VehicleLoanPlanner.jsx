
import { useState } from "react";

const money = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

function getEMI(principal, annualRate, months) {
    const r = annualRate / 1200;
    if (r === 0) return principal / months;

    const factor = Math.pow(1 + r, months);
    return (principal * r * factor) / (factor - 1);
}

export default function VehicleLoanPlanner() {
    const [vehicle, setVehicle] = useState("Car");
    const [price, setPrice] = useState("1000000");
    const [downPayment, setDownPayment] = useState("200000");
    const [rate, setRate] = useState("9");
    const [years, setYears] = useState("5");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    function calculate() {
        const cost = Number(price);
        const down = Number(downPayment);
        const annualRate = Number(rate);
        const tenureYears = Number(years);

        if (
            !price.trim() || !downPayment.trim() ||
            !rate.trim() || !years.trim() ||
            !Number.isFinite(cost) || cost <= 0 ||
            !Number.isFinite(down) || down < 0 || down >= cost ||
            !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100 ||
            !Number.isFinite(tenureYears) || tenureYears <= 0 || tenureYears > 10
        ) {
            setError(
                "Enter a valid vehicle price, down payment below the price, interest rate (0–100%), and tenure (up to 10 years)."
            );
            setResult(null);
            return;
        }

        const principal = cost - down;
        const months = Math.round(tenureYears * 12);
        const emi = getEMI(principal, annualRate, months);
        const monthlyRate = annualRate / 1200;

        let balance = principal;
        let totalInterest = 0;
        let totalPaid = 0;
        const schedule = [];

        for (let month = 1; month <= months && balance > 0.005; month++) {
            const openingBalance = balance;
            const interest = openingBalance * monthlyRate;
            const payment = Math.min(emi, openingBalance + interest);
            const principalPaid = payment - interest;

            balance = Math.max(0, openingBalance - principalPaid);
            totalInterest += interest;
            totalPaid += payment;

            schedule.push({
                month,
                openingBalance,
                payment,
                principalPaid,
                interest,
                closingBalance: balance,
            });
        }

        setResult({
            principal,
            months,
            emi,
            totalInterest,
            totalPaid,
            totalCost: down + totalPaid,
            schedule,
        });
        setError("");
    }

    return (
        <section className="vehicle-planner">
            <div className="vehicle-header">
                <span>VEHICLE FINANCING</span>
                <h2>Vehicle Loan Planner</h2>
                <p>Plan your car or bike loan before making a purchase.</p>
            </div>

            <div className="vehicle-layout">
                <div className="vehicle-form">
                    <label>
                        Vehicle type
                        <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
                            <option>Car</option>
                            <option>Bike</option>
                            <option>Scooter</option>
                            <option>Other</option>
                        </select>
                    </label>

                    <label>
                        On-road vehicle price (₹)
                        <input
                            type="number"
                            min="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </label>

                    <label>
                        Down payment (₹)
                        <input
                            type="number"
                            min="0"
                            value={downPayment}
                            onChange={(e) => setDownPayment(e.target.value)}
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
                        />
                    </label>

                    <label>
                        Loan tenure (years)
                        <input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.5"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                        />
                    </label>

                    <button type="button" onClick={calculate}>
                        Calculate Vehicle Loan
                    </button>

                    {error && <p className="vehicle-error">{error}</p>}
                </div>

                <div className="vehicle-info">
                    <h3>Loan breakdown</h3>
                    <p>Vehicle price: {money(Number(price) || 0)}</p>
                    <p>Down payment: {money(Number(downPayment) || 0)}</p>
                    <p>
                        Estimated loan:{" "}
                        {money(Math.max(0, (Number(price) || 0) - (Number(downPayment) || 0)))}
                    </p>
                    <p className="vehicle-note">
                        This estimate excludes any additional fees or insurance not included
                        in the entered vehicle price.
                    </p>
                </div>
            </div>

            {result && (
                <div className="vehicle-results">
                    <h3>{vehicle} Loan Estimate</h3>

                    <div className="vehicle-metrics">
                        <div><span>Monthly EMI</span><strong>{money(result.emi)}</strong></div>
                        <div><span>Loan amount</span><strong>{money(result.principal)}</strong></div>
                        <div><span>Total interest</span><strong>{money(result.totalInterest)}</strong></div>
                        <div><span>Total loan payments</span><strong>{money(result.totalPaid)}</strong></div>
                        <div><span>Down payment + loan payments</span><strong>{money(result.totalCost)}</strong></div>
                        <div><span>Repayment tenure</span><strong>{result.months} months</strong></div>
                    </div>

                    <h3>Vehicle Loan Amortization Schedule</h3>
                    <div className="vehicle-table-wrap">
                        <table className="vehicle-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Opening Balance</th>
                                    <th>Payment</th>
                                    <th>Principal</th>
                                    <th>Interest</th>
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
                </div>
            )}
        </section>
    );
}
