import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa6";
import propertyImg from "../../../../assets/images/propertyImage.jpg";
import AddProperty from "../../AddProperty/AddProperty";
import { FaLocationDot } from "react-icons/fa6";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

const createCircleMarker = (color: string, size: number = 30, isHovered: boolean = false) => {
  return L.divIcon({
    className: "custom-circle-marker",
    html: `
      <div style="
        width: ${isHovered ? size * 1.3 : size}px; 
        height: ${isHovered ? size * 1.3 : size}px; 
        border-radius: 50%; 
        background-color: ${color}; 
        border: 3px solid ${isHovered ? '#FFD700' : 'white'};
        box-shadow: ${isHovered ? '0 0 10px rgba(0,0,0,0.5)' : 'none'};
        display: flex; 
        align-items: center; 
        justify-content: center;
      "></div>
    `,
    iconSize: [isHovered ? size * 1.3 : size, isHovered ? size * 1.3 : size],
    iconAnchor: [isHovered ? (size * 1.3) / 2 : size / 2, isHovered ? (size * 1.3) / 2 : size / 2],
  });
};

// Pre-create marker icons
const markerIcons = {
  green: (isHovered: boolean = false) => createCircleMarker("#403C72", 30, isHovered), // Wholesale
  blue: (isHovered: boolean = false) => createCircleMarker("#0A7BD8", 30, isHovered), // Flip
  orange: (isHovered: boolean = false) => createCircleMarker("#DE7315", 30, isHovered), // Rent
  yellow: (isHovered: boolean = false) => createCircleMarker("#CF9725", 30, isHovered), // Wholetail
  red: (isHovered: boolean = false) => createCircleMarker("#E0DEF7", 30, isHovered), // Other/Error
};

const defaultIcon = markerIcons.blue();

interface LocationMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  markerColor?: string;
  popupContent?: React.ReactNode;
  investment_strategy_id?: string;
}

interface Property {
  id: string;
  address: string;
  full_address?: string;
  city: string;
  state: string;
  zip_code: string;
  title?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  purchase_price?: number;
  lat: number;
  lng: number;
  investment_strategy_id?: string;
  location?: string;
  after_repair_value?: number;
  year_built?: number;
}

interface MapInitializerProps {
  markers: LocationMarker[];
  debug?: boolean;
}

const MapInitializer: React.FC<MapInitializerProps> = ({
  markers,
  debug = false,
}) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      if (debug) {
        console.log(
          "MapInitializer: Setting bounds for markers:",
          markers.map((m) => ({
            id: m.id,
            lat: m.lat,
            lng: m.lng,
            title: m.title,
          }))
        );
      }

      try {
        const bounds = L.latLngBounds(
          markers.map((marker) => [marker.lat, marker.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } catch (error) {
        console.error("MapInitializer: Error setting bounds:", error);
      }
    } else {
      map.setView([39.8283, -98.5795], 4); // Default to US center
    }
  }, [map, markers, debug]);

  return null;
};

const formatCurrency = (value?: number) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const getInvestmentStrategyName = (id?: string): string => {
  switch (id) {
    case "8f2a8664-9e80-41d5-8444-d3362fa5aee8":
      return "Wholesale";
    case "af6a41d5-28ae-4456-8ce1-35118d9683a3":
      return "Flip";
    case "c6e3fb44-e0a0-489e-9dcc-4e1aec43d60e":
      return "Rent";
    case "d9becb2e-1de8-4e93-8b4b-e658f155c9e1":
      return "Wholetail";
    default:
      return "Other";
  }
};

interface OpenStreetViewProps {
  properties?: Property[];
  debug?: boolean;
  isLoadingMarkers?: boolean;
  hoveredPropertyId?: string | null;
}

