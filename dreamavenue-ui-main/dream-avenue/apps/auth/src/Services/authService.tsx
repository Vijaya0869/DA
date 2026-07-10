import apiInstance from "../Axios/Axios";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  // Register a new user
  register = async (data: RegisterData) => {
    try {
      const response = await apiInstance.post("/auth/register", data);
      return response;
    } catch (error: any) {
      console.error("An error occurred during registration:", error);
      throw error;
    }
  };

  sendEmailConfirmation = async (data: any) => {
    try {
      const response = await apiInstance.post("/auth/send_welcome_email", data);
      return response;
    } catch (error: any) {
      console.error("An error occurred during sendEmailConfirmation:", error);
      throw error;
    }
  };

  

  // Login with email and password
  login = async (data: LoginData) => {
    try {
      const response = await apiInstance.post("/auth/login", data);
      return response;
    } catch (error: any) {
      console.error("An error occurred during login:", error);
      throw error;
    }
  };


    // Login with email and password
    resetPassword = async (data:any) => {
      try {
        const response = await apiInstance.post("/auth/send_reset_password_email", data);
        return response;
      } catch (error: any) {
        console.error("An error occurred during resetPassword:", error);
        throw error;
      }
    };

  // Initialize Google OAuth login
  async googleLogin() {
    try {
      // Since it's a GET request that likely redirects, we'll handle it differently
      window.location.href = "/auth/google"; // Direct to backend endpoint
      // Note: We won't get a response here since it's a redirect
    } catch (error) {
      throw error;
    }
  }

  // Handle Google OAuth callback
  async googleCallback() {
    try {
      const response = await apiInstance.get("/auth/google/callback");
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const AuthServices = new AuthService();

export default AuthServices;
