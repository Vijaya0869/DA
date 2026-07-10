import apiInstance from "../Axios/Axios";
interface PropertyListParams {
  pageNumber: number;
  pageSize: number;
  investmentStrategy?: string;
  searchKey?: string;
}

interface PropertyListParams {
  pageNumber: number;
  pageSize: number;
  investmentStrategy?: string;
  searchKey?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
}

interface Image {
  id: string;
  url: string;
}

class PropertyService {
  // Get paginated list of properties
  getProperties = async (params: PropertyListParams) => {
    try {
      const response = await apiInstance.get("/property", {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          searchKey: params.searchKey,
          investmentStrategy: params.investmentStrategy
            ? params.investmentStrategy
            : undefined,
        },
      });
      return response;
    } catch (error: any) {
      console.error("An error occurred while fetching properties:", error);
      throw error;
    }
  };

  // Get property by ID
  getPropertyById = async (id: string) => {
    try {
      const response = await apiInstance.get(`/property/details/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching property with ID ${id}:`,
        error
      );
      throw error;
    }
  };

  // Get property Financing by ID
  getPropertyFinancingById = async (id: string) => {
    try {
      const response = await apiInstance.get(`/property/financing/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching getPropertyFinancingById with ID ${id}:`,
        error
      );
      throw error;
    }
  };
  // Get paginated list of properties
  getInvestmentStrategies = async () => {
    try {
      const response = await apiInstance.get("/master/investment_strategies");
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getInvestmentStrategies:",
        error
      );
      throw error;
    }
  };

  getPropertyTypes = async () => {
    try {
      const response = await apiInstance.get("/master/property_types");
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getPropertyTypes:",
        error
      );
      throw error;
    }
  };

  getLoanTypes = async () => {
    try {
      const response = await apiInstance.get("/master/loan_types");
      return response;
    } catch (error: any) {
      console.error("An error occurred while fetching getLoanTypes:", error);
      throw error;
    }
  };

  getFinancingTypes = async () => {
    try {
      const response = await apiInstance.get("/master/financing_of_types");
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getFinancingTypes:",
        error
      );
      throw error;
    }
  };
  getCommonDropdown = async (endpoint: string) => {
    try {
      const response = await apiInstance.get(endpoint);
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getInvestmentStrategies:",
        error
      );
      throw error;
    }
  };

  postCommon = async (endpoint: string, contentType: string, data: any) => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const headers = {
        headers: {
          "Content-Type": `${contentType}`,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await apiInstance.post(endpoint, data, headers);
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getInvestmentStrategies:",
        error
      );
      throw error;
    }
  };
  patchCommon = async (endpoint: string, contentType: string, data: any) => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const headers = {
        headers: {
          "Content-Type": `${contentType}`,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await apiInstance.patch(endpoint, data, headers);
      return response;
    } catch (error: any) {
      console.error(
        "An error occurred while fetching getInvestmentStrategies:",
        error
      );
      throw error;
    }
  };

  deleteCommon = async (endpoint: string) => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await apiInstance.delete(endpoint, headers);
      return response;
    } catch (error: any) {
      console.error("An error occurred while deleting:", error);
      throw error;
    }
  };

  // Get property images
  getPropertyImages = async (propertyId: string) => {
    try {
      const response = await apiInstance.get(`/property/images/${propertyId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching images for property ${propertyId}:`,
        error
      );
      throw error;
    }
  };

  // Get property documents
  getPropertyDocuments = async (propertyId: string) => {
    try {
      const response = await apiInstance.get(
        `/property/documents/${propertyId}`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching documents for property ${propertyId}:`,
        error
      );
      throw error;
    }
  };

  // Download specific property document
  downloadPropertyDocument = async (propertyId: string, documentId: string) => {
    try {
      const response = await apiInstance.get(
        `/property/${propertyId}/documents/${documentId}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while downloading document ${documentId} for property ${propertyId}:`,
        error
      );
      throw error;
    }
  };

  downloadProperty = async(data:any)=>{
    try {
      const response = await apiInstance.post(
        `/reports/pdf`,data,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while download`,
        error
      );
      throw error;
    }
  
  };

  // Get Rental Analysis
  getRentalAnalysis = async (propertyId: string) => {
    try {
      const response = await apiInstance.get("/analysis/rental-comps", {
        params: {
          propertyId: propertyId,
        },
      });
      return response;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching analysis ${propertyId}:`,
        error
      );
      throw error;
    }
  };

  // Get Rental Analysis
  getAnalysis = async (propertyId: string) => {
    try {
      const response = await apiInstance.get("/analysis/property-data", {
        params: {
          propertyId: propertyId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching analysis ${propertyId}:`,
        error
      );
      throw error;
    }
  };

  // Get property details by address
  getPropertyDetailsByAddress = async (address: string) => {
    try {
      const response = await apiInstance.get(
        "/property/pull-property-details",
        {
          params: { address },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `An error occurred while fetching property details for address "${address}":`,
        error
      );
      throw error;
    }
  };
}

const PropertyServices = new PropertyService();

export default PropertyServices;
