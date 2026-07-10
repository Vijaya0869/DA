import React, { useCallback, useEffect, useState, useRef } from "react";
// import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button } from "container/components";
import { FileSpreadsheet, FileText } from "lucide-react";
import FinancingForm from "./FinancingForm";
import CostsForm from "./CostsForm";
import SellingCosts from "./SellingCosts";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./addproperty.css";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import CreatableSelect from "react-select/creatable";
import PropertyServices from "../../../Services/property";
import { AxiosResponse } from "axios";
import Select1 from "react-select";
import { useLocation } from "react-router-dom";
import AddressAutocomplete from "../../../components/addressOptions/addresOptions";
import { FaAngleRight } from "react-icons/fa";
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "100%",
  }),
};

interface TabValidationType {
  tab1Validation: boolean;
  tab2Validation: boolean;
  tab3Validation: boolean;
  tab4Validation: boolean;
}

type StateOption = {
  label: string;
  value: string;
};

interface ItemType {
  id?: string;
  name: string;
  amount: string | null;
  cost_type?: string;
  amount_type: string;
}
interface Financing {
  id?: string;
  loan_label: string;
  financing_of_type_id: string;
  down_payment_type: string;
  down_payment: number | null;
  rehab_down_payment: number | null;
  interest_rate: number | null;
  loan_term: number | null;
  loan_type_id: string;
}

