import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCheckCircle,
  FaTools,
} from "react-icons/fa";
import PropertyServices from "../../../Services/property";
import "./propertyDetails.css";
import { Button, Card, Dialog } from "container/components";
import DocumentsSection from "./sections/cashflowChart/propertydocuments/documents";
import PropertyImagesGallery from "./sections/propertyImage/propertyImage";
import SummarySection from "./sections/tabs/summary/summarySection";
import DetailedBreakdownSection from "./sections/tabs/detailedBreakdown/detailedBreakDown";
import { FaCodeCompare } from "react-icons/fa6";
import CompareIcon from "@/assets/icons/compare.svg";
import propertyIcon from "@/assets/icons/addproperty.svg";
import annualReturnIcon from "@/assets/property_icons/annualreturn.svg";
import projectedyieldIcon from "@/assets/property_icons/projectedyield.svg";
import rentalyield from "@/assets/property_icons/rentaltyield.svg";
import { MdOutlineFileDownload } from "react-icons/md";
import { BiExport } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";


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

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [investmentStrategy, setInvestmentStrategy] =
    useState<string>("Unknown");
  const [propertyType, setPropertyType] = useState<string>("Unknown");
  const [loanType, setLoanType] = useState<string>("Unknown");
  const [financingType, setFinancingType] = useState<string>("Unknown");
  const [activeTab, setActiveTab] = useState("summary");
  const [propertyFinancing, setPropertyFinancing] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) return;

      try {
        setLoading(true);
        const propertyData = await PropertyServices.getPropertyById(propertyId);
        const propertyFinancing =
          await PropertyServices.getPropertyFinancingById(propertyId);
        setPropertyFinancing(propertyFinancing);
        // Extract lat/lng from geocode_response if not directly available
        if (
          !propertyData.lat &&
          !propertyData.lng &&
          propertyData.geocode_response
        ) {
          if (propertyData.geocode_response?.items?.[0]?.position) {
            propertyData.lat =
              propertyData.geocode_response.items[0].position.lat;
            propertyData.lng =
              propertyData.geocode_response.items[0].position.lng;
          }
        }
        const totalDownPayment = propertyFinancing?.reduce((sum, item) => {
          return sum + parseFloat(item.down_payment);
        }, 0);
        propertyData.loan_amount =
          propertyData.loan_amount ||
          propertyData.purchase_price - propertyData.down_payment;

        // Calculate pie and bar data
        const totalCost =
          (propertyData.purchase_price || 0) + (propertyData.rehab_costs || 0);
        const amountFinanced =
          totalCost > 0
            ? ((propertyData.loan_amount || 0) / totalCost) * 100
            : 0;
        const purchaseAndRehab =
          totalCost > 0
            ? ((propertyData.rehab_costs || 0) / totalCost) * 100
            : 0;
        const downPaymentPercentage =
          totalCost > 0
            ? ((propertyData.down_payment || 0) / totalCost) * 100
            : 0;

        const pieData = [
          {
            name: "Amount Financed",
            value: parseFloat(amountFinanced.toFixed(2)),
            fill: "#4B5EAA",
          },
          {
            name: "Purchase & Rehab",
            value: parseFloat(purchaseAndRehab.toFixed(2)),
            fill: "#34C759",
          },
          {
            name: "Down Payment",
            value: parseFloat(downPaymentPercentage.toFixed(2)),
            fill: "#FF6B6B",
          },
        ];

        const barData = [
          {
            name: "Purchase Price",
            value: propertyData.purchase_price || 0,
            fill: "#4B5EAA",
          },
          {
            name: "Total Cash Needed",
            value: propertyData || 0,
            fill: "#34C759",
          },
          {
            name: "Down Payment",
            value: propertyData.down_payment || 0,
            fill: "#FF6B6B",
          },
          {
            name: "Amount Financed",
            value: propertyData.loan_amount || 0,
            fill: "#A78BFA",
          },
        ];

        propertyData.pieData = pieData;
        propertyData.barData = barData;
        setProperty(propertyData);

        // Fetch related data
        const [strategies, propertyTypes, loanTypes, financingTypes] =
          await Promise.all([
            PropertyServices.getInvestmentStrategies(),
            PropertyServices.getPropertyTypes(),
            PropertyServices.getLoanTypes(),
            PropertyServices.getFinancingTypes(),
          ]);

        if (propertyData.investment_strategy_id) {
          const strategy = strategies?.data?.find(
            (s: any) => s.id === propertyData.investment_strategy_id
          );
          if (strategy) setInvestmentStrategy(strategy.name);
        }

        if (propertyData.property_type_id) {
          const type = propertyTypes?.data?.find(
            (t: any) => t.id === propertyData?.property_type_id
          );
          if (type) setPropertyType(type.name);
        }

        if (propertyData.loan_type_id) {
          const loan = loanTypes?.data?.find(
            (l: any) => l.id === propertyData.loan_type_id
          );
          if (loan) setLoanType(loan.name);
        }

        if (propertyData.financing_of_type_id) {
          const financing = financingTypes?.data?.find(
            (f: any) => f.id === propertyData.financing_of_type_id
          );
          if (financing) setFinancingType(financing.name);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const exportData = async ()=>{
    try{
     const response = await PropertyServices.downloadProperty(
              
              {sections:["section1", "section2", "section3", "section4", "section5", "section6", "section7", "section8", "section9", "section10"],
               id:propertyId
               }
             );

                const file = new Blob([response], { type: 'application/pdf' });
                  const fileURL = URL.createObjectURL(file); // Step 1: Create URL from Blob

                const link = document.createElement("a"); // Step 2: Create a download link
                link.href = fileURL;
                link.download = property?.title+".pdf"; // Set your desired file name here
                document.body.appendChild(link);
                link.click(); // Trigger download
                link.remove(); // Clean up
                URL.revokeObjectURL(fileURL);
            }
            catch(error:any)
            {
                    toast.error("Unable to download property data. Please try again.");
              

            }


  }
  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "N/A";
    return `$${price.toLocaleString()}`;
  };

  console.log(property, "the perope");
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-medium">Property Not Found</h2>
          <p>The property you're looking for could not be found.</p>
          <button
            onClick={() => navigate("/property")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-bg container mx-auto px-10 py-6  overflow-auto h-screen">
      {/* Header with address and edit button */}

      <div className="flex justify-between items-start sm:items-center mb-4 ">
        <div>
          <div className="flex items-center text-sm text-main">
            <span className="mr-2">Explore Property</span>
            <span className="mx-1">›</span>
            <span
              className="mr-2 cursor-pointer hover:text-indigo-600"
              onClick={() => {
                navigate("/property");
              }}
            >
              Property List
            </span>
          </div>
          <h1 className="text-3xl xs:text-xl font-bold text-gray-900 mb-1">
            {property.title || `${property.address}`}
          </h1>
          <p className="text-base text-gray-400"> {property?.full_address} </p>
        </div>
        <div className="flex items-center gap-3">
           <Button
            // onClick={() => navigate(`/property/edit/${propertyId}`)}
            onClick={() => {exportData()}}
            className="px-3 py-2 bg-secondary text-white rounded-md flex items-center"
          >
            <MdOutlineFileDownload size={24}/>
            
          </Button>
          <button
            // onClick={() => navigate(`/property/edit/${propertyId}`)}
            onClick={() => navigate(`/comprare`)}
            className="px-3 py-2 bg-secondary text-white rounded-md flex items-center"
          >
            <FaCodeCompare className="mr-2" />
            Find Contractor 
          </button>
          <Button
            // onClick={() => navigate(`/property/edit/${propertyId}`)}
            onClick={() => navigate(`/add-property`)}
            className="px-2 py-2  flex items-center gap-2"
          >
            <img src={propertyIcon}></img>
            Add Property
          </Button>
        </div>
      </div>

      <div className="flex items-stretch gap-4 w-full">
        {/* Left: Photo Gallery */}
        <div className="w-[65%] bg-white rounded-md shadow-md p-4 flex justify-start">
          <PropertyImagesGallery propertyId={propertyId!} property={property} />
        </div>

        {/* Right: Investment Metrics */}
        <div className="w-[35%] bg-white rounded-md shadow-md p-4 flex flex-col justify-between gap-4">
          {/* Each metric block */}
          <div className="bg-white border border-borderColor p-4 rounded-lg flex items-center gap-4">
            <span className="p-4 bg-bg rounded-2xl border border-borderColor">
              <img src={annualReturnIcon} />
            </span>
            <div>
              <p className="text-base text-slate-600">
                Projected Annual Return
              </p>
              <p className="font-semibold text-xl text-[#009E64]">
                {property?.loan_to_value
                  ? `${property.loan_to_value.toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white border border-borderColor p-4 rounded-lg flex items-center gap-4">
            <span className="p-4 bg-bg rounded-2xl border border-borderColor">
              <img src={projectedyieldIcon} />
            </span>
            <div>
              <p className="text-base text-slate-600">Projected Rental Yield</p>
              <p className="font-semibold text-xl text-[#009E64]">
                {property?.arv_per_square_foot
                  ? `${property.arv_per_square_foot.toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white border border-borderColor p-4 rounded-lg flex items-center gap-4">
            <span className="p-4 bg-bg rounded-2xl border border-borderColor">
              <img src={rentalyield} />
            </span>
            <div>
              <p className="text-base text-slate-600">Rental Yield</p>
              <p className="font-semibold text-xl text-[#009E64]">
                {property?.loan_to_cost
                  ? `${(property.loan_to_cost * 100).toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-stretch justify-between gap-4 xs:flex-wrap">
        {/* Property Summary - 70% width */}
        <Card className="w-[65%] flex flex-col justify-between min-h-full">
          <h2 className="text-xl font-bold mb-4">About the Property</h2>
          <p className="text-gray-600 mb-4">
            {property?.description || "No description available"}
          </p>

          {/* Property Details Icons */}
          <div className="flex items-center justify-between mb-6 border border-gray-200 rounded-lg p-4 shadow-sm text-sm text-slate-500 flex-wrap">
            {/* Bedrooms */}
            <div className="flex flex-col items-start px-4">
              <p className="text-sm mb-1">Bedrooms</p>
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <FaBed className="text-slate-500" />
                <span>{property?.bedrooms || 0}</span>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex flex-col items-start px-4">
              <p className="text-xs mb-1">Bathrooms</p>
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <FaBath className="text-slate-500" />
                <span>{property?.bathrooms || 0}</span>
              </div>
            </div>

            {/* Square Area */}
            <div className="flex flex-col items-start px-4">
              <p className="text-xs mb-1">Square Area</p>
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <FaRulerCombined className="text-slate-500" />
                <span>{property?.square_feet || 0} sqft</span>
              </div>
            </div>

            {/* Repair Quality */}
            <div className="flex flex-col items-start px-4">
              <p className="text-xs mb-1">Repair Quality</p>
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <FaTools className="text-slate-500" />
                <span>{property?.repair_quality || "Standard"}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col items-start px-4">
              <p className="text-xs mb-1">Status</p>
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <FaCheckCircle className="text-slate-500" />
                <span>{property?.status || "Active"}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents Section - 30% width */}
        <Card className="w-[35%] flex flex-col justify-between min-h-full">
          <div className="h-full">
            <DocumentsSection propertyId={propertyId!} />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="bg-mainColor py-6 ">
        <nav className="flex space-x-2 border-b border-gray-300 pl-2 bg-white  pt-4 rounded-md">
          <button
            onClick={() => setActiveTab("summary")}
            className={`py-2 px-4 text-base  font-medium ${
              activeTab === "summary"
                ? " text-main font-medium border-b-2 border-main "
                : "text-gray-400 hover:text-main"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("detailed")}
            className={`py-2 px-4 text-base  ${
              activeTab === "detailed"
                ? " text-main font-medium border-b-2 border-main "
                : "text-gray-400 hover:text-main"
            }`}
          >
            Detailed Breakdown
          </button>
        </nav>
      </div>
      {activeTab === "summary" && <SummarySection property={property} />}
      {activeTab === "detailed" && (
        <DetailedBreakdownSection
          property={property}
          setProperty={setProperty}
        />
      )}
    </div>
     <Toaster />
</>
  );
};

export default PropertyDetails;
