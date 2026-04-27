import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function CashChart({ cash, burn, currency }) {
  const totalCash = Number(cash);
  const monthlyBurn = Number(burn);

  if (!totalCash || !monthlyBurn || monthlyBurn <= 0) return null;

  const maxMonths = Math.min(Math.ceil(totalCash / monthlyBurn), 24);

  const labels = Array.from({ length: maxMonths + 1 }, (_, i) => `M${i}`);

  const cashRemaining = Array.from({ length: maxMonths + 1 }, (_, i) =>
    Math.max(totalCash - i * monthlyBurn, 0)
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 border dark:border-gray-600">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
        Cash Projection
      </h3>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Cash Remaining",
              data: cashRemaining,
              borderWidth: 2,
              pointRadius: 3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  return `${currency}${ctx.raw.toLocaleString()}`;
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: function (val) {
                  return currency + val;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
