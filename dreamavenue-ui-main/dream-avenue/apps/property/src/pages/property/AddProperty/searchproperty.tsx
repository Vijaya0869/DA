import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt, BiArrowBack } from "react-icons/bi";
import { Button } from "container/components"; // Adjust import as needed
import PropertyServices from "../../../Services/property";
import debounce from "lodash/debounce";

const Searchproperty = () => {
  const navigate = useNavigate();

  // State for input field and suggestions
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for search results and UI
  const [showResults, setShowResults] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [dealChecked, setDealChecked] = useState(false);
  const [realtorChecked, setRealtorChecked] = useState(false);
  const [realtorTaxChecked, setRealtorTaxChecked] = useState(false);
  const [realtorInsuranceChecked, setRealtorInsuranceChecked] = useState(false);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  // Debounced search function
  const searchAddress = debounce(async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=5&countrycodes=us`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        console.error("Failed to fetch address suggestions");
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    searchAddress(value);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const formattedAddress = suggestion.display_name;
    setAddress(formattedAddress);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter an address.");
      return;
    }

    try {
      setError(null);
      // Call API to fetch property details
      const data = await PropertyServices.getPropertyDetailsByAddress(address);
      // Assuming API returns an array or single object
      const propertyData = Array.isArray(data) ? data : [data];
      setProperties(
        propertyData.map((item, index) => ({
          id: index + 1,
          title: item.title || "Property",
          address: item.address || address,
          price: item.price ? `$${item.price.toLocaleString()}` : "N/A",
          propertyType: item.propertyType || "Unknown",
          bedrooms: item.bedrooms || "N/A",
          bathrooms: item.bathrooms || "N/A",
          squareFootage: item.squareFootage || "N/A",
          yearBuilt: item.yearBuilt || "N/A",
          lotSize: item.lotSize || "N/A",
          numberOfFloors: item.numberOfFloors || "N/A",
        }))
      );
      setShowResults(true);
    } catch (err) {
      setError(`Failed to fetch property details: ${err.message}`);
      setShowResults(false);
      setProperties([]);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handlePropertyCancel = () => {
    setSelectedProperty(null);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  const handleDealToggle = () => {
    setDealChecked(!dealChecked);
  };

  const handleRealtorToggle = () => {
    setRealtorChecked(!realtorChecked);
  };

  const handleRealtorTaxToggle = () => {
    setRealtorTaxChecked(!realtorTaxChecked);
  };

  const handleRealtorInsuranceToggle = () => {
    setRealtorInsuranceChecked(!realtorInsuranceChecked);
  };

  return (
    <div className="bg-[#F4F7FC] min-h-screen p-6 overflow-auto">
      <h1 className="text-2xl mb-4 text-[#423E76] font-bold">Search Property</h1>

      <div className="flex flex-wrap justify-between pt-4 mb-4 items-center">
        <nav className="text-gray-500 text-sm mb-2 sm:mb-0">
          <span className="text-[#5E5E5E] font-semibold">
            Explore Property >{" "}
            <span
              className="cursor-pointer"
              onClick={() => navigate("/new-property")}
            >
              New Property
            </span>{" "}
            > Default >{" "}
          </span>
          <span className="text-[#423E76] font-semibold">Search Property</span>
        </nav>
      </div>

      {!selectedProperty && (
        <div className="bg-white p-6 mt-3 rounded-[24px] shadow">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <label className="text-gray-700 font-semibold w-40">Address:</label>
              <input
                type="text"
                placeholder="Enter address (e.g., 123 Main St, Anytown, CA 12345)"
                value={address}
                onChange={handleAddressChange}
                className="flex-1 h-12 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-2 w-[calc(100%-10rem)] max-h-60 overflow-y-auto shadow-lg left-40">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
            {isLoading && (
              <p className="text-gray-500 mt-2">Loading suggestions...</p>
            )}
          </div>
        </div>
      )}

      {!selectedProperty && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded flex items-center"
          >
            <BiSearchAlt className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      )}

      {showResults && !selectedProperty && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-[#34D399]">Property Results:</h2>
          {properties.length === 0 && <p>No properties found.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white p-6 rounded-xl shadow cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
                <p className="text-gray-600 mt-2">{property.address}</p>
                <p className="text-gray-800 font-bold mt-2">{property.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProperty && (
        <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
          <div className="flex flex-col items-center">
            <h2 className="text-blue-600 text-sm font-semibold mb-2">
              {selectedProperty.address}
            </h2>
            <h2 className="text-gray-600 text-sm font-semibold mb-2">
              {selectedProperty.propertyType}, Built in {selectedProperty.yearBuilt}
            </h2>
            <button
              className="text-blue-600 text-lg flex items-center"
              onClick={handlePropertyCancel}
            >
              <BiArrowBack className="text-blue-600 textリーグ mr-1" />
              Property Search
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-blue-600 text-lg font-semibold mb-2">
              PROPERTY VALUE ESTIMATES
            </h2>
            <p className="text-gray-600 mb-4">
              Select a property value estimate to import from the choices displayed below.
            </p>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <p className="font-semibold">Property Type:</p>
                <p className="text-gray-700">{selectedProperty.propertyType}</p>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">Bedrooms:</p>
                  <p className="text-gray-700">{selectedProperty.bedrooms}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">Bathrooms:</p>
                  <p className="text-gray-700">{selectedProperty.bathrooms}</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <p className="font-semibold">Square Footage:</p>
                <p className="text-gray-700">{selectedProperty.squareFootage}</p>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <p className="font-semibold">Year Built:</p>
                <p className="text-gray-700">{selectedProperty.yearBuilt}</p>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <p className="font-semibold">Lot Size:</p>
                <p className="text-gray-700">{selectedProperty.lotSize}</p>
              </div>

              {showMore && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <p className="font-semibold">Number of Floors:</p>
                    <p className="text-gray-700">
                      {selectedProperty.numberOfFloors || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center pt-6">
                <button
                  onClick={handleShowMoreClick}
                  className="text-blue-600 font-medium flex items-center justify-center space-x-2"
                >
                  <span>{showMore ? "Show Less" : "Show More Details"}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-8 mt-12">
              <h2 className="text-blue-600 text-lg font-semibold mb-2">
                Property Value Estimates
              </h2>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center p-4">
                  <div className="mr-4 cursor-pointer" onClick={handleDealToggle}>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        dealChecked
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      } flex items-center justify-center`}
                    >
                      <div
                        className={`w-2.5 h-2.5 ${
                          dealChecked ? "bg-white" : "bg-transparent"
                        } rounded-full`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">DealCheck Estimate:</p>
                  </div>
                  <div className="text-gray-700">{selectedProperty.price}</div>
                </div>

                <div className="flex items-center p-4">
                  <div
                    className="mr-4 cursor-pointer"
                    onClick={handleRealtorToggle}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        realtorChecked
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      } flex items-center justify-center`}
                    >
                      <div
                        className={`w-2.5 h-2.5 ${
                          realtorChecked ? "bg-white" : "bg-transparent"
                        } rounded-full`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      Realtor.com<sup>®</sup> Estimate:
                    </p>
                  </div>
                  <div className="text-gray-700">
                    {selectedProperty.realtorEstimate || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-gray-300 text-black py-2 px-4 rounded-lg flex items-center"
              onClick={handlePropertyCancel}
            >
              <BiArrowBack className="text-lg mr-1" />
              Property Search
            </button>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
              Save Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchproperty;