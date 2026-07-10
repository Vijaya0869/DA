import React, { FC } from "react";
import { Trash2 } from "lucide-react";

interface InputField {
  id?: string;
  name: string;
  amount: string | null;
  amount_type: string;
  cost_type?: string;
  totalAmount?: number;
}

interface PopupModalProps {
  isOpen: boolean;
  title: string;
  inputFields: InputField[];
  handleInputChange: (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number
  ) => void;
  handleAddInput: () => void;
  handleDeleteInput: (idOrIndex: string | number) => void;
  onClose: () => void;
  onSave: () => void;
  onSaveItemizednormal?: () => void;
  showSelect?: boolean;
  selectedType?: string;
  handleSelectChange?: (value: string) => void;
  itemize: boolean;
  toggleItemize: () => void;
}

const PopupModal: FC<PopupModalProps> = ({
  isOpen,
  title,
  inputFields,
  handleInputChange,
  handleAddInput,
  handleDeleteInput,
  onClose,
  onSave,
  onSaveItemizednormal,
  itemize,
  toggleItemize,
  showSelect = false,
}) => {
  if (!isOpen) return null;

  function formatWithCommas(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "";
    const numValue = Number(value);
    if (isNaN(numValue)) return "";
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const handleInputChange1 = (e) => {
              const input = e.target.value;
              // Allow empty input, numbers, one decimal point, and up to 2 decimal places
              if (input === '' || /^\d*\.?\d{0,2}$/.test(input)) {
                  return(input);
              }
          };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[80vh] overflow-y-auto">
        {/* Title & Toggle */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-[##000929] font-regular">Itemize</span>
            <button
              type="button"
              onClick={toggleItemize}
              className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all ${
                itemize ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all flex items-center justify-center ${
                  itemize ? "translate-x-8" : "translate-x-0"
                }`}
              >
                <span className="text-xs font-semibold text-gray-600">
                  {itemize ? "Yes" : "No"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Table Header */}
        {itemize && (
          <div className=" gap-3 mb-2 flex flex-row">
            <span className="flex font-medium w-[42%]">Description</span>
            <span className="font-medium ">Amount</span>
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-2">
          {itemize ? (
            inputFields.map((field, index) => (
              <div key={index} className="flex items-center gap-3 w-full">
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px] w-1/2"
                  placeholder="Description"
                  value={field.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <div className="flex items-center gap-2 w-1/2">
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px] flex-1"
                    placeholder="Amount"
                    value={
                      field.amount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      if (/^\d*\.?\d{0,2}$/.test(raw) || raw === "") {
                        handleInputChange(index, "amount", raw);
                      }
                    }}
                  />
                  {showSelect && (
                    <select
                      value={field.amount_type}
                      className="p-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                      onChange={(e) =>
                        handleInputChange(index, "amount_type", e.target.value)
                      }
                    >
                      <option value="$">$</option>
                      <option value="%">%</option>
                    </select>
                  )}
                </div>
                {(title === "Rehab Costs" || title ==="Holding Costs" ) && (
                  <select
                    value={field.cost_type || "OverAll"}
                    className="p-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                    onChange={(e) =>
                      handleInputChange(index, "cost_type", e.target.value)
                    }
                  >
                    <option value="OverAll">OverAll</option>
                    <option value="Per Month">Per Month</option>
                  </select>
                )}
                <button
                  className="text-red-500 hover:text-red-700 p-2 transition-all duration-200 ease-in-out hover:scale-110"
                  onClick={() => handleDeleteInput(field.id ?? index)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <input
              type="text"
              placeholder="Enter Amount..."
              className="w-full p-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={
                inputFields[0]?.totalAmount !== undefined &&
                inputFields[0]?.totalAmount !== null
                  ? formatWithCommas(inputFields[0].totalAmount)
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (/^\d*\.?\d{0,2}$/.test(rawValue) || rawValue === "") {
                  handleInputChange(0, "totalAmount", rawValue);
                }
              }}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          {itemize && (
            <button type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
              onClick={handleAddInput}
            >
              Add Description
            </button>
          )}
          <div className="flex gap-3">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow transition"
              onClick={onClose}
            >
              Cancel
            </button>
            {itemize ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                onClick={onSave}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
                onClick={onSaveItemizednormal}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
