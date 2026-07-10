import React from "react";
import OpenStreetView from "./openStreetView";

interface SinglePropertyMapProps {
  property: {
    id: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    title?: string;
    bedrooms?: number;
    bathrooms?: number;
    square_feet?: number;
    purchase_price?: number;
    investment_strategy_id?: string | null;
    geocode_response?: {
      items?: Array<{
        position?: {
          lat: number;
          lng: number;
        };
      }>;
    };
  };
  loading?: boolean;
  debug?: boolean;
}

const SinglePropertyMap: React.FC<SinglePropertyMapProps> = ({
  property,
  loading = false,
  debug = false,
}) => {
  // Extract location data from the property
  const hasValidCoordinates =
    property.geocode_response?.items?.[0]?.position?.lat !== undefined &&
    property.geocode_response?.items?.[0]?.position?.lng !== undefined;

  // Create a mappable property if coordinates exist
  const mappableProperties = hasValidCoordinates
    ? [
        {
          id: property.id,
          address: property.address || "",
          city: property.city || "",
          state: property.state || "",
          zip_code: property.zip_code || "",
          title: property.title || property.address || "Property",
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          square_feet: property.square_feet,
          purchase_price: property.purchase_price,
          lat: property.geocode_response!.items![0].position!.lat,
          lng: property.geocode_response!.items![0].position!.lng,
          investment_strategy_id: property.investment_strategy_id || undefined,
        },
      ]
    : [];

  if (debug) {
    console.log("SinglePropertyMap: Has valid coordinates:", hasValidCoordinates);
    console.log("SinglePropertyMap: Mappable property:", mappableProperties);
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
      <OpenStreetView
        properties={mappableProperties}
        debug={debug}
        isLoadingMarkers={loading}
      />
      
      {!hasValidCoordinates && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-gray-700">No location data available</p>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-gray-700">Loading location data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePropertyMap;