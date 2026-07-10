import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "container/components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Input from "../../../components/Input";
import PopupModal from "../../../components/popup";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const SellingCosts = (props: any) => {
  const {
    // activeTab,
    setActiveTab,
    requestData,
    setRequestData,
    setTabsValidation,
    inputFields2,
    setInputFields2,
    setStep,
    setLoading,
    loading,
    isPopupOpenS,
    setIsPopupOpenS,
    // setSpLoading
  } = props;
  // const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(
    requestData?.selling_cost_type || "$"
  );
  const [sellingintemizedselectedType, setSellingintemizedselectedType] =
    useState("$");
  const [totalValue, setTotalValue] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clearsellingitemizecosts, setClearsellingitemizecosts] =
    useState(false);
  const validationSchema = Yup.object().shape({
    selling_costs: Yup.number()
      .typeError("selling costs must be a number")
      .required("selling costs are required"),
    clear_selling_itemize_costs: Yup.boolean(),
  });

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: requestData,
  });

  console.log("requestData", requestData);
  console.log("errors4--", errors);

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/,/g, "");
    if (!isNaN(Number(numericValue))) {
      return new Intl.NumberFormat("en-US").format(Number(numericValue));
    }
    return value;
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target.value;
  //   // const raw = input.replace(/,/g, "");

  //   // if (!/^\d*\.?\d*$/.test(raw)) return;
  //   const raw = e.target.value.replace(/,/g, "");
  //   if (/^\d*\.?\d{0,2}$/.test(raw)) {
  //     // console.log('e2-',raw)
  //     setRequestData((prev: any) => ({
  //       ...prev,
  //       selling_costs: Number(raw),
  //     }));
  //     setValue("selling_costs", raw, { shouldValidate: true });
  //   }

  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");

    // Allow only digits and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setRequestData((prev: any) => ({
        ...prev,
        selling_costs: input, // store as string to preserve decimals exactly
      }));

      setValue("selling_costs", input, { shouldValidate: true });
    }
  };

  const clearSellingRef = useRef(clearsellingitemizecosts);

  // update refs whenever state changes
  useEffect(() => {
    clearSellingRef.current = clearsellingitemizecosts;
  }, [clearsellingitemizecosts]);

  const onSubmit = async (data: any) => {
    // setSpLoading(true);
    setStep("1");
    console.log("dd----", data);

    data.clear_selling_itemize_costs = clearSellingRef.current;
    setRequestData((prev: any) => ({ ...prev, ...data }));
    const { selling_cost_type, ...filteredData } = {
      ...requestData,
      ...data,
    };
    setRequestData(filteredData);
    setTabsValidation((prev: any) => ({
      ...prev,
      tab4Validation: true,
    }));
    // setLoading(false);
    // setSpLoading(true);
    setLoading(true);
  };

  const handleItemizedInputChange = (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number | string | number
  ) => {
    setInputFields2((prevFields: any) => {
      const updatedFields = [...prevFields];

      updatedFields[index] = {
        ...updatedFields[index],
        [field]: field === "amount" ? value || '' : value || "$",
      };

      console.log("input--", updatedFields);
      return updatedFields;
    });
  };
  const toggleItemizeselling = () => {
    setClearsellingitemizecosts((prev) => {
      const newValue = !prev;

      setRequestData((prevData: any) => ({
        ...prevData,
        clear_selling_itemize_costs: newValue,
      }));

      return newValue;
    });
  };

  const handleAddInput = () => {
    setInputFields2([
      ...inputFields2,
      { name: "", amount: null, amount_type: "$" },
    ]);
  };

  // const handleDeleteInput = (idOrIndex: string | number) => {
  //   setInputFields2((prevFields: any[]) =>
  //     prevFields.filter((field: any, index: number) =>
  //       typeof idOrIndex === "string"
  //         ? field.id !== idOrIndex
  //         : index !== idOrIndex
  //     )
  //   );

  //   if (props.handleDeleteInput) {
  //     props.handleDeleteInput(idOrIndex);
  //   }
  // };

  const handleDeleteInput = (idOrIndex: string | number) => {
    setInputFields2((prevFields: any[]) =>
      prevFields.filter((field: any, index: number) =>
        typeof idOrIndex === "string"
          ? field.id !== idOrIndex
          : index !== idOrIndex
      )
    );

    if (typeof idOrIndex === "string" && props.handleDeleteInput) {
      props.handleDeleteInput(idOrIndex);
    }
  };

  const handleSave = () => {
    const totalValue = inputFields2.reduce(
      (sum: any, field: any) => sum + Number(field.amount || 0),
      0
    );
    setTotalValue(formatNumberWithCommas(totalValue.toString()));
    setIsPopupOpen(false);

    if (props.handleSave) {
      props.handleSave();
    }
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;

    setSelectedType(newType);

    setRequestData((prev: any) => ({
      ...prev,
      selling_cost_type: newType,
    }));
  };

  const selling_costs = watch("selling_costs") || "";

  useEffect(() => {
    if (selling_costs !== totalValue) {
      setTotalValue(
        selectedType === "$"
          ? formatNumberWithCommas(selling_costs.toString())
          : selling_costs.toString()
      );
    }
  }, [selling_costs, selectedType]);

  const clear_selling_itemize_costs = watch("clear_selling_itemize_costs");

  useEffect(() => {
    setClearsellingitemizecosts(!!clear_selling_itemize_costs);
  }, [clear_selling_itemize_costs]);

  const handleSaveTotalAmount = () => {
    const totalAmount = inputFields2[0]?.totalAmount || 0;

    setValue("selling_costs", totalAmount, { shouldValidate: true });
    setRequestData((prev: any) => ({
      ...prev,
      selling_costs: totalAmount,
    }));
    setIsPopupOpen(false);
  };

  // const formatWithCommas = (value: string | number) => {
  //   if (value === null || value === undefined) return "";
  //   const clean = String(value).replace(/,/g, "");
  //   if (!clean) return "";
  //   const parts = clean.split(".");
  //   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //   return parts.join(".");
  // };

  function formatWithCommas(value: string | number | null | undefined): string {
    console.log("e4", value);
    if (value === null || value === undefined || value === "") return "";

    const [intPart, decimalPart] = value.toString().split(".");
    const formattedInt = Number(intPart).toLocaleString("en-US");

    return decimalPart !== undefined
      ? `${formattedInt}.${decimalPart}`
      : formattedInt;
  }

  useEffect(() => {
    let totalAmount =
      requestData?.selling_costs != null ? requestData?.selling_costs : null;
    setValue("selling_costs", totalAmount, { shouldValidate: true });
  }, [requestData]);

  return (
    <>
      <div className="bg-white p-6 mt-3 rounded-md shadow-md">
        <h2 className="text-xl text-black-600 mb-1 font-semibold">
          Selling Costs
        </h2>
        <div className="flex justify-center items-center mb-1">
          <span
            className="text-amber-500 cursor-pointer mr-24"
            onClick={() => setIsPopupOpen(true)}
          >
            ✦ Itemize
            {isPopupOpenS ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-green"
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
                ...
              </span>
            ) : null}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-6">
            <label
              htmlFor="closingCosts"
              className="text-[#000929] font-medium text-sm w-40 min-w-[160px]"
            >
              Total <span className="text-red-500">*</span>
            </label>
            <div className="w-full flex items-center gap-3 relative">
              <div className="relative w-full">
                <div className="relative w-full">
                  <span className="absolute left-3 mr-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    $
                  </span>
                  <Input
                    prefixText={selectedType === "$" ? "$" : ""}
                    suffixText={selectedType === "%" ? "%" : ""}
                    type="text"
                    placeholder={
                      selectedType === "$" ? "Enter amount" : "Enter percentage"
                    }
                    readOnly={clearsellingitemizecosts}
                    onFocus={() => {
                      if (!clearsellingitemizecosts) {
                      }
                    }}
                    value={formatWithCommas(requestData.selling_costs)}
                    {...register("selling_costs")}
                    onChange={handleInputChange}
                    className="w-full h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:p-[10px]"
                    style={{ paddingLeft: "24px" }}
                    // error={errors.selling_costs}
                  />
                </div>
              </div>
              <select
                // {...register("selling_cost_type")}
                value={selectedType}
                onChange={handleTypeChange}
                className="border rounded-md px-4 py-3 bg-bgPurple"
              >
                <option value="$">$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end  p-2 shadow-sm border-borderColor bg-white rounded-md mt-3">
        <span className="flex items-center justify-between gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setStep("0");
              setActiveTab("Rehab");
            }}
          >
            <span className="flex flex-row justify-center items-center gap-2"><FaAngleLeft/> Back</span>
            </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
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
                Saving...
              </span>
            ) : (
             <span className="flex justify-center gap-2 flex-row items-center">Finish  <FaAngleRight /></span>
            )}
          </Button>
        </span>
      </div>
      <PopupModal
        isOpen={isPopupOpen}
        title="Selling Costs"
        inputFields={inputFields2}
        handleInputChange={handleItemizedInputChange}
        handleAddInput={handleAddInput}
        handleDeleteInput={(id) => {
          handleDeleteInput(id);
        }}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSave}
        showSelect={true}
        selectedType={sellingintemizedselectedType}
        handleSelectChange={(value) => setSellingintemizedselectedType(value)}
        itemize={clearsellingitemizecosts}
        toggleItemize={toggleItemizeselling}
        onSaveItemizednormal={handleSaveTotalAmount}
      />
    </>
  );
};

export default SellingCosts;
