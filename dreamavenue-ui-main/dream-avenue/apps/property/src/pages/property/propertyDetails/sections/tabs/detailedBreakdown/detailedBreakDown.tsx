import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChartLine, FaPercentage, FaAngleDown } from "react-icons/fa";
import OpenStreetView from "../PropertyList/OpenStreetView/openStreetView";
import "../../../propertyDetails.css";
import {
  Button,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "container/components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FaDollarSign } from "react-icons/fa";
import { Legend } from "@headlessui/react";
import CashFlowChart from "../../cashflowChart/cashFlowChart";
import { BiDownArrow } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";
// import CostModal from "../../../../../../components/costmodal";
import PopupModal from "../../../../../../components/popup";
import PropertyServices from "../../../../../../Services/property";
import cashNeededIcon from "@/assets/property_icons/cashneedIcon.svg";
import cashFlowIcon from "@/assets/property_icons/cashflowIcon.svg";
import capRateIcon from "@/assets/property_icons/caprateIcon.svg";
import cocIcon from "@/assets/property_icons/cocIcon.svg";

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
  clear_purchase_itemize_costs?: boolean;
  clear_rehab_itemize_costs?: boolean;
}

interface DetailedBreakDownProps {
  property: Property;
}
interface ItemType {
  id?: string;
  name: string;
  amount: string | null;
  amount_type: string;
  cost_type?: string;
  totalAmount?: number;
}
const DetailedBreakDown: React.FC<DetailedBreakDownProps> = ({
  property,
  setProperty,
}) => {
  const [showChart, setShowChart] = useState(true);
  const [showHistogram, setShowHistogram] = useState(false);
  const [metrics, setMetrics] = useState([]);
  // const [isOpen, setIsOpen] = React.useState(false);
  // const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  // const [rehabData, setRehabData] = useState<number | any[]>(0);
  const [inputFields4, setInputFields4] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$" },
  ]);
  const [inputFieldsrehab, setInputFieldsrehab] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$", cost_type: "OverAll" },
  ]);
  const [isPopupOpen2, setIsPopupOpen2] = useState(false);
  const [rehabintemizedselectedType, setRehabintemizedselectedType] =
    useState("$");
  const [isPopupOpenrehab, setIsPopupOpenrehab] = useState(false);
  const [
    purchasecostintemizedselectedType,
    setPurchasecostintemizedselectedType,
  ] = useState("$");
  const [clearpurchaseitemizecosts, setClearpurchaseitemizecosts] = useState(
    property?.clear_purchase_itemize_costs
      ? property.clear_purchase_itemize_costs
      : false
  );
  const [clearrehabitemizecosts, setClearrehabitemizecosts] = useState(
    property?.clear_rehab_itemize_costs
      ? property.clear_rehab_itemize_costs
      : false
  );

  const getMetrics = (property: any) => {
    const format = (value?: number, suffix = "", prefix = "$") => {
      if (!value || value === 0) return "N/A";
      return `${prefix}${value.toLocaleString()}${suffix}`;
    };
    const capRate = property.cap_rate ?? null;
    const coc = property.coc ?? null;
    const cashFlow = property.monthly_cash_flow ?? null;

    return [
      {
        label: "Cash Needed",
        value: format(property.total_cash_needed),
        icon: cashNeededIcon,
        bgColor: "bg-bg",
        textColor: "text-main",
      },
      {
        label: "Cash Flow",
        value: cashFlow ? `${format(cashFlow, "/mo")}` : "N/A",
        icon: cashFlowIcon,
        bgColor: "bg-bg",
        textColor: "text-main",
      },
      {
        label: "Cap Rate",
        value: capRate ? `${capRate.toFixed(1)}%` : "N/A",
        icon: capRateIcon,
        bgColor: "bg-bg",
        textColor: "text-main",
      },
      {
        label: "COC",
        value: coc ? `${coc.toFixed(1)}%` : "N/A",
        icon: cocIcon,
        bgColor: "bg-bg",
        textColor: "text-main",
      },
    ];
  };

  useEffect(() => {
    if (property) {
      const updatedMetrics = getMetrics(property);
      setMetrics(updatedMetrics);
    }
  }, [property]);

  const calculateCapRate = (netIncome: number, purchasePrice: number) => {
    if (!netIncome || !purchasePrice) return null;
    return (netIncome / purchasePrice) * 100;
  };

  const calculateCOC = (netIncome: number, totalCash: number) => {
    if (!netIncome || !totalCash) return null;
    return ((netIncome * 12) / totalCash) * 100;
  };

  const purchaseRehabData = [
    {
      name: "Purchase Price",
      value: property?.purchase_price,
      fill: "#4B5EAA",
    },
    { name: "Rehab Costs", value: property?.rehab_costs, fill: "#34C759" },
    { name: "Closing Costs", value: property?.closing_costs, fill: "#4B5EAA" },
    { name: "Holding Costs", value: property?.holding_costs, fill: "#4B5EAA" },
    { name: "Down Payment", value: property?.down_payment, fill: "#FF6B6B" },
  ];

  const cashFlowData = [
    { name: "Net Operating Income", value: 2753, fill: "#4B5EAA" },
    { name: "", value: 150, fill: "#34C759" },
    { name: "", value: 460, fill: "#4B5EAA" },
    { name: "", value: 421, fill: "#4B5EAA" },
    { name: "", value: 211, fill: "#4B5EAA" },
  ];

  const purchaseCosts = [
    { label: "Home Inspection", value: property?.home_inspection || 0 },
    { label: "Loan Points (Financed)", value: property?.loan_points || 0 },
    { label: "Closing Costs", value: property?.closing_costs || 0 },
  ];

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || price === 0) return "N/A";
    return `$${price.toLocaleString()}`;
  };

  const handleAddInput2 = () => {
    setInputFields4([
      ...inputFields4,
      { name: "", amount: null, amount_type: "$" },
    ]);
  };

  const handleItemizedInputChange2 = (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number | string | number
  ) => {
    setInputFields4((prevFields: any) => {
      const updatedFields = [...prevFields];

      updatedFields[index] = {
        ...updatedFields[index],
        [field]: field === "amount" ? value || '' : value || "$",
      };

      return updatedFields;
    });
  };

  const toggleItemizepurchase = () => {
    setClearpurchaseitemizecosts((prev: any) => {
      const newValue = !prev;

      setProperty((prevData: any) => ({
        ...prevData,
        clear_purchase_itemize_costs: newValue,
      }));

      return newValue;
    });
  };

  const handleSaveTotalAmountPurchase = async () => {
    const totalAmount = inputFields4[0]?.totalAmount || 0;

    const requestData = {
      purchase_costs: totalAmount,
      clear_closing_itemize_costs: false,
    };

    const endpoint = `property/${property.id}`;
    const contentType = "application/json";

    try {
      const response = await PropertyServices.patchCommon(
        endpoint,
        contentType,
        requestData
      );

      setProperty((prev: any) => ({
        ...prev,
        purchase_costs: response?.data?.purchase_costs ?? totalAmount,
      }));

      setInputFields4((prevFields: any) => {
        return prevFields.map((field: any, index: any) =>
          index === 0 ? { ...field, totalAmount } : field
        );
      });

      setIsPopupOpen2(false);
    } catch (error) {
      console.error("Failed to update purchase_costs:", error);
    }
  };

  const handleItemizedInputChange = (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number
  ) => {
    setInputFieldsrehab((prevFields: any) => {
      const updatedFields = [...prevFields];

      updatedFields[index] = {
        ...updatedFields[index],
        [field]: field === "amount" ? value || '' : value || "$",
      };

      console.log("input--", updatedFields);
      return updatedFields;
    });
  };
  const handleAddInputrehab = () => {
    setInputFieldsrehab([
      ...inputFieldsrehab,
      { name: "", amount: null, amount_type: "$" },
    ]);
  };
  const handleSaveRehab = useCallback(async () => {
    try {
      setIsPopupOpenrehab(true);

      if (!property.id) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFieldsrehab || inputFieldsrehab.length === 0) {
        console.warn("No Rehab costs to send.");
        return;
      }

      // Delete existing rehab costs if IDs are provided
      for (const item of inputFieldsrehab) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${property.id}/rehab-costs/${item.id}`
          );
        }
      }

      // Prepare the payload
      const payload = inputFieldsrehab.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(property.id),
      }));

      // Post the rehab costs
      const response = await PropertyServices.postCommon(
        "/property/rehab-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post rehab costs.");
        return;
      }

      // Update local state
      const r = response.data;
      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFieldsrehab(upData);

      // Delay fetching to ensure backend processes data
      setTimeout(async () => {
        const response2 = await fetchPropertydetails(property.id);
        const rehab_costs = response2?.data.rehab_costs;

        setProperty((prevValue: any) => ({
          ...prevValue,
          rehab_costs: String(rehab_costs),
        }));
        // property.rehab_costs = rehab_costs;

        console.log("Rehab costs fetched after delay:", rehab_costs);
      }, 500); // Delay by 500ms (adjust if needed)

      console.log("Rehab costs posted successfully:", response);
    } catch (error) {
      console.error("Error posting Rehab costs:", error);
    } finally {
      setIsPopupOpenrehab(false);
    }
  }, [property.id, inputFieldsrehab]);

  const handlePurchaseSave = useCallback(async () => {
    try {
      setIsPopupOpen2(true);
      if (!property.id) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFields4 || inputFields4.length === 0) {
        console.warn("No purchase costs to send.");
        return;
      }

      for (const item of inputFields4) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${property.id}/purchase-costs/${item.id}`
          );
        }
      }

      const payload = inputFields4.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(property.id),
      }));

      const response = await PropertyServices.postCommon(
        "/property/purchase-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post purchase costs.");
        return;
      }

      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFields4(upData);

      const response2 = await fetchPropertydetails(property.id);
      const purchase_costs = response2?.data.purchase_costs;

      setProperty((prevValue: any) => ({
        ...prevValue,
        purchase_costs: String(purchase_costs),
      }));

      console.log("Purchase costs posted successfully:", response);
    } catch (error) {
      console.error("Error posting purchase costs:", error);
    } finally {
      setIsPopupOpen2(false);
    }
  }, [property.id, inputFields4]);
  const handleDeleteInputrehab = async (idOrIndex?: string | number) => {
    const propId = property.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (idOrIndex !== undefined) {
        if (typeof idOrIndex === "string") {
          const endpoint = `/property/${propId}/rehab-costs/${idOrIndex}`;
          console.log("Sending DELETE request:", endpoint);

          const response = await PropertyServices.deleteCommon(endpoint);
          console.log("Deleted successfully:", response);

          setInputFieldsrehab((prevFields: any[]) =>
            prevFields.filter((field: any) => field.id !== idOrIndex)
          );
        } else if (typeof idOrIndex === "number") {
          setInputFieldsrehab((prevFields: any[]) =>
            prevFields.filter((_, index) => index !== idOrIndex)
          );
        }
      } else {
        const allRehabCostIds = inputFieldsrehab
          .map((item: any) => item.id)
          .filter(Boolean);

        if (!allRehabCostIds?.length) {
          console.warn("No rehab costs with IDs to delete.");
          return;
        }

        console.log("Deleting ALL rehab costs...");
        for (const itemId of allRehabCostIds) {
          const endpoint = `/property/${propId}/rehab-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All rehab costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          rehab_costs: null,
        }));

        setInputFieldsrehab([]);
      }

      const response2 = await fetchPropertydetails(propId);
      const rehab_costs = response2?.data.rehab_costs;

      setProperty((prevValue: any) => ({
        ...prevValue,
        rehab_costs: isBulkDelete ? null : rehab_costs,
      }));
    } catch (error) {
      console.error("Error deleting rehab cost(s):", error);
    }
  };

  const handleDeleteInput2 = async (idOrIndex?: string | number) => {
    const propId = property.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (idOrIndex !== undefined) {
        if (typeof idOrIndex === "string") {
          const endpoint = `/property/${propId}/purchase-costs/${idOrIndex}`;
          console.log("Sending DELETE request:", endpoint);

          const response = await PropertyServices.deleteCommon(endpoint);
          console.log("Deleted successfully:", response);

          setInputFields4((prevFields: any[]) =>
            prevFields.filter((field: any) => field.id !== idOrIndex)
          );
        } else if (typeof idOrIndex === "number") {
          setInputFields4((prevFields: any[]) =>
            prevFields.filter((_, index) => index !== idOrIndex)
          );
        }
      } else {
        const allPurchaseCostIds = inputFields4
          .map((item: any) => item.id)
          .filter(Boolean);

        if (!allPurchaseCostIds?.length) {
          console.warn("No purchase costs with IDs to delete.");
          return;
        }

        console.log("Deleting ALL purchase costs...");
        for (const itemId of allPurchaseCostIds) {
          const endpoint = `/property/${propId}/purchase-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All purchase costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          purchase_costs: null,
        }));

        setInputFields4([]);
      }

      const response2 = await fetchPropertydetails(propId);
      const purchase_costs = response2?.data.purchase_costs;

      setProperty((prevValue: any) => ({
        ...prevValue,
        purchase_costs: isBulkDelete ? null : purchase_costs,
      }));
    } catch (error) {
      console.error("Error deleting purchase cost(s):", error);
    }
  };

  const toggleItemizerehab = () => {
    setClearrehabitemizecosts((prev) => {
      const newValue = !prev;

      setProperty((prevData: any) => ({
        ...prevData,
        clear_rehab_itemize_costs: newValue,
      }));
      return newValue;
    });
  };

  const handleSaveTotalAmountrehab = async () => {
    const totalAmount = inputFieldsrehab[0]?.totalAmount || 0;

    const requestData = {
      rehab_costs: totalAmount,
      clear_rehab_itemize_costs: false,
    };

    const endpoint = `property/${property.id}`;
    const contentType = "application/json";

    try {
      const response = await PropertyServices.patchCommon(
        endpoint,
        contentType,
        requestData
      );

      setProperty((prev: any) => ({
        ...prev,
        rehab_costs: response?.data?.rehab_costs ?? totalAmount,
      }));

      setInputFieldsrehab((prevFields: any) => {
        return prevFields.map((field: any, index: any) =>
          index === 0 ? { ...field, totalAmount } : field
        );
      });

      setIsPopupOpenrehab(false);
    } catch (error) {
      console.error("Failed to update rehab_costs:", error);
    }
  };

  const fetchRehabCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/rehab-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFieldsrehab(upData);
      }
    } catch (error) {
      console.error("Error fetching rehab costs:", error);
    }
  };
  const fetchPurchaseCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/purchase-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFields4(upData);
      }
    } catch (error) {
      console.error("Error fetching purchase costs:", error);
    }
  };

  const fetchPropertydetails = async (propertyId: string) => {
    try {
      const endpoint = `/property/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      return response;
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  useEffect(() => {
    if (property.id) {
      const propertyId = property.id;
      fetchRehabCosts(propertyId);
      fetchPurchaseCosts(propertyId);
      fetchPropertydetails(propertyId);
    }
  }, [property?.id]);

  return (
    <div>
      {/* Overview Metrics */}
      <Card>
        <div>
          <h3 className="text-2xl  text-gray-800 font-semibold mb-4">
            Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex flex-wrap w-full justify-between">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 min-w-[14rem] w-[23%]"
                >
                  <span
                    className={`${metric.bgColor} p-4 rounded-2xl mr-3 border`}
                  >
                    <img
                      src={IconComponent}
                      className={`text-3xl ${metric.textColor}`}
                    />
                  </span>
                  <div>
                    <p className="text-base text-gray-700">{metric.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Summary Section */}
      {/* <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        </div>

        <div className="gap-6 mb-6 flex flex-wrap w-full ">
          <div className="border rounded-lg p-4 flex items-start bg-white">
            <div>
              <h3 className="text-sm font-base text-gray-600 mb-5">
                Purchase and Rehab
              </h3>
              <span>
                <h3 className="text-base text-slate-500 mb-1">
                  Purchase Price
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mb-4">
                  {formatPrice(property?.purchase_price) || "N/A"}
                </p>
              </span>
            </div>

            <BarChart
              width={300}
              height={200}
              data={purchaseRehabData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                vertical={true}
                stroke="#E5E7EB"
              />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                barSize={20}
                fill="#6366F1"
                radius={[0, 5, 5, 0]}
                label={{ position: "right", fill: "#6B7280", fontSize: 12 }}
              />
            </BarChart>
          </div>

          <div className="border rounded-lg p-4 flex items-start bg-white">
            <div>
              <h3 className="text-sm font-base text-gray-600 mb-5">
                Cash Flow
              </h3>
              <span>
                <h3 className="text-base text-slate-500 mb-1">
                  Net Operating Income
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mb-4">
                  {formatPrice(property?.total_cash_needed)}
                </p>
              </span>
            </div>
            <BarChart
              width={300}
              height={200}
              data={cashFlowData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                barSize={20}
                fill="#10B981"
                radius={[0, 5, 5, 0]}
                label={{ position: "right", fill: "#6B7280", fontSize: 12 }}
              />
            </BarChart>
          </div>
        </div>
      </Card> */}

      <Card>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-gray-800 font-semibold">
            Purchase & Rehab
          </h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Show Chart</span>
            <label className="relative inline-flex items-center cursor-pointer"></label>
            {/* <input
              type="checkbox"
              checked={showChart}
              onChange={() => setShowChart(!showChart)}
              className="sr-only peer"
            /> */}
            <button
              type="button"
              onClick={() => {
                setShowChart((prev) => !prev);
              }}
              className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all ${
                showChart ? "bg-[#423E76]" : "bg-bgPurple"
              }`}
            >
              {/* Toggle Circle */}
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-all duration-300 absolute top-1 ${
                  showChart
                    ? "left-[calc(100%-1.75rem)] bg-white"
                    : "left-1 bg-main"
                }`}
              ></div>

              {/* "Yes" Text on the left */}
              <span
                className={`text-xs font-semibold z-10 transition-all duration-300 absolute left-2 ${
                  showChart ? "text-white" : "text-transparent"
                }`}
              >
                Yes
              </span>

              {/* "No" Text on the right */}
              <span
                className={`text-xs font-semibold z-10 transition-all duration-300 absolute right-2 ${
                  !showChart ? "text-main" : "text-transparent"
                }`}
              >
                No
              </span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="border border-borderColor rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2  border-b py-2">
              <span className="text-base text-gray-600">Purchase Price</span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property.purchase_price)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-600 flex items-center">
                Rehab Costs
                <FaAngleDown />
              </span>
              <span className="text-lg font-bold text-gray-800 flex items-center">
                {formatPrice(property.rehab_costs)}
                <AiFillEdit
                  className="text-main cursor-pointer"
                  onClick={() => setIsPopupOpenrehab(true)}
                  // onClick={() => setIsOpen(true)}
                />
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-600">Amount Financed</span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.loan_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 text-emerald-500">
              <span className="text-base ">Down Payment</span>
              <span className="text-lg font-bold">
                {formatPrice(property?.down_payment) || "N/A"}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="border border-borderColor rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-600 flex items-center">
                Purchase Costs
                <FaAngleDown />
              </span>
              <span className="text-lg font-bold text-gray-800 flex items-center">
                {formatPrice(property?.purchase_costs) || "N/A"}
                <AiFillEdit
                  className="text-main"
                  onClick={() => setIsPopupOpen2(true)}
                  // onClick={() =>{setIsPurchaseModalOpen(true)}}
                />
              </span>
            </div>
            {purchaseCosts.map((cost, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 border-b py-2"
              >
                <span className="text-base text-gray-600">{cost.label}</span>
                <span className="text-gray-800 font-bold">
                  {formatPrice(cost?.value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 text-emerald-500">
              <span className="text-base font-medium ">Total Cash Needed</span>
              <span className="text-lg font-bold ">
                {formatPrice(property?.total_cash_needed)}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {showChart && (
          <>
            {/* Histogram Toggle */}
            {/* <div className="flex items-center mb-4">
              <span className="text-sm text-gray-600 mr-2">Histogram</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHistogram}
                  onChange={() => setShowHistogram(!showHistogram)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-main transition-colors duration-200"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-50 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
              </label>
            </div> */}

            {/* Charts */}
            <div className="flex flex-wrap items-start gap-6">
              {/* Pie Chart */}
              <div
                className="relative bg-white p-4 border-borderColor"
                style={{
                  border: "1px solid #d8d6f5",
                  borderRadius: "16px", // or any radius you prefer
                  padding: "16px", // optional, adds space inside the border
                  display: "inline-block", // ensures it wraps tightly around the chart
                  backgroundColor: "#fff", // optional, if you want a white background
                }}
              >
                <PieChart width={400} height={400}>
                  <Pie
                    data={
                      property?.pieData?.length
                        ? property.pieData.map(
                            (item: {
                              name: any;
                              value: number | null | undefined;
                              fill: any;
                            }) => {
                              return {
                                name: item?.name || "",
                                value: item?.value || 0, // use 0 instead of "" for numeric safety
                                fill: item?.fill || "#ccc",
                              };
                            }
                          )
                        : []
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(property?.pieData || []).map(
                      (entry: { fill: string | undefined }, index: any) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                    labelFormatter={(name) => name}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) =>
                      `${value} (${entry.payload.value}%)`
                    }
                  />
                </PieChart>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs text-gray-600">Total Cash Needed</p>
                  <p className="text-base font-medium text-gray-800">
                    {formatPrice(property?.total_cash_needed)}
                  </p>
                </div>
              </div>
              {/* {showHistogram && ( */}
                <>
                  {/* Bar Chart */}
                  <div className="flex-1 bg-white p-4 border border-gray-300 rounded-xl shadow-sm">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={
                          property?.barData?.length
                            ? property.barData.map(
                                (item: {
                                  name: any;
                                  value: { amount: number | null | undefined };
                                  fill: any;
                                }) => ({
                                  name: item.name,
                                  value:
                                    typeof item.value === "object"
                                      ? formatPrice(item.value.amount)
                                      : item.value,
                                  fill: item.fill,
                                })
                              )
                            : [
                                {
                                  name: "Amount Financed",
                                  value: 0,
                                  fill: "#423E76",
                                },
                                {
                                  name: "Down Payment",
                                  value: 0,
                                  fill: "#9992F2",
                                },
                                {
                                  name: "Cash Needed",
                                  value: 0,
                                  fill: "#827CCE",
                                },
                                {
                                  name: "Purchase Price",
                                  value: 0,
                                  fill: "#A78BFA",
                                },
                              ]
                        }
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6B7280", fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `$${value.toLocaleString()}`
                          }
                          tick={{ fill: "#6B7280", fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Bar
                          dataKey="value"
                          barSize={40}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              {/* )} */}
            </div>
          </>
        )}
      </Card>
      <div className="flex justify-between w-full gap-2 h-full">
        {/* Financing */}
        <Card className="w-1/2 flex-1 min-h-full">
          <h2 className="text-2xl text-gray-800 font-semibold mb-4">
            Financing
          </h2>
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                Loan Amount
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.loan_amount) || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                Loan to Cost
              </span>
              <span className="text-lg font-bold text-gray-800">
                {property?.loan_to_cost?.toFixed(2) + "%" || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-500 font-medium">
                Loan to Value
              </span>
              <span className="text-lg font-bold text-gray-800">
                {property?.loan_to_value?.toFixed(2) + "%" || "N/A"}
              </span>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                Financing
              </span>
              <span className="text-lg font-bold text-gray-800">
                {property?.financing_of_type_id || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                Loan Type
              </span>
              <span className="text-lg font-bold text-gray-800">
                {property?.loan_type || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-500 font-medium">
                Interest Rate
              </span>
              <span className="text-lg font-bold text-gray-800">
                {property?.interest_rate
                  ? `${property.interest_rate.toFixed(2)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Valuation */}
        <Card className="w-1/2 flex-1 flex-col min-h-full bg-gray-50 rounded-lg shadow-inner p-6">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">
            Valuation
          </h2>
          <div className="border mb-4 border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                After Repair Value
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.after_repair_value)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-500 font-medium">
                ARV Per Square Foot
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.arv_per_square_foot)}
              </span>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2 border-b py-2">
              <span className="text-base text-gray-500 font-medium">
                Price Per Square Foot
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.price_per_square_foot)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-500 font-medium">
                Rehab Per Square Foot
              </span>
              <span className="text-lg font-bold text-gray-800">
                {formatPrice(property?.rehab_cost_overrun)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Chart TODO */}

      {/* <CashFlowChart property={property} /> */}

      {/* Returns */}
      <div className="flex =justify-between w-full  gap-2 h-full">
        {/* 1st Year Return Section */}
        <Card className="w-1/2 flex-1 min-h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1st Year Return
          </h2>

          {/* Left Column */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm mb-4">
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Cap Rate (Purchase Price)
              </span>
              <span className="font-bold">
                {formatPrice(property?.purchase_price) || 0}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Cash on Cash Return
              </span>
              <span className="font-bold">
                {property?.cash_on_cash_return || 0}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium text-base">
                Return on Investment
              </span>
              <span className="font-bold">
                {property?.return_on_investment || "N/A"}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Cap Rate (Market Value)
              </span>
              <span className="font-bold"> {property?.cap_rate || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Return on Equity
              </span>
              <span className="font-bold">
                {property?.return_on_equity || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium text-base">
                Internal Rate of Return
              </span>
              <span className="font-bold">
                {property?.internal_rate_of_return || "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Purchase Financial Ratio Section */}
        <Card className="w-1/2 flex-1 flex-col min-h-full bg-gray-50 rounded-lg shadow-inner p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Purchase Financial Ratio
          </h2>
          {/* Left Column */}
          <div className="border mb-4 border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Rate to Value
              </span>
              <span className="font-bold">{property?.rate_to_value || 0}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Gross Rent Multiplier
              </span>
              <span className="font-bold">
                {property?.gross_rent_multiplier || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pb py-2">
              <span className="text-gray-500 font-medium text-base">
                Equity Multiple
              </span>
              <span className="font-bold">
                {property?.equity_multiple || "N/A"}
              </span>
            </div>
          </div>
          {/* Right Column */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Break Even Ratio
              </span>
              <span className="font-bold">
                {property?.break_even_ratio || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b py-2">
              <span className="text-gray-500 font-medium text-base">
                Debt Coverage Ratio
              </span>
              <span className="font-bold">
                {property?.debt_coverge_ratio || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium text-base">
                Debt Yield
              </span>
              <span className="font-bold">{property?.debt_yield || 0}%</span>
            </div>
          </div>
        </Card>
      </div>
      {/* <CostModal
      isOpen={isOpen || isPurchaseModalOpen}
      title={isOpen?"Rehab Costs":"Purchase Costs"}
      initialData={rehabData} // number or array
      onClose={() => {
        setIsPurchaseModalOpen(false);
        setIsOpen(false)
      }}
      onSave={(data) => {
        setRehabData(data);
        console.log("Saved:", data);
        setIsPurchaseModalOpen(false);
        setIsOpen(false);
      }}
    /> */}

      <PopupModal
        isOpen={isPopupOpen2}
        title="Purchase Costs"
        inputFields={inputFields4}
        handleInputChange={handleItemizedInputChange2}
        handleAddInput={handleAddInput2}
        handleDeleteInput={(id) => {
          handleDeleteInput2(id);
        }}
        onClose={() => setIsPopupOpen2(false)}
        onSave={handlePurchaseSave}
        showSelect={true}
        selectedType={purchasecostintemizedselectedType}
        handleSelectChange={(value) =>
          setPurchasecostintemizedselectedType(value)
        }
        itemize={clearpurchaseitemizecosts}
        toggleItemize={toggleItemizepurchase}
        onSaveItemizednormal={handleSaveTotalAmountPurchase}
      />
      <PopupModal
        isOpen={isPopupOpenrehab}
        title="Rehab Costs"
        inputFields={inputFieldsrehab}
        handleInputChange={handleItemizedInputChange}
        handleAddInput={handleAddInputrehab}
        handleDeleteInput={(id) => {
          handleDeleteInputrehab(id);
        }}
        onClose={() => setIsPopupOpenrehab(false)}
        onSave={handleSaveRehab}
        showSelect={true}
        selectedType={rehabintemizedselectedType}
        handleSelectChange={(value) => setRehabintemizedselectedType(value)}
        itemize={clearrehabitemizecosts}
        toggleItemize={toggleItemizerehab}
        onSaveItemizednormal={handleSaveTotalAmountrehab}
      />
    </div>
  );
};

export default DetailedBreakDown;
