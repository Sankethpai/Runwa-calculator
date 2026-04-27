import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CashChart from "../components/CashChart";

function formatMoney(value, currency) {
  const num = Number(value);
  if (!num || num < 0) return `${currency}0`;
  return `${currency}${num.toLocaleString()}`;
}

function downloadReport(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "runway-report.txt";
  a.click();

  URL.revokeObjectURL(url);
}

export default function CalculatorPage() {
  const [cash, setCash] = useState(() => localStorage.getItem("cash") || "");
  const [burn, setBurn] = useState(() => localStorage.getItem("burn") || "");
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "₹"
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("cash", cash);
    localStorage.setItem("burn", burn);
    localStorage.setItem("currency", currency);
    localStorage.setItem("darkMode", darkMode);
  }, [cash, burn, currency, darkMode]);

  // Runway Months = Total Cash / Monthly Burn
  const runwayMonths = useMemo(() => {
    const totalCash = Number(cash);
    const monthlyBurn = Number(burn);

    if (!totalCash || !monthlyBurn || monthlyBurn <= 0) return 0;
    return totalCash / monthlyBurn;
  }, [cash, burn]);

  const runwayDays = useMemo(() => Math.floor(runwayMonths * 30), [runwayMonths]);

  // Thresholds:
  // >= 6 months => Green (Positive)
  // < 6 months => Yellow (Warning)
  // < 3 months => Red (Urgent)
  const status = useMemo(() => {
    if (runwayMonths < 3) {
      return {
        label: "URGENT",
        bg: "bg-red-600",
        border: "border-red-500",
        text: "text-red-600",
        msg: "Urgent state! You have less than 3 months runway.",
      };
    }

    if (runwayMonths < 6) {
      return {
        label: "WARNING",
        bg: "bg-yellow-500",
        border: "border-yellow-400",
        text: "text-yellow-500",
        msg: "Warning state! You have less than 6 months runway.",
      };
    }

    return {
      label: "POSITIVE",
      bg: "bg-green-600",
      border: "border-green-500",
      text: "text-green-600",
      msg: "Positive state! You have 6+ months runway.",
    };
  }, [runwayMonths]);

  const progressPercent = useMemo(() => {
    if (!runwayMonths) return 0;
    return Math.min((runwayMonths / 12) * 100, 100);
  }, [runwayMonths]);

  const resetAll = () => {
    setCash("");
    setBurn("");
    localStorage.removeItem("cash");
    localStorage.removeItem("burn");
  };

  const exportReport = () => {
    const report = `
========== CASH RUNWAY REPORT ==========
Total Cash: ${formatMoney(cash, currency)}
Monthly Burn: ${formatMoney(burn, currency)}

Runway (Months): ${runwayMonths.toFixed(2)}
Runway (Days): ${runwayDays}

State: ${status.label}
Message: ${status.msg}
=======================================
`;
    downloadReport(report);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-6 border dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <Link
                to="/"
                className="text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                ← Back
              </Link>

              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                Runway Calculator
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-300">
                Based on core startup runway logic.
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 text-sm rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrency("₹")}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                currency === "₹"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              INR (₹)
            </button>

            <button
              onClick={() => setCurrency("$")}
              className={`flex-1 py-2 rounded-xl font-semibold transition ${
                currency === "$"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              USD ($)
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Total Cash on Hand
              </label>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="Example: 500000"
                className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatMoney(cash, currency)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Monthly Burn Rate
              </label>
              <input
                type="number"
                value={burn}
                onChange={(e) => setBurn(e.target.value)}
                placeholder="Example: 50000"
                className="w-full mt-1 p-3 rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatMoney(burn, currency)} / month
              </p>

              {burn && Number(burn) <= 0 && (
                <p className="text-xs text-red-500 mt-1 font-semibold">
                  Burn rate must be greater than 0.
                </p>
              )}
            </div>
          </div>

          <div
            className={`rounded-2xl p-5 bg-gray-50 dark:bg-gray-700 border-2 ${status.border}`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-800 dark:text-white">
                Runway Remaining
              </h2>

              <span
                className={`text-xs px-3 py-1 rounded-full text-white font-bold ${status.bg}`}
              >
                {status.label}
              </span>
            </div>

            <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              {runwayMonths ? runwayMonths.toFixed(1) : "0.0"}
              <span className="text-base font-semibold text-gray-600 dark:text-gray-200">
                {" "}
                months
              </span>
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-200 mt-1">
              Approx. <span className="font-bold">{runwayDays}</span> days left
            </p>

            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden mt-3">
              <div
                className={`${status.bg} h-3 transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className={`text-xs font-bold mt-3 ${status.text}`}>
              {status.msg}
            </p>
          </div>

          <CashChart cash={cash} burn={burn} currency={currency} />

          <div className="flex gap-3">
            <button
              onClick={resetAll}
              className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold"
            >
              Reset
            </button>

            <button
              onClick={exportReport}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold"
            >
              Export Report
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Built for founders. Cash is King 👑
          </p>
        </div>
      </div>
    </div>
  );
}