const OpenStreetView: React.FC<OpenStreetViewProps> = ({
  properties = [],
  debug = false,
  isLoadingMarkers = false,
  hoveredPropertyId,
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const navigate = useNavigate();
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 4;
  const [pageview, setPageView] = useState("property");
  const [editObject, setEditObject] = useState<Property | undefined>(undefined);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const getMarkerColor = (investmentStrategyId?: string): string => {
    switch (investmentStrategyId) {
      case "8f2a8664-9e80-41d5-8444-d3362fa5aee8":
        return "green"; // Matches markerIcons key
      case "af6a41d5-28ae-4456-8ce1-35118d9683a3":
        return "blue";
      case "c6e3fb44-e0a0-489e-9dcc-4e1aec43d60e":
        return "orange";
      case "d9becb2e-1de8-4e93-8b4b-e658f155c9e1":
        return "yellow";
      default:
        return "red";
    }
  };

  const generatePopupContent = (property: Property) => (
    <div className="property-popup p-0" style={{ width: "180px" }}>
      <div className="relative w-full h-18 bg-gray-200">
        <img
          src={ property?.thumbnail_image?.url||propertyImg}
          alt={property.address}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md">
          <FaRegHeart />
        </div>
        <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
          New listing
        </div>
      </div>
      <div className="">
        <div className="text-xl font-bold text-gray-800 mb-1">
          {formatCurrency(property.purchase_price)}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="font-medium">{property.bedrooms || 0}</span>
          <span className="mx-1">bds</span>
          <span className="mx-1">|</span>
          <span className="font-medium">{property.bathrooms || 0}</span>
          <span className="mx-1">ba</span>
          <span className="mx-1">|</span>
          <span className="font-medium">{property.square_feet || 0}</span>
          <span className="ml-1">sqft</span>
        </div>
        <div
          className="text-sm flex items-center text-gray-800 mb-3 hover:underline hover:text-blue-600 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`);
          }}
        >
          <FaLocationDot />
          {property.title}, {property.full_address}
        </div>
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
              property.investment_strategy_id ===
              "8f2a8664-9e80-41d5-8444-d3362fa5aee8"
                ? "bg-whsale text-white"
                : property.investment_strategy_id ===
                  "af6a41d5-28ae-4456-8ce1-35118d9683a3"
                ? "bg-flip text-white"
                : property.investment_strategy_id ===
                  "c6e3fb44-e0a0-489e-9dcc-4e1aec43d60e"
                ? "bg-rental text-white"
                : property.investment_strategy_id ===
                  "d9becb2e-1de8-4e93-8b4b-e658f155c9e1"
                ? "bg-whtail text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {getInvestmentStrategyName(property.investment_strategy_id)}
          </span>
        </div>
      </div>
    </div>
  );

  const markers: LocationMarker[] = properties.map((property) => ({
    id: property.id,
    lat: property.lat,
    lng: property.lng,
    title: property.address || property.title || "Unnamed Property",
    markerColor: getMarkerColor(property.investment_strategy_id),
    popupContent: generatePopupContent(property),
    investment_strategy_id: property.investment_strategy_id,
  }));

  const center: [number, number] =
    properties.length > 0 && properties[0].lat && properties[0].lng
      ? [properties[0].lat, properties[0].lng]
      : defaultCenter;

  const zoom = properties.length > 0 ? 10 : defaultZoom;

  useEffect(() => {
    if (mapReady && !isLoadingMarkers) {
      markerRefs.current.forEach((marker) => {
        marker.closePopup();
      });

      if (hoveredPropertyId) {
        const marker = markerRefs.current.get(hoveredPropertyId);
        if (marker) {
          marker.openPopup();
          if (debug) {
            console.log(`OpenStreetView: Opening popup for property ${hoveredPropertyId}`);
          }
        }
      }
    }
  }, [hoveredPropertyId, mapReady, isLoadingMarkers, debug]);

  if (debug) {
    console.log("OpenStreetView: Using center:", center, "and zoom:", zoom);
    console.log("OpenStreetView: Markers:", markers);
  }

  const getMarkerIcon = (markerColor?: string, isHovered: boolean = false) => {
    const colorKey = markerColor as keyof typeof markerIcons;
    if (!markerColor || !markerIcons[colorKey]) {
      return markerIcons.blue(isHovered);
    }
    return markerIcons[colorKey](isHovered);
  };

  const mapTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satelliteTileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <div className="absolute top-3 left-3 z-[999999] flex bg-white rounded-md shadow-md">
        <button
          className={`px-3 py-2 rounded-l-md text-sm font-medium ${
            mapType === "map"
              ? "text-main"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => setMapType("map")}
        >
          Map
        </button>
        <button
          className={`px-3 py-2 rounded-r-md text-sm font-medium ${
            mapType === "satellite"
              ? "text-main"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
          onClick={() => setMapType("satellite")}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => {
          setMapReady(true);
          if (debug) console.log("OpenStreetView: Map is ready");
        }}
        zoomControl={false}
      >
        {mapType === "map" ? (
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={mapTileUrl}
          />
        ) : (
          <TileLayer
            attribution='© <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors'
            url={satelliteTileUrl}
          />
        )}

        <ZoomControl position="topright" />
        {mapReady && <MapInitializer markers={markers} debug={debug} />}

        {!isLoadingMarkers &&
          markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={getMarkerIcon(marker.markerColor, marker.id === hoveredPropertyId)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(marker.id, ref);
                } else {
                  markerRefs.current.delete(marker.id);
                }
              }}
              eventHandlers={{
                click: () => {
                  // Ensure popup opens on marker click
                  const markerRef = markerRefs.current.get(marker.id);
                  if (markerRef) {
                    markerRef.openPopup();
                    if (debug) {
                      console.log(`OpenStreetView: Marker clicked for property ${marker.id}`);
                    }
                  }
                },
              }}
            >
              <Popup className="property-popup">{marker.popupContent}</Popup>
            </Marker>
          ))}
      </MapContainer>

      {mapReady && !isLoadingMarkers && properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-gray-700">
              No properties with valid coordinates to display
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 bg-white p-2 rounded-md shadow-md z-50">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-whsale mr-1"></div>
            <span className="text-xs">Wholesale</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-flip mr-1"></div>
            <span className="text-xs">Flip</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-rental mr-1"></div>
            <span className="text-xs">Rental</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-whtail mr-1"></div>
            <span className="text-xs">Wholetail</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h ////-3 rounded-full bg-gray-600 mr-1"></div>
            <span className="text-xs">Other</span>
          </div>
        </div>
      </div>

      {isLoadingMarkers && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {pageview === "add-property" ? (
        <AddProperty editObject={editObject} setPageView={setPageView} />
      ) : null}
    </div>
  );
};

export default OpenStreetView;