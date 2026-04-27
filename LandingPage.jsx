import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-5 py-10">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-6 border dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                CashRunway 🚀
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Track your startup runway before your cash hits zero.
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 text-sm rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Cash is King.
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Many founders fail because they don’t know when their runway ends.
              This tool calculates your runway instantly and shows urgency based
              on your remaining months.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
              <p className="font-bold text-gray-900 dark:text-white">
                📌 Simple Formula
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Runway = Total Cash / Monthly Burn
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
              <p className="font-bold text-gray-900 dark:text-white">
                ⚠️ Urgency States
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Green (≥6), Yellow (&lt;6), Red (&lt;3)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700">
              <p className="font-bold text-gray-900 dark:text-white">
                📉 Cash Chart + Export Report
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visual cash projection + downloadable report.
              </p>
            </div>
          </div>

          <Link
            to="/calculator"
            className="block text-center py-3 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition"
          >
            Open Calculator →
          </Link>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Built for entrepreneurs. Cash is King 👑
          </p>
        </div>
      </div>
    </div>
  );
}
