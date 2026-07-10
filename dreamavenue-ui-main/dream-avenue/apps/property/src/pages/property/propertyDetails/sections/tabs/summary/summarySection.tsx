import React, { useEffect, useState } from "react";
import { Card } from "container/components";
import { Button, Dialog } from "container/components";
import {
  FaChartLine,
  FaThumbsUp,
  FaDollarSign,
  FaThumbsDown,
  FaEdit,
  FaFileContract,
} from "react-icons/fa";
import { LuThumbsUp } from "react-icons/lu";

import PropertyServices from "../../../../../../Services/property";
import CustomSlider from "../../../../../../components/CustomSlider";
import { FaChartBar, FaSquarePollVertical, FaTableList } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import PropertyMap from "../../../../PropertyList/OpenStreetView/propertyMap";
import { useNavigate } from "react-router-dom";
import { GrGraphQl } from "react-icons/gr";
import editIcon from "@/assets/property_icons/editIcon.svg";
import contractIcon from "@/assets/property_icons/contractIcon.svg";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type?: string | null;
  investment_strategy_id?: string | null;
  financing_of_type_id?: string | null;
  title: string;
  description?: string;
  notes?: string;
  tags_n_labels?: string;
  zoning?: string | null;
  mls_number?: string;
  loan_labels?: string;
  purchase_price: number;
  closing_costs?: number | null;
  purchase_costs?: number | null;
  after_repair_value?: number | null;
  rehab_cost_overrun?: number | null;
  rehab_cost_holding_period?: number | null;
  down_payment?: number | null;
  loan_amount?: number | null;
  interest_rate?: number | null;
  rehab_costs?: number | null;
  selling_costs?: number | null;
  holding_costs?: number | null;
  loan_term?: number | null;
  rehab_down_payment?: number | null;
  location?: string;
  userId?: string;
  bedrooms: number;
  parking?: number;
  bathrooms: number;
  year_built?: number;
  listing_price?: number | null;
  estimated_arv?: number | null;
  estimated_rent?: number | null;
  square_feet: number;
  lot_size?: number;
  property_type_id?: string | null;
  loan_type_id?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lat?: number;
  lng?: number;
  full_address?: string | null;
  geocode?: string | null;
  geocode_response?: any;
  is_favorite?: boolean | null;
  lot_size_type?: string;
  closing_cost_type?: string | null;
  selling_cost_type?: string | null;
  property_unique_id?: string | null;
  pieData: any;
  barData: any;
  loan_type?: string;
  loan_percentage?: number;
  total_cash_needed?: number;
  loan_to_cost?: number;
  loan_to_value?: number;
  arv_per_square_foot?: number;
  price_per_square_foot?: number;
  rehab_per_square_foot?: number;
  investment_strategy?: string;
}

