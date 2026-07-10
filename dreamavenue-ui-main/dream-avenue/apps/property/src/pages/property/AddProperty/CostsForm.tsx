import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "container/components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Input from "../../../components/Input";
import PopupModal from "../../../components/popup";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
const CostsForm = (props: any) => {
  const {
    setActiveTab,
    requestData,
    setRequestData,
    setTabsValidation,
    inputFields,
    setInputFields,
    inputFieldsrehab,
    setInputFieldsrehab,
    setFin,
    setStep,
    setLoading,
    loading,
    isPopupOpenH,
    isPopupOpenR,
    // setSpLoading
  } = props;
  // const [loading, setLoading] = useState(false);
  const [selectedType2, setSelectedType2] = useState("$");
  const [selectedType3, setSelectedType3] = useState("$");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rawHoldingCostValue, setRawHoldingCostValue] = useState("");
  const [rehabintemizedselectedType, setRehabintemizedselectedType] =
    useState("$");
  const [holdingintemizedselectedType, setHoldingintemizedselectedType] =
    useState("$");
  const [formattedHoldingCostValue, setFormattedHoldingCostValue] =
    useState("");
  const [totalValue2, setTotalValue2] = useState("");
  const [isPopupOpenrehab, setIsPopupOpenrehab] = useState(false);
  const [clearrehabitemizecosts, setClearrehabitemizecosts] = useState(false);
  const [clearholdingitemizecosts, setClearholdingitemizecosts] =
    useState(false);
  const [hc, setHc] = useState(
    requestData?.holding_costs ? requestData.holding_costs : null
  );
  const [rc, setRc] = useState(
    requestData?.rehab_costs ? requestData.rehab_costs : null
  );

  const validationSchema = Yup.object().shape({
    holding_costs: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      ),
    rehab_costs: Yup.number()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          const cleaned = originalValue.replace(/,/g, "");
          return cleaned === "" ? undefined : Number(cleaned);
        }
        return value;
      })
      .typeError("Rehab costs must be a number")
      .required("Rehab costs are required"),
    rehab_cost_overrun: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      ),
    rehab_cost_holding_period: Yup.number().required(
      "Holding Period is required"
    ),
    clear_rehab_itemize_costs: Yup.boolean(),
    clear_holding_itemize_costs: Yup.boolean(),
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: requestData,
  });

  console.log("errors3", errors);
  useEffect(() => {
    console.log("requestData-amount", requestData);
  }, [requestData]);

  const clearHoldingRef = useRef(clearholdingitemizecosts);
  const clearRehabRef = useRef(clearrehabitemizecosts);

  // update refs whenever state changes
  useEffect(() => {
    clearHoldingRef.current = clearholdingitemizecosts;
  }, [clearholdingitemizecosts]);

  useEffect(() => {
    clearRehabRef.current = clearrehabitemizecosts;
  }, [clearrehabitemizecosts]);

  const reCRef = useRef(rc);
  useEffect(() => {
    reCRef.current = rc;
  }, [rc]);

  useEffect(() => {
    setRc(requestData.rehab_costs);
  }, [requestData.rehab_costs]);

  const hoCRef = useRef(rc);
  useEffect(() => {
    hoCRef.current = hc;
  }, [hc]);

  useEffect(() => {
    setHc(requestData.holding_costs);
  }, [requestData.holding_costs]);

  const onSubmit = async (data: any) => {
    // setSpLoading(true);
    console.log("data3", data);
    setStep("1");
    setFin("");

    data.rehab_costs = reCRef.current;
    data.holding_costs = hoCRef.current;

    data.clear_holding_itemize_costs = clearHoldingRef.current;
    data.clear_rehab_itemize_costs = clearRehabRef.current;
    setRequestData((preValue: any) => ({ ...preValue, ...data }));

    setRequestData((preValue: any) => ({ ...preValue, ...data }));
    setTabsValidation((prev: any) => ({
      ...prev,
      tab3Validation: true,
    }));
    // setSpLoading(true);
    // setActiveTab("Sale");
    setLoading(true);
  };
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFin("");
  //   const input = e.target.value;
  //   const raw = input.replace(/,/g, "");

  //   if (!/^\d*\.?\d*$/.test(raw)) return;

  //   setRequestData((prev: any) => ({
  //     ...prev,
  //     rehab_costs: raw,
  //   }));
  //   setValue("rehab_costs", raw, { shouldValidate: true });
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");

    // Allow only digits and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setRequestData((prev: any) => ({
        ...prev,
        rehab_costs: input, // store as string to preserve decimals exactly
      }));

      setValue("rehab_costs", input, { shouldValidate: true });
    }
  };

  // const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFin("");
  //   const input = e.target.value;
  //   const raw = input.replace(/,/g, "");

  //   if (!/^\d*\.?\d*$/.test(raw)) return;

  //   setRequestData((prev: any) => ({
  //     ...prev,
  //     holding_costs: raw,
  //   }));
  //   setValue("holding_costs", raw, { shouldValidate: true });
  // };
  const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");

    // Allow only digits and up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setRequestData((prev: any) => ({
        ...prev,
        holding_costs: input, // store as string to preserve decimals exactly
      }));

      setValue("holding_costs", input, { shouldValidate: true });
    }
  };

  const handleItemizedInputChange = (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number
  ) => {
    setInputFieldsrehab((prevFields: any) => {
      const updatedFields = [...prevFields];

      updatedFields[index] = {
        ...updatedFields[index],
        [field]: field === "amount" ? value || '' : value || "$",
      };

      console.log("input--", updatedFields);
      return updatedFields;
    });
  };

  const handleAddInputrehab = () => {
    setInputFieldsrehab([
      ...inputFieldsrehab,
      { name: "", amount: null, amount_type: "$" },
    ]);
  };

  // const handleDeleteInputrehab = (idOrIndex: string | number) => {
  //   setInputFieldsrehab((prevFields: any[]) =>
  //     prevFields.filter((field: any, index: number) =>
  //       typeof idOrIndex === "string"
  //         ? field.id !== idOrIndex
  //         : index !== idOrIndex
  //     )
  //   );

  //   if (props.handleDeleteInputrehab) {
  //     props.handleDeleteInputrehab(idOrIndex);
  //   }
  // };

  const handleDeleteInputrehab = (idOrIndex: string | number) => {
    setInputFieldsrehab((prevFields: any[]) =>
      prevFields.filter((field: any, index: number) =>
        typeof idOrIndex === "string"
          ? field.id !== idOrIndex
          : index !== idOrIndex
      )
    );

    if (typeof idOrIndex === "string" && props.handleDeleteInputrehab) {
      props.handleDeleteInputrehab(idOrIndex);
    }
  };

  const handleSaveRehab = () => {
    setFin("");
    const totalValue2 = inputFieldsrehab.reduce(
      (sum: any, field: any) => sum + Number(field.amount || 0),
      0
    );
    setTotalValue2(formatNumberWithCommas(totalValue2.toString()));

    setIsPopupOpenrehab(false);

    if (props.handleSaveRehab) {
      props.handleSaveRehab();
    }
  };

  const handleAddInput = () => {
    setInputFields([
      ...inputFields,
      { name: "", amount: null, amount_type: "$" },
    ]);
  };

  // const handleDeleteInput = (idOrIndex: string | number) => {
  //   setInputFields((prevFields: any[]) =>
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
    setInputFields((prevFields: any[]) =>
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

  const formatNumberWithCommas = (
    value: string | number | null | undefined
  ) => {
    if (value == null) return "";

    const stringValue = String(value);
    const numericValue = stringValue.replace(/,/g, "");

    if (!isNaN(Number(numericValue))) {
      return new Intl.NumberFormat("en-US").format(Number(numericValue));
    }

    return stringValue;
  };

  const handleInputChangeholding = (
    index: number,
    field: "name" | "amount" | "amount_type" | "totalAmount" | "cost_type",
    value: string | number
  ) => {
    setInputFields((prevFields: any) => {
      const updatedFields = [...prevFields];
      updatedFields[index] = {
        ...updatedFields[index],
        [field]: field === "amount" ? value || '' : value || "$",
      };
      return updatedFields;
    });
  };

  const handleSaveHoldingCosts = () => {
    setFin("");

    if (props.handleSaveHoldingCosts) {
      props.handleSaveHoldingCosts();
    }

    setIsPopupOpen(false);
  };

  const HoldingCostsValue = watch("holding_costs") || "";
  const rehab_costvalue = watch("rehab_costs") || "";

  useEffect(() => {
    if (HoldingCostsValue !== rawHoldingCostValue) {
      setFormattedHoldingCostValue(formatNumberWithCommas(HoldingCostsValue));
    }
    if (rehab_costvalue !== totalValue2) {
      setTotalValue2(formatNumberWithCommas(rehab_costvalue));
    }
  }, [HoldingCostsValue, rehab_costvalue]);

  const handleTypeChange2 = (event: any) => {
    const newType = event.target.value;

    setSelectedType2(newType);

    let rawValue = totalValue2.replace(/,/g, "");

    if (newType === "%") {
      rawValue = rawValue ? parseFloat(rawValue).toString() : "";
    } else {
      rawValue = rawValue ? formatNumberWithCommas(rawValue) : "";
    }
    setTotalValue2(rawValue);
  };

  const handleTypeChange3 = (event: any) => {
    const newType = event.target.value;
    setSelectedType3(newType);

    let rawValue = formattedHoldingCostValue.replace(/,/g, "");

    if (newType === "%") {
      rawValue = rawValue ? parseFloat(rawValue).toString() : "";
    } else {
      rawValue = rawValue ? formatNumberWithCommas(rawValue) : "";
    }

    setFormattedHoldingCostValue(rawValue);
    setRawHoldingCostValue(rawValue);
  };

  const toggleItemizerehab = () => {
    setFin("");
    setClearrehabitemizecosts((prev) => {
      const newValue = !prev;

      setRequestData((prevData: any) => ({
        ...prevData,
        clear_rehab_itemize_costs: newValue,
      }));
      return newValue;
    });
  };
  const toggleItemizeholding = () => {
    setFin("");
    setClearholdingitemizecosts((prev) => {
      const newValue = !prev;

      setRequestData((prevData: any) => ({
        ...prevData,
        clear_holding_itemize_costs: newValue,
      }));

      return newValue;
    });
  };

  const handleSaveTotalAmountholding = () => {
    const totalAmount = inputFields[0]?.totalAmount || 0;

    setValue("holding_costs", totalAmount, { shouldValidate: true });
    setRequestData((prev: any) => ({
      ...prev,
      holding_costs: totalAmount,
    }));
    setIsPopupOpen(false);
  };

  const handleSaveTotalAmountrehab = () => {
    const totalAmount = inputFieldsrehab[0]?.totalAmount || 0;

    // setValue("rehab_costs", totalAmount, { shouldValidate: true });
    setRequestData((prev: any) => ({
      ...prev,
      rehab_costs: totalAmount,
    }));
    setIsPopupOpenrehab(false);
  };

  const clear_rehab_itemize_costs = watch("clear_rehab_itemize_costs");

  useEffect(() => {
    setClearrehabitemizecosts(!!clear_rehab_itemize_costs);
  }, [clear_rehab_itemize_costs]);

  const clear_holding_itemize_costs = watch("clear_holding_itemize_costs");

  useEffect(() => {
    setClearholdingitemizecosts(!!clear_holding_itemize_costs);
  }, [clear_holding_itemize_costs]);

  // clear_rehab_itemize_costs
  // clear_holding_itemize_costs

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
      requestData?.rehab_costs != null ? requestData?.rehab_costs : null;
    setValue("rehab_costs", totalAmount, { shouldValidate: true });
  }, [requestData]);

  return (
    <>
      <div>
        <div className="bg-white p-6  rounded-md shadow-md">
          <h2 className="text-xl text-black-600 mb-3 font-semibold">
            Rehab Costs
          </h2>
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <span className="flex items-center justify-between w-full">
                <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                  Total <span className="text-red-500">*</span>
                </label>
                <span
                  className="text-amber-500 cursor-pointer mr-24"
                  onClick={() => setIsPopupOpenrehab(true)}
                >
                  ✦ Itemize
                  {isPopupOpenR ? (
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
              </span>
              <div className="w-full relative flex items-center gap-3">
                <div className="relative w-full">
                  <Input
                    label="Total"
                    type="text"
                    width="w-full"
                    prefixText={selectedType2 === "$" ? "$" : ""}
                    suffixText={selectedType2 === "%" ? "%" : ""}
                    placeholder={
                      selectedType2 === "$"
                        ? "Enter amount"
                        : "Enter percentage"
                    }
                    readOnly={clearrehabitemizecosts}
                    onFocus={() => {
                      if (!clearrehabitemizecosts) {
                      }
                    }}
                    value={formatWithCommas(requestData.rehab_costs)}
                    {...register("rehab_costs")}
                    className="w-full h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ paddingLeft: "24px" }}
                    // error={errors.rehab_costs}
                    onChange={handleInputChange}
                  />
                </div>
                <select
                  // {...register("rehab_cost_type")}
                  value={selectedType2}
                  onChange={handleTypeChange2}
                  className="border rounded-md px-4 py-3 bg-bgPurple"
                >
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                Holding Period Months <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center w-full">
                <Input
                  label="Holding Period Months"
                  type="number"
                  placeholder="Holding Period Months"
                  width="w-full"
                  register={register("rehab_cost_holding_period")}
                  className="w-full"
                  error={errors.rehab_cost_holding_period}
                />
              </div>
            </div>
            <div className="flex-1 flex-col items-start gap-1 space-y-1 w-[32%]">
              <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                Cost Overrun
              </label>
              <Input
                label="Cost Overrun"
                type="number"
                suffixText="%"
                width="w-full"
                register={register("rehab_cost_overrun")}
                className="w-full"
                error={errors.rehab_cost_overrun}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md my-4">
          <h2 className="text-xl text-black-600 mb-3 font-semibold">
            Holding Costs
          </h2>

          <div className="flex flex-col items-start gap-1 space-y-1 w-1/2">
            <span className="flex items-center justify-between w-full">
              <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                Itemized Total
              </label>
              <span
                className="text-amber-500 cursor-pointer mr-24"
                onClick={() => setIsPopupOpen(true)}
              >
                ✦ Itemize
                {isPopupOpenH ? (
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
            </span>
            <div className="w-full relative flex items-center gap-3 ">
              {/* Purchase Costs Input */}
              <div className="relative w-full">
                <Input
                  label="Itemized Total"
                  type="text"
                  width="w-full"
                  prefixText={selectedType3 === "$" ? "$" : ""}
                  suffixText={selectedType3 === "%" ? "%" : ""}
                  style={{ paddingLeft: "24px" }}
                  readOnly={clearholdingitemizecosts}
                  onFocus={() => {
                    if (!clearholdingitemizecosts) {
                    }
                  }}
                  // value={requestData.holding_costs}
                  value={formatWithCommas(requestData.holding_costs)}
                  {...register("holding_costs")}
                  className="w-full"
                  onChange={handleInputChange2}
                />
              </div>
              <select
                // {...register("holding_costs_type")}
                value={selectedType3}
                onChange={handleTypeChange3}
                className="border rounded-md px-4 py-3 bg-bgPurple"
              >
                <option value="$">$</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end  p-2 shadow-sm border-borderColor bg-white rounded-md">
          <span className="flex items-center justify-between gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setStep("0");
                setActiveTab("Purchase");
                setFin("fin");
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
                 <span className="flex justify-center gap-2 flex-row items-center">Save & Continue  <FaAngleRight /></span>
              
              )}
            </Button>
          </span>
        </div>
      </div>
      <PopupModal
        isOpen={isPopupOpen}
        title="Holding Costs"
        inputFields={inputFields}
        handleInputChange={handleInputChangeholding}
        handleAddInput={handleAddInput}
        handleDeleteInput={(id) => {
          handleDeleteInput(id);
        }}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveHoldingCosts}
        showSelect={true}
        selectedType={holdingintemizedselectedType}
        handleSelectChange={(value) => setHoldingintemizedselectedType(value)}
        itemize={clearholdingitemizecosts}
        toggleItemize={toggleItemizeholding}
        onSaveItemizednormal={handleSaveTotalAmountholding}
      />
      <PopupModal
        isOpen={isPopupOpenrehab}
        title="Rehab Costs"
        inputFields={inputFieldsrehab}
        handleInputChange={handleItemizedInputChange}
        handleAddInput={handleAddInputrehab}
        handleDeleteInput={(id) => {
          handleDeleteInputrehab(id);
        }}
        onClose={() => setIsPopupOpenrehab(false)}
        onSave={handleSaveRehab}
        showSelect={true}
        selectedType={rehabintemizedselectedType}
        handleSelectChange={(value) => setRehabintemizedselectedType(value)}
        itemize={clearrehabitemizecosts}
        toggleItemize={toggleItemizerehab}
        onSaveItemizednormal={handleSaveTotalAmountrehab}
      />
    </>
  );
};

export default CostsForm;
