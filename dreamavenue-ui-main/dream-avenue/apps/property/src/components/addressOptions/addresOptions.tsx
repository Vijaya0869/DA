import { useState, useEffect } from "react";
import { debounce } from "lodash";
import React from "react";

interface AddressOption {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (addressData: {
    fullAddress: string;
    city: string;
    state: string;
    zip_code: string;
    lat?: string;
    lng?: string;
  }) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const AddressAutocomplete = ({
  onAddressSelect,
  defaultValue = "",
  placeholder = "Enter an address",
  className = "",
}: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressSelect , setAddressSelect] = useState(false)

  // Sync query with defaultValue changes
   useEffect(() => {
      setQuery(defaultValue);
  }, [defaultValue]);

  // Debounced search function
  const searchAddress = debounce(async (searchQuery: string) => {
    setAddressSelect(false);
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

  useEffect(() => {
    if (query && !addressSelect) {
      searchAddress(query);
    }
    return () => {
      searchAddress.cancel();
    };
  }, [query]);

  const handleSelectAddress = (suggestion: AddressOption) => {
    // Fallback for city: use city, town, village, or county
    const city =
      suggestion.address.city ||
      suggestion.address.town ||
      suggestion.address.village ||
      suggestion.address.county ||
      "";

    // Ensure fullAddress is meaningful
    const fullAddress = suggestion.address.house_number
      ? `${suggestion.address.house_number} ${
          suggestion.address.road || ""
        }`.trim()
      : suggestion.address.road || suggestion.display_name || "";

    const addressData = {
      fullAddress: fullAddress || suggestion.display_name, // Fallback to display_name
      city: city,
      state: suggestion.address.state || "",
      zip_code: suggestion.address.postcode || "",
      lat: suggestion.lat,
      lng: suggestion.lon,
    };

    console.log("Selected Address Data:", addressData); // Debug log

    // Validate required fields
    if (!addressData.fullAddress || !addressData.city || !addressData.state) {
      console.warn("Incomplete address data:", addressData);
      // Optionally notify the user
      alert("Selected address is incomplete. Please try another address.");
      return;
    }
    setAddressSelect(true);

    setQuery(addressData.fullAddress); // Update visible input immediately
    onAddressSelect(addressData); // Pass to form
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  const handleOutsideClick = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".address-autocomplete-container")) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative w-full address-autocomplete-container">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setAddressSelect(false);
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => query.length >= 3 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />

      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectAddress(suggestion)}
            >
              {suggestion.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
