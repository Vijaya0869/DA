import React, { useState } from "react";
import {
  Sankey,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button, Card } from "container/components";

interface Property {
  id: string;
  purchase_price: number;
  rehab_costs?: number | null;
  holding_costs?: number | null;
  rehab_cost_holding_period?: number | null;
  loan_amount?: number | null;
  interest_rate?: number | null;
  loan_term?: number | null;
  down_payment?: number | null;
  monthly_maintenance?: number;
  monthly_insurance?: number;
  monthly_utilities?: number;
  annual_property_taxes?: number;
  monthly_taxes?: number;
  monthly_loan_payment?: number;
  estimated_rent?: number | null;
  vacancy_rate?: number | null;
  capital_reserves_rate?: number | null;
  landscaping_cost?: number | null;
  [key: string]: any;
}

interface HistogramDataItem {
  name: string;
  amount: number;
  color: string;
}

interface CashFlowChartProps {
  property: Property;
}

export default function CashFlowChart({ property }: CashFlowChartProps) {
  const [showChart, setShowChart] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);


  const holdTimeMonths = property.rehab_cost_holding_period || 12;

  // Monthly expenses with more detailed breakdown
  const monthlyTaxes =
    property.monthly_taxes ||
    (property.annual_property_taxes
      ? property.annual_property_taxes / 12
      : 200);
  const monthlyInsurance = property.monthly_insurance || 0;
  const monthlyMaintenance = property.monthly_maintenance || 0;

  // New categories to match the example chart
  const vacancyRate = property.vacancy_rate || 0; // 5% default vacancy rate
  const capitalReservesRate = property.capital_reserves_rate || 0; // 3% for capital reserves
  const landscapingCost = property.landscaping_cost || 0; // Monthly landscaping

  // Loan information
  const monthlyLoanPayment = property.monthly_loan_payment || 0;

  // Rental income - for this example we'll set a default value if not provided
  const estimatedRent = property.estimated_rent || 0; // Default rent shown in your example

  // Calculate operating expenses
  const vacancyCost = estimatedRent * vacancyRate;
  const reservesCost = estimatedRent * capitalReservesRate;

  const monthlyOperatingExpenses =
    monthlyTaxes +
    monthlyInsurance +
    monthlyMaintenance +
    reservesCost +
    landscapingCost;

  // Adjusted gross income after vacancy
  const effectiveGrossIncome = estimatedRent - vacancyCost;

  // Net operating income
  const netOperatingIncome = effectiveGrossIncome - monthlyOperatingExpenses;

  // Cash flow after debt service
  const cashFlow = netOperatingIncome - monthlyLoanPayment;

  // Total values over the holding period
  const totalGrossIncome = estimatedRent * holdTimeMonths;
  const totalVacancyCost = vacancyCost * holdTimeMonths;
  const totalNetOperatingIncome = netOperatingIncome * holdTimeMonths;
  const totalCashFlow = cashFlow * holdTimeMonths;

  // Sankey Data - Using the structure from your example image
  const sankeyData = {
    nodes: [
      { name: "Gross Rent" }, // 0
      { name: "Operating Income" }, // 1
      { name: "Vacancy" }, // 2
      { name: "Net Operating Income" }, // 3
      { name: "Property Taxes" }, // 4
      { name: "Insurance" }, // 5
      { name: "Maintenance" }, // 6
      { name: "Capital Reserves" }, // 7
      { name: "Landscaping" }, // 8
    ],
    links: [
      // Income flows
      { source: 0, target: 1, value: estimatedRent },
      { source: 1, target: 2, value: vacancyCost },
      {
        source: 1,
        target: 3,
        value: effectiveGrossIncome - monthlyOperatingExpenses,
      },

      // Expense breakdowns
      { source: 3, target: 4, value: monthlyTaxes },
      { source: 3, target: 5, value: monthlyInsurance },
      { source: 3, target: 6, value: monthlyMaintenance },
      { source: 3, target: 7, value: reservesCost },
      { source: 3, target: 8, value: landscapingCost },
    ],
  };

  // Histogram Data (total over hold period)
  const histogramData: HistogramDataItem[] = [
    { name: "Gross Income", amount: totalGrossIncome, color: "#4CAF50" },
    { name: "Vacancy", amount: -totalVacancyCost, color: "#FFA726" },
    {
      name: "Operating Expenses",
      amount: -(monthlyOperatingExpenses * holdTimeMonths),
      color: "#42A5F5",
    },
    {
      name: "Cash Flow",
      amount: totalCashFlow,
      color: totalCashFlow >= 0 ? "#34d399" : "#f87171",
    },
  ];

  // Determine Y-axis domain based on data range
  const maxPositive = Math.max(
    ...histogramData.map((item) => Math.max(item.amount, 0))
  );
  const maxNegative = Math.abs(
    Math.min(...histogramData.map((item) => Math.min(item.amount, 0)))
  );
  const domainMax = Math.max(maxPositive, maxNegative, 1000);

  const yAxisDomain = [-domainMax, domainMax];
  const yAxisTicks = [-domainMax, -domainMax / 2, 0, domainMax / 2, domainMax];

  return (
    <Card >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cash Flow</h2>
        <div className="flex items-center">
          <span className="text-base text-gray-600 mr-2">Show Chart</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showChart}
              onChange={() => setShowChart(!showChart)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors duration-200"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>

      {showChart && (
        <div
          className="border border-gray-200 rounded-lg p-2 mb-4"
          style={{ height: "400px", minHeight: "320px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              node={{
                stroke: "#ddd",
                strokeWidth: 0,
                width: 20,
                colors: [
                  "#8884d8", // Gross Rent
                  "#8884d8", // Operating Income
                  "#8884d8", // Vacancy
                  "#4CAF50", // Net Operating Income
                  "#42A5F5", // Property Taxes
                  "#42A5F5", // Insurance
                  "#42A5F5", // Maintenance
                  "#42A5F5", // Capital Reserves
                  "#42A5F5", // Landscaping
                ],
              }}
              link={{
                stroke: "#d0e7f7",
                strokeWidth: 0,
                opacity: 0.7,
              }}
              nodePadding={40}
              margin={{ top: 10, right: 150, bottom: 10, left: 150 }}
            >
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </Sankey>
          </ResponsiveContainer>
        </div>
      )}

  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Gross Rent & Operating Income Card */}
        <div className="bg-white shadow-sm rounded-lg p-5 border">
          <div className="flex justify-between text-gray-700 border-b pb-3">
            <span className="text-base font-medium">Gross Rent</span>
            <span className="text-base font-semibold">$1,150</span>
          </div>
          <div className="flex justify-between text-gray-700 border-b py-3">
            <span className="text-base font-medium">Vacancy</span>
            <span className="text-base font-semibold text-red-500">- $58</span>
          </div>
          <div className="flex justify-between text-green-600 text-base pt-3 font-semibold">
            <span>Operating Income</span>
            <span>$1,092</span>
          </div>
        </div>

        {/* Loan Payment & Cash Flow Card */}
        <div className="bg-white shadow-sm rounded-lg p-5 border">
          <div className="flex justify-between text-gray-700 border-b pb-3">
            <span className="text-base font-medium">Loan Payment</span>
            <span className="text-base font-semibold">$421</span>
          </div>
          <div className="flex justify-between text-gray-700 border-b py-3">
            <span className="text-base font-medium">Cash Flow</span>
            <span className="text-base font-semibold">$211</span>
          </div>
          <div className="flex justify-between text-green-600 text-base pt-3 font-semibold">
            <span>Post Tax Cash Flow</span>
            <span>$169</span>
          </div>
        </div>

        {/* Right Section - Operating Expenses */}
        <div className="bg-white shadow-sm rounded-lg p-5 border w-full md:w-80">
          <div className="flex justify-between text-gray-700 border-b pb-3">
            <span className="text-base font-medium">Operating Expenses</span>
            <span className="text-base font-semibold">$460</span>
          </div>
          <div className="flex justify-between text-green-600 text-base pt-3 font-semibold">
            <span>Net Operating Income</span>
            <span>$58</span>
          </div>
        </div>
      </div>

      {/* Histogram Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-base text-gray-600 mr-2">Show Histogram</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showHistogram}
                onChange={() => setShowHistogram(!showHistogram)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors duration-200"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {showHistogram && (
          <div className="w-full h-64 border border-gray-200 rounded-lg p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={histogramData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ dy: 10 }} tickLine={false} />
                <YAxis
                  tickFormatter={(value) =>
                    `$${Math.abs(value).toLocaleString()}`
                  }
                  domain={yAxisDomain}
                  ticks={yAxisTicks}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                  label={{
                    position: "top",
                    formatter: (value: number) => `$${value.toFixed(2)}`,
                    fill: "#666",
                    fontSize: 12,
                  }}
                >
                  {histogramData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