interface SummarySectionProps {
  property: Property;
}
interface AnalysisValues {
  purchasePrice: number;
  closingCosts: number;
  propertyTaxes: number;
  insurance: number;
  rent: number;
  afterRepairValue: number;
}
const SummarySection: React.FC<SummarySectionProps> = ({ property }) => {
  const [investmentStrategy, setInvestmentStrategy] = useState([]);
  const navigate = useNavigate();
  // Default values for property if not provided
  const [rentalData, setRentalData] = useState({
    comparables: [],
    latitude: null,
    longitude: null,
    rent: null,
    rentRangeHigh: null,
    rentRangeLow: null,
  });
  const [loading, setLoading] = useState(true);
  // State for customizable values
  const [customValues, setCustomValues] = useState({
    purchasePrice: property?.purchase_price || 0,
    closingCosts: property?.closing_costs || 0,
    propertyTaxes: property?.property_taxes || 0,
    insurance: property?.insurance || 0,
    rent: property?.estimated_rent || 0,
    afterRepairValue: property?.after_repair_value || 0,
  });

  // Handle changes for the sliders
  const handleCustomValueChange = (key, value) => {
    setCustomValues({ ...customValues, [key]: value });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || price === 0) return "N/A";
    return `$${price.toLocaleString()}`;
  };
  // Calculated values
  const annualRentalIncome = customValues.rent * 12;
  const annualOperatingExpenses =
    customValues.propertyTaxes + customValues.insurance;
  const netAnnualCashFlow = annualRentalIncome - annualOperatingExpenses;
  const roi = ((netAnnualCashFlow / customValues.purchasePrice) * 100).toFixed(
    1
  );
  useEffect(() => {
    getInvestmentStrategies();
    getRentalAnalysis();
    getAnalysis();
  }, []);
  const getInvestmentStrategies = async () => {
    try {
      const response: any = await PropertyServices.getInvestmentStrategies();
      console.log("Investment Strategies:", response);
      setInvestmentStrategy(response.data);
    } catch (error) {
      console.error("Failed to fetch investment strategies:", error);
    }
  };

  const getRentalAnalysis = async () => {
    try {
      setLoading(true);
      const response: any = await PropertyServices.getRentalAnalysis(
        property?.id || "cd79a774-43c5-43b5-b372-da4ae570d74f"
      );

      const comparables = response?.data?.comparables?.map((comp) => ({
        ...comp,
        address: comp.addressLine1,
        zip_code: comp.zipCode,
        square_feet: comp.squareFootage,
        purchase_price: comp.salePrice,
        geocode_response: {
          items: [
            {
              position: {
                lat: comp.latitude,
                lng: comp.longitude,
              },
            },
          ],
        },
      }));
      setRentalData({ ...response?.data, comparables });
      // setRentalData(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch investment strategies:", error);
    }
  };
  console.log(rentalData, "the rental data");
  const getAnalysis = async () => {
    try {
      const response: any = await PropertyServices.getAnalysis(property?.id);
    } catch (error) {
      console.error("Failed to fetch investment strategies:", error);
    }
  };

  const [analysisValues, setAnalysisValues] = useState({
    purchasePrice: property?.purchase_price || 0,
    closingCosts: property?.closing_costs || 0,
    propertyTaxes: property?.property_taxes || 0,
    insurance: property?.insurance || 0,
    rent: property?.estimated_rent || 0,
    afterRepairValue: property?.after_repair_value || 0,
  });

  const handleChange = (key: keyof AnalysisValues, val: number) => {
    setAnalysisValues((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const [viewMode, setViewMode] = useState("graph");
  const [timeRange, setTimeRange] = useState("6 Months");
  const [histogramEnabled, setHistogramEnabled] = useState(false);
  const [tableViewMode, setTableViewMode] = useState("table");
  const [selectedComps, setSelectedComps] = useState([0, 1]);

  const compCounts = [4, 6, 8, 10];
  const timeRanges = ["3 Month Old", "6 Month Old", "12 Month Old"];
  const radiusOptions = ["1 Mile", "3 Miles", "5 Miles"];
  // Sample data for the historical AVM chart
  const historicalAVMData = [
    {
      year: "2016",
      avmValue: 545000,
      lowEstimate: 540000,
      highEstimate: 553000,
    },
    {
      year: "2017",
      avmValue: 552000,
      lowEstimate: 545000,
      highEstimate: 558000,
    },
    {
      year: "2018",
      avmValue: 549000,
      lowEstimate: 542000,
      highEstimate: 553000,
    },
    {
      year: "2019",
      avmValue: 558000,
      lowEstimate: 549000,
      highEstimate: 570000,
      reference: true,
      referenceValue: 549300,
    },
    {
      year: "2020",
      avmValue: 568000,
      lowEstimate: 552000,
      highEstimate: 575000,
    },
    {
      year: "2021",
      avmValue: 540000,
      lowEstimate: 532000,
      highEstimate: 550000,
    },
    {
      year: "2022",
      avmValue: 559000,
      lowEstimate: 550000,
      highEstimate: 570000,
    },
    {
      year: "2023",
      avmValue: 545000,
      lowEstimate: 535000,
      highEstimate: 555000,
    },
    {
      year: "2024",
      avmValue: 566000,
      lowEstimate: 552000,
      highEstimate: 578000,
    },
  ];

  // Sample data for property appreciation chart
  const appreciationData = [
    { month: "Jan", value: 19500 },
    { month: "Feb", value: 20000 },
    { month: "Mar", value: 19800 },
    { month: "Apr", value: 20200, reference: true, referenceValue: 21000 },
    { month: "May", value: 19000 },
    { month: "Jun", value: 18500 },
    { month: "Jul", value: 20000 },
    { month: "Aug", value: 22000 },
    { month: "Sep", value: 21500 },
    { month: "Oct", value: 22500 },
    { month: "Nov", value: 23000 },
    { month: "Dec", value: 24000 },
  ];

  // Sample data based on your screenshot
  const properties = [
    {
      id: 0,
      address: "4529 Winona Ct",
      salePrice: 500000.0,
      saleDate: "2023-05-01",
      pricePerSqFt: 350.0,
      bedrooms: 3,
      bathrooms: 2,
      sqFt: 1429,
      coordinates: { lat: 34.123, lng: -118.456 },
    },
    {
      id: 1,
      address: "4510 Winona Ct",
      salePrice: 480000.0,
      saleDate: "2023-04-20",
      pricePerSqFt: 340.0,
      bedrooms: 3,
      bathrooms: 2,
      sqFt: 1410,
      coordinates: { lat: 34.125, lng: -118.458 },
    },
    {
      id: 2,
      address: "4530 Winona Ct",
      salePrice: 510000.0,
      saleDate: "2023-06-15",
      pricePerSqFt: 355.0,
      bedrooms: 2,
      bathrooms: 2,
      sqFt: 1435,
      coordinates: { lat: 34.124, lng: -118.455 },
    },
    {
      id: 3,
      address: "4530 Winona Ct",
      salePrice: 510000.0,
      saleDate: "2023-06-15",
      pricePerSqFt: 355.0,
      bedrooms: 2,
      bathrooms: 2,
      sqFt: 1435,
      coordinates: { lat: 34.122, lng: -118.453 },
    },
  ];
  // Sample data for AVM history table
  const avmHistoryData = [
    {
      date: "2016-01-01",
      avmValue: 388000.0,
      lowEstimate: 331000.0,
      highEstimate: 445000.0,
      avmValueChange: "None",
    },
    {
      date: "2024-03-21",
      avmValue: 704249.0,
      lowEstimate: 697206.0,
      highEstimate: 711291.0,
      avmValueChange: "9.72",
    },
    {
      date: "2024-04-27",
      avmValue: 736909.0,
      lowEstimate: 729539.0,
      highEstimate: 744278.0,
      avmValueChange: "0.55",
    },
    {
      date: "2024-05-21",
      avmValue: 759132.0,
      lowEstimate: 751540.0,
      highEstimate: 766723.0,
      avmValueChange: "0.36",
    },
  ];

  // Sample data for percent change chart
  const percentChangeData = [
    { year: "2015", change: 2.0 },
    { year: "2016", change: 3.2 },
    { year: "2017", change: 2.8 },
    { year: "2018", change: 4.0 },
    { year: "2019", change: 3.98, reference: true },
    { year: "2020", change: 5.5 },
    { year: "2021", change: 2.8 },
    { year: "2022", change: 4.2 },
    { year: "2023", change: 3.0 },
    { year: "2024", change: 4.8 },
  ];

  // Sample data for sales history chart
  const salesHistoryData = [
    { year: "2015", price: 430000 },
    { year: "2016", price: 450000 },
    { year: "2017", price: 445000 },
    { year: "2018", price: 500000 },
    { year: "2019", price: 550000, reference: true, referenceValue: 560000 },
    { year: "2020", price: 540000 },
    { year: "2021", price: 450000 },
    { year: "2022", price: 510000 },
    { year: "2023", price: 480000 },
    { year: "2024", price: 560000 },
  ];

  const salesHistoryTableData = [
    {
      date: "2023-10-20",
      salePrice: 710000.0,
      buyer: "Jennifer Nicole Gubner, Sydney Frances Stento",
      seller: "Michael S. Mattice",
      documentNumber: "0000101441",
    },
    {
      date: "2021-06-28",
      salePrice: "Not Available",
      buyer: "Michael S. Mattice & Sharee Mattice",
      seller: "Michael Scott Mattice",
      documentNumber: "0000123161",
    },
    {
      date: "2015-08-21",
      salePrice: 345000.0,
      buyer: "Michael S. Mattice, Sharee Mattice",
      seller: "Lidia Stcherbak",
      documentNumber: "0000119310",
    },
  ];

  // Sample data for Mortgage History Table
  const mortgageHistoryData = [
    {
      date: "2023-10-23",
      amount: 510000.0,
      lender: "The Horn Funding Corp",
      type: "Conventional",
      dueDate: "2048-11-01",
    },
    {
      date: "2012-03-27",
      amount: 246465.0,
      lender: "Quicken Loans Inc",
      type: "FHA",
      dueDate: "-",
    },
    {
      date: "2003-12-01",
      amount: 158000.0,
      lender: "Regions Bank",
      type: "Adjustable",
      dueDate: "-",
    },
  ];

  // Assessment data
  const assessmentData = {
    assessedValue: 40770,
    improvementValue: 16850,
    landValue: 23920,
    totalMarketValue: 663500,
    taxAmount: "$3,159.12 (2023)",
  };
  const [percentChangeHistogram, setPercentChangeHistogram] = useState(false);
  const [salesHistogram, setSalesHistogram] = useState(false);
  const [salesActiveTab, setSalesActiveTab] = useState("history");
  const [avmActiveTab, setAvmActiveTab] = useState("values");

  const toggleCompSelection = (index) => {
    if (selectedComps.includes(index)) {
      setSelectedComps(selectedComps.filter((id) => id !== index));
    } else {
      setSelectedComps([...selectedComps, index]);
    }
  };
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };
  const calculatePricePerSqFt = (price, sqFt) => {
    if (!price || !sqFt || sqFt === 0) return 0;
    return price / sqFt;
  };
  const strategyColorMap: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    wholesaling: {
      bg: "bg-whsale",
      text: "text-whsale",
      border: "border-whsale",
    },
    rent: {
      bg: "bg-rental",
      text: "text-rental",
      border: "border-rental",
    },
    flip: {
      bg: "bg-flip",
      text: "text-flip",
      border: "border-flip",
    },
    wholetail: {
      bg: "bg-whtail",
      text: "text-whtail",
      border: "border-whtail",
    },
    default: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-300",
    },
  };

  return (
    <div>
      {/* Investment Strategy Section */}
      <div className="mb-6 flex items-center flex-wrap justify-between gap-3">
        <div className="flex flex-row gap-4 items-center">
          <div className="text-gray-700">Recommended for:</div>
          <div className="flex gap-2 flex-wrap">
            {investmentStrategy.map((strategy) => {
              const isRecommended =
                strategy?.id === property?.investment_strategy_id;
              const key = strategy?.name?.toLowerCase() || "default";
              const colors = strategyColorMap[key] || strategyColorMap.default;

              return (
                <button
                  key={strategy?.id}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm border
        ${
          isRecommended
            ? `${colors.bg} text-white border-none`
            : `${colors.border} ${colors.text}`
        }`}
                >
                  {isRecommended ? (
                    <LuThumbsUp className="text-white" />
                  ) : (
                    <LuThumbsUp className={`${colors.text}`} />
                  )}
                  {strategy?.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            // onClick={() => navigate(`/property/edit/${propertyId}`)}
            onClick={() =>
              navigate(`/add-property`, {
                state: { propertyDetails: property },
              })
            }
            className="px-2 py-2  flex items-center"
          >
            <img src={editIcon} className="mr-2" /> Edit Property
          </Button>
          <button
            // onClick={() => navigate(`/property/edit/${propertyId}`)}
            onClick={() => navigate(`/contractor`)}
            className="px-3 py-2 bg-secondary text-white rounded-md flex items-center"
          >
            <img src={contractIcon} className="mr-2" />
            Find Contractor
          </button>
        </div>
      </div>

      {/* Customise Analysis Section */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold  text-gray-800">
            Customise Analysis
          </h2>
          <div className="text-sm rounded-md border p-2 border-main text-main font-medium flex items-center gap-1">
            <FaSquarePollVertical className="w-4 h-4" />
            Sensitivity Analysis
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <CustomSlider
            label="Purchase Price"
            value={analysisValues.purchasePrice}
            min={100000}
            max={1000000}
            prefix="$"
            onChange={(val) => handleChange("purchasePrice", val)}
          />
          <CustomSlider
            label="Closing Costs"
            value={analysisValues.closingCosts}
            min={0}
            max={20000}
            prefix="$"
            onChange={(val) => handleChange("closingCosts", val)}
          />
          <CustomSlider
            label="Property Taxes"
            value={analysisValues.propertyTaxes}
            min={0}
            max={10000}
            prefix="$"
            suffix="/year"
            onChange={(val) => handleChange("propertyTaxes", val)}
          />
          <CustomSlider
            label="Insurance"
            value={analysisValues.insurance}
            min={0}
            max={5000}
            prefix="$"
            suffix="/year"
            onChange={(val) => handleChange("insurance", val)}
          />
          <CustomSlider
            label="Rent"
            value={analysisValues.rent}
            min={500}
            max={10000}
            prefix="$"
            onChange={(val) => handleChange("rent", val)}
          />
          <CustomSlider
            label="After Repair Value"
            value={analysisValues.afterRepairValue}
            min={50000}
            max={500000}
            prefix="$"
            onChange={(val) => handleChange("afterRepairValue", val)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {/* ROI Calculation and Recommendation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ROI Calculation
            <br />
            and Recommendation
          </h2>

          <h3 className="text-lg font-medium text-main mb-3">
            ROI Calculation
          </h3>

          <div className="mb-4">
            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Total Investment</span>
              <span className="text-green-600 font-bold">
                $30,000 (down payment)
              </span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Net Monthly Cash Flow</span>
              <span className="text-red-600 font-bold">-$1,007.29</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Net Annual Cash Flow</span>
              <span className="text-red-600 font-bold">-$12,087.48</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Annual ROI</span>
              <span className="text-red-600 font-bold">-40.29%</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-main mb-2">
              Recommendation
            </h3>
            <p className="text-gray-900">
              Based on the current financial analysis, it is not recommended to
              buy this property due to the negative annual ROI of -40.29%.
            </p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Financial Summary
          </h2>

          <div className="mb-4">
            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Monthly Mortgage Payment</span>
              <span className="text-green-600 font-bold">$3,793.29</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Estimated Rental Income</span>
              <span className="text-green-600 font-bold">$3,436 per month</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">
                Estimated Annual Property Taxes
              </span>
              <span className="text-green-600 font-bold">$7,800</span>
              <div className="text-sm text-gray-500">
                (based on market value of $663,500)
              </div>
            </div>

            <div className="flex flex-col gap-2 py-2 mt-2">
              <span className="text-gray-500">Estimated ARV</span>
              <span className="text-green-600 font-bold">$25,000</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">Other Annual Expenses</span>
              <span className="text-green-600 font-bold">Not provided</span>
            </div>

            <div className="flex flex-col gap-2 py-2">
              <span className="text-gray-500">
                Estimated Annual Insurance Costs
              </span>
              <span className="text-green-600 font-bold">Not provided</span>
            </div>
          </div>
        </div>

        {/* Rental AVM Data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Rental AVM Data
          </h2>

          <div className="mb-4">
            <div className="flex flex-col gap-2  py-2">
              <span className="text-gray-500">Estimated Rental Value</span>
              <span className="text-green-600 font-bold">$3,436</span>
            </div>

            <div className="flex flex-col gap-2  py-2">
              <span className="text-gray-500">Estimated Min Rental Value</span>
              <span className="text-green-600 font-bold">$2,515</span>
            </div>

            <div className="flex flex-col gap-2  py-2">
              <span className="text-gray-500">Estimated Max Rental Value</span>
              <span className="text-green-600 font-bold">$4,347</span>
            </div>

            <div className="flex flex-col gap-2  py-2">
              <span className="text-gray-500">Valuation Date</span>
              <span className="text-green-600 font-bold">2024-06-24</span>
            </div>
          </div>
        </div>
      </div>
      <Card>
        <h2 className="text-2xl font-semibold  text-gray-800">Sales History</h2>
        {/* Tab Navigation */}
        <div className="bg-mainColor py-2">
          <nav className="flex border-b border-gray-300  bg-white rounded-md">
            <button
              onClick={() => setSalesActiveTab("history")}
              className={`py-2 px-r text-base  font-medium ${
                salesActiveTab === "history"
                  ? " text-main font-medium border-b-2 border-main "
                  : "text-gray-400 hover:text-main"
              }`}
            >
              Sales History
            </button>
            <button
              onClick={() => setSalesActiveTab("table")}
              className={`py-2 px-4 text-base  ${
                salesActiveTab === "table"
                  ? " text-main font-medium border-b-2 border-main "
                  : "text-gray-400 hover:text-main"
              }`}
            >
              Sales History Table
            </button>
          </nav>
        </div>
        {salesActiveTab === "history" && (
          <>
            {/* Sales History */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-end py-1">
                <span className="mr-2 text-sm text-gray-600">Histogram</span>
                <button
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                    salesHistogram ? "bg-main" : "bg-gray-300"
                  }`}
                  onClick={() => setSalesHistogram(!salesHistogram)}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      salesHistogram ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesHistoryData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      domain={[400000, 650000]}
                      tickFormatter={(value) =>
                        value === 0 ? "$0" : `$${(value / 1000).toFixed(0)}k`
                      }
                      label={{
                        value: "Sales Price",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      labelFormatter={(value) => `Year: ${value}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    <ReferenceLine
                      x="2019"
                      stroke="#8b5cf6"
                      strokeDasharray="3 3"
                      label={{
                        value: "$560,000\nSales Price",
                        position: "right",
                        fill: "#333",
                        fontSize: 10,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        {salesActiveTab === "table" && (
          <>
            {/* Sales History Table */}
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Number
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesHistoryTableData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-main">
                          {row.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatPrice(row.salePrice)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {row.buyer}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {row.seller}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {row.documentNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="flex items-center justify-between gap-4 w-full">
        <Card className="w-[60%]">
          <h2 className="text-2xl font-semibold  text-gray-800">
            Historical AVM Values
          </h2>
          {/* Tab Navigation */}
          <div className="bg-mainColor py-2">
            <nav className="flex border-b border-gray-300  bg-white rounded-md">
              <button
                onClick={() => setAvmActiveTab("values")}
                className={`py-2 pr-4 text-base  font-medium ${
                  avmActiveTab === "values"
                    ? " text-main font-medium border-b-2 border-main "
                    : "text-gray-400 hover:text-main"
                }`}
              >
                Historical AVM Values
              </button>
              <button
                onClick={() => setAvmActiveTab("table")}
                className={`py-2 px-4 text-base  ${
                  avmActiveTab === "table"
                    ? " text-main font-medium border-b-2 border-main "
                    : "text-gray-400 hover:text-main"
                }`}
              >
                AVM History Table
              </button>
            </nav>
          </div>
          {avmActiveTab === "values" && (
            <>
              {/* Historical AVM Values */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historicalAVMData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      domain={[500000, "dataMax + 20000"]}
                      tickFormatter={(value) =>
                        value === 0 ? "$0" : `$${(value / 1000).toFixed(0)}k`
                      }
                      label={{
                        value: "AVM Value",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                      labelFormatter={(value) => `Year: ${value}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avmValue"
                      name="AVM Value"
                      stroke="#504b96"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lowEstimate"
                      name="Low Estimate"
                      stroke="#e4bb67"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="highEstimate"
                      name="High Estimate"
                      stroke="#6A65AE"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ReferenceLine
                      x="2019"
                      stroke="#ffcd00"
                      strokeDasharray="3 3"
                      label={{
                        value: "$493,000\nAVM Value",
                        position: "right",
                        fill: "#A5781D",
                        fontSize: 10,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {avmActiveTab === "table" && (
            <>
              {/* AVM History Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AVM Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Low Estimate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        High Estimate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AVM Value Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {avmHistoryData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-main">
                          {row.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatPrice(row.avmValue)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatPrice(row.lowEstimate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatPrice(row.highEstimate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {row.avmValueChange === "None"
                            ? "None"
                            : `${row.avmValueChange}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
        {/* Percent Change in AVM Value Over Time */}
        <Card className="w-[40%]">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Percent Change in AVM Value Over Time
              </h2>
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Histogram</span>
              <button
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  percentChangeHistogram ? "bg-main" : "bg-gray-300"
                }`}
                onClick={() =>
                  setPercentChangeHistogram(!percentChangeHistogram)
                }
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    percentChangeHistogram ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={percentChangeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    domain={[0, 8]}
                    tickFormatter={(value) => `$${value}`}
                    label={{
                      value: "AVM Value",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(value) => `Year: ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="change"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <ReferenceLine
                    x="2019"
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{
                      value: "3.98\nAVM Value",
                      position: "right",
                      fill: "#333",
                      fontSize: 10,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
      {/* Property Appreciation */}
      <Card>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Property Appreciation
            </h2>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Calculated By</span>
              <div className="relative">
                <select
                  className="appearance-none bg-bgPurple border  py-2 border-bgPurple rounded-md pl-3 pr-8 py-1 text-whsale focus:outline-none focus:ring-main focus:border-main text-sm"
                  value="AVM History"
                  onChange={(e) => console.log(e.target.value)}
                >
                  <option>AVM History</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-bgPurple border border-bgPurple rounded-md pl-3 pr-8  py-2 text-whsale focus:outline-none focus:ring-main focus:border-main text-sm"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option>Last 6 Months</option>
                  <option>Last 12 Months</option>
                  <option>Last 24 Months</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex space-x-2 border  border-bgPurple bg-bgPurple rounded-md p-1">
                <button
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                    viewMode === "graph" ? "bg-main text-white" : "text-rental"
                  }`}
                  onClick={() => setViewMode("graph")}
                >
                  <GrGraphQl /> Graph
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                    viewMode === "table" ? "bg-main text-white" : "text-rental"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <FaTableList /> Table
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end flex-wrap">
            <div className="ml-auto flex space-x-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Total Appreciation: 8.61% over 1 Y
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Annual Appreciation: 8.61%
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Histogram</span>
                <button
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                    histogramEnabled ? "bg-main" : "bg-gray-300"
                  }`}
                  onClick={() => setHistogramEnabled(!histogramEnabled)}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      histogramEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={appreciationData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  domain={[15000, 40000]}
                  tickFormatter={(value) =>
                    value === 0 ? "$0" : `$${(value / 1000).toFixed(0)}k`
                  }
                  label={{
                    value: "Appreciation Value",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  labelFormatter={(value) => `Month: ${value}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine
                  x="Apr"
                  stroke="#ffcd00"
                  strokeDasharray="3 3"
                  label={{
                    value: "$21,000\nAppreciation Value",
                    position: "right",
                    fill: "#333",
                    fontSize: 10,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Mortgage History */}
        <Card className="w-[65%]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Mortgage History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mortgageHistoryData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-main">
                      {row.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPrice(row.amount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {row.lender}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Assessment Data */}
        <Card className="w-[35%]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Assessment Data
          </h2>

          <div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Assessed Value</span>
              <span className="text-gray-700 font-medium">
                ${assessmentData.assessedValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Land Value</span>
              <span className="text-gray-700 font-medium">
                ${assessmentData.landValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax Amount</span>
              <span className="text-gray-700 font-medium">
                {assessmentData.taxAmount}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Improvement Value</span>
              <span className="text-gray-700 font-medium">
                ${assessmentData.improvementValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total Market Value</span>
              <span className="text-gray-700 font-medium">
                ${assessmentData.totalMarketValue.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Comparative Market Analysis (CMA)
          </h1>
          <div className="flex items-center mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="doCMA"
                className="w-5 h-5 text-main rounded"
                checked={true}
                readOnly
              />
              <label htmlFor="doCMA" className="text-gray-700 font-medium">
                I want to do CMA
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-between mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">No. of Comps</label>
              <select className="w-full appearance-none bg-bgPurple border  py-2 border-bgPurple rounded-md pl-3 pr-8  text-whsale focus:outline-none focus:ring-main focus:border-main text-sm">
                {compCounts.map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Time Range for Property Sell
              </label>
              <select className="w-full appearance-none bg-bgPurple border  py-2 border-bgPurple rounded-md pl-3 pr-8 text-whsale focus:outline-none focus:ring-main focus:border-main text-sm">
                {timeRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Property within Radius
              </label>
              <select className="w-full appearance-none bg-bgPurple border  py-2 border-bgPurple rounded-md pl-3 pr-8  text-whsale focus:outline-none focus:ring-main focus:border-main text-sm">
                {radiusOptions.map((radius) => (
                  <option key={radius} value={radius}>
                    {radius}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-2 border  border-bgPurple bg-bgPurple rounded-md p-1">
            <button
              onClick={() => setTableViewMode("map")}
              className={`px-4 py-2 rounded-lg flex items-center ${
                tableViewMode === "map" ? "bg-main text-white" : "text-rental"
              }`}
            >
              {/* <Map size={18} className="mr-2" /> */}
              Map
            </button>
            <button
              onClick={() => setTableViewMode("table")}
              className={`px-4 py-2 rounded-lg flex items-center ${
                tableViewMode === "table" ? "bg-main text-white" : "text-rental"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              Table
            </button>
          </div>
        </div>

        {tableViewMode === "map" ? (
          <PropertyMap
            properties={rentalData?.comparables || properties}
            debug={true}
          />
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-10 px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listed Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price per Sq Ft
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bedrooms
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bathrooms
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sq Ft
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-4 text-center text-gray-600"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : rentalData?.comparables?.length > 0 ? (
                    rentalData.comparables.map((property, index) => (
                      <tr
                        key={property.id}
                        className={`hover:bg-gray-50 ${
                          selectedComps.includes(index) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-main rounded"
                            checked={selectedComps.includes(index)}
                            onChange={() => toggleCompSelection(index)}
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-main">
                          {property.formattedAddress || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatPrice(property.price)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(property.listedDate)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          $
                          {calculatePricePerSqFt(
                            property.price,
                            property.squareFootage
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.bedrooms ?? "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.bathrooms ?? "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.squareFootage ?? "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.distance.toFixed(2)} mi
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-4 text-center text-gray-600"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SummarySection;
