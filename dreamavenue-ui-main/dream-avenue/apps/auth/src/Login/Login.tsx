import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Google from "@/assets/images/google.png";
import Facebook from "@/assets/images/facebook.png";
import DashboardBg from "@/assets/images/newbg.png";
import LoginLeft from "@/assets/images/loginLeft.png";
import { Button, InputField, Logo } from "container/components";
import { useNavigate } from "react-router-dom";
import AuthServices from "../Services/authService";
import "./Login.css";
import logo from "../assets/images/logo.png";
import {
  FaGoogle,
  FaFacebook,
  FaEye,
  FaEyeSlash,
  FaWaveSquare,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { AxiosResponse } from "axios";
import RightSide from "@/assets/images/Rightside.svg";
import House from "@/assets/images/middle.png";
import sideContent from "@/assets/images/grp1.png";

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string | null;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      handleLogin(values);
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<LoginResponse> = await AuthServices.login({
        email: values.email,
        password: values.password,
      });

      // Check if response has data with accessToken
      if (response) {
        const { accessToken, user } = response;

        if (accessToken) {
          // Store token in localStorage
          localStorage.setItem("authToken", accessToken);

          // Store user info if needed
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }

          toast.success("Logged in successfully!");

          // Force navigation after a short delay
          setTimeout(() => {
            console.log("Navigating to /property");
            window.location.href = "/property"; // Using direct location change as fallback
          }, 500);
        } else {
          console.error("No accessToken in response:", response.data);
          toast.error("Login successful but no access token received");
        }
      } else {
        console.error("Invalid response structure:", response);
        toast.error("Login succeeded but received an invalid response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/auth/google/callback") {
        setIsLoading(true);
        try {
          const response = await AuthServices.googleCallback();
          if (response && response.data && response.data.accessToken) {
            localStorage.setItem("authToken", response.data.accessToken);

            if (response.data.user) {
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            window.location.href = "/property";
          } else {
            throw new Error("Invalid response from Google auth");
          }
        } catch (error: any) {
          console.error("Google auth error:", error);
          toast.error("Google authentication failed. Please try again.");
          navigate("/login");
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  const handleGoogleLogin = () => {
    try {
      // This will redirect to the backend's Google OAuth endpoint
      AuthServices.googleLogin();
    } catch (error: any) {
      console.error("Google login initiation error:", error);
      toast.error("Failed to initiate Google login. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen flex md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 via-white to-emerald-100 rounded-lg shadow-lg overflow-hidden">
        <div
          className="card px-10 py-10 w-full flex flex-col items-center justify-center relative overflow-hidden h-full rounded-4xl"
          style={{
            backgroundImage: `url(${LoginLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Logo and Title */}

          <div className="absolute top-4 left-4 mb-6 ">
            <Logo className="h-14" />
          </div>
          <div className="bg-white/50 p-4 w-full max-w-sm">
            <div className="w-full max-w-sm mb-8 text-left">
              <h3 className="text-3xl font-bold text-black">Welcome back</h3>
              <p className="text-gray-400 mt-2  text-base">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Divider */}
            {/* <div className="flex items-center w-full max-w-sm mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div> */}

            {/* Login Form with Formik */}
            <form
              className="w-full max-w-sm space-y-4"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <InputField
                  placeholder="Enter Email"
                  onChange={(value: any) =>
                    formik.setFieldValue("email", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  name="email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(value: any) =>
                    formik.setFieldValue("password", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  name="password"
                />

                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Links */}
              <div className=" w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                  className="text-sm text-transparent bg-gradient-to-r from-[#514B96] to-[#423E76] bg-clip-text hover:text-indigo-900"
                >
                  Forgot Password?
                </button>
              </div>
              <Button
                variant="primary"
                type="submit"
                className="w-full text-center py-3  rounded-md transition duration-200 flex justify-center items-center"
                disabled={isLoading || !formik.isValid}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Social Login Options */}
            <div className="w-full max-w-sm mb-6 space-y-4 my-4">
              <a
                href="https://test.dreamavenue.ai/backend/auth/google"
                className="flex-1 py-3 px-4 border border-[#E8E6F9] rounded-lg flex items-center justify-center space-x-2"
              >
                <img src={Google} alt="Google Sign In" />
                <span>Sign up with Google</span>
              </a>
              <a
                href="https://test.dreamavenue.ai/backend/auth/facebook"
                className="flex-1 py-3 px-4 border border-[#E8E6F9] rounded-lg flex items-center justify-center space-x-2"
              >
                <img src={Facebook} alt="Facebook Sign In" />
                <span>Sign up with Facebook</span>
              </a>
            </div>

            <div className="mt-6 text-center flex items-center justify-center">
              <p className="text-gray-600">Don't have an account?</p>
              <button
                type="button"
                onClick={() => {
                  navigate("/create-account");
                }}
                className="text-indigo-900 hover:underline ml-1"
              >
                Sign up
              </button>
            </div>
          </div>
          {/* Footer */}
          {/* <div className="mt-12 text-center text-gray-500 text-sm">
            © Dream Avenue 2024
          </div> */}
        </div>
      </div>

      <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center">
        {/* Background image */}
        <img
          src={RightSide}
          alt="dashboardbg"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05] z-0"
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center text-white px-6">
          <img src={sideContent} alt="Overlay Content" className="" />
        </div>
      </div>

      <Toaster />
    </section>
  );
};

export default Login;