const AddProperty = (props: any) => {
  const { editObject, setPageView } = props;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Property Description");
  const [fin, setFin] = useState("");
  const [step, setStep] = useState("");
  const location = useLocation();
  const [isPopupOpenS, setIsPopupOpenS] = useState(false);
  const [isPopupOpenR, setIsPopupOpenR] = useState(false);
  const [isPopupOpenH, setIsPopupOpenH] = useState(false);
  const [isPopupOpenP, setIsPopupOpenP] = useState(false);
  const [isPopupOpenC, setIsPopupOpenC] = useState(false);
  const [purchasePrice,setPurchasePrice] = useState<string | null>(null);

  // const [spLoading, setSpLoading] = useState(false);
  const propertyDetails = location.state?.propertyDetails || {};
  const mergedData = { ...propertyDetails, ...editObject };
  const [investmentStrategy, setInvestmentStrategy] = useState(
    mergedData?.investment_strategy_id !== null ? true : false
  );
  const [selectedStrategy, setSelectedStrategy] = useState(
    mergedData?.investment_strategy_id !== null
      ? mergedData?.investment_strategy_id
      : ""
  );

  const [ptI, setPtI] = useState(
    mergedData?.property_type_id !== null ? mergedData?.property_type_id : ""
  );
  const [strategies, setStrategies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [newpropertyId, setNewpropertyId] = useState<string | null>(null);
  const [tabsValidation, setTabsValidation] = useState<TabValidationType>({
    tab1Validation: false,
    tab2Validation: false,
    tab3Validation: false,
    tab4Validation: false,
  });
  const tabs = ["Property Description", "Purchase", "Rehab", "Sale"];
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [documentImages, setDocumentImages] = useState<File[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [cityOptions, setCityOptions] = useState<StateOption[]>([]);
  const [tagOptions, setTagOptions] = useState<any[]>([]);
  const [stateId, setStateId] = useState<string | null>(
    mergedData?.state ? mergedData?.state : ""
  );
  const [inputFields, setInputFields] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$" },
  ]);
  const [inputFields2, setInputFields2] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$" },
  ]);
  const [inputFields3, setInputFields3] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$" },
  ]);
  const [inputFields4, setInputFields4] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$" },
  ]);
  const [inputFieldsrehab, setInputFieldsrehab] = useState<ItemType[]>([
    { name: "", amount: null, amount_type: "$", cost_type: "OverAll" },
  ]);
  const [financingForms, setFinancingForms] = useState<Financing[]>([
    {
      loan_label: "",
      financing_of_type_id: "",
      down_payment_type: "",
      down_payment: null,
      rehab_down_payment: null,
      interest_rate: null,
      loan_term: null,
      loan_type_id: "",
    },
  ]);
  const getValidValue = (value: any, defaultValue: any) => {
    return value == null ? defaultValue : value;
  };
  const [addressFieldsLocked, setAddressFieldsLocked] = useState(false);
  const [directCity, setDirectCity] = useState("");
  const [directState, setDirectState] = useState("");
  const [directZipCode, setDirectZipCode] = useState("");
    const [formattedPurchasePrice, setFormattedPurchasePrice] = useState("");
  
  const [requestData, setRequestData] = useState<any>({
    lot_size: getValidValue(mergedData?.lot_size, null),
    lot_size_type: getValidValue(mergedData?.lot_size_type, "Acres"),
    parking: getValidValue(mergedData?.parking, null),
    bathrooms: getValidValue(mergedData?.bathrooms, null),
    bedrooms: getValidValue(mergedData?.bedrooms, null),
    notes: getValidValue(mergedData?.notes, ""),
    mls_number: getValidValue(mergedData?.mls_number, ""),
    year_built: getValidValue(mergedData?.year_built, null),
    square_feet: getValidValue(mergedData?.square_feet, null),
    // property_type_id: getValidValue(mergedData?.property_type_id, null),
    property_type_id: getValidValue(mergedData?.property_type_id, null),
    zip_code: getValidValue(mergedData?.zip_code, ""),
    city: getValidValue(mergedData?.city, ""),
    state: getValidValue(mergedData?.state, ""),
    address: getValidValue(mergedData?.address, ""),
    investment_strategy_id: getValidValue(
      mergedData?.investment_strategy_id,
      ""
    ),
    tags_n_labels: getValidValue(mergedData?.tags_n_labels, ""),
    description: getValidValue(mergedData?.description, ""),
    title: getValidValue(mergedData?.title, ""),
    location: getValidValue(mergedData?.location, ""),
    zoning: getValidValue(mergedData?.zoning, ""),
    purchase_costs: getValidValue(mergedData?.purchase_costs, null),
    // // loan_term: getValidValue(mergedData?.loan_term, null),
    // // interest_rate: getValidValue(mergedData?.interest_rate, null),
    // // rehab_down_payment: getValidValue(mergedData?.rehab_down_payment, null),
    // // loan_type_id: getValidValue(mergedData?.loan_type_id, null),
    // // financing_of_type_id: getValidValue(mergedData?.financing_of_type_id, null),
    // // down_payment: getValidValue(mergedData?.down_payment, null),
    // // loan_labels: getValidValue(mergedData?.loan_labels, ""),
    // after_repair_value: getValidValue(mergedData?.after_repair_value, null),
    // closing_costs: getValidValue(mergedData?.closing_costs, null),
    // // closing_cost_type: getValidValue(mergedData?.closing_cost_type, "$"),
     purchase_price: getValidValue(mergedData?.purchase_price, ""),
    // rehab_cost_holding_period: getValidValue(
    //   mergedData?.rehab_cost_holding_period,
    //   null
    // ),
    // rehab_cost_overrun: getValidValue(mergedData?.rehab_cost_overrun, null),
    // rehab_costs: getValidValue(mergedData?.rehab_costs, null),
    // selling_costs: getValidValue(mergedData?.selling_costs, null),
    // // selling_cost_type: getValidValue(mergedData?.selling_cost_type, "$"),
    // holding_costs: getValidValue(mergedData?.holding_costs, null),
    // clear_selling_itemize_costs: getValidValue(
    //   mergedData?.clear_selling_itemize_costs,
    //   false
    // ),
    // clear_rehab_itemize_costs: getValidValue(
    //   mergedData?.clear_rehab_itemize_costs,
    //   false
    // ),
    // clear_holding_itemize_costs: getValidValue(
    //   mergedData?.clear_holding_itemize_costs,
    //   false
    // ),
    // clear_purchase_itemize_costs: getValidValue(
    //   mergedData?.clear_purchase_itemize_costs,
    //   false
    // ),
    // clear_closing_itemize_costs: getValidValue(
    //   mergedData?.clear_closing_itemize_costs,
    //   false
    // ),
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Property Name is required"),
    description: Yup.string().required("Description is required"),
    tags_n_labels: Yup.string().required("Tags & Labels are required"),
    investment_strategy_id: Yup.string().required(
      "Investment Strategy is required"
    ),
    address: Yup.string().required("Street Address required"),
    state: Yup.string().required("State required"),
    city: Yup.string().required("City required"),
    zip_code: Yup.string().required("Zip Code required"),
    property_type_id: Yup.string().required("Property Type required"),
    mls_number: Yup.string(),
    // purchase_price: Yup.string().required("Purchase Price is required"),
    notes: Yup.string(),
    bedrooms: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    year_built: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    square_feet: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    bathrooms: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    parking: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    lot_size: Yup.number()
      .transform((_, originalValue) =>
        originalValue === "" ? 0 : Number(originalValue)
      )
      .nullable(),
    lot_size_type: Yup.string(),
    zoning: Yup.string(),
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: requestData,
  });
  console.log("Errors:", errors);

  useEffect(() => {
    console.log("requestData2-", requestData);
    setRequestData(requestData);
  }, [step]);

  useEffect(() => {
    if (requestData.purchase_price) {
      setFormattedPurchasePrice(formatNumberWithCommas(String(requestData.purchase_price)));
    }
   
  }, [requestData]);
  const onSubmit = async (data: any) => {
    setStep("1");
    // setSpLoading(true);
    // Validate required fields
    if (!data.state) {
      toast.error("State is required");
      setLoading(false);
      return;
    }
    if (!data.city) {
      toast.error("City is required");
      setLoading(false);
      return;
    }
    console.log("data---", data);
    console.log("req-data---", requestData);
    setLoading(true);
    data.investment_strategy_id =
      data.investment_strategy_id === "" ? null : data.investment_strategy_id;
    // data.property_type_id = ptCRef.current;
    // setRequestData((prevData: any) => ({
    //   ...prevData,
    //   ...data,
    //   location: "Austin, TX",
    // }));
    if (newpropertyId) {
      // Merge with previous data if newPropertyId exists
      setRequestData((prevData: any) => ({
        ...prevData,
        ...data,
        location: `${data.city}, ${data.state}` || "Austin, TX",
      }));
    } else {
      // Only use new data if newPropertyId doesn't exist
      setRequestData((prevData: any) => ({
        ...prevData,
        ...data,
        location: `${data.city}, ${data.state}` || "Austin, TX",
      }));
    }

    setTabsValidation((prev: any) => ({
      ...prev,
      tab1Validation: true,
    }));
    // await addOrUpdateProperty();

    // setLoading(false);
  };

  const handleImageUpload1 = async (propertyId: string) => {
    if (propertyImages.length === 0) {
      console.warn("No images selected for upload.");
      return;
    }
    try {
      const uploadPromises = propertyImages.map(async (file) => {
        const formData = new FormData();
        formData.append("propertyId", propertyId);
        formData.append("file", file);
        formData.append("filename", file.name);

        const endpoint = "/property/property-image-upload";
        const contentType = "multipart/form-data";
        const response = await PropertyServices.postCommon(
          endpoint,
          contentType,
          formData
        );
        console.log("files successfully uploaded", response);
        return response;
      });

      const responses = await Promise.all(uploadPromises);
      console.log(
        "All files successfully uploaded:",
        responses.map((res) => res.data)
      );
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleImageUpload = async (propertyId: string) => {
    if (documentImages.length === 0) {
      console.warn("No images selected for upload.");
      return;
    }

    // ✅ 3 MB size check
    const MAX_FILE_SIZE = 3 * 1024 * 1024;
    const hasLargeFile = documentImages.some(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (hasLargeFile) {
      console.warn("One or more files exceed the 3MB size limit.");
      return;
    }

    try {
      const uploadPromises = documentImages.map(async (file) => {
        const formData = new FormData();
        formData.append("propertyId", propertyId);
        formData.append("file", file);
        formData.append("filename", file.name);

        const endpoint = "/property/document-upload";
        const contentType = "multipart/form-data";
        const response = await PropertyServices.postCommon(
          endpoint,
          contentType,
          formData
        );
        console.log("files successfully uploaded", response);
        return response;
      });
      const responses = await Promise.all(uploadPromises);
      console.log(
        "All files successfully uploaded:",
        responses.map((res) => res.data)
      );
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  useEffect(() => {
    console.log("inputFields--", inputFields);
  }, [inputFields]);
  // const isApiCalled = useRef(false);

  useEffect(() => {
    if (
      requestData &&
      step === "1" &&
      (tabsValidation?.tab1Validation ||
        tabsValidation?.tab2Validation ||
        tabsValidation?.tab3Validation ||
        tabsValidation?.tab4Validation)
    ) {
      console.log("Triggered");
      addOrUpdateProperty();
    }
  }, [requestData, tabsValidation, fin]);

  const addOrUpdateProperty = async () => {
    try {
      let response;
      let contentType = "application/json";
      console.log("EditID---", mergedData?.id);
      console.log("newpropertyId---", newpropertyId);
      const EditID = mergedData?.id;
      let endpoint;
      if (EditID) {
        endpoint = `/property/${EditID}`;
      } else if (newpropertyId) {
        endpoint = `/property/${newpropertyId}`;
      } else {
        endpoint = `/property`;
      }

      // if (!EditID && newpropertyId) {
      //   return;
      // }
      const costFields = [
        "selling_costs",
        "purchase_costs",
        "closing_costs",
        "rehab_costs",
        "holding_costs",
      ];

      costFields.forEach((field) => {
        if (typeof requestData[field] === "string") {
          requestData[field] = Number(requestData[field]);
        }
      });
      console.log("requestData-add", requestData);
      if (EditID || newpropertyId) {
        response = await PropertyServices.patchCommon(
          endpoint,
          contentType,
          requestData
        );
      } else {
        response = await PropertyServices.postCommon(
          endpoint,
          contentType,
          requestData
        );
      }

      console.log(
        `Property ${EditID ? "updated" : "added"} successfully:`,
        response
      );

      const propertyId = EditID || response?.data?.id;
      console.log("newpropertyIdL", newpropertyId);
      if (!newpropertyId) {
        console.log("newpropertyIdLt", newpropertyId);
        setNewpropertyId(propertyId);
      }

      if (!propertyId) {
        console.error("Property ID not returned");
        toast.error("Error saving property. No property ID received.");
        return;
      }
      if (step === "1" && activeTab === "Property Description" && propertyId) {
        if (documentImages.length > 0) {
          await handleImageUpload(propertyId);
        }
        if (propertyImages.length > 0) {
          await handleImageUpload1(propertyId);
        }
      }

      if (fin === "fin") {
        const withId: any = [];
        const withoutId: any = [];

        financingForms.forEach((el) => {
          if (el.id) {
            withId.push(el);
          } else {
            withoutId.push(el);
          }
        });

        if (withoutId.length > 0) {
          await Finacingform(withoutId);
        }
        if (withId.length > 0) {
          await FinacingformUpdate(withId);
        }
      }

      console.log("final-tab", step, activeTab);
      if (step === "1" && activeTab === "Property Description") {
        console.log("final-fetchedData1", activeTab);
        // setTimeout(async() => {
        //   try{
        const response2 = await fetchPropertydetails(propertyId);

        const fetchedData = response2?.data;
        console.log("final-fetchedData--", fetchedData);
        setRequestData((prevValue: any) => ({
          ...prevValue,
          holding_costs: fetchedData.holding_costs
            ? String(fetchedData.holding_costs)
            : "",
          rehab_costs: fetchedData.rehab_costs
            ? String(fetchedData.rehab_costs)
            : "",
          rehab_cost_overrun: fetchedData.rehab_cost_overrun,
          rehab_cost_holding_period: fetchedData.rehab_cost_holding_period,
          clear_rehab_itemize_costs: fetchedData.clear_rehab_itemize_costs
            ? fetchedData.clear_rehab_itemize_costs
            : false,
          clear_holding_itemize_costs: fetchedData.clear_holding_itemize_costs
            ? fetchedData.clear_holding_itemize_costs
            : false,
          closing_costs: fetchedData.closing_costs
            ? String(fetchedData.closing_costs)
            : "",
          purchase_costs: fetchedData.purchase_costs
            ? String(fetchedData.purchase_costs)
            : "",
          purchase_price: fetchedData.purchase_price,
          clear_closing_itemize_costs: fetchedData.clear_closing_itemize_costs
            ? fetchedData.clear_closing_itemize_costs
            : false,
          clear_purchase_itemize_costs: fetchedData.clear_purchase_itemize_costs
            ? fetchedData.clear_purchase_itemize_costs
            : false,
          after_repair_value: fetchedData.after_repair_value,
          selling_costs: fetchedData.selling_costs
            ? String(fetchedData.selling_costs)
            : "",
          clear_selling_itemize_costs: fetchedData.clear_selling_itemize_costs
            ? fetchedData.clear_selling_itemize_costs
            : false,
        }));
        //   }catch(err){
        //     console.log('err fetch data', err);
        //   }
        //   // navigate("/property");
        // }, 500);
      }
      if (editObject) {
        if (tabsValidation.tab4Validation) {
          toast.success("Property updated successfully!");
          setTimeout(() => {
            setPageView("property");
          }, 500);
        }
      } else {
        if (tabsValidation.tab4Validation) {
          toast.success("Property added successfully!");
          setTimeout(() => {
            navigate("/property");
          }, 500);
        }
      }
    } catch (error) {
      console.error(
        `Error ${mergedData?.id ? "updating" : "adding"} property:`,
        error
      );
      toast.error(`Error ${mergedData?.id ? "updating" : "adding"} property`);
    } finally {
      if (step === "1") {
        let tabIndex = tabs.indexOf(activeTab);
        let tabIndexName = tabs[tabIndex + 1];
        setActiveTab(tabIndexName);
        setStep("");
        setLoading(false);
      }
      if (step === "0") {
        let tabIndex = tabs.indexOf(activeTab);
        let tabIndexName = tabs[tabIndex - 1];
        setActiveTab(tabIndexName);
        setStep("");
        setLoading(false);
      }
      // setActiveTab(activeTab);
    }
  };

  const handleDeleteClosingCost = async (id?: string, propertyId?: string) => {
    const propId = propertyId || newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (id) {
        const endpoint = `/property/${propId}/closing-costs/${id}`;
        console.log("Sending DELETE request:", endpoint);

        const response = await PropertyServices.deleteCommon(endpoint);
        console.log("Deleted successfully:", response);
      } else {
        const allClosingCostIds = inputFields3.map((item: any) => item.id);

        if (!allClosingCostIds?.length) {
          console.warn("No closing costs to delete.");
          return;
        }

        console.log("Deleting ALL closing costs...");
        for (const itemId of allClosingCostIds) {
          const endpoint = `/property/${propId}/closing-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All closing costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          closing_costs: null,
        }));
        setInputFields3([]);
      }

      const response2 = await fetchPropertydetails(propId);

      const closing_costs = response2?.data.closing_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        closing_costs: isBulkDelete ? null : closing_costs,
      }));
    } catch (error) {
      console.error("Error deleting closing cost(s):", error);
    }
  };

  const handleDeletePurchaseCost = async (id?: string, propertyId?: string) => {
    const propId = propertyId || newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (id) {
        const endpoint = `/property/${propId}/purchase-costs/${id}`;
        console.log("Sending DELETE request:", endpoint);

        const response = await PropertyServices.deleteCommon(endpoint);
        console.log("Deleted successfully:", response);
      } else {
        // Delete ALL purchase costs
        const allPurchaseCostIds = inputFields4.map((item: any) => item.id);

        if (!allPurchaseCostIds?.length) {
          console.warn("No purchase costs to delete.");
          return;
        }

        console.log("Deleting ALL purchase costs...");
        for (const itemId of allPurchaseCostIds) {
          const endpoint = `/property/${propId}/purchase-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All purchase costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          purchase_costs: null,
        }));
        setInputFields4([]);
      }

      const response2 = await fetchPropertydetails(propId);
      const purchase_costs = response2?.data.purchase_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        purchase_costs: isBulkDelete ? null : purchase_costs,
      }));
    } catch (error) {
      console.error("Error deleting purchase cost(s):", error);
    }
  };

  const handleDeleteHoldingCost = async (id?: string, propertyId?: string) => {
    const propId = propertyId || newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (id) {
        const endpoint = `/property/${propId}/holding-costs/${id}`;
        console.log("Sending DELETE request:", endpoint);

        const response = await PropertyServices.deleteCommon(endpoint);
        console.log("Deleted successfully:", response);
      } else {
        // Delete ALL holding costs
        const allHoldingCostIds = inputFields.map((item: any) => item.id);

        if (!allHoldingCostIds?.length) {
          console.warn("No holding costs to delete.");
          return;
        }

        console.log("Deleting ALL holding costs...");
        for (const itemId of allHoldingCostIds) {
          const endpoint = `/property/${propId}/holding-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All holding costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          holding_costs: null,
        }));
        setInputFields([]);
      }

      // Refresh property data
      const response2 = await fetchPropertydetails(propId);
      const holding_costs = response2?.data.holding_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        holding_costs: isBulkDelete ? null : holding_costs,
      }));
    } catch (error) {
      console.error("Error deleting holding cost(s):", error);
    }
  };

  const handleDeleteRehabCost = async (id?: string, propertyId?: string) => {
    const propId = propertyId || newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (id) {
        const endpoint = `/property/${propId}/rehab-costs/${id}`;
        console.log("Sending DELETE request:", endpoint);

        const response = await PropertyServices.deleteCommon(endpoint);
        console.log("Deleted successfully:", response);
      } else {
        // Delete ALL rehab costs
        const allRehabCostIds = inputFieldsrehab.map((item: any) => item.id);

        if (!allRehabCostIds?.length) {
          console.warn("No rehab costs to delete.");
          return;
        }

        console.log("Deleting ALL rehab costs...");
        for (const itemId of allRehabCostIds) {
          const endpoint = `/property/${propId}/rehab-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        console.log("All rehab costs deleted.");
        isBulkDelete = true;

        setRequestData((prevValue: any) => ({
          ...prevValue,
          rehab_costs: null,
        }));
        setInputFieldsrehab([]);
      }

      // Refresh the data
      const response2 = await fetchPropertydetails(propId);
      const rehab_costs = response2?.data.rehab_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        rehab_costs: isBulkDelete ? null : rehab_costs,
      }));
    } catch (error) {
      console.error("Error deleting rehab cost(s):", error);
    }
  };

  const handleDeleteSellingCost = async (id?: string, propertyId?: string) => {
    const propId = propertyId || newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing.");
      return;
    }

    try {
      let isBulkDelete = false;

      if (id) {
        const endpoint = `/property/${propId}/selling-costs/${id}`;
        console.log("Sending DELETE request:", endpoint);
        await PropertyServices.deleteCommon(endpoint);
        console.log("Deleted successfully");
      } else {
        const allSellingCostIds = inputFields2.map((item: any) => item.id);

        if (!allSellingCostIds?.length) {
          console.warn("No selling costs to delete.");
          return;
        }

        console.log("Deleting ALL selling costs...");
        for (const itemId of allSellingCostIds) {
          const endpoint = `/property/${propId}/selling-costs/${itemId}`;
          await PropertyServices.deleteCommon(endpoint);
        }

        isBulkDelete = true;

        setInputFields2([]);
        setRequestData((prevValue: any) => ({
          ...prevValue,
          selling_costs: null,
        }));
      }

      const response2 = await fetchPropertydetails(propId);

      setRequestData((prevValue: any) => ({
        ...prevValue,
        selling_costs: isBulkDelete ? null : response2?.data.selling_costs,
      }));
    } catch (error) {
      console.error("Error deleting selling cost(s):", error);
    }
  };

  const handleDeleteFinacing = async (id: string) => {
    const propId = newpropertyId || mergedData?.id;

    if (!propId) {
      console.error("Error: Property ID is missing for refresh.");
      return;
    }

    const endpoint = `/property/financing/${id}`;
    console.log("Sending DELETE request:", endpoint);

    try {
      const response = await PropertyServices.deleteCommon(endpoint);
      console.log("Deleted successfully:", response);

      const response2 = await finacingformfetch(propId);
      console.log("Updated financing data:", response2);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const postHoldingCosts = useCallback(async () => {
    try {
      setIsPopupOpenH(true);
      if (!newpropertyId) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFields || inputFields.length === 0) {
        console.warn("No holding costs to send.");
        return;
      }

      for (const item of inputFields) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${newpropertyId}/holding-costs/${item.id}`
          );
        }
      }

      const payload = inputFields.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(newpropertyId),
      }));

      const response = await PropertyServices.postCommon(
        "/property/holding-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post holding costs.");
        return;
      }
      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFields(upData);

      const response2 = await fetchPropertydetails(newpropertyId);
      const holding_costs = response2?.data.holding_costs;

      setRequestData((prev: any) => ({
        ...prev,
        holding_costs: String(holding_costs),
      }));

      console.log("Holding costs posted successfully:", response);
    } catch (error) {
      console.error("Error posting holding costs:", error);
    } finally {
      setIsPopupOpenH(false);
    }
  }, [newpropertyId, inputFields]);

  const sellingCosts = useCallback(async () => {
    try {
      setIsPopupOpenS(true);
      if (!newpropertyId) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFields2 || inputFields2.length === 0) {
        console.warn("No selling costs to send.");
        return;
      }

      for (const item of inputFields2) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${newpropertyId}/selling-costs/${item.id}`
          );
        }
      }

      const payload = inputFields2.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(newpropertyId),
      }));

      const response = await PropertyServices.postCommon(
        "/property/selling-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post selling costs.");
        return;
      }

      // setInputFields2(response.data);
      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFields2(upData);

      const response2 = await fetchPropertydetails(newpropertyId);
      const selling_costs = response2?.data.selling_costs;

      setRequestData((prev: any) => ({
        ...prev,
        selling_costs: String(selling_costs),
        // clear_selling_itemize_costs:false
      }));
    } catch (error) {
      console.error("Error posting selling costs:", error);
    } finally {
      setIsPopupOpenS(false);
    }
  }, [newpropertyId, inputFields2]);


  useEffect(() => {
    console.log(requestData,"requestData")
  },[requestData])  
  
  const closingCosts = useCallback(async () => {
    try {
      setIsPopupOpenC(true);
      if (!newpropertyId) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFields3 || inputFields3.length === 0) {
        console.warn("No closing costs to send.");
        return;
      }

      for (const item of inputFields3) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${newpropertyId}/closing-costs/${item.id}`
          );
        }
      }

      const payload = inputFields3.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(newpropertyId),
        purchase_price: purchasePrice ? Number(purchasePrice) : requestData.purchase_price,
      }));

      const response = await PropertyServices.postCommon(
        "/property/closing-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post closing costs.");
        return;
      }

      // setInputFields3(response.data);
      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFields3(upData);

      const response2 = await fetchPropertydetails(newpropertyId);
      console.log("res-last", response2);
      const closing_costs = response2?.data.closing_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        closing_costs: String(closing_costs),
      }));

      console.log("Closing costs posted successfully:", response);
      // toast.success("Closing costs added successfully!");
    } catch (error) {
      console.error("Error posting closing costs:", error);
      // toast.error("Error adding closing costs.");
    } finally {
      setIsPopupOpenC(false);
    }
  }, [newpropertyId, inputFields3]);

  const rehabCosts = useCallback(async () => {
    try {
      setIsPopupOpenR(true);
      if (!newpropertyId) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFieldsrehab || inputFieldsrehab.length === 0) {
        console.warn("No Rehab costs to send.");
        return;
      }

      for (const item of inputFieldsrehab) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${newpropertyId}/rehab-costs/${item.id}`
          );
        }
      }

      const payload = inputFieldsrehab.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(newpropertyId),
      }));

      const response = await PropertyServices.postCommon(
        "/property/rehab-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post rehab costs.");
        return;
      }

      // setInputFieldsrehab(response.data);
      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFieldsrehab(upData);

      const response2 = await fetchPropertydetails(newpropertyId);
      const rehab_costs = response2?.data.rehab_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        rehab_costs: String(rehab_costs),
      }));

      console.log("Rehab costs posted successfully:", response);
      // toast.success("Rehab costs added successfully!");
    } catch (error) {
      console.error("Error posting Rehab costs:", error);
      // toast.error("Error adding Rehab costs.");
    } finally {
      setIsPopupOpenR(false);
    }
  }, [newpropertyId, inputFieldsrehab]);

  const purchaseCosts = useCallback(async () => {
    try {
      setIsPopupOpenP(true);
      if (!newpropertyId) {
        console.warn("No property ID available.");
        return;
      }

      if (!inputFields4 || inputFields4.length === 0) {
        console.warn("No purchase costs to send.");
        return;
      }

      for (const item of inputFields4) {
        if (item.id) {
          await PropertyServices.deleteCommon(
            `/property/${newpropertyId}/purchase-costs/${item.id}`
          );
        }
      }

      const payload = inputFields4.map(({ id, amount, ...rest }) => ({
        ...rest,
        amount: Number(amount),
        property_id: String(newpropertyId),
         purchase_price: purchasePrice ? Number(purchasePrice) : requestData.purchase_price,
      }));

      const response = await PropertyServices.postCommon(
        "/property/purchase-costs",
        "application/json",
        payload
      );

      if (!response?.data) {
        console.error("Failed to post purchase costs.");
        return;
      }

      // setInputFields4(response.data);
      const r: ItemType[] = response.data;

      const upData = r.map(({ amount, ...rest }) => ({
        ...rest,
        amount: String(amount),
      }));
      setInputFields4(upData);

      const response2 = await fetchPropertydetails(newpropertyId);
      const purchase_costs = response2?.data.purchase_costs;

      setRequestData((prevValue: any) => ({
        ...prevValue,
        purchase_costs: String(purchase_costs),
      }));

      console.log("Purchase costs posted successfully:", response);
      // toast.success("Purchase costs added successfully!");
    } catch (error) {
      console.error("Error posting purchase costs:", error);
      // toast.error("Error adding purchase costs.");
    } finally {
      setIsPopupOpenP(false);
    }
  }, [newpropertyId, inputFields4]);

  const fetchPropertydetails = async (propertyId: string) => {
    try {
      const endpoint = `/property/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);
    
      return response;
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };
  const fetchHoldingCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/holding-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        // setInputFields(response.data);
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFields(upData);
      }
    } catch (error) {
      console.error("Error fetching holding costs:", error);
    }
  };
  const fetchSellingCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/selling-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        // setInputFields2(response.data);
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFields2(upData);
      }
    } catch (error) {
      console.error("Error fetching selling costs:", error);
    }
  };
  const fetchClosingCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/closing-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        // setInputFields3(response.data);
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFields3(upData);
      }
    } catch (error) {
      console.error("Error fetching closing costs:", error);
    }
  };
  const fetchRehabCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/rehab-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        // setInputFieldsrehab(response.data);
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFieldsrehab(upData);
      }
    } catch (error) {
      console.error("Error fetching rehab costs:", error);
    }
  };
  const fetchPurchaseCosts = async (propertyId: string) => {
    try {
      const endpoint = `/property/purchase-costs/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        // setInputFields4(response.data);
        const r: ItemType[] = response.data;

        const upData = r.map(({ amount, ...rest }) => ({
          ...rest,
          amount: String(amount),
        }));
        setInputFields4(upData);
      }
    } catch (error) {
      console.error("Error fetching purchase costs:", error);
    }
  };

  const finacingformfetch = async (propertyId: string) => {
    try {
      const endpoint = `/property/financing/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data?.length > 0) {
        setFinancingForms(response.data);
      } else {
        setFinancingForms([
          {
            loan_label: "",
            financing_of_type_id: "",
            down_payment_type: "",
            down_payment: null,
            rehab_down_payment: null,
            interest_rate: null,
            loan_term: null,
            loan_type_id: "",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching purchase costs:", error);
    }
  };

  const fetchimage = async (propertyId: string) => {
    try {
      const endpoint = `/property/images/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        const imageUrls = response.data.map((img: { url: string }) => img.url);
        setPropertyImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching Property images:", error);
    }
  };
  const fetchDocuments = async (propertyId: string) => {
    try {
      const endpoint = `/property/documents/${propertyId}`;
      const response = await PropertyServices.getCommonDropdown(endpoint);

      if (response?.data) {
        const documentUrls = response.data.map(
          (doc: { url: string }) => doc.url
        );
        setDocumentImages(documentUrls);
      }
    } catch (error) {
      console.error("Error fetching Property Documents:", error);
    }
  };

  useEffect(() => {
    if (mergedData?.id) {
      const propertyId = mergedData.id;
      fetchHoldingCosts(propertyId);
      fetchSellingCosts(propertyId);
      fetchClosingCosts(propertyId);
      fetchRehabCosts(propertyId);
      fetchPurchaseCosts(propertyId);
      finacingformfetch(propertyId);
      fetchimage(propertyId);
      fetchDocuments(propertyId);
    }
  }, [mergedData?.id]);

  useEffect(() => {
    if (activeTab === "Purchase" && newpropertyId) {
      finacingformfetch(newpropertyId);
    }
  }, [activeTab, newpropertyId]);

  const Finacingform = async (withoutId: any) => {
    try {
      const endpoint = "/property/financing/create";
      const contentType = "application/json";

      if (!financingForms || financingForms.length === 0) {
        console.warn("No purchase Costs to send.");
        return;
      }
      const Finacing = withoutId.map((field: any) => ({
        interest_rate: Number(field.interest_rate) || 0,
        financing_of_type_id: String(field.financing_of_type_id),
        down_payment_type: String(field.down_payment_type),
        property_id: String(newpropertyId) || String(mergedData.id),
        down_payment: Number(field.down_payment) || 0,
        rehab_down_payment: Number(field.rehab_down_payment) || 0,
        loan_type_id:
          field.loan_type_id != "" ? String(field.loan_type_id) : null,
        loan_label: String(field.loan_label),
        loan_term: Number(field.loan_term) || 0,
      }));

      console.log("Posting Finacing Costs:", Finacing);

      const response = await PropertyServices.postCommon(
        endpoint,
        contentType,
        Finacing
      );

      console.log("Finacing posted successfully:", response);
      // toast.success("Finacing added successfully!");
    } catch (error) {
      console.error("Error posting Finacing:", error);
      // toast.error("Error adding Finacing.");
    }
  };

  const FinacingformUpdate = async (withId: any) => {
    try {
      if (!mergedData?.id) {
        console.error("Error: No property ID provided.");
        return;
      }

      if (!financingForms || financingForms.length === 0) {
        console.warn("No financing data available for update.");
        return;
      }

      const contentType = "application/json";

      // Ensure only valid financing records are processed
      const validFinancingForms = financingForms.filter(
        (field: any) => field.id
      );

      if (validFinancingForms.length === 0) {
        console.warn("No valid financing records with an ID to update.");
        return;
      }

      // Update only specific fields
      const updatePromises = withId.map(async (field: any) => {
        const endpoint = `/property/financing/${field.id}`;

        const updatedData = {
          interest_rate: field.interest_rate,
          financing_of_type_id: field.financing_of_type_id,
          down_payment_type: field.down_payment_type,
          down_payment: field.down_payment,
          rehab_down_payment: field.rehab_down_payment,
          loan_type_id: field.loan_type_id != "" ? field.loan_type_id : null,
          loan_label: field.loan_label,
          loan_term: field.loan_term,
          property_id: mergedData.id,
        };

        console.log(`Updating Financing ID: ${field.id}`, updatedData);

        return PropertyServices.patchCommon(endpoint, contentType, updatedData);
      });

      const responses = await Promise.all(updatePromises);

      console.log("All Financing records updated successfully:", responses);
    } catch (error: any) {
      console.error("Error updating financing:", error);

      // const errorMessage =
      //   error?.response?.data?.message ||
      //   "Error updating financing. Please try again.";

      // toast.error(errorMessage);
    }
  };

  const handleFileChange =
    (setImages: React.Dispatch<React.SetStateAction<File[]>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files).slice(0, 5);
        setImages((prev) => [...prev, ...newImages]);
      }
    };

  const handleRemoveImage =
    (
      index: number,
      setImages: React.Dispatch<React.SetStateAction<File[]>>,
      images: File[]
    ) =>
    () => {
      setImages(images.filter((_, i) => i !== index));
    };

  const handleClick = (id: string) => {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const fetchPropertyTypes = useCallback(async () => {
    try {
      const endpoint = "/master/property_types";
      const response: AxiosResponse<any> =
        await PropertyServices.getCommonDropdown(endpoint);
      console.log("test---", response);
      if (Array.isArray(response.data)) {
        setPropertyTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  }, []);

  const fetchInvestmentStrategies = useCallback(async () => {
    try {
      const endpoint = "/master/investment_strategies";
      const response: AxiosResponse<any> =
        await PropertyServices.getCommonDropdown(endpoint);
      console.log("test1---", response.data);
      if (Array.isArray(response.data)) {
        setStrategies(response.data);
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  }, []);
  const fetchstates = useCallback(async () => {
    try {
      const endpoint = "/master/states";
      const response: AxiosResponse<any> =
        await PropertyServices.getCommonDropdown(endpoint);
      console.log("test2fetchstates---", response.data);
      if (Array.isArray(response.data)) {
        const formattedStates = response.data.map((state: any) => ({
          label: state.name,
          value: state.id,
        }));
        setStateOptions(formattedStates);
      }
    } catch (error) {
      console.error("Error fetching states types:", error);
    }
  }, []);

 
  const [isCityLoading, setIsCityLoading] = useState(false);

  const fetchCities = async (stateId: string) => {
  if (!stateId) return [];

  try {
    const endpoint = `/master/cities?state_id=${stateId}`;
    const response: AxiosResponse<any> = await PropertyServices.getCommonDropdown(endpoint);

    if (Array.isArray(response.data)) {
      return response.data.map((city: any) => ({
        label: city.name,
        value: city.id,
      }));
    }

    return [];
  } catch (error) {
    console.error("fetchCities - Error fetching cities:", error);
    return [];
  }
};


  const fetchcity = useCallback(async (cityName = "", request?:any) => {
    if (!stateId) {
      setCityOptions([]);
      return Promise.resolve([]);
    }
    setIsCityLoading(true); // Set loading state
    try {
      const endpoint = `/master/cities?state_id=${stateId}`;
      const response: AxiosResponse<any> =
        await PropertyServices.getCommonDropdown(endpoint);
      if (Array.isArray(response.data)) {
        const formattedcity = response.data.map((city: any) => ({
          label: city.name,
          value: city.id,
        }));
        setCityOptions(formattedcity);

        // Find the city by name (case-insensitive)
        const selectedCity = formattedcity.find(
          (option) => option.label.toLowerCase() === cityName?.toLowerCase()
        );
        const cityId = selectedCity ? selectedCity?.value : "";

        // Wait for cityOptions to be set before updating form values
        if (request && cityId) {
          // Use a short delay to ensure cityOptions are set before updating value
          setTimeout(() => {
        request.city = cityId;
        setValue("city", cityId);
        setDirectCity(cityName);

        setRequestData((prev: any) => ({
          ...prev,
          ...request,
        }));
          }, 100); // 100ms is usually enough
        } else if (cityId) {
          setTimeout(() => {
        setValue("city", cityId);
        setDirectCity(cityName);
          }, 100);
        }
      } else {
        setCityOptions([]);
        return Promise.resolve([]);
      }
    } catch (error) {
      console.error("fetchcity - Error fetching cities:", error);
      setCityOptions([]);
      return Promise.reject(error);
    } finally {
      setIsCityLoading(false); // Reset loading state
    }
  }, [stateId]);

  const fetchTagsAndLabels = useCallback(async () => {
    try {
      const endpoint = "/users/get-user-tags"; // Same endpoint as per your requirement
      const response: AxiosResponse<any> =
        await PropertyServices.getCommonDropdown(endpoint);
      console.log("Fetched Tags and Labels:", response.data);

      if (Array.isArray(response.data)) {
        const formattedTags = response.data.map((tag: string) => ({
          value: tag.trim(),
          label: tag.trim(),
        }));
        setTagOptions(formattedTags); // Update the state with formatted options
      }
    } catch (error) {
      console.error("Error fetching tags and labels:", error);
    }
  }, []);

  useEffect(() => {
    fetchPropertyTypes();
    fetchInvestmentStrategies();
    fetchstates();
    fetchcity();
    fetchTagsAndLabels();

    console.log("strategies", strategies);
    console.log("propertyTypes", propertyTypes);
  }, [
    fetchPropertyTypes,
    fetchInvestmentStrategies,
    fetchstates,
    fetchcity,
    fetchTagsAndLabels,
  ]);

  useEffect(() => {
    setRequestData((prev: any) => ({
      ...prev,
      investment_strategy_id: selectedStrategy !== "" ? selectedStrategy : null,
    }));
  }, [selectedStrategy]);

  const handleNavigation = () => {
    // if (mergedData?.id) {
    //   setPageView("property");
    // } else {
    navigate("/property");
    // }
  };

  // useEffect(() => {
  //   if (mergedData?.state) {
  //     setStateId(mergedData.state);
  //     setValue("state", mergedData.state);
  //   }
  //   if (mergedData?.city) {
  //     setValue("city", mergedData.city);
  //   }
  //   if (mergedData?.zip_code) {
  //     setValue("zip_code", mergedData.zip_code);
  //   }
  //   if (mergedData?.address) {
  //     setValue("address", mergedData.address);
  //     setDirectState(
  //       stateOptions.find((opt) => opt.value === mergedData.state)?.label || ""
  //     );
  //     setDirectCity(
  //       cityOptions.find((opt) => opt.value === mergedData.city)?.label || ""
  //     );
  //     setDirectZipCode(mergedData.zip_code);
  //     setAddressFieldsLocked(true);
  //   }
  // }, [mergedData, stateOptions, cityOptions, setValue]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  // Watch form values for dynamic changes
  const stateValue = watch("state");
  const cityValue = watch("city");
  const zipCodeValue = watch("zip_code");

  // Handler for when an address is selected from autocomplete
  // Improved handleAddressSelect function
  const handleAddressSelect = async (addressData: {
    fullAddress: string;
    state: string;
    city: string;
    zip_code: string;
    lat?: string;
    lng?: string;
  }) => {
    // Set the address value
    setValue("address", addressData.fullAddress);
    const selectedState = stateOptions.find(
      (option) =>
        option.label.trim().toLowerCase() ===
        addressData.state.trim().toLowerCase()
    );
    const stateId = selectedState ? selectedState.value : "";

 const cities = await fetchCities(stateId);

    const selectedCity = cities.find(
      (option) =>
        option.label.trim().toLowerCase() ===
        addressData.city.trim().toLowerCase()
    );

    // Update stateId and form state
    setStateId(stateId);
    setValue("state", stateId);
    console.log("Set stateId:", stateId, "Set form state:", stateId);

    // Store the display values
    setDirectState(addressData.state);
    setDirectZipCode(addressData.zip_code);

    // Wait for cityOptions to be populated
    
     setCityOptions(cities);


    const cityId = selectedCity ? selectedCity.value : "";

    // Handle missing city
    if (!selectedCity) {
      // Retry fetching cities after a delay
      setTimeout(async () => {
        // await fetchcity();
        const retrySelectedCity = cities.find(
          (option) =>
            option.label.toLowerCase() === addressData.city.toLowerCase()
        );
        if (retrySelectedCity) {
          setValue("city", retrySelectedCity.value);
          setDirectCity(addressData.city);
          setAddressFieldsLocked(true);
        } else {
          toast.error(
            `City "${addressData.city}" not found for state "${addressData.state}". Please select a city manually.`
          );
          setAddressFieldsLocked(false);
          setValue("city", "");
          setDirectCity("");
        }
      }, 1000); // Wait 1 second for fetch to complete
    } else {
      setValue("city", cityId);
      setDirectCity(addressData.city);
      setAddressFieldsLocked(true);
    }

    // Set zip code
    setValue("zip_code", addressData.zip_code);

    // Update requestData with IDs
    setRequestData((prev: any) => ({
      ...prev,
      address: addressData.fullAddress,
      state: stateId,
      city: cityId,
      zip_code: addressData.zip_code,
    }));
  };
  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/,/g, "");
    if (!isNaN(Number(numericValue))) {
      return new Intl.NumberFormat("en-US").format(Number(numericValue));
    }
    return value;
  };
  const handlePurchasePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setFormattedPurchasePrice("");
      setValue("purchase_price", 0, { shouldValidate: true });
      return;
    }
    const formatted = formatNumberWithCommas(rawValue);
    setFormattedPurchasePrice(formatted);
    setValue("purchase_price", Number(rawValue), { shouldValidate: true });
  };
  // Function to reset address fields if needed
  const resetAddressFields = () => {
    setAddressFieldsLocked(false);
    setDirectCity("");
    setDirectState("");
    setDirectZipCode("");
    setValue("address", "");
    setValue("raw_city", "");
    setValue("raw_state", "");
    setValue("zip_code", "");
  };
  // Make sure fetchcity is called when state changes
  useEffect(()=>{
    fetchcity();
  },[])
  // useEffect(() => {
  //    if (stateId) {
  //     fetchcity();
  //    }
  // }, [stateId, fetchcity]);
  console.log("stateOptions:", stateOptions);
  console.log("cityOptions:", cityOptions);

  return (
    <>
      <div className="bg-[#F4F7FC] h-screen p-6 overflow-auto pb-10">
        <h1 className="text-2xl mb-4 text-[#423E76] font-bold">
          {" "}
          {mergedData?.id ? "Edit Property" : "Add Property"}
        </h1>
        <div className="flex flex-wrap justify-between pt-4 mb-4 items-center">
          <nav className="text-main text-base mb-2 sm:mb-0 flex items-center justify-center gap-1">
            <span className="text-main font-semibold flex items-center justify-between gap-1">
              Explore Property <FaAngleRight />
              <span className="cursor-pointer" onClick={handleNavigation}>
                Property List
              </span>
              <FaAngleRight /> Default <FaAngleRight />
            </span>
            <span className="text-main font-semibold">
              {mergedData?.id ? "Edit Property" : "Add Property"}
            </span>
          </nav>
        </div>
        {/* Tabs Section */}
        <div className="flex  bg-white shadow-md text-gray-500 rounded-md justify-center sm:justify-center mb-3">
          <div
            className=" flex  p-2  overflow-auto whitespace-nowrap"
            style={{ width: "fit-content" }}
          >
            <div className="flex items-center space-x-4">
              {tabs.map((tab, index) => (
                <div key={tab} className="flex items-center">
                  {index != 0 && (
                    <span className="px-1 pr-2 text-gray-500">
                      <FaAngleRight />
                    </span>
                  )}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-base font-bold ${
                      tab === activeTab
                        ? "bg-whsale text-white"
                        : index < tabs.indexOf(activeTab)
                        ? "bg-whsale text-white"
                        : "bg-bgPurple text-whsale"
                    }`}
                  >
                    {index + 1}
                  </div>{" "}
                  <span
                    className={`ml-2 text-base font-medium ${
                      tab === activeTab
                        ? "text-whsale"
                        : index < tabs.indexOf(activeTab)
                        ? "text-whsale"
                        : "text-whsale"
                    }`}
                  >
                    {tab}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Tab Content */}
        {activeTab === "Property Description" && (
          <>
            <form>
              <div className="bg-white p-6 rounded-md shadow-md py-2">
                <h3 className="text-xl text-[#000929] mb-3 font-bold ">
                  Strategy
                </h3>
                {/* Investment Strategy Toggle */}
                <div className="flex items-center gap-6 mb-2">
                  <label className="text-gray-700 font-medium">
                    Investment Strategy
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setInvestmentStrategy((prev) => !prev);
                      setSelectedStrategy("");
                    }}
                    className={`relative w-20 h-8 flex items-center rounded-full px-2 transition-colors duration-300 ${
                      investmentStrategy ? "bg-[#423E76]" : "bg-purple-100"
                    }`}
                  >
                    {/* Toggle Circle */}
                    <div
                      className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 absolute ${
                        investmentStrategy
                          ? "translate-x-[48px] bg-white"
                          : "translate-x-0 bg-[#423E76]"
                      }`}
                    ></div>

                    {/* "Yes" Text */}
                    <span
                      className={`text-xs font-semibold z-10 transition-opacity duration-300 ${
                        investmentStrategy
                          ? "opacity-100 text-white pl-2"
                          : "opacity-0"
                      }`}
                    >
                      Yes
                    </span>

                    {/* "No" Text */}
                    <span
                      className={`text-xs font-semibold z-10 transition-opacity duration-300 ${
                        !investmentStrategy
                          ? "opacity-100 text-[#423E76] pl-4"
                          : "opacity-0"
                      }`}
                    >
                      No
                    </span>
                  </button>
                </div>

                {/* Select Strategy Dropdown - Only Enabled When Investment Strategy is ON */}
                <div className="py-2">
                  <label>Select Strategy</label>
                  <Select
                    className="bg-bgPurple col-span-12 sm:col-span-6 lg:col-span-6 flex items-center mb-4  w-full max-w-[70%] "
                    width="min-w-[182px]"
                    // label="Select Strategy"
                    options={strategies.map((strategy) => ({
                      value: strategy.id,
                      label: strategy.name,
                    }))}
                    register={register("investment_strategy_id")}
                    value={selectedStrategy}
                    onChange={(e: any) => {
                      setSelectedStrategy(e.target.value);
                      register("investment_strategy_id").onChange(e);
                    }}
                    disabled={!investmentStrategy}
                  />
                </div>
              </div>

              <div className="bg-white p-6 mt-3 rounded-md shadow-md">
                {/* Property Section */}
                <h3 className="text-2xl text-black-600 mb-3 font-semibold">
                  Property Details
                </h3>
                <div className="flex flex-col items-start gap-1 py-1">
                  <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px] ">
                    Property Name <span className="text-main">*</span>
                  </label>
                  <Input
                    label="Property Name"
                    type="text"
                    placeholder={
                      (errors.title?.message as string) ?? "Property Name"
                    }
                    register={register("title")}
                    className="w-full"
                    width="w-full"
                    error={errors.title}
                  />
                </div>
                <div className="flex flex-col items-start gap-1 py-1">
                  <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                    Short Description <span className="text-main">*</span>
                  </label>
                  <div className="flex-1 w-full">
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      placeholder="Add a short description of this property"
                      className={`bg-bgPurple w-full min-h-[20px] border rounded-[10px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors?.description.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 w-full pu-1">
                  <label className=" w-40 min-w-[160px]">
                    Tags & Labels <span className="text-main">*</span>
                  </label>
                  <div className="flex-grow h-auto min-h-[48px] w-full">
                    <Controller
                      name="tags_n_labels"
                      control={control}
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          options={tagOptions}
                          isMulti
                          placeholder="Tags & Labels"
                          components={{ DropdownIndicator: null }}
                          styles={{
                            ...customStyles,
                            control: (base) => ({
                              ...base,
                              minHeight: "48px",
                              height: "auto",
                              borderRadius: "10px",
                              overflowY: "auto",
                              maxHeight: "120px",
                              color: "white",
                              backgroundColor: "#f7f7fd",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              flexWrap: "wrap",
                              maxHeight: "100px",
                              overflowY: "auto",
                              color: "white",
                            }),
                            multiValue: (base) => ({
                              ...base,
                              maxWidth: "100%",
                              color: "black",
                              backgroundColor: "#d1fae5",
                              borderRadius: "5px",
                            }),
                          }}
                          className="w-full bg-bgPurple border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={
                            field.value
                              ? field.value.split(",").map((tag: string) => ({
                                  value: tag.trim(),
                                  label: tag.trim(),
                                }))
                              : []
                          }
                          onChange={(selectedOptions) => {
                            const selectedString = selectedOptions
                              .map((option) => option.value)
                              .join(",");
                            field.onChange(selectedString);
                          }}
                          onCreateOption={(inputValue) => {
                            if (inputValue.trim() === "") return;
                            const newTags = field.value
                              ? `${field.value},${inputValue}`
                              : inputValue;
                            field.onChange(newTags);
                          }}
                        />
                      )}
                    />
                    {errors.tags_n_labels && (
                      <p className="border-red-500 focus:ring-red-500 placeholder-red-500 text-red-500 text-sm mt-1">
                        {errors.tags_n_labels.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 mt-3 rounded-md shadow-md">
                {/* Address Section */}
                <h3 className="text-2xl text-black-600 mb-3 font-semibold">
                  Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1 py-1">
                    <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <AddressAutocomplete
                            defaultValue={field.value}
                            onAddressSelect={handleAddressSelect}
                            placeholder={
                              (errors.title?.message as string) ??
                              "Street Address"
                            }
                            className="w-full bg-bgPurple"
                          />
                        )}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State/Region field - display-only when locked */}
                  <div className="flex flex-col items-start gap-1 py-1">
                    <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                      State/Region <span className="text-red-500">*</span>
                    </label>
                    {addressFieldsLocked ? (
                      <div className="w-full h-12 px-3 py-3 border border-gray-300 rounded-lg bg-gray-100">
                        {directState}
                      </div>
                    ) : (
                      <Controller
                        name="state"
                        control={control}
                        rules={{ required: "State/Region is required" }}
                        render={({ field }) => (
                          <Select1
                            {...field}
                            options={stateOptions}
                            getOptionLabel={(option: StateOption) =>
                              option.label
                            }
                            getOptionValue={(option: StateOption) =>
                              option.value
                            }
                            className="w-full h-12 bg-bgPurple"
                            placeholder="Select State/Region"
                            isClearable
                            isLoading={loading}
                            isSearchable={true}
                            value={
                              stateOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(newValue: StateOption | null) => {
                              const newStateId = newValue?.value || "";
                              field.onChange(newStateId);
                              setStateId(newStateId);
                              setValue("city", ""); // Clear city when state changes
                              setRequestData((prev: any) => ({
                                ...prev,
                                state: newStateId,
                                city: "",
                              }));
                            }}
                            styles={{
                              control: (base, { isFocused }) => ({
                                ...base,
                                height: "48px",
                                borderRadius: "10px",
                                backgroundColor: "#f7f7fd",
                                borderColor: isFocused ? "#3b82f6" : "#d1d5db",
                                boxShadow: isFocused
                                  ? "0 0 0 2px #3b82f6"
                                  : "none",
                                "&:hover": { borderColor: "#3b82f6" },
                              }),
                              indicatorSeparator: () => ({
                                display: "none",
                              }),
                              indicatorsContainer: (base) => ({
                                ...base,
                                paddingRight: "8px",
                              }),
                            }}
                          />
                        )}
                      />
                    )}
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* City field - display-only when locked */}
                  <div className="flex flex-col items-start gap-1 py-1">
                    <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                      City <span className="text-red-500">*</span>
                    </label>
                    {addressFieldsLocked ? (
                      <div className="w-full h-12 px-3 py-3 border border-gray-300 rounded-lg bg-gray-100">
                        {directCity}
                      </div>
                    ) : (
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <Select1
                            {...field}
                            options={cityOptions}
                            getOptionLabel={(option: StateOption) =>
                              option.label
                            }
                            getOptionValue={(option: StateOption) =>
                              option.value
                            }
                              className="w-full h-12 bg-bgPurple"
                              placeholder="Select City"
                              isClearable
                            isLoading={loading}
                              isSearchable={true}
                              value={cityOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                                }
                              onChange={(newValue: StateOption | null) => {
                                const newCityId = newValue?.value || "";
                                field.onChange(newCityId);
                                setRequestData((prev: any) => ({
                                  ...prev,
                                  city: newCityId,
                                }));
                              }}
                              styles={{
                                control: (base, { isFocused }) => ({
                                  ...base,
                                  height: "48px",
                                  borderRadius: "10px",
                                  borderColor: isFocused ? "#3b82f6" : "#d1d5db",
                                  backgroundColor: "#f7f7fd",
                                  boxShadow: isFocused ? "0 0 0 2px #3b82f6" : "none",
                                  "&:hover": { borderColor: "#3b82f6" },
                                }),
                              }}
                            />
                        )}
                      />
                    )}
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* ZIP/Postal Code field - display-only when locked */}
                  <div className="flex flex-col items-start gap-1 py-1">
                    <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    {addressFieldsLocked ? (
                      <div className="w-full h-12 px-3 py-3 border border-gray-300 rounded-lg bg-gray-100">
                        {directZipCode}
                      </div>
                    ) : (
                      <Input
                        label="ZIP/Postal Code"
                        type="text"
                        placeholder={
                          (errors.title?.message as string) ?? "ZIP/Postal Code"
                        }
                        register={register("zip_code")}
                        className="w-full"
                        error={errors.zip_code}
                        width="w-full"
                      />
                    )}
                  </div>

                  {/* Add an edit button to reset fields if needed */}
                  {addressFieldsLocked && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={resetAddressFields}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit Address Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 mt-3 rounded-md shadow-sm">
                {/* Description Section */}
                <h3 className="text-xl text-black-600 mb-3 font-semibold">
                  Description
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-4 w-full">
                    <label className="text-[#000929] font-medium text-sm w-40 min-w-[160px]">
                      Property Type <span className="text-main">*</span>
                    </label>
                    <Select
                      width="min-w-[147px]"
                      className="flex items-center w-full mt-1"
                      required
                      register={register("property_type_id")}
                      value={ptI}
                      onChange={(e) => {
                        setPtI(e.target.value);
                        register("property_type_id").onChange(e);
                      }}
                      error={errors.property_type_id?.message}
                      options={propertyTypes.map((type) => ({
                        value: type.id,
                        label: type.name,
                      }))}
                    />
                    {errors.property_type_id && (
                      <p className="text-red-500 text-sm mt-1 flex items-center justify-center sm:justify-end mr-[135px]">
                        {errors.property_type_id.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem]">
                      Bedrooms
                    </label>
                    <Input
                      label="Bedrooms"
                      type="number"
                      placeholder="Bedrooms"
                      register={register("bedrooms")}
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem]">
                      Bathrooms
                    </label>
                    <Input
                      label="Bathrooms"
                      type="number"
                      placeholder="Bathrooms"
                      register={register("bathrooms")}
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem] min-w-[145px]">
                      Square Footage
                    </label>
                    <Input
                      label="Square Footage"
                      type="number"
                      placeholder="Square Footage"
                      register={register("square_feet")}
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem] min-w-[145px]">
                      Year Built
                    </label>
                    <Input
                      label="Year Built"
                      type="number"
                      placeholder="Year Built"
                      register={register("year_built")}
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem]">
                      Parking
                    </label>
                    <select
                      {...register("parking")}
                      className="w-full mt-1 h-12 p-3 border rounded-[10px] focus:outline-none focus:ring-2 bg-bgPurple"
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem] min-w-[145px]">
                      Lot Size
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        label="Lot Size"
                        type="number"
                        placeholder="Enter Lot Size"
                        register={register("lot_size")}
                        className="w-full mt-1"
                        width="w-full"
                      />
                      <select
                        {...register("lot_size_type")}
                        className="w-24 mt-1 h-12 p-3 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-bgPurple"
                      >
                        <option value="Acres">Acres</option>
                        <option value="Sqft">Sqft</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem]">
                      Zoning
                    </label>
                    <Input
                      label="Zoning"
                      type="text"
                      placeholder="Enter Zoning"
                      register={register("zoning")} // Ensure 'zoning' is registered in the form
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-4 w-full mb-4">
                    <label className="text-[#000929] font-medium text-sm w-48 max-sm:w-[18rem]">
                      MLS Number
                    </label>
                    <Input
                      label="MLS Number"
                      type="text"
                      placeholder="MLS Number"
                      register={register("mls_number")}
                      className="w-full mt-1"
                      width="w-full"
                    />
                  </div>
                     {/* <div className="col-span-12 lg:col-span-4 w-full mb-4">
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
                              </div> */}
                </div>
              </div>

              <div className="bg-white p-6 mt-3 rounded-md shadow-sm">
                {/* Notes Section */}
                <h3 className="text-xl text-black-600 mb-3 font-semibold">
                  Notes
                </h3>
                <label className="block text-[#000929] font-medium text-sm mb-1">
                  Add Notes
                </label>
                <textarea
                  placeholder=" Include any notes, external links, or additional details related to this property"
                  className={`bg-bgPurple w-full h-32 p-3 border rounded-[10px] focus:outline-none focus:ring-2`}
                  {...register("notes")}
                ></textarea>
              </div>
              <div className="flex justify-between justify-between w-full gap-4">
                {/* Upload Section */}

                <div className="bg-white p-6 mt-3 rounded-md shadow-md w-1/2 flex-1 min-h-full">
                  <h3 className="text-xl text-[#000929] mb-2 font-bold">
                    Upload Property Images
                  </h3>
                  <div
                    className="upload"
                    onClick={() => handleClick("propertyFileInput")}
                  >
                    <div className="property">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="36"
                        height="36"
                      >
                        <path d="M6.5 10a5.5 5.5 0 0110.906-1.346A4.502 4.502 0 0118 19H6a4 4 0 01-1.051-7.857A5.49 5.49 0 016.5 10zM13 14h3l-4-4-4 4h3v4h2v-4z" />
                      </svg>
                    </div>
                    <p className="drag">Drag & Drop file or browse</p>
                    <p className="format">
                      (File supported .jpg, .jpeg and .png & Max file size: 25
                      MB)
                    </p>
                    <input
                      type="file"
                      id="propertyFileInput"
                      style={{ display: "none" }}
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileChange(setPropertyImages)}
                      multiple
                    />
                  </div>

                  {/* Image Preview */}
                  {propertyImages?.length > 0 && (
                    <>
                      {" "}
                      <h6 className="block text-gray-700 font-regular mb-1 pt-6">
                        Uploaded Images
                      </h6>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {propertyImages.map((imageUrl, index) => {
                          const imageSrc =
                            imageUrl instanceof File
                              ? URL.createObjectURL(imageUrl)
                              : imageUrl;

                          return (
                            <div key={index} className="relative w-32 h-32">
                              <img
                                src={imageSrc}
                                alt="Uploaded"
                                className="w-full h-full rounded-lg object-cover"
                              />
                              <button
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                // onClick={handleRemoveImage(
                                //   index,
                                //   setPropertyImages,
                                //   propertyImages
                                // )}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent event bubbling
                                  e.preventDefault(); // Prevent default form behavior
                                  handleRemoveImage(
                                    index,
                                    setPropertyImages,
                                    propertyImages
                                  )();
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="w-1/2 shadow-md w-1/2 flex-1">
                  <div className="bg-white p-6 mt-3 rounded-md shadow-sm">
                    <h3 className="text-xl text-[#000929] mb-2 font-bold">
                      Upload Documents & Other Images
                    </h3>
                    <div
                      className="upload"
                      onClick={() => handleClick("documentFileInput")}
                    >
                      <div className="document">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="36"
                          height="36"
                        >
                          <path d="M6.5 10a5.5 5.5 0 0110.906-1.346A4.502 4.502 0 0118 19H6a4 4 0 01-1.051-7.857A5.49 5.49 0 016.5 10zM13 14h3l-4-4-4 4h3v4h2v-4z" />
                        </svg>
                      </div>
                      <p className="drag">Drag & Drop file or browse</p>
                      <p className="format">
                        (File supported .jpg, .jpeg and .png & Max file size: 25
                        MB)
                      </p>
                      <input
                        type="file"
                        id="documentFileInput"
                        style={{ display: "none" }}
                        accept=".pdf,.png,.jpeg,.jpg,.docx"
                        onChange={handleFileChange(setDocumentImages)}
                        multiple
                      />
                    </div>

                    {/* Image Preview */}
                    {documentImages?.length > 0 && (
                      <>
                        <h6 className="block text-gray-700 font-regular mb-1 pt-6">
                          Uploaded Documents and Images
                        </h6>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {documentImages.map((file, index) => {
                            const isFileObject = file instanceof File;
                            const fileUrl = isFileObject
                              ? URL.createObjectURL(file)
                              : file;

                            const isImage = isFileObject
                              ? file.type.includes("image")
                              : /\.(jpeg|jpg|png)$/i.test(fileUrl);

                            const isPDF = isFileObject
                              ? file.type === "application/pdf"
                              : fileUrl.endsWith(".pdf");

                            return (
                              <div key={index} className="relative w-32 h-32">
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt="Uploaded"
                                    className="w-full h-full rounded-lg object-cover"
                                  />
                                ) : isPDF ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-lg p-2">
                                    <FileText className="w-10 h-10 text-red-600" />
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-red-500 underline mt-1"
                                    >
                                      View PDF
                                    </a>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-lg p-2">
                                    <FileSpreadsheet className="w-12 h-12 text-blue-600" />
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-500 underline mt-1"
                                    >
                                      View Docx
                                    </a>
                                  </div>
                                )}

                                {/* Remove Button */}
                                <button
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
                                    e.preventDefault(); // Prevent default form behavior
                                    handleRemoveImage(
                                      index,
                                      setDocumentImages,
                                      documentImages
                                    )();
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-3 p-3 border border-borderColor bg-white shadow-sm rounded-md">
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
                    <span className="flex justify-center gap-2 flex-row items-center">
                      Save & Continue <FaAngleRight />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
        {activeTab === "Purchase" && (
          <>
            <FinancingForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              requestData={requestData}
              setRequestData={setRequestData}
              setTabsValidation={setTabsValidation}
              inputFields3={inputFields3}
              setInputFields3={setInputFields3}
              inputFields4={inputFields4}
              setInputFields4={setInputFields4}
              setFinancingForms={setFinancingForms}
              financingForms={financingForms}
              handleClosingSave={closingCosts}
              handlePurchaseSave={purchaseCosts}
              handleDeleteInput={handleDeleteClosingCost}
              handleDeleteInput2={handleDeletePurchaseCost}
              removeFinancingForm={handleDeleteFinacing}
              handleClearClosingItemizedInputs={handleDeleteClosingCost}
              handleClearPurchaseItemizedInputs={handleDeletePurchaseCost}
              addOrUpdateProperty={addOrUpdateProperty}
              setFin={setFin}
              // setSpLoading={setSpLoading}
              setStep={setStep}
              setLoading={setLoading}
              setIsPopupOpenC={setIsPopupOpenC}
              setIsPopupOpenP={setIsPopupOpenP}
              isPopupOpenC={isPopupOpenC}
              isPopupOpenP={isPopupOpenP}
              loading={loading}
              setPurchasePrice={setPurchasePrice}
              purchasePrice={purchasePrice}
            />
          </>
        )}
        {activeTab === "Rehab" && (
          <>
            <CostsForm
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              requestData={requestData}
              setRequestData={setRequestData}
              setTabsValidation={setTabsValidation}
              inputFields={inputFields}
              setInputFields={setInputFields}
              inputFieldsrehab={inputFieldsrehab}
              setInputFieldsrehab={setInputFieldsrehab}
              handleSaveHoldingCosts={postHoldingCosts}
              handleSaveRehab={rehabCosts}
              handleDeleteInputrehab={handleDeleteRehabCost}
              handleDeleteInput={handleDeleteHoldingCost}
              handleClearRehabItemizedInputs={handleDeleteRehabCost}
              handleClearHoldingItemizedInputs={handleDeleteHoldingCost}
              addOrUpdateProperty={addOrUpdateProperty}
              setFin={setFin}
              // setSpLoading={setSpLoading}
              setStep={setStep}
              setLoading={setLoading}
              loading={loading}
              setIsPopupOpenR={setIsPopupOpenR}
              setIsPopupOpenH={setIsPopupOpenH}
              isPopupOpenR={isPopupOpenR}
              isPopupOpenH={isPopupOpenH}
              // loading={loading}
            />
          </>
        )}
        {activeTab === "Sale" && (
          <>
            <SellingCosts
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              requestData={requestData}
              setRequestData={setRequestData}
              setTabsValidation={setTabsValidation}
              tabsValidation={tabsValidation}
              inputFields2={inputFields2}
              setInputFields2={setInputFields2}
              handleSave={sellingCosts}
              handleDeleteInput={handleDeleteSellingCost}
              handleClearsellingItemizedInputs={handleDeleteSellingCost}
              addOrUpdateProperty={addOrUpdateProperty}
              // setSpLoading={setSpLoading}
              setStep={setStep}
              setLoading={setLoading}
              loading={loading}
              setIsPopupOpenS={setIsPopupOpenS}
              isPopupOpenS={isPopupOpenS}
            />
          </>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default AddProperty;
