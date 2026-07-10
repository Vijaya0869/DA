import React, { useEffect, useState, useRef, useCallback } from "react";
import { AiOutlineOrderedList } from "react-icons/ai";
import { GrDisabledOutline } from "react-icons/gr";
import { BiBath, BiBed, BiBrush } from "react-icons/bi";
import {
  FaMapMarked,
  FaThumbsUp,
  FaAngleRight,
  FaEdit,
  FaSync,
} from "react-icons/fa";
import { HiOutlineHomeModern } from "react-icons/hi2";
import PropertyTop from "@/assets/images/propertyTop.svg";
import "./propertyList.css";
import { AiOutlineLike, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import PropertyServices from "../../../Services/property";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import OpenStreetView, {
  LocationMarker,
} from "./OpenStreetView/openStreetView";
import PropertyMap from "./OpenStreetView/propertyMap";
import debounce from "lodash.debounce";
import propertyImage from "../../../assets/images/home-icon.png";
import AddProperty from "../AddProperty/AddProperty";
import { Button, InputField, Logo } from "container/components";
import CompareIcon from "@/assets/icons/compare.svg";
import propertyIcon from "@/assets/icons/addproperty.svg";
import searchIcon from "@/assets/icons/searchIcon.svg";
import mapIcon from "@/assets/icons/mapIcon.svg";
import syncIcon from "@/assets/icons/syncIcon.svg";
import listIcon from "@/assets/icons/listIcon.svg";

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
  full_address?:string
  notes?: string;
  tags_n_labels?: string;
  zoning?: string;
  mls_number?: string;
  loan_labels?: string;
  purchase_price: number;
  closing_costs?: number | null;
  purchase_costs?: number | null;
  after_repair_value?: number | null;
  rehab_cost_overrun?: number | null;
  rehab_cost_holding_period?: number | null;
  down_payment?: number | null;
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
  thumbnail_image?: {
    url: string;
  };
  geocode_response: {
    items: Array<{
      position: {
        lat: number;
        lng: number;
      };
      address: {
        city: string;
        state: string;
      };
    }>;
  };
}

