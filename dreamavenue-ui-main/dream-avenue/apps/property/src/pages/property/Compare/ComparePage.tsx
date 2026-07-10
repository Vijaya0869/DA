import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const formatPrice = (price?: number | null) =>
  price || price === 0 ? `$${Number(price).toLocaleString()}` : "N/A";

const ROWS: { label: string; render: (p: any) => React.ReactNode }[] = [
  { label: "Purchase Price", render: (p) => formatPrice(p.purchase_price) },
  { label: "Bedrooms", render: (p) => p.bedrooms ?? "N/A" },
  { label: "Bathrooms", render: (p) => p.bathrooms ?? "N/A" },
  { label: "Square Feet", render: (p) => p.square_feet ?? "N/A" },
  { label: "Lot Size", render: (p) => p.lot_size ?? "N/A" },
  { label: "Year Built", render: (p) => p.year_built ?? "N/A" },
  { label: "Property Type", render: (p) => p.property_type ?? "N/A" },
  {
    label: "Estimated ARV",
    render: (p) => formatPrice(p.estimated_arv),
  },
  {
    label: "Estimated Rent",
    render: (p) => formatPrice(p.estimated_rent),
  },
];

const ComparePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const properties: any[] = location.state?.properties || [];

  if (properties.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-600 mb-4">
          No properties selected to compare.
        </p>
        <button
          onClick={() => navigate("/property")}
          className="bg-gray-300 text-black py-2 px-4 rounded-lg flex items-center"
        >
          <BiArrowBack className="mr-1" />
          Back to Property List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FC] min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-[#423E76] font-bold">
          Compare Properties
        </h1>
        <button
          onClick={() => navigate("/property")}
          className="bg-gray-300 text-black py-2 px-4 rounded-lg flex items-center"
        >
          <BiArrowBack className="mr-1" />
          Back to Property List
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b text-gray-500 text-sm w-48">
                &nbsp;
              </th>
              {properties.map((property) => (
                <th
                  key={property.id}
                  className="p-3 border-b text-gray-900 font-semibold cursor-pointer hover:text-[#423E76]"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  {property.full_address || property.title || "Property"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td className="p-3 border-b font-medium text-gray-700 text-sm">
                  {row.label}
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-3 border-b text-gray-800">
                    {row.render(property)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
