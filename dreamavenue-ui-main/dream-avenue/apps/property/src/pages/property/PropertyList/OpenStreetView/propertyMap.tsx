import React, { useEffect, useState } from "react";
import OpenStreetView from "./openStreetView";

// Interface for API property response
interface ApiProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  purchase_price?: number;
  investment_strategy_id?: string | null; // Allow null if API returns it
  geocode_response?: {
    items?: Array<{
      position?: {
        lat: number;
        lng: number;
      };
    }>;
  };
}

// Extended property with coordinates for mapping
interface MappableProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  title: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  purchase_price?: number;
  lat: number;
  lng: number;
  investment_strategy_id?: string;
}

interface PropertyMapProps {
  properties: ApiProperty[];
  loading?: boolean;
  debug?: boolean;
  hoveredPropertyId?: string | null;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  loading: externalLoading = false,
  debug = false,
  hoveredPropertyId,
}) => {
  // State for tracking processed properties
  const [mappableProperties, setMappableProperties] = useState<
    MappableProperty[]
  >([]);
  // State for marker loading
  const [markersLoading, setMarkersLoading] = useState(true);

  // Process properties when they change or on initial mount
  useEffect(() => {
    let mounted = true;

    const processProperties = async () => {
      // Set loading state at the beginning of processing
      setMarkersLoading(true);

      if (debug) {
        console.log("PropertyMap: Processing properties:", properties.length);
      }

      // Filter out properties without valid coordinates
      const filteredProperties = properties.filter(
        (property) =>
          property.geocode_response?.items?.[0]?.position?.lat !== undefined &&
          property.geocode_response?.items?.[0]?.position?.lng !== undefined
      );

      // Transform properties to include required coordinates
      const transformedProperties = filteredProperties.map((property) => {
        const position = property.geocode_response!.items![0].position!;
        return {
          ...property,
          lat: position.lat,
          lng: position.lng,
          title: property.title || property.address || "Property",
          investment_strategy_id: property.investment_strategy_id ?? undefined,
        } as MappableProperty;
      });

      // Only update state if component is still mounted
      if (mounted) {
        setMappableProperties(transformedProperties);
        setMarkersLoading(false);

        if (debug) {
          console.log(
            "PropertyMap: Processed mappable properties:",
            transformedProperties.length
          );
        }
      }
    };

    // Use a short timeout to ensure the map renders first
    const processingTimeout = setTimeout(() => {
      processProperties();
    }, 100);

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(processingTimeout);
    };
  }, [properties, debug]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
      {/* Always render the map, even while markers are loading */}
      <OpenStreetView
        properties={mappableProperties}
        debug={debug}
        isLoadingMarkers={markersLoading || externalLoading}
        hoveredPropertyId={hoveredPropertyId}
      />

      {/* Optionally show a loading indicator for markers */}
      {(markersLoading || externalLoading) && (
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-md z-50">
          <span className="text-sm text-gray-600">Loading markers...</span>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
