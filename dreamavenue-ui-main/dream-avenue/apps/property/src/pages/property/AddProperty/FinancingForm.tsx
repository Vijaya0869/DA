import React, { useState, useEffect, useCallback, useRef } from "react";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Button } from "container/components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import PropertyServices from "../../../Services/property";
import PopupModal from "../../../components/popup";
import { Trash2 } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface FinancingForm {
  loan_label: string;
  financing_of_type_id: string;
  down_payment_type: string;
  down_payment: number | null;
  rehab_down_payment: number | null;
  interest_rate: number | null;
  loan_term: number | null;
  loan_type_id: string;
}

const FinancingForm = (props: any) => {
  const {
    setActiveTab,
    requestData,
    setRequestData,
    setTabsValidation,
    inputFields3,
    setInputFields3,
    inputFields4,
    setInputFields4,
    financingForms,
    setFinancingForms,
    setFin,
    setStep,
    setLoading,
    loading,
    isPopupOpenC,
    isPopupOpenP,
    setPurchasePrice,
    purchasePrice
  } = props;

  const [purchaseType, setPurchaseType] = useState("$");
  const [useFinancing, setUseFinancing] = useState(true); // Default to true
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpen2, setIsPopupOpen2] = useState(false);
  const [totalValue2, setTotalValue2] = useState("");
  const [clearpurchaseitemizecosts, setClearpurchaseitemizecosts] = useState(
    requestData?.clear_purchase_itemize_costs || false
  );
  const [clearclosingitemizecosts, setClearclosingitemizecosts] = useState(
    requestData?.clear_closing_itemize_costs || false
  );
  const [ch, setCh] = useState(requestData?.closing_costs || null);
  const [ph, setPh] = useState(requestData?.purchase_costs || null);
  const [closingcostintemizedselectedType, setClosingcostintemizedselectedType] = useState("$");
  const [purchasecostintemizedselectedType, setPurchasecostintemizedselectedType] = useState("$");
  const [financingOf, setFinancingOf] = useState<{ id: string; name: string }[]>([]);
  const [loanTypes, setLoanTypes] = useState<{ id: string; name: string; code: string }[]>([]);

  const validationSchema = Yup.object().shape({
    purchase_price: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    closing_costs: Yup.string(),
    after_repair_value: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    loan_label: Yup.string(),
    down_payment: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    financing_of_type_id: Yup.string().nullable().transform((_, val) => (val === "" ? null : val)),
    loan_type_id: Yup.string().nullable().transform((_, val) => (val === "" ? null : val)),
    rehab_down_payment: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    interest_rate: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    loan_term: Yup.number().transform((_, val) => (val === "" ? 0 : Number(val))).nullable(),
    purchase_costs: Yup.string(),
    down_payment_type: Yup.string(),
    clear_purchase_itemize_costs: Yup.boolean(),
    clear_closing_itemize_costs: Yup.boolean(),
  });

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: requestData,
  });

  const [formattedAfterRepairValue, setFormattedAfterRepairValue] = useState("");
  const [formattedPurchasePrice, setFormattedPurchasePrice] = useState("");
  const [selectedType, setSelectedType] = useState(requestData.closing_cost_type || "$");

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/,/g, "");
    if (!isNaN(Number(numericValue))) {
      return new Intl.NumberFormat("en-US").format(Number(numericValue));
    }
    return value;
  };

  const clearClosingRef = useRef(clearclosingitemizecosts);
  const clearPurchaseRef = useRef(clearpurchaseitemizecosts);
  const clCRef = useRef(ch);
  const psCRef = useRef(ph);

  useEffect(() => {
    clearClosingRef.current = clearclosingitemizecosts;
    clearPurchaseRef.current = clearpurchaseitemizecosts;
    clCRef.current = ch;
    psCRef.current = ph;
  }, [clearclosingitemizecosts, clearpurchaseitemizecosts, ch, ph]);

  useEffect(() => {
    setCh(requestData.closing_costs);
    setPh(requestData.purchase_costs);
  }, [requestData.closing_costs, requestData.purchase_costs]);

  const onSubmit = async (data: any) => {
    setStep("1");
    data.purchase_costs = psCRef.current;
    data.closing_costs = clCRef.current;
    data.clear_closing_itemize_costs = clearClosingRef.current;
    data.clear_purchase_itemize_costs = clearPurchaseRef.current;

    setRequestData((prev: any) => ({ ...prev, ...data }));
    setTabsValidation((prev: any) => ({ ...prev, tab2Validation: true }));
    setFin("fin");
    setLoading(true);
  };

  const fetchLoanTypes = useCallback(async () => {
    try {
      const response: AxiosResponse<any> = await PropertyServices.getCommonDropdown("/master/loan_types");
      if (Array.isArray(response.data)) {
        setLoanTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching loan types:", error);
    }
  }, []);

  const fetchFinancingOfTypes = useCallback(async () => {
    try {
      const response: AxiosResponse<any> = await PropertyServices.getCommonDropdown("/master/financing_of_types");
      if (Array.isArray(response.data)) {
        setFinancingOf(response.data);
      }
    } catch (error) {
      console.error("Error fetching financing types:", error);
    }
  }, []);

  useEffect(() => {
    fetchFinancingOfTypes();
    fetchLoanTypes();
  }, [fetchFinancingOfTypes, fetchLoanTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d{0,2}$/.test(input) || input === "") {
      setCh(input);
      setRequestData((prev: any) => ({ ...prev, closing_costs: input }));
      setValue("closing_costs", input, { shouldValidate: true });
    }
  };

  const handleItemizedInputChange = (index: number, field: string, value: any) => {
    setInputFields3((prevFields: any) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], [field]: field === "amount" ? value || '' : value || "$" };
      return updatedFields;
    });
  };

  const handleAddInput = () => {
    setInputFields3([...inputFields3, { name: "", amount: null, amount_type: "$" }]);
  };

  const handleDeleteInput = (idOrIndex: string | number) => {
    setInputFields3((prevFields: any[]) =>
      prevFields.filter((field: any, index: number) =>
        typeof idOrIndex === "string" ? field.id !== idOrIndex : index !== idOrIndex
      )
    );
    if (typeof idOrIndex === "string" && props.handleDeleteInput) {
      props.handleDeleteInput(idOrIndex);
    }
  };

  const handleClosingSave = () => {
    setFin("");
    const purchasePrice = Number(requestData.purchase_price) || 0;
    const totalValue = inputFields3.reduce((sum: number, field: any) => {
      const amount = Number(field.amount) || 0;
      return field.amount_type === "%" ? sum + (amount / 100) * purchasePrice : sum + amount;
    }, 0);

    setTotalValue2(totalValue.toFixed(2));
    setCh(totalValue.toFixed(2));
    setRequestData((prev: any) => ({ ...prev, closing_costs: totalValue.toFixed(2) }));
    setValue("closing_costs", totalValue.toFixed(2), { shouldValidate: true });
    setIsPopupOpen(false);
    if (props.handleClosingSave) {
      props.handleClosingSave();
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setValue("closing_cost_type", newType);
    setRequestData((prev: any) => ({ ...prev, closing_cost_type: newType }));
  };

  const handleItemizedInputChange2 = (index: number, field: string, value: any) => {
    setInputFields4((prevFields: any) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], [field]: field === "amount" ? value || '' : value || "$" };
      return updatedFields;
    });
  };

  const handleAddInput2 = () => {
    setInputFields4([...inputFields4, { name: "", amount: null, amount_type: "$" }]);
  };

  const handleDeleteInput2 = (idOrIndex: string | number) => {
    setInputFields4((prevFields: any[]) =>
      prevFields.filter((field: any, index: number) =>
        typeof idOrIndex === "string" ? field.id !== idOrIndex : index !== idOrIndex
      )
    );
    if (typeof idOrIndex === "string" && props.handleDeleteInput2) {
      props.handleDeleteInput2(idOrIndex);
    }
  };

  const handlePurchaseSave = () => {
    setFin("");
    const totalValue2 = inputFields4.reduce((sum: any, field: any) => sum + Number(field.amount || 0), 0);
    setTotalValue2(totalValue2.toFixed(2));
    setPh(totalValue2.toFixed(2));
    setRequestData((prev: any) => ({ ...prev, purchase_costs: totalValue2.toFixed(2) }));
    setValue("purchase_costs", totalValue2.toFixed(2), { shouldValidate: true });
    setIsPopupOpen2(false);
    if (props.handlePurchaseSave) {
      props.handlePurchaseSave();
    }
  };

  const purchase_costs = watch("purchase_costs") || "";
  useEffect(() => {
    if (purchase_costs !== requestData.purchase_costs) {
      setTotalValue2(purchase_costs);
    }
  }, [purchase_costs, requestData.purchase_costs]);

  const removeFinancingForm = (idOrIndex: string | number) => {
    setFinancingForms((prevForms: any[]) =>
      prevForms.filter((form: any, index: number) =>
        typeof idOrIndex === "string" ? form.id !== idOrIndex : index !== idOrIndex
      )
    );
    if (typeof idOrIndex === "string" && props.removeFinancingForm) {
      props.removeFinancingForm(idOrIndex);
    }
    // If no forms remain, optionally toggle useFinancing to false
    if (financingForms.length === 1) {
      setUseFinancing(false);
      localStorage.setItem("useFinancing", JSON.stringify(false));
    }
  };

  const handlePurchaseTypeChange = (e: any) => setPurchaseType(e.target.value);

  const handlePurchaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setPh(input);
      setRequestData((prev: any) => ({ ...prev, purchase_costs: input }));
      setValue("purchase_costs", input, { shouldValidate: true });
    }
  };

  const formfields = (index: any, field: any, value: any) => {
    setFinancingForms((prevFields: any) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = { ...updatedFields[index], [field]: value };
      return updatedFields;
    });
  };

  const DEFAULT_FINANCING_FORM: FinancingForm = {
    loan_label: "",
    financing_of_type_id: "",
    down_payment_type: "$",
    down_payment: null,
    rehab_down_payment: null,
    interest_rate: null,
    loan_term: null,
    loan_type_id: "",
  };

  const addFinancingForm = () => {
    setFinancingForms([...financingForms, { ...DEFAULT_FINANCING_FORM }]);
    setUseFinancing(true); // Ensure financing section is visible
    localStorage.setItem("useFinancing", JSON.stringify(true));
  };

  const handlePurchasePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setFormattedPurchasePrice("");
      setValue("purchase_price", 0, { shouldValidate: true });
      return;
    }
    setPurchasePrice(rawValue); // Update the purchase price in the parent component
    const formatted = formatNumberWithCommas(rawValue);
    setFormattedPurchasePrice(formatted);
    setValue("purchase_price", Number(rawValue), { shouldValidate: true });
    setRequestData((prev: any) => ({ ...prev, purchase_price: Number(rawValue).toFixed(2) }));

  };

  const handleAfterRepairValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setFormattedAfterRepairValue("");
      setValue("after_repair_value", 0, { shouldValidate: true });
      return;
    }
    const formatted = formatNumberWithCommas(rawValue);
    setFormattedAfterRepairValue(formatted);
    setValue("after_repair_value", Number(rawValue), { shouldValidate: true });
  };

  useEffect(() => {
    if (requestData.purchase_price) {
      setFormattedPurchasePrice(formatNumberWithCommas(String(requestData.purchase_price)));
    }
    if (requestData.after_repair_value) {
      setFormattedAfterRepairValue(formatNumberWithCommas(String(requestData.after_repair_value)));
    }
  }, [requestData]);

  const toggleFinancing = () => {
    const newValue = !useFinancing;
    setUseFinancing(newValue);
    localStorage.setItem("useFinancing", JSON.stringify(newValue));
    // Optionally clear forms when toggling off
    if (!newValue) {
      setFinancingForms([]);
    }
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("useFinancing");
    if (storedValue !== null) {
      setUseFinancing(JSON.parse(storedValue));
    }
  }, []);

  const toggleItemizeclosing = () => {
    setFin("");
    setClearclosingitemizecosts((prev) => {
      const newValue = !prev;
      setRequestData((prevData: any) => ({ ...prevData, clear_closing_itemize_costs: newValue }));
      return newValue;
    });
  };

  const toggleItemizepurchase = () => {
    setFin("");
    setClearpurchaseitemizecosts((prev) => {
      const newValue = !prev;
      setRequestData((prevData: any) => ({ ...prevData, clear_purchase_itemize_costs: newValue }));
      return newValue;
    });
  };

  const handleSaveTotalAmountClosing = () => {
    setFin("");
    const totalAmount = inputFields3[0]?.totalAmount || 0;
    setCh(totalAmount.toFixed(2));
    setValue("closing_costs", totalAmount.toFixed(2), { shouldValidate: true });
    setRequestData((prev: any) => ({ ...prev, closing_costs: totalAmount.toFixed(2) }));
    setIsPopupOpen(false);
  };

  const handleSaveTotalAmountPurchase = () => {
    setFin("");
    const totalAmount = inputFields4[0]?.totalAmount || 0;
    setPh(totalAmount.toFixed(2));
    setValue("purchase_costs", totalAmount.toFixed(2), { shouldValidate: true });
    setRequestData((prev: any) => ({ ...prev, purchase_costs: totalAmount.toFixed(2) }));
    setIsPopupOpen2(false);
  };

  function formatWithCommas(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === "") return "";
    const [intPart, decimalPart] = value.toString().split(".");
    const formattedInt = Number(intPart).toLocaleString("en-US");
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
  }

  return (
    <form>
      <div>
        {/* Costs Section */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl text-black-600 mb-2 font-semibold">Costs</h2>
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <label htmlFor="purchasePrice" className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                Purchase Price
              </label>
              <Input
                id="purchasePrice"
                label="Purchase Price"
                type="text"
                className="w-full"
                prefixText="$"
                width="w-full"
                value={formattedPurchasePrice}
                style={{ paddingLeft: "24px" }}
                {...register("purchase_price")}
                onChange={handlePurchasePriceChange}
              />
            </div>
            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <span className="flex items-center justify-between w-full">
                <label htmlFor="closingCosts" className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                  Closing Costs
                </label>
                <span
                  className="text-amber-500 cursor-pointer flex items-center justify-center gap-1"
                  onClick={() => setIsPopupOpen(true)}
                >
                  ✦ Itemize
                  {isPopupOpenC ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-green" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </span>
                  ) : null}
                </span>
              </span>
              <div className="w-full relative flex items-center gap-3">
                <div className="relative w-full">
                  <Input
                    prefixText={selectedType === "$" ? "$" : ""}
                    suffixText={selectedType === "%" ? "%" : ""}
                    type="text"
                    placeholder={selectedType === "$" ? "Enter amount" : "Enter percentage"}
                    readOnly={clearclosingitemizecosts}
                    value={formatWithCommas(requestData.closing_costs)}
                    {...register("closing_costs")}
                    onChange={handleInputChange}
                    className="w-full h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px]"
                    style={{ paddingLeft: "24px" }}
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="border rounded-md px-4 py-3 bg-bgPurple"
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <span className="flex items-center justify-between w-full">
                <label htmlFor="afterRepairValue" className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                  After Repair Value
                </label>
              </span>
              <Input
                id="afterRepairValue"
                label="After Repair Value"
                type="text"
                value={formattedAfterRepairValue}
                className="w-full"
                prefixText="$"
                width="w-full"
                style={{ paddingLeft: "24px" }}
                {...register("after_repair_value")}
                onChange={handleAfterRepairValueChange}
              />
            </div>
          </div>
        </div>

        {/* Financing Section */}
        <div>
        <div className="flex items-center justify-between mb-4 mt-4 space-y-1">
              <h2 className="text-xl text-black-600 font-semibold">Financing</h2>
              <div className="flex items-center">
                <span className="text-[#000929] font-regular w-40">Use Financing</span>
                <button
                  type="button"
                  onClick={toggleFinancing}
                  className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all ${
                    useFinancing ? "bg-[#423E76]" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all flex items-center justify-center ${
                      useFinancing ? "translate-x-8" : "translate-x-0"
                    }`}
                  >
                    <span className="text-xs font-semibold text-gray-600">{useFinancing ? "Yes" : "No"}</span>
                  </div>
                </button>
              </div>
            </div>
     
        {(useFinancing || financingForms.length > 0) && (
          <div className="bg-white p-6 mt-3 rounded-md shadow-md">
            
            {financingForms.map((form: any, index: any) => (
              <div key={index} className="mb-4 border-b pb-4">
                <div className="flex items-center justify-between w-full flex-wrap gap-2 space-y-1">
                  <div className="flex items-center justify-between w-full flex-wrap gap-4">
                    <div className="flex-1 flex-col items-start gap-1 space-y-1">
                      <label htmlFor={`loanLabel-${index}`} className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                        Loan Label
                      </label>
                      <Input
                        id={`loanLabel-${index}`}
                        label="Loan Label"
                        type="text"
                        placeholder="Loan Label"
                        width="w-full"
                        value={form.loan_label ?? ""}
                        onChange={(e) => formfields(index, "loan_label", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select
                      width="min-w-[158px]"
                      className="flex-1 flex-col items-start gap-1 space-y-1 w-[48%]"
                      label="Financing Of"
                      options={financingOf.map((fin) => ({ value: fin.id, label: fin.name }))}
                      value={form.financing_of_type_id}
                      onChange={(e) => formfields(index, "financing_of_type_id", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between w-full xs:flex-wrap gap-4">
                    <div className="flex-1 flex-col items-start gap-1 space-y-1">
                      <label htmlFor={`downPayment-${index}`} className="text-[#282828] font-medium text-sm w-40 min-w-[160px]">
                        Down Payment
                      </label>
                      <div className="w-full relative flex items-center gap-3">
                        <div className="relative w-full">
                          <Input
                            prefixText={form.down_payment_type === "$" ? "$" : ""}
                            suffixText={form.down_payment_type === "%" ? "%" : ""}
                            type="text"
                            placeholder={form.down_payment_type === "$" ? "Enter amount" : "Enter percentage"}
                            value={formatWithCommas(form.down_payment)}
                            onChange={(e) => formfields(index, "down_payment", e.target.value.replace(/,/g, ""))}
                            className="w-full h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px]"
                            style={{ paddingLeft: "24px" }}
                          />
                        </div>
                        <select
                          value={form.down_payment_type}
                          onChange={(e) => formfields(index, "down_payment_type", e.target.value)}
                          className="border rounded-md px-4 py-3 bg-bgPurple"
                        >
                          <option value="$">$</option>
                          <option value="%">%</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex-1 flex-col items-start gap-1 space-y-1">
                      <label htmlFor={`rehabDownPayment-${index}`} className="text-[#000929] font-medium text-sm">
                        Rehab Down Payment
                      </label>
                      <Input
                        id={`rehabDownPayment-${index}`}
                        label="Rehab Down Payment"
                        type="number"
                        placeholder="Rehab Down Payment"
                        width="w-full"
                        value={form.rehab_down_payment ?? ""}
                        onChange={(e) => formfields(index, "rehab_down_payment", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex-1 space-y-3">
                      <label className="text-[#000929] font-medium text-sm mb-2">Loan Type</label>
                      <div className="flex items-center gap-6">
                        {loanTypes.map((loan) => (
                          <label key={loan.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              value={loan.id}
                              checked={form.loan_type_id === loan.id}
                              onChange={(e) => formfields(index, "loan_type_id", e.target.value)}
                              className="form-radio text-green-500 w-5 h-5"
                            />
                            <span>{loan.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label htmlFor={`interestRate-${index}`} className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                        Interest Rate
                      </label>
                      <Input
                        id={`interestRate-${index}`}
                        label="Interest Rate"
                        type="number"
                        suffixText="%"
                        width="w-full"
                        value={form.interest_rate ?? ""}
                        onChange={(e) => formfields(index, "interest_rate", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label htmlFor={`loanTerm-${index}`} className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                        Loan Term
                      </label>
                      <Input
                        id={`loanTerm-${index}`}
                        label="Loan Term"
                        type="number"
                        suffixText="Years"
                        width="w-full"
                        value={form.loan_term ?? ""}
                        onChange={(e) => formfields(index, "loan_term", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-2 transition-all duration-200 ease-in-out hover:scale-110"
                    onClick={() => removeFinancingForm(form.id ?? index)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {useFinancing && (
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={addFinancingForm}
                  className="bg-green-600 mb-2 text-white px-4 py-2 rounded"
                >
                  Add Financing
                </button>
              </div>
            )}
          </div>
        )}
   </div>
        {/* Purchase Costs Section */}
        <div className="bg-white p-6 rounded-md shadow-md mt-3">
          <h2 className="text-xl text-black-600 mb-2 font-semibold">Purchase Costs</h2>
          <div className="flex flex-col items-start gap-1 space-y-1 w-1/2">
            <span className="flex items-center justify-between">
              <label htmlFor="purchasePrice" className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                Total
              </label>
              <div className="items-center mb-1">
                <span
                  className="text-amber-500 cursor-pointer flex items-center justify-center gap-1"
                  onClick={() => setIsPopupOpen2(true)}
                >
                  ✦ Itemize
                  {isPopupOpenP ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-green" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </span>
                  ) : null}
                </span>
              </div>
            </span>
            <div className="w-full relative flex items-center gap-3">
              <div className="relative w-full">
                <Input
                  prefixText={purchaseType === "$" ? "$" : ""}
                  suffixText={purchaseType === "%" ? "%" : ""}
                  type="text"
                  placeholder={purchaseType === "$" ? "Enter amount" : "Enter percentage"}
                  readOnly={clearpurchaseitemizecosts}
                  value={formatWithCommas(requestData.purchase_costs)}
                  {...register("purchase_costs")}
                  onChange={handlePurchaseInputChange}
                  className="w-full h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px]"
                  style={{ paddingLeft: "24px" }}
                />
              </div>
              <select
                value={purchaseType}
                onChange={handlePurchaseTypeChange}
                className="border rounded-md px-4 py-3 bg-bgPurple"
              >
                <option value="$">$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 p-2 shadow-sm border-borderColor bg-white rounded-md">
          <span className="flex items-center justify-between gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setStep("0");
                setActiveTab("Property Description");
              }}
            >
              <span className="flex flex-row justify-center items-center gap-2">
                <FaAngleLeft /> Back
              </span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex justify-center gap-2 flex-row items-center">
                  Save & Continue <FaAngleRight />
                </span>
              )}
            </Button>
          </span>
        </div>
      </div>
      <PopupModal
        isOpen={isPopupOpen}
        title="Closing Costs" 
        inputFields={inputFields3}
        handleInputChange={handleItemizedInputChange}
        handleAddInput={handleAddInput}
        handleDeleteInput={handleDeleteInput}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleClosingSave}
        showSelect={true}
        selectedType={closingcostintemizedselectedType}
        handleSelectChange={setClosingcostintemizedselectedType}
        itemize={clearclosingitemizecosts}
        toggleItemize={toggleItemizeclosing}
        onSaveItemizednormal={handleSaveTotalAmountClosing}
      />
      <PopupModal
        isOpen={isPopupOpen2}
        title="Purchase Costs"
        inputFields={inputFields4}
        handleInputChange={handleItemizedInputChange2}
        handleAddInput={handleAddInput2}
        handleDeleteInput={handleDeleteInput2}
        onClose={() => setIsPopupOpen2(false)}
        onSave={handlePurchaseSave}
        showSelect={true}
        selectedType={purchasecostintemizedselectedType}
        handleSelectChange={setPurchasecostintemizedselectedType}
        itemize={clearpurchaseitemizecosts}
        toggleItemize={toggleItemizepurchase}
        onSaveItemizednormal={handleSaveTotalAmountPurchase}
      />
    </form>
  );
};

export default FinancingForm;