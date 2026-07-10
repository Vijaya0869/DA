import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiImport } from "react-icons/bi";
import { BiSearchAlt } from "react-icons/bi";
import { TbHomeSearch } from "react-icons/tb";
import { FaPencil } from "react-icons/fa6";
import * as XLSX from "xlsx";
import PropertyServices from "../../../Services/property";
import toast, { Toaster } from "react-hot-toast";
import { PiArrowFatLineUpFill } from "react-icons/pi";


const AddPropertyNew = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [excelRows, setExcelRows] = useState<any[][]>([]);
  const [dbMappings, setDbMappings] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [apiFields, setApiFields] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isManuallyMapped, setIsManuallyMapped] = useState(false);
  const [requiredFields, setRequiredFields] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const endpoint = `/static/property-columns-for-import`;
        const response = await PropertyServices.getCommonDropdown(endpoint);
        const fields = response.data;

        const columnNames = fields.map((item: any) => item.column_name);
        const requiredMap: Record<string, boolean> = {};
        fields.forEach((field: any) => {
          requiredMap[field.column_name] = field.required || false;
        });

        setApiFields(columnNames);
        setRequiredFields(requiredMap);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    fetchFields();
  }, [isOpen]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      setIsManuallyMapped(false);
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (["xlsx", "xls", "csv"].includes(fileExtension || "")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          const headers = jsonData[0] || [];
          const rows = jsonData.slice(1);

          setExcelHeaders(headers);
          setExcelRows(rows);
          setDbMappings(Array(headers.length).fill(null));
          setIsOpen(true);
          setLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please upload a valid Excel or CSV file.");
      }
    }
  };

  useEffect(() => {
    if (excelHeaders.length > 0 && apiFields.length > 0 && !isManuallyMapped) {
      const normalize = (str: string) =>
        str.trim().toLowerCase().replace(/\s+/g, "_");

      const newMappings = apiFields.map((field) => {
        const normalizedField = normalize(field);
        const matchedHeader = excelHeaders.find(
          (header) => normalize(header) === normalizedField
        );
        return matchedHeader || null;
      });

      setDbMappings(newMappings);
    }
  }, [excelHeaders, apiFields, isManuallyMapped]);

  const onClose = () => {
    setIsOpen(false);
    setLoading(false);
    setExcelHeaders([]);
    setExcelRows([]);
    setDbMappings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const updatedMappings = [...dbMappings];
    updatedMappings[targetIndex] = draggedItem;
    setDbMappings(updatedMappings);
    setDraggedItem(null);
    setIsManuallyMapped(true);
  };

  const handleUnmap = (e: React.DragEvent, fromIndex: number) => {
    e.preventDefault();
    const updatedMappings = [...dbMappings];
    updatedMappings[fromIndex] = null;
    setDbMappings(updatedMappings);
    setIsManuallyMapped(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getUnmappedHeaders = () => {
    return excelHeaders.filter((header) => !dbMappings.includes(header));
  };

  const finalData = excelRows.map((row) => {
    const rowData: { [key: string]: any } = {};
    dbMappings.forEach((mappedHeader, index) => {
      const dbField = apiFields[index];
      const colIndex = excelHeaders.indexOf(mappedHeader || "");
      if (colIndex !== -1) {
        rowData[dbField] = row[colIndex];
      }
    });
    return rowData;
  });

  const generateMappedExcelFile = () => {
    const transformedData = excelRows.map((row) => {
      const rowObj: { [key: string]: any } = {};

      apiFields.forEach((apiField, index) => {
        const assignedExcelHeader = dbMappings[index];
        const colIndex = excelHeaders.indexOf(assignedExcelHeader || "");
        if (colIndex !== -1) {
          rowObj[apiField] = row[colIndex];
        }
      });

      return rowObj;
    });

    console.log("transformedData", transformedData);
    // Generate Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MappedData");

    // Convert to binary
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const uploadExcelBlob = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "mapped_data.xlsx");

    const endpoint = "/property/upload";
    const contentType = "multipart/form-data";
    const payload = formData;

    try {
      const response = await PropertyServices.postCommon(
        endpoint,
        contentType,
        payload
      );
      console.log("Upload success:", response);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const blob = generateMappedExcelFile();
      const response = await uploadExcelBlob(blob);
      console.log(response);
      toast.success("File uploaded successfully!");
      setIsPreviewOpen(false);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[80vh] p-6">
        <h1 className="text-2xl mb-4 text-[#423E76] font-bold">
          Add a New Property
        </h1>

        <div className="flex flex-wrap justify-between pt-4 mb-4 items-center">
          <nav className="text-gray-500 text-sm mb-2 sm:mb-0">
            <span className="text-[#5E5E5E] font-semibold">
              Explore Property &gt;{" "}
              <span
                className="cursor-pointer"
                onClick={() => navigate("/property")}
              >
                Property List
              </span>{" "}
              &gt; Default &gt;{" "}
            </span>
            <span className="text-[#423e77] font-semibold">New Property</span>
          </nav>
        </div>
      <div>
        <span className="text-[#4D5461] text-sm font-medium mt-10">Select the option below to add a new property</span>
      </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 mt-20 max-w-5xl mx-auto"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 mt-10 max-w-6xl mx-auto">
          {/* Import */}
            <div
            className="bg-[#F7F7FD] border border-[#E0DEF7] p-4 rounded-xl shadow w-[250px] h-[270px] flex flex-col justify-between items-center transition-colors duration-200 hover:bg-[#edeafd] hover:border-[#423E76] cursor-pointer"
            >
            <div className="w-16 h-16 p-0.5  border border-[#E0DEF7] bg-white flex items-center justify-center mb-4 rounded-full">
              <div className="w-full h-full flex justify-center items-center bg-[#E0DEF7] rounded-full">
              <PiArrowFatLineUpFill size={20} className="text-[#423E76]" />
              </div>
            </div>
            <p className="font-medium text-[18px] text-center mb-2">
              Import Property Data
            </p>
            <p className="text-sm text-gray-600 text-center mb-6">
              Import property data from public records and active listings.
            </p>
            <div className="flex justify-center"> 
              <button
              className="w-48 text-[16px] bg-[#423E76] text-white py-2 rounded-md hover:bg-[#393666] transition duration-300"
              onClick={handleButtonClick}
              disabled={loading}
              >
              {loading ? (
                <span className="flex items-center ml-5">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  ></circle>
                  <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Importing...
                </span>
              ) : (
                "Import Excel"
              )}
              </button>
              <input
              type="file"
              accept=".xlsx, .xls, .csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              />
            </div>
            </div>

          <div className="bg-[#F7F7FD] border border-[#E0DEF7] p-4 rounded-xl shadow w-[250px] h-[270px] hover:bg-[#edeafd] hover:border-[#423E76]  flex flex-col justify-between items-center">
           
             <div className="w-16 h-16 p-0.5  border border-[#E0DEF7] bg-white flex items-center justify-center mb-4 rounded-full">
            <div className="w-full h-full flex justify-center items-center bg-[#E0DEF7] rounded-full">
              <TbHomeSearch   size={20} className="text-[#423E76]" />
            </div>
            </div>
            <p className="font-medium text-[18px] text-center mb-2">
              Search & Upload
            </p>
            <p className="text-sm text-gray-600 text-center mb-6">
              Search existing property records and upload matched data.
            </p>
            <div className="flex justify-center">
              <button
                className="w-48 text-[16px] bg-[#423E76] text-white py-2 rounded-md hover:bg-[#3f3b78] transition duration-300"
                onClick={() => navigate("/search-property")}
              >
                Search
              </button>
            </div>
          </div>

          {/* Manual */}
          <div className="bg-[#F7F7FD] border border-[#E0DEF7] p-4 rounded-xl shadow w-[250px] h-[270px] hover:bg-[#edeafd] hover:border-[#423E76] 
           flex flex-col justify-between items-center">
            

              <div className="w-16 h-16 p-0.5  border border-[#E0DEF7] bg-white flex items-center justify-center mb-4 rounded-full">
            <div className="w-full h-full flex justify-center items-center bg-[#E0DEF7] rounded-full">
              <FaPencil  size={20} className="text-[#423E76]" />
            </div>
            </div>
            <p className="font-medium text-[18px] text-center mb-2">
              Enter Manually
            </p>
            <p className="text-sm text-gray-600 text-center mb-6">
              Fill in property information manually. We'll guide you through the
              process.
            </p>
            <div className="flex justify-center">
              <button
                className="w-48 text-[16px] bg-[#3b376d] text-white py-2 rounded-md hover:bg-[#423E76] transition duration-300"
                onClick={() => navigate("/add-property")}
              >
                Enter Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl max-h-[80vh] overflow-y-auto">
           

            <div className="flex gap-6">

                    {/* Field Mapping Section */}
                    <div className="flex-1 border p-4 rounded">
                      <h3 className="font-bold text-base mb-3 text-gray-900">Field Mapping</h3>
                      <p className="text-xs text-gray-900 mb-4">
                      Map the fields from your Excel file to the database fields below. Fields marked as (<span className="text-[#E63946] font-semibold">*</span>) Required must be mapped before proceeding.
                      </p>
                      <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-row gap-4 flex-wrap">
                      {apiFields.map((field, index) => {
                        const isRequired = requiredFields[field];
                        const isMapped = dbMappings[index];
                        return (
                        <div
                          key={`${field}-${index}`}
                          className={`p-3 border rounded-md bg-white shadow-sm flex flex-col w-[48%] gap-2 ${
                          isRequired && !isMapped ? "border-[#E63946]" : "border-[#E0DEF7]"
                          }`}
                        >
                          <div className="flex  items-center">
                          <span className="text-sm font-medium text-[#423E76]">{field}</span>
                          {isRequired && (
                            <span className="text-xs  py-1 text-[#E63946] rounded">
                            *
                            </span>
                          )}
                          </div>
                          <select
                          className="border bg-[#F7F7FD] border-gray-300 rounded px-2 py-2 text-sm w-full focus:ring focus:ring-[#423E76] shadow-sm appearance-none"
                          value={dbMappings[index] ?? ""}
                          onChange={(e) => {
                            const updatedMappings = [...dbMappings];
                            updatedMappings[index] = e.target.value || null;
                            setDbMappings(updatedMappings);
                            setIsManuallyMapped(true);
                          }}
                          >
                          <option value="">Select Excel Header</option>
                          {excelHeaders.map((header, headerIndex) => (
                            <option key={`${header}-${headerIndex}`} value={header}>
                            {header}
                            </option>
                          ))}
                          </select>
                          {!isMapped && isRequired && (
                          <p className="text-xs text-[#E63946] mt-1">
                            This field is required. Please map it to proceed.
                          </p>
                          )}
                        </div>
                        );
                      })}
                      </div>
                    </div>

          
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                //   onClick={onClose}
                // >
                onClick={() => {
                  onClose();
                  setShowValidationErrors(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  const missingFields = apiFields.filter(
                    // (_, index) => !dbMappings[index]
                    (field, index) =>
                      requiredFields[field] && !dbMappings[index]
                  );
                  if (missingFields.length > 0) {
                    toast.error("Please map all fields before proceeding.");
                    setShowValidationErrors(true);
                    return;
                  }

                  setShowValidationErrors(false);
                  setPreviewData(finalData);
                  setIsOpen(false);
                  setIsPreviewOpen(true);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh]">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Preview Data
            </h2>

            <div
              className="overflow-x-auto max-h-[60vh] [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar]:h-1
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
              <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100 sticky">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left sticky left-0 z-10 bg-gray-100">
                      DB Field
                    </th>
                    {/* Excel Header Values */}
                    <th
                      className="border border-gray-300 px-3 py-2 text-left "
                      colSpan={previewData.length}
                    >
                      <div className="overflow-x-auto whitespace-nowrap ">
                        Excel Header Values
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {apiFields.map((field, rowIndex) => {
                    const hasValue = previewData.some((row) => {
                      const value = row[field];
                      return (
                        value !== undefined &&
                        value !== null &&
                        String(value).trim() !== ""
                      );
                    });

                    if (!hasValue) return null;

                    return (
                      <tr key={rowIndex}>
                        <td className="border border-gray-300 px-3 py-2 font-medium text-gray-700 sticky left-0 bg-white min-w-[350px]">
                          {field}
                        </td>
                        {previewData.map((row, colIndex) => {
                          const value = row[field];
                          if (value && value !== "") {
                            return (
                              <td
                                key={colIndex}
                                className="border border-gray-300 px-3 py-2 min-w-[350px]"
                              >
                                {value && String(value).trim() !== ""
                                  ? value
                                  : ""}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsOpen(true);
                }}
              >
                Back
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Confirm & Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default AddPropertyNew;