const PropertyList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isMapView, setIsMapView] = useState(true);
  const [pageview, setPageView] = useState("property");
  const [editObject, setEditObject] = useState<Property | undefined>(undefined);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investmentStrategy, setInvestmentStrategy] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const pageSize = 10;
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null
  );
  // Create a debounced search handler
  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500), // 500ms debounce delay
    []
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const value = e.target.value;
    setSearch(value);
    debouncedSearchHandler(value);
  };
  useEffect(() => {
    getInvestmentStrategies();
  }, []);

  // Fetch properties when dependencies change
  useEffect(() => {
    fetchProperties();
  }, [currentPage, selectedStrategy, debouncedSearch]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      // Prepare API params
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
        searchKey: debouncedSearch ? debouncedSearch : undefined,
        investmentStrategy: selectedStrategy ? selectedStrategy : undefined,
      };

      const response = await PropertyServices.getProperties(params);
      console.log("API Response:", response.data);

      // The API returns [data, totalCount]
      const [propertyData, totalCount] = response.data;
      setProperties(propertyData);

      // Set the first property as selected by default if we don't have a selection
      if (propertyData.length > 0 && !selectedProperty) {
        setSelectedProperty(propertyData[0]);
      }

      setTotalPages(Math.ceil(totalCount / pageSize));
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setError("Failed to load properties. Please try again later.");
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentStrategies = async () => {
    try {
      const response: any = await PropertyServices.getInvestmentStrategies();
      console.log("Investment Strategies:", response);
      setInvestmentStrategy(response.data);
    } catch (error) {
      console.error("Failed to fetch investment strategies:", error);
    }
  };

  // Helper function to format price
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null || price === 0) {
      return "N/A";
    }
    return `$${price.toLocaleString()}`;
  };

  // Helper function to calculate ROI
  const calculateROI = (property: Property) => {
    if (property.purchase_price && property.estimated_rent) {
      const annualRent = property.estimated_rent * 12;
      const roi = (annualRent / property.purchase_price) * 100;
      return roi.toFixed(1) + "%";
    }
    return "N/A";
  };

  // Helper function to determine ROI type
  const getRoiType = (property: Property): "good" | "bad" => {
    if (property.purchase_price && property.estimated_rent) {
      const annualRent = property.estimated_rent * 12;
      const roi = (annualRent / property.purchase_price) * 100;
      return roi > 8 ? "good" : "bad";
    }
    return "bad";
  };

  // Helper function to determine property category
  const getPropertyCategory = (property: Property): "rental" | "wholesal" => {
    // This is a simplified logic - you'll want to adjust based on your actual data model
    const strategy = investmentStrategy.find(
      (strategy: any) => strategy.id === property.investment_strategy_id
    );
    return strategy ? strategy?.name : "Unknown";
  };
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#423E76]"></div>
    </div>
  );
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-10 text-red-600">{message}</div>
  );

  // const editObject ={};
  const handleClick = (id: string) => {
    const filterOb = properties.find((el) => el.id === id);
    setEditObject(filterOb);
    navigate(`/add-property`, {
      state: { propertyDetails: filterOb },
    });
  };

  const ListView = () => (
    <div className="space-y-3">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : properties?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
          <HiOutlineHomeModern className="text-6xl text-gray-400 mb-4" />
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        properties?.map((property) => (
          <div
            key={property?.id}
            className={`bg-white w-full border shadow-sm rounded-lg p-3 flex gap-4 cursor-pointer ${
              selectedProperty?.id === property.id ? "ring-1 ring-main" : ""
            }`}
            onClick={() => setSelectedProperty(property)}
          >
            {/* Image */}
            <div className="w-32 h-32 flex-shrink-0">
            {property?.thumbnail_image?.url?  <img
                src={property?.thumbnail_image?.url}
                alt={property?.full_address}
                className="w-full h-full object-cover rounded-lg"
              />:

              <img src={propertyImage}    alt={property?.full_address}
                className="w-full h-full object-contain rounded-lg p-2"/>
                
                }
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 flex-grow min-w-0 overflow-hidden justify-center">
              {/* ROI, Price, Category, Title */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* ROI */}
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    getRoiType(property) === "good"
                      ? "bg-[#009E641A] text-[#009E64]"
                      : "bg-[#E32B2B1A] text-[#E32B2B]"
                  }`}
                >
                  ROI {calculateROI(property)}
                </span>

                {/* Price */}
                <span
                  className={`px-2 py-1 rounded-md text-sm  ${
                    getRoiType(property) === "good"
                      ? "bg-bgPurpe text-whsale"
                      : "bg-[#E32B2B1A] text-[#E32B2B]"
                  }`}
                >
                  {formatPrice(property?.purchase_price) || "N/A"}
                </span>

                {/* Category */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                    getPropertyCategory(property).toLowerCase() ===
                    "wholesaling"
                      ? "bg-whsale text-white"
                      : getPropertyCategory(property).toLowerCase() === "rent"
                      ? "bg-rental text-white"
                      : getPropertyCategory(property).toLowerCase() === "flip"
                      ? "bg-flip text-white"
                      : getPropertyCategory(property).toLowerCase() ===
                        "wholetail"
                      ? "bg-whtail text-white"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  <FaThumbsUp />
                  {getPropertyCategory(property)}
                </span>

                {/* Title */}
                <h2 className="font-semibold text-lg truncate">
                  {property?.title}
                </h2>
              </div>

              {/* Address */}
              <p className="text-base text-gray-900">
                {property.full_address && `${property.full_address}`}
                {/* {property.location && `, ${property.location}`} */}
              </p>
              <div className="flex items-center justify-between">
                {/* Property details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <BiBed className="text-main" />
                    {property.bedrooms} Beds
                  </div>
                  <div className="flex items-center gap-1">
                    <BiBath className="text-main" />
                    {property.bathrooms} Baths
                  </div>
                  <div className="flex items-center gap-1">
                    <GrDisabledOutline className="text-main" />
                    {property.square_feet} sqft
                  </div>
                  <div className="flex items-center gap-1">
                    <BiBrush className="text-main" />
                    MLS: {property.mls_number || "N/A"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-[#423E76] text-white rounded-lg hover:bg-[#393565] flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${property.id}`);
                    }}
                  >
                    <span className="xs:hidden">Details</span>
                    <FaAngleRight />
                  </button>

                  <button
                    className="px-3 py-1 bg-[#423E76] text-white rounded-lg hover:bg-[#2b284b] flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(property?.id);
                    }}
                  >
                    <span className="xs:hidden">Edit</span>
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const PropertyCard = ({ property }: { property: Property }) => (
    <div
      className={`border bg-white rounded-lg p-3 flex items-center gap-4 shadow-sm w-full flex-row ${
        hoveredPropertyId === property.id ? "border-main" : "border-gray-200 "
      }`}
      onMouseEnter={() => setHoveredPropertyId(property.id)}
      onMouseLeave={() => setHoveredPropertyId(null)}
    >
      <div className="w-36 h-28 flex-shrink-0 sm:block">
       {property?.thumbnail_image?.url ? <img
          src={property?.thumbnail_image?.url }
          className="w-full h-full object-cover rounded-lg block"
        />
:
         <img src={propertyImage}    alt={property?.full_address}
                className="w-full h-full object-contain rounded-lg p-2"/>}
      </div>
      <div className="flex-grow flex flex-col gap-1 xs:min-w-full">
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-medium text-gray-900 break-words max-w-[50vw] sm:max-w-[30vw] text-ellipsis  cursor-pointer hover:text-[#423E76] "
            onClick={() => navigate(`/property/${property.id}`)}
          >
            {/* {property?.title} */}
            {property?.full_address},  <br />
            {/* <span className="truncate max-w-[190px] inline-block align-top">
              {property?.location}
            </span>{" "} */}
          </h3>
        </div>
        <div className="flex items-center justify-start text-sm gap-4 my-2">
          <span
            className={`px-2 py-0.5 rounded-md text-xs ${
              getRoiType(property) === "good"
                ? "bg-[#009E641A] text-[#009E64]"
                : "bg-[#E32B2B1A] text-[#E32B2B]"
            }`}
          >
            ROI {calculateROI(property)}
          </span>
          <span
            className={`px-2 py-1 rounded-md text-xs ${
              getRoiType(property) === "good"
                ? "bg-bgPurpe text-whsale"
                : "bg-[#E32B2B1A] text-[#E32B2B]"
            }`}
          >
            {formatPrice(property.purchase_price) || "N/A"}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2 ${
              getPropertyCategory(property).toLowerCase() === "wholesaling"
                ? "bg-whsale text-white"
                : getPropertyCategory(property).toLowerCase() === "rent"
                ? "bg-rental text-white"
                : getPropertyCategory(property).toLowerCase() === "flip"
                ? "bg-flip text-white"
                : getPropertyCategory(property).toLowerCase() === "Wholetail"
                ? "bg-whtail text-white"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            <FaThumbsUp
              className={`${
                getPropertyCategory(property).toLowerCase() === "wholesaling"
                  ? "text-white"
                  : getPropertyCategory(property).toLowerCase() === "rent"
                  ? "text-white"
                  : getPropertyCategory(property).toLowerCase() === "flip"
                  ? "text-white"
                  : getPropertyCategory(property).toLowerCase() === "wholetail"
                  ? "text-white"
                  : "text-gray-700"
              }`}
            />
            {getPropertyCategory(property)}
          </span>
        </div>
        <hr></hr>
        <div className="flex items-center text-xs text-gray-600 justify-between py-1 mt-1">
          <div className="flex items-center gap-4 ">
            <span className="flex items-center gap-1 text-sm">
              <BiBed className="text-main w-4 h-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <BiBath className="text-main w-4 h-4" /> {property.bathrooms}
            </span>
            <span className="flex items-center gap-1 text-sm">
              {" "}
              <GrDisabledOutline className="text-main w-3 h-3" />{" "}
              {property.square_feet} sqft
            </span>
          </div>
          <div className="flex-shrink-0 ml-2 flex items-center gap-2">
            <button
              className="text-gray-500 hover:text-[#423E76] flex items-center text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(property?.id);
              }}
            >
              <FaEdit className="mr-1" size={18} />
            </button>
            {/* <input
              type="checkbox"
              className="w-4 h-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
              onClick={(e) => e.stopPropagation()}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
  const strategyColors: Record<
    string,
    { bg: string; text: string; border: string; selectedBg: string }
  > = {
    WH: {
      bg: "bg-whsale",
      text: "text-whsale",
      border: " border-whsale",
      selectedBg: "bg-whsale text-white",
    },
    RE: {
      bg: "bg-rental",
      text: "text-rental",
      border: " border-rental",
      selectedBg: "bg-rental text-white",
    },
    FL: {
      bg: "bg-flip",
      text: "text-flip",
      border: "border-flip",
      selectedBg: "bg-flip text-white",
    },
    WT: {
      bg: "bg-whtail",
      text: "text-whtail",
      border: "border-whtail",
      selectedBg: "bg-whtail text-white",
    },
    NR: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: " border-gray-400",
      selectedBg: "bg-gray-500 text-white",
    },
  };
  return (
    <>
      {pageview === "property" ? (
        <div className=" p-4 bg-[#f7f7fd] container h-[90vh] overflow-auto w-full">
          <div
            className="flex items-center justify-center  rounded-md  p-4"
            style={{ display: "none" }}
          >
            <div className="flex-wrap bgcircuitsvg max-w-screen w-full  bg-opacity-5 bg-gradient-to-r from-[#423E76] to-[#2a2750]  rounded-2xl shadow-lg flex items-center justify-between  p-10">
              {/* Chat Messages */}
              <div className="flex-auto min-w-2/3 mb-6 space-y-3">
                <div className="bg-white/10 bg-opacity-10 text-gray-300 px-4 py-2 rounded-lg w-2/5 opacity-60">
                  Properties near me for Fractional Investment
                </div>
                <div className="bg-white/30 bg-opacity-20 text-gray-600 px-4 py-2 rounded-lg w-2/4 opacity-80">
                  Searching for 3BHK house for investment about 5 years with
                  maximum return
                </div>
                <div className="bg-white/50 bg-opacity-30 text-gray-700 px-4 py-2 rounded-lg w-3/5">
                  Find me properties for sale in 30152 that have more than a 5%
                  rental yield
                </div>
                {/* Search Input */}
                <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-2 w-4/6">
                  <input
                    type="text"
                    className="flex-grow bg-transparent text-gray-800 placeholder-gray-900 outline-none px-3 py-2"
                    placeholder="Show me properties for 30254"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    ➜
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div className=" text-center text-white text-xl font-light space-y-2">
                <span className="flex justify-start gap-2 items-center">
                  <h2 className="font-semibold text-3xl">Real Estate</h2>
                  <span className="text-gray-300 font-extralight">
                    Insights
                  </span>
                </span>
                <span className="flex justify-start gap-2 items-center">
                  <h2 className="font-semibold text-3xl">Analyse</h2>
                  <span className="text-gray-300 font-extralight">Data</span>
                </span>
                <span className="flex justify-start gap-2 items-center">
                  <h2 className="font-semibold text-3xl">Best</h2>
                  <span className="text-gray-300 font-extralight">Returns</span>
                </span>
              </div>
            </div>
          </div>
          <div className="px-2">
            <h1 className="text-2xl font-semibold text-gray-800">
              Property List
            </h1>
            <nav className="text-sm text-[#423E76]">
              <span className="mr-1">Explore Property</span>
              <span className="text-gray-400">›</span>
              <span className="ml-1 text-[#423e76bd]">Property List</span>
            </nav>
            <img src={PropertyTop} className="w-full h-auto py-2"></img>
          </div>
          {/* bottom section property list */}

          <div className="flex items-center justify-between p-2 rounded-lg">
            {/* Left Side: Title and Breadcrumb */}
            <div></div>

            {/* Right Side: Buttons */}
          </div>
          <div className=" rounded-lg m-4 ">
            <div className="bg-white py-1">
              <div className=" p-4 rounded-xl flex flex-wrap items-center justify-end  w-full gap-2 ">
                {/* <div className="flex space-x-3">
              <button className="flex items-center text-blue-600 space-x-2">
                <FaThLarge className="text-lg" />
                <span className="font-medium">Category</span>
              </button>
              <select className="border px-3 py-3 rounded-lg">
                <option className="p-2">Return of Investment</option>
                <option className="p-2">Profitability</option>
              </select>
              <select className="border px-3 py-1 rounded-lg">
                <option> {`> 15%`}</option>
                <option> {`> 10%`}</option>
                <option> {`> 5%`}</option>
              </select>
            </div> */}
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 bg-[#E4BB67] text-white px-4 py-2 rounded-lg shadow hover:bg-[#b9964f] transition">
                    <img src={CompareIcon}></img>
                    <span>Compare</span>
                  </button>

                  <Button
                    className="flex items-center space-x-2 bg-[#423E76] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2e2c52] transition"
                    onClick={() => {
                      navigate("/new-property", {
                        state: { new: true },
                      });
                    }}
                    variant="primary"
                  >
                    <img src={propertyIcon}></img>
                    <span>Add Property</span>
                  </Button>
                </div>
                {/* Search Box */}
                <div className="flex items-center border px-3  rounded-lg bg-gray-100/30">
                  <img src={searchIcon}></img>
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-bgPurple border-borderColor outline-none  p-2"
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col justify-center space-x-2 text-xs items-center">
                    <span className="px-3 py-1">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-3 py-1 rounded ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500"
                            : "bg-[#423E76] text-white"
                        }`}
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        Prev
                      </button>

                      <button
                        className={`px-3 py-1 rounded ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-500"
                            : "bg-[#423E76] text-white"
                        }`}
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <hr className="border-dashed mx-4" />
              {/* Filter Buttons */}
              <div className="flex px-3 py-2 w-full flex-wrap justify-between items-center gap-2">
                {/* Active Button */}
                <div className="flex items-center justify-between gap-2 flex-nowrap">
                  <Button
                    className={`px-4 py-2 rounded-lg shadow-md ${
                      selectedStrategy === null
                        ? "bg-main text-white"
                        : "bg-white text-gray-700"
                    }`}
                    variant={selectedStrategy === null ? "primary" : "outline"}
                    onClick={() => setSelectedStrategy(null)}
                  >
                    All
                  </Button>

                  {investmentStrategy.map((strategy: any) => {
                    const { bg, text, border, selectedBg } =
                      strategyColors[strategy.code] || strategyColors.NR;
                    const isSelected =
                      selectedStrategy === strategy.id ||
                      selectedStrategy === null;

                    return (
                      <button
                        key={strategy.id}
                        className={`border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm ${border} ${
                          isSelected ? selectedBg : "bg-white"
                        }`}
                        onClick={() => setSelectedStrategy(strategy.id)}
                      >
                        {strategy.code !== "NR" ? (
                          <AiOutlineLike
                            className={isSelected ? "text-white" : text}
                          />
                        ) : (
                          <AiOutlineCloseCircle
                            className={isSelected ? "text-white" : text}
                          />
                        )}
                        <span className={isSelected ? "text-white" : text}>
                          {strategy.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <button
                    className={`border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm ${
                      isMapView ? "bg-[#4d478d] text-white" : "bg-white"
                    }`}
                    onClick={() => setIsMapView(true)}
                  >
                    <FaMapMarked
                      className={isMapView ? "text-white" : "text-gray-600"}
                    />
                    <span
                      className={isMapView ? "text-white" : "text-gray-700"}
                    >
                      Map
                    </span>
                  </button>
                  <button
                    className={`text-[#4d478d] border px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm bg-white 
        ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`}
                    onClick={() => {
                      if (!loading) fetchProperties();
                    }}
                    disabled={loading}
                  >
                    <img
                      src={syncIcon}
                      className={`text-[#4d478d] ${loading ? "" : ""}`}
                    ></img>
                  </button>
                  <button
                    className={`border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm ${
                      !isMapView ? "bg-[#4d478d] text-white" : "bg-white"
                    }`}
                    onClick={() => setIsMapView(false)}
                  >
                    <AiOutlineOrderedList
                      className={!isMapView ? "text-white" : "text-[#4d478d]"}
                    />
                    <span
                      className={!isMapView ? "text-white" : "text-[#4d478d]"}
                    >
                      List
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* Property List */}
            <div className="p-3">
              {isMapView ? (
                <div className="flex gap-4 w-full xs:flex-wrap">
                  <div className="w-[55%]">
                    <PropertyMap properties={properties} debug={false} hoveredPropertyId={hoveredPropertyId}/>
                  </div>
                  <div className="w-[45%] space-y-4 overflow-y-auto max-h-[600px]">
                    {loading ? (
                      <LoadingSpinner />
                    ) : properties?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                        <HiOutlineHomeModern className="text-6xl text-gray-400 mb-4" />
                        <p className="text-lg font-medium">
                          No properties found
                        </p>
                        <p className="text-sm text-gray-500">
                          Try adjusting your filters or search criteria.
                        </p>
                      </div>
                    ) : (
                      properties?.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <ListView />
                  {/* {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))} */}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {pageview === "add-property" ? (
        <AddProperty editObject={editObject} setPageView={setPageView} />
      ) : null}
    </>
  );
};

export default PropertyList;
